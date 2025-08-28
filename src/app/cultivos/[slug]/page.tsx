
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet } from '@/lib/crop-data-structure';
import type { Pest } from '@/models/pest-model';
import { doc, getDoc, collection, query, where, getDocs, documentId, type GeoPoint } from 'firebase/firestore';
import { CropDetailClient } from './components/crop-detail-client';
import type { SampleCrop } from '@/models/crop-model';
import type { EducationalGuideDocument } from '@/lib/educational-guides-structure';


interface CropDetailPageProps {
  params: {
    slug: string;
  };
}

interface SimplifiedItem {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
    summary?: string; // For articles
    dataAiHint?: string; // For articles
}

// --- HELPER FUNCTIONS ---

async function getCropBySlug(slug: string): Promise<CropTechnicalSheet | null> {
  const docRef = doc(db, 'fichas_tecnicas_cultivos', slug);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Make sure to include the document ID in the returned object
    return { id: docSnap.id, ...(docSnap.data() as CropTechnicalSheet) };
  }
  return null;
}

async function getRelatedPests(pestSlugs: string[]): Promise<Pest[]> {
    if (!pestSlugs || pestSlugs.length === 0) return [];
    const pestsRef = collection(db, 'plagas_y_enfermedades');
    const q = query(pestsRef, where(documentId(), 'in', pestSlugs));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            slug: doc.id,
            nombreComun: data.nombreComun,
            imageUrl: data.imageUrl,
            dataAiHint: data.dataAiHint,
            tipo: data.tipo,
        } as Pest;
    });
}


async function getRelatedCrops(cropSlugs: string[]): Promise<SimplifiedItem[]> {
  if (!cropSlugs || cropSlugs.length === 0) return [];
  const cropsRef = collection(db, 'fichas_tecnicas_cultivos');
  const q = query(cropsRef, where(documentId(), 'in', cropSlugs));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as CropTechnicalSheet;
    return {
      id: doc.id,
      slug: doc.id, // Use the document ID for the link
      name: data.nombre,
      imageUrl: data.imagenes?.[0]?.url || 'https://placehold.co/300x200',
      dataAiHint: 'crop field',
    };
  });
}

async function getRelatedContent(cropSlug: string, articleSlugs: string[] = []): Promise<SimplifiedItem[]> {
  const allContent: SimplifiedItem[] = [];

  // 1. Fetch related articles by slug (if manually linked)
  if (articleSlugs && articleSlugs.length > 0) {
    const articlesRef = collection(db, 'articulos');
    const articlesQuery = query(articlesRef, where('slug', 'in', articleSlugs));
    const articlesSnapshot = await getDocs(articlesQuery);
    articlesSnapshot.forEach(doc => {
        const data = doc.data();
        allContent.push({
            id: doc.id,
            slug: `/articulos/${data.slug}`,
            name: data.title,
            summary: data.summary,
            imageUrl: data.imageUrl,
            dataAiHint: data.dataAiHint,
        });
    });
  }

  // 2. Fetch related educational guides by dynamically querying for the current crop slug
  const guidesRef = collection(db, 'guias_educativas');
  const guidesQuery = query(guidesRef, where('cultivosRelacionados', 'array-contains', cropSlug));
  const guidesSnapshot = await getDocs(guidesQuery);
  guidesSnapshot.forEach(doc => {
      const data = doc.data() as EducationalGuideDocument;
      allContent.push({
          id: doc.id,
          slug: `/guias#${doc.id}`, // Link to guides page with anchor
          name: data.titulo,
          summary: data.subtitulo,
          imageUrl: 'https://placehold.co/400x250/EDF2E8/6B875E?text=Gu%C3%ADa', // Placeholder for guides
          dataAiHint: 'educational guide',
      });
  });

  return allContent;
}


export default async function CropDetailPage({ params }: CropDetailPageProps) {
    const crop = await getCropBySlug(params.slug);
    
    if (!crop || !crop.id) {
        notFound();
    }
    
    // Convert Firestore GeoPoint to a plain object before passing to client component
    if (crop.posicion && typeof (crop.posicion as GeoPoint).latitude === 'number') {
        const geoPoint = crop.posicion as GeoPoint;
        crop.posicion = { lat: geoPoint.latitude, lon: geoPoint.longitude };
    }

    // Adapt data for AddCropDialog
    const sampleCrop: SampleCrop = {
        id: crop.id,
        name: crop.nombre,
        description: crop.descripcion,
        regionSlugs: crop.region.principal.map(r => r.toLowerCase()),
        imageUrl: crop.imagenes?.[0]?.url || 'https://placehold.co/300x200.png',
        dataAiHint: 'crop field',
        clima: crop.clima.clase[0] as SampleCrop['clima'],
        duration: 'Media (3–5 meses)',
        spaceRequired: 'Maceta mediana (4–10 L)',
        plantType: crop.tipo_planta as SampleCrop['plantType'],
        difficulty: 'Media',
        datos_programaticos: crop.datos_programaticos,
        lifeCycle: crop.cicloVida.map(etapa => ({ name: etapa.etapa })),
        pancoger: crop.tags.includes('pancoger'),
        patrimonial: crop.tags.includes('patrimonial'),
        sembrable_en_casa: 'sí',
        educativo: 'no',
    };

    // Fetch related data in parallel
    const [compatibleCrops, incompatibleCrops, relatedContent, commonPests] = await Promise.all([
        getRelatedCrops(crop.compatibilidades || []),
        getRelatedCrops(crop.incompatibilidades || []),
        getRelatedContent(params.slug, crop.articulosRelacionados || []),
        getRelatedPests(crop.plagasComunes || [])
    ]);

    return (
        <CropDetailClient
            crop={crop}
            sampleCrop={sampleCrop}
            compatibleCrops={compatibleCrops}
            incompatibleCrops={incompatibleCrops}
            relatedArticles={relatedContent} // This now includes both articles and guides
            commonPests={commonPests}
        />
    );
}
