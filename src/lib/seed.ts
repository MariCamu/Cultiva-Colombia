
'use server';

import { writeBatch, collection, doc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { CropTechnicalSheet } from './crop-data-structure';

// INSTRUCCIONES:
// 1. Pega tus datos de Excel en esta variable `fichasTecnicasCultivos`.
//    Asegúrate de que sigue el formato JSON (comillas en las claves, comas correctas, etc.).
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tu colección 'fichas_tecnicas_cultivos' en Firestore se llenará con estos datos.

const fichasTecnicasCultivos: Omit<CropTechnicalSheet, 'id'>[] = [
  // EJEMPLO COMPLETO CON LECHUGA - USA ESTE COMO GUÍA
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
    
    "datos_tecnicos": {
        "temperatura_ideal": "10-21°C",
        "riego": "Mantener humedad constante sin encharcar.",
        "luz_solar": "Prefiere sol pleno en clima fresco; en clima cálido agradece sol filtrado.",
        "ph_suelo": "5.7-6.8"
        // ... aquí irían todos los demás campos de tu ficha técnica detallada ...
    },
    
    "ciclo_vida": [
        { "etapa": "Germinación", "duracion": "5-10 días", "descripcion": "La semilla brota y emergen los cotiledones." },
        { "etapa": "Crecimiento de Plántula", "duracion": "15-20 días", "descripcion": "Desarrollo de las primeras hojas verdaderas." },
        { "etapa": "Formación de Cabeza", "duracion": "30-40 días", "descripcion": "Las hojas centrales se compactan para formar la cabeza." },
        { "etapa": "Cosecha", "duracion": "N/A", "descripcion": "La cabeza está firme y ha alcanzado el tamaño deseado." }
    ],
    
    "metodos_cultivo": [
        { 
            "nombre": "Siembra en Semillero", 
            "pasos": [
                { "descripcion": "Llenar el semillero con sustrato húmedo y bien drenado." },
                { "descripcion": "Colocar 2-3 semillas por celda a 0.5 cm de profundidad." },
                { "descripcion": "Mantener la humedad constante y en un lugar con luz indirecta." },
                { "descripcion": "Trasplantar al lugar definitivo cuando tenga 4-5 hojas verdaderas." }
            ] 
        },
        { 
            "nombre": "Siembra Directa", 
            "pasos": [
                { "descripcion": "Preparar el suelo, dejándolo suelto y rico en materia orgánica." },
                { "descripcion": "Sembrar las semillas en hileras, a 1 cm de profundidad." },
                { "descripcion": "Aclarar las plántulas dejando un espacio de 25-30 cm entre ellas." }
            ] 
        }
    ],

    "datos_programaticos": { "frecuencia_riego_dias": 2, "dias_para_cosecha": 60 }
  },
  
  // MOLDE PARA EL SIGUIENTE CULTIVO - CILANTRO
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

    // --- ¡AQUÍ DEBES PEGAR TUS DATOS! ---
    "datos_tecnicos": {
        // Pega aquí los datos de la ficha técnica del cilantro
        "temperatura_ideal": "", 
        "riego": "",
        "luz_solar": "", 
        "ph_suelo": ""
    },
    "ciclo_vida": [
        // Pega aquí las fases del ciclo de vida del cilantro
    ],
    "metodos_cultivo": [
        // Pega aquí los métodos de cultivo del cilantro y sus pasos
    ],
    // --- FIN DE LA SECCIÓN PARA PEGAR DATOS ---

    "datos_programaticos": { "frecuencia_riego_dias": 3, "dias_para_cosecha": 45 }
  },
  // ... y así sucesivamente con el resto de tus cultivos.
];

async function seedFichasTecnicas() {
  const collectionRef = collection(db, 'fichas_tecnicas_cultivos');
  console.log(`Iniciando siembra de ${fichasTecnicasCultivos.length} fichas técnicas de cultivo...`);

  const chunkSize = 400; // Firestore permite hasta 500 operaciones por lote
  for (let i = 0; i < fichasTecnicasCultivos.length; i += chunkSize) {
    const chunk = fichasTecnicasCultivos.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    chunk.forEach(cropData => {
      // Usar el nombre como base para un ID amigable (slug)
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
      // Detener si un lote falla para no continuar con errores.
      return;
    }
  }

  console.log('¡Siembra de fichas técnicas completada!');
}

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedFichasTecnicas();
  // Aquí podríamos añadir llamadas a otras funciones de siembra, ej: await seedGlosario();
  console.log('--- Proceso de Siembra Finalizado ---');
}

// Ejecuta la función principal
main().catch(error => {
  console.error("Ocurrió un error en el script de siembra:", error);
});
