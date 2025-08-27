
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { CropTechnicalSheet } from '@/lib/crop-data-structure';
import type { Article } from '@/models/article-model';
import { doc, getDoc, collection, query, where, getDocs, documentId, type GeoPoint } from 'firebase/firestore';
import { CropDetailClient } from './components/crop-detail-client';
import type { SampleCrop } from '@/models/crop-model';


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

const createSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

async function getCropBySlug(slug: string): Promise<CropTechnicalSheet | null> {
  const docRef = doc(db, 'fichas_tecnicas_cultivos', slug);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as CropTechnicalSheet) };
  }
  return null;
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
      slug: createSlug(data.nombre), // Use consistent slug generation
      name: data.nombre,
      imageUrl: data.imagenes?.[0]?.url || 'https://placehold.co/300x200',
      dataAiHint: 'crop field',
    };
  });
}

async function getRelatedArticles(articleSlugs: string[]): Promise<SimplifiedItem[]> {
  if (!articleSlugs || articleSlugs.length === 0) return [];
  const articlesRef = collection(db, 'articulos');
  const q = query(articlesRef, where('slug', 'in', articleSlugs));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as Article;
    return {
      id: doc.id,
      slug: data.slug,
      name: data.title,
      summary: data.summary,
      imageUrl: data.imageUrl,
      dataAiHint: data.dataAiHint,
    };
  });
}

export default async function CropDetailPage({ params }: CropDetailPageProps) {
    const crop = await getCropBySlug(params.slug);
    
    if (!crop) {
        notFound();
    }
    
    // Convert Firestore GeoPoint to a plain object before passing to client component
    if (crop.posicion && typeof (crop.posicion as GeoPoint).latitude === 'number') {
        const geoPoint = crop.posicion as GeoPoint;
        crop.posicion = { lat: geoPoint.latitude, lon: geoPoint.longitude };
    }

    // Adapt data for AddCropDialog
    const sampleCrop: SampleCrop = {
        id: crop.id || params.slug,
        name: crop.nombre,
        description: crop.descripcion,
        regionSlugs: crop.region.principal.map(r => r.toLowerCase()),
        imageUrl: crop.imagenes?.[0]?.url || 'https://placehold.co/300x200.png',
        dataAiHint: 'crop field',
        clima: crop.clima.clase[0] as SampleCrop['clima'],
        estimatedPrice: 'Precio moderado',
        duration: 'Media (3–5 meses)',
        spaceRequired: 'Maceta mediana (4–10 L)',
        plantType: crop.tipo_planta as SampleCrop['plantType'],
        difficulty: 3, // Default
        datos_programaticos: crop.datos_programaticos,
        lifeCycle: crop.cicloVida.map(etapa => ({ name: etapa.etapa })),
        pancoger: crop.tags.includes('pancoger'),
        patrimonial: crop.tags.includes('patrimonial'),
        sembrable_en_casa: 'sí',
        educativo: 'no',
    };

    // Fetch related data in parallel
    const [compatibleCrops, incompatibleCrops, relatedArticles] = await Promise.all([
        getRelatedCrops(crop.compatibilidades || []),
        getRelatedCrops(crop.incompatibilidades || []),
        getRelatedArticles(crop.articulosRelacionados || [])
    ]);

    return (
        <CropDetailClient
            crop={crop}
            sampleCrop={sampleCrop}
            compatibleCrops={compatibleCrops}
            incompatibleCrops={incompatibleCrops}
            relatedArticles={relatedArticles}
        />
    );
}
