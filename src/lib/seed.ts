
'use server';

import { writeBatch, collection, doc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { CropTechnicalSheet } from './crop-data-structure';

// INSTRUCCIONES:
// 1. Pega tus datos de Excel en esta variable `fichasTecnicasCultivos`.
//    Asegúrate de que sigue el formato JSON (comillas en las claves, comas correctas, etc.).
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tu colección 'fichas_tecnicas_cultivos' en Firestore se llenará con estos datos.

const fichasTecnicasCultivos: Omit<CropTechnicalSheet, 'id'>[] = [
  {
    "nombre": "Lechuga",
    "nombreCientifico": "Lactuca sativa",
    "descripcion": "La lechuga (Lactuca sativa) es una planta anual de la familia Asteraceae cultivada como verdura de hoja. Se utiliza principalmente en ensaladas por su textura y frescura.",
    "tags": ["maceta_pequena", "maceta_mediana", "frio", "templado", "Andina"],
    "dificultad": "Fácil",
    "clima": { "clase": ["frio", "templado"] },
    "region": {
      "principal": ["Andina"],
      "nota": "Andina (óptimo). Caribe/Pacífica: viable con sombra 30–40% y riego frecuente; Orinoquía/Amazonia: en microclimas frescos o invernadero."
    },
    "compatibilidades": ["cilantro", "fresa", "aji_dulce", "pepino_cohombro", "albahaca", "espinaca", "hierbabuena", "jengibre", "calabacin", "rabano", "curcuma", "yuca_dulce", "tomate_cherry", "oregano", "acelga", "pepino_de_maracuya", "pina", "pimenton", "maiz"],
    "incompatibilidades": ["perejil"],
    "posicion": new GeoPoint(4.816667, -74.350000),
    "imagenes": [{
      "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flechuga.jpg?alt=media&token=fdf580f3-6e74-4e0a-8047-34dfaa7ef4a3",
      "attribution": { "text": "Image by jcomp on Freepik", "link": "https://www.freepik.com/free-photo/green-salad-that-is-ready-be-harvested-garden_5490731.htm" }
    }],
    "articulos_relacionados_ids": ["arranque_P_casero", "N_vegetativo_casero", "riego_goteo_casero", "alto_k_casero"],
    "tipo_planta": "Hortalizas de hoja",
    "ciclo_vida": [
        { "etapa": "Germinación", "duracion": "5-10 días", "descripcion": "La semilla brota y emergen los cotiledones." },
        { "etapa": "Crecimiento de Plántula", "duracion": "15-20 días", "descripcion": "Desarrollo de las primeras hojas verdaderas." }
    ],
    "metodos_cultivo": [
        { "nombre": "Siembra Directa", "pasos": [{ "descripcion": "Preparar el suelo y sembrar las semillas a 1 cm de profundidad." }] }
    ],
    "datos_tecnicos": { 
        "riego": "Frecuente, mantener el suelo húmedo pero no encharcado.", 
        "temperatura_ideal": "15-20°C", 
        "luz_solar": "Mínimo 6 horas de sol directo.", 
        "ph_suelo": "6.0-7.0"
        // Aquí irían los demás campos de la ficha técnica detallada.
    },
    "datos_programaticos": { "frecuencia_riego_dias": 2, "dias_para_cosecha": 60 }
  },
  {
    "nombre": "Cilantro",
    "nombreCientifico": "Coriandrum sativum",
    "descripcion": "El cilantro (Coriandrum sativum) es una hierba aromática anual cuyas hojas y semillas se emplean ampliamente como condimento en la gastronomía. Es muy apreciado en la cocina colombiana para sopas, guisos y salsas.",
    "tags": ["maceta_pequena", "facil", "frio", "templado", "calido", "Andina", "Caribe"],
    "dificultad": "Fácil",
    "clima": { "clase": ["frio", "templado"] },
    "region": {
      "principal": ["Andina", "Caribe"],
      "nota": "Andina (óptimo). Caribe/Pacífica: viable con sombra 30–40% y riego constante para evitar espigado; Orinoquía/Amazonia: en microclimas frescos o invernadero."
    },
    "compatibilidades": ["lechuga", "fresa", "pepino_cohombro", "espinaca", "hierbabuena", "calabacin", "rabano", "tomate_cherry", "acelga", "maiz", "frijol", "pimenton"],
    "incompatibilidades": ["albahaca", "perejil"],
    "posicion": new GeoPoint(8.748000, -75.881000),
    "imagenes": [{
      "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcilantro.jpg?alt=media&token=da5c9ee8-fc4a-46c1-b13a-c1133a569f61",
      "attribution": { "text": "Image by azerbaijan_stockers on Freepik", "link": "https://www.freepik.com/free-photo/wrapping-parsley-bundle-marble-background-high-quality-photo_16928364.htm" }
    }],
    "articulos_relacionados_ids": ["arranque_P_casero", "N_vegetativo_casero", "riego_goteo_casero", "alto_k_casero"],
    "tipo_planta": "Plantas aromáticas",
    "ciclo_vida": [],
    "metodos_cultivo": [],
    "datos_tecnicos": { 
        "riego": "Moderado, evitar encharcamiento.", 
        "temperatura_ideal": "18-25°C", 
        "luz_solar": "4-6 horas de sol, tolera semisombra.", 
        "ph_suelo": "6.0-7.5" 
    },
    "datos_programaticos": { "frecuencia_riego_dias": 3, "dias_para_cosecha": 45 }
  },
];

async function seedFichasTecnicas() {
  const collectionRef = collection(db, 'fichas_tecnicas_cultivos');
  console.log(`Iniciando siembra de ${fichasTecnicasCultivos.length} fichas técnicas de cultivo...`);

  const chunkSize = 400;
  for (let i = 0; i < fichasTecnicasCultivos.length; i += chunkSize) {
    const chunk = fichasTecnicasCultivos.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    chunk.forEach(cropData => {
      const slug = cropData.nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const docRef = doc(collectionRef, slug);
      
      const dataToSet = { ...cropData };
      
      batch.set(docRef, dataToSet);
    });

    try {
      await batch.commit();
      console.log(`Lote de ${chunk.length} documentos subido exitosamente.`);
    } catch (error) {
      console.error("Error al subir lote a Firestore:", error);
      return;
    }
  }

  console.log('¡Siembra de fichas técnicas completada!');
}

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedFichasTecnicas();
  console.log('--- Proceso de Siembra Finalizado ---');
}

main().catch(error => {
  console.error("Ocurrió un error en el script de siembra:", error);
});
