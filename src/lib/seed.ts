
// Añadido para cargar las variables de entorno (API Keys) ANTES que cualquier otra cosa.
import { config } from 'dotenv';
config();

'use server';

import { writeBatch, collection, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Pest } from '@/models/pest-model';
import type { EducationalGuideDocument } from './educational-guides-structure';

// --- INSTRUCCIONES DE USO ---
// 1. Pega tus datos en las variables `pestsAndDiseasesData` y/o `educationalGuidesData`.
//    Asegúrate de que el formato coincida con las interfaces.
// 2. Decide qué quieres subir a Firestore:
//    - Para subir SOLO plagas, deja la línea `await seedPestsAndDiseases();` y comenta la otra.
//    - Para subir SOLO guías, deja la línea `await seedEducationalGuides();` y comenta la otra.
//    - Para subir AMBAS, deja las dos líneas activas.
// 3. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 4. ¡Listo! Tus colecciones se llenarán con los datos.

const pestsAndDiseasesData: Omit<Pest, 'slug' | 'imageUrl' | 'dataAiHint'>[] = [
    {
      id: "pulgones",
      nombreComun: "Pulgones",
      nombreCientifico: "Aphididae spp.",
      tipo: "insecto",
      descripcion: "Chupadores de savia; colonias en brotes tiernos y enves de hojas; excretan melaza y transmiten virus.",
      danos: "Enrulado, clorosis, retraso de crecimiento, fumagina sobre melaza; vectores de virosis.",
      cultivosAfectados: ['lechuga', 'cilantro', 'fresa', 'cebolla-larga', 'aj-dulce', 'pepino-cohombro', 'albahaca', 'espinaca', 'hierbabuena', 'calabacn', 'perejil', 'rbano', 'tomate-cherry', 'organo', 'acelga', 'pepino-dulce', 'frijol', 'pimentn', 'yuca_dulce'],
      prevencion: ["Monitoreo del enves", "Control de hormigas", "Asociacion con aromaticas (ajo/cebolla/calendula)"],
      solucion: "Jabon potasico o aceite de neem; liberar depredadores (mariquitas, sirfidos); retirar focos."
    },
];

const pestImages: { [id: string]: { imageUrl: string; dataAiHint: string } } = {
  pulgones: { 
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Pestes%2Fpulgon.jpg?alt=media&token=c27e2a39-c5d0-4e31-897d-6062cc8f0f0c", 
    dataAiHint: "aphids on plant" 
  },
};

async function seedPestsAndDiseases() {
  if (pestsAndDiseasesData.length === 0) {
    console.log('No hay datos de plagas para sembrar. Saltando...');
    return;
  }
    
  const collectionRef = collection(db, 'plagas_y_enfermedades');
  console.log(`Iniciando siembra de ${pestsAndDiseasesData.length} plagas y enfermedades...`);

  const batch = writeBatch(db);
  pestsAndDiseasesData.forEach(pestData => {
    if (pestData.id) {
      const docRef = doc(collectionRef, pestData.id);
      const { id, ...dataToSet } = pestData;
      
      const completeData: Pest = {
        ...dataToSet,
        id: id,
        slug: id,
        imageUrl: pestImages[id]?.imageUrl || 'https://placehold.co/400x250.png',
        dataAiHint: pestImages[id]?.dataAiHint || `${dataToSet.nombreComun.toLowerCase()} plant pest`,
      };
      
      batch.set(docRef, completeData);
    }
  });

  try {
    await batch.commit();
    console.log(`Lote de ${pestsAndDiseasesData.length} documentos de plagas subido exitosamente.`);
  } catch (error) {
    console.error("Error al subir lote de plagas a Firestore:", error);
  }
}

// --- DATOS PARA GUÍAS EDUCATIVAS ---
const educationalGuidesData: Omit<EducationalGuideDocument, 'id'>[] = [
    {
      "titulo": "🧫 Guía práctica: Inoculación de Rhizobium (frijol)",
      "subtitulo": "Fijación biológica de N para plantas más verdes",
      "descripcion": "Recubre semillas con inoculante específico (o suelo ‘viejo’ de frijol) para formar nódulos eficientes.",
      "materiales": [
        "Inoculante para frijol",
        "Melaza/panela",
        "Recipiente, guantes",
        "Puñado de suelo de frijol (plan B)"
      ],
      "pasos": [
        "Mezcla 1 cdita de melaza en 50 ml de agua (adhesivo).",
        "Humedece semillas y agrega inoculante; seca 20 min a la sombra.",
        "Siembra el mismo día.",
        "Mantén pH 6–7 y evita N fuerte 3–4 semanas."
      ],
      "exito": [
        "Nódulos rosados a 4–6 semanas.",
        "Plantas verde sanas con menos N externo."
      ],
      "cultivosRelacionados": ["lechuga", "cilantro", "fresa", "cebolla-larga", "aj-dulce", "pepino-cohombro", "espinaca", "jengibre", "calabacn", "perejil", "rbano", "crcuma", "yuca-dulce", "tomate-cherry", "acelga", "pepino-dulce", "maz", "pia", "frijol", "pimentn"]
    },
];

async function seedEducationalGuides() {
    if (educationalGuidesData.length === 0) {
        console.log('No hay datos de guías para sembrar. Saltando...');
        return;
    }

    const collectionRef = collection(db, 'guias_educativas');
    console.log(`Iniciando siembra de ${educationalGuidesData.length} guías educativas...`);

    const batch = writeBatch(db);
    educationalGuidesData.forEach(guideData => {
        const docId = guideData.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const docRef = doc(collectionRef, docId);
        batch.set(docRef, guideData);
    });

    try {
        await batch.commit();
        console.log(`Lote de ${educationalGuidesData.length} documentos de guías subido exitosamente.`);
    } catch (error) {
        console.error("Error al subir lote de guías a Firestore:", error);
    }
}


export const seedArticles = async () => {
    console.log('La función seedArticles está definida pero actualmente no tiene contenido.');
};

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  
  // Decide qué sembrar descomentando las líneas que necesites:
  await seedPestsAndDiseases();
  await seedEducationalGuides();
  
  console.log('--- Proceso de Siembra Finalizado ---');
}

if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
