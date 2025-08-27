
// Añadido para cargar las variables de entorno (API Keys) ANTES que cualquier otra cosa.
import { config } from 'dotenv';
config();

'use server';

import { writeBatch, collection, doc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { Pest } from '@/models/pest-model';

// INSTRUCCIONES:
// 1. Pega tus datos de plagas y enfermedades en la variable `pestsAndDiseasesData`.
//    Asegúrate de que cada item es un objeto {} dentro del array [], separado por comas.
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tu colección 'plagas_y_enfermedades' en Firestore se llenará.

const pestsAndDiseasesData: Omit<Pest, 'slug' | 'imageUrl' | 'dataAiHint'>[] = [
  // PEGA AQUÍ TUS DATOS DE PLAGAS Y ENFERMEDADES
  // EJEMPLO DE ESTRUCTURA:
  /*
  {
    id: "pulgones",
    nombreComun: "Pulgones",
    nombreCientifico: "Aphididae spp.",
    tipo: "insecto",
    descripcion: "Chupadores de savia; colonias en brotes tiernos y enves de hojas; excretan melaza y transmiten virus.",
    danos: "Enrulado, clorosis, retraso de crecimiento, fumagina sobre melaza; vectores de virosis.",
    cultivosAfectados: ['lechuga', 'cilantro', 'fresa'],
    prevencion: ["Monitoreo del enves", "Control de hormigas", "Asociacion con aromaticas (ajo/cebolla/calendula)"],
    solucion: "Jabon potasico o aceite de neem; liberar depredadores (mariquitas, sirfidos); retirar focos."
  },
  */
];

// URLs de imágenes para las plagas. Si un ID no está aquí, se usará una imagen de marcador de posición.
// Puedes añadir las URLs aquí cuando las tengas.
const pestImages: { [id: string]: { imageUrl: string; dataAiHint: string } } = {
  // EJEMPLO:
  // pulgones: { 
  //   imageUrl: "https://.../imagen_pulgon.jpg", 
  //   dataAiHint: "aphids on plant" 
  // },
};


async function seedPestsAndDiseases() {
  if (pestsAndDiseasesData.length === 0) {
    console.log('No hay datos de plagas para sembrar. Finalizando el script.');
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
        dataAiHint: pestImages[id]?.dataAiHint || 'plant pest disease',
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

export const seedArticles = async () => {
    console.log('La función seedArticles está definida pero actualmente no tiene contenido.');
};

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedPestsAndDiseases();
  console.log('--- Proceso de Siembra Finalizado ---');
}

if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
