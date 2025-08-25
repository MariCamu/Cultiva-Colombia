
'use server';

import { writeBatch, collection, doc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { CropTechnicalSheet } from './crop-data-structure';

// INSTRUCCIONES:
// 1. Pega tus datos de Excel en esta variable `fichasTecnicasCultivos`.
//    Asegúrate de que cada cultivo es un objeto {} dentro del array [], separado por comas.
//    El ejemplo de "Lechuga" a continuación es la plantilla perfecta a seguir.
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tu colección 'fichas_tecnicas_cultivos' en Firestore se llenará con estos datos.

const fichasTecnicasCultivos: Partial<CropTechnicalSheet>[] = [
  // COMIENZO DEL CULTIVO DE LECHUGA (PLANTILLA)
  // PEGA AQUÍ TUS DATOS CONVERTIDOS DE EXCEL A JSON
  {
    "nombre": "Lechuga",
    "nombreCientifico": "Lactuca sativa",
    "descripcion": "La lechuga (Lactuca sativa) es una planta anual de la familia Asteraceae cultivada como verdura de hoja. Se utiliza principalmente en ensaladas por su textura y frescura.",
    "tags": ["maceta_pequena", "maceta_mediana", "frio", "templado", "Andina"],
    "dificultad": "Fácil",
    "clima": {
      "clase": ["frio", "templado"]
    },
    "region": {
      "principal": ["Andina"],
      "nota": "Andina (óptimo). Caribe/Pacífica: viable con sombra 30–40% y riego frecuente; Orinoquía/Amazonia: en microclimas frescos o invernadero."
    },
    "compatibilidades": ["cilantro", "fresa", "aji_dulce", "pepino_cohombro", "albahaca", "espinaca", "hierbabuena", "jengibre", "calabacin", "rabano", "curcuma", "yuca_dulce", "tomate_cherry", "oregano", "acelga", "pepino_de_maracuya", "pina", "pimenton", "maiz"],
    "incompatibilidades": ["perejil"],
    "posicion": { "lat": 4.816667, "lon": -74.35 },
    "imagenes": [{
      "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flechuga.jpg?alt=media&token=fdf580f3-6e74-4e0a-8047-34dfaa7ef4a3",
      "atribucion": {
        "text": "Image by jcomp on Freepik",
        "link": "https://www.freepik.com/free-photo/green-salad-that-is-ready-be-harvested-garden_5490731.htm"
      }
    }],
    "articulos_relacionados_ids": ["arranque_P_casero", "N_vegetativo_casero", "riego_goteo_casero", "alto_k_casero"],
    "tipo_planta": "Hortalizas de hoja",
    "datos_tecnicos": {
      "temperatura_ideal": "10-21°C",
      "riego": "Mantener humedad constante sin encharcar. En semillero y plántulas, aplicar riego diario en forma de rocío; si hay humedad ambiental alta, preferir goteo/manual al pie.",
      "luz_solar": "Prefiere sol pleno en clima fresco; en clima cálido agradece sol filtrado o semisombra, ya que el sol directo intenso puede marchitarla.",
      "ph_suelo": "5.7-6.8",
    },
    "ciclo_vida": [
      {
        "etapa": "Germinación",
        "duracion": "3-10 días",
        "descripcion": "La semilla brota y emergen los cotiledones."
      },
      {
        "etapa": "Crecimiento de Plántula",
        "duracion": "15-20 días",
        "descripcion": "Desarrollo de las primeras hojas verdaderas."
      },
      {
        "etapa": "Formación de Cabeza",
        "duracion": "30-40 días",
        "descripcion": "Las hojas se compactan formando la cabeza o roseta."
      },
      {
        "etapa": "Cosecha",
        "duracion": "N/A",
        "descripcion": "La cabeza está firme y ha alcanzado el tamaño deseado."
      }
    ],
    "metodos_cultivo": [
      {
        "nombre": "En Maceta",
        "pasos": [
          { "descripcion": "Llenar maceta con sustrato bien drenado." },
          { "descripcion": "Sembrar 2-3 semillas por maceta y cubrir ligeramente." },
          { "descripcion": "Mantener el sustrato húmedo hasta la germinación." },
          { "descripcion": "Aclarar para dejar la plántula más fuerte." },
          { "descripcion": "Regar regularmente y fertilizar cada 2-3 semanas." }
        ]
      },
      {
        "nombre": "En Jardín",
        "pasos": [
          { "descripcion": "Preparar el suelo con compost y asegurar buen drenaje." },
          { "descripcion": "Sembrar en surcos, dejando 30cm entre hileras." },
          { "descripcion": "Aclarar las plántulas para dejar un espacio de 20-25cm entre ellas." },
          { "descripcion": "Mantener el área libre de malezas y regar constantemente." }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 60
    }
  },
];

async function seedFichasTecnicas() {
  const collectionRef = collection(db, 'fichas_tecnicas_cultivos');
  console.log(`Iniciando siembra de ${fichasTecnicasCultivos.length} fichas técnicas de cultivo...`);

  const chunkSize = 400; // Firestore permite hasta 500 operaciones por lote
  for (let i = 0; i < fichasTecnicasCultivos.length; i += chunkSize) {
    const chunk = fichasTecnicasCultivos.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    chunk.forEach(cropData => {
      if (!cropData.nombre) {
        console.warn('Se encontró un objeto de cultivo sin nombre, será omitido.', cropData);
        return;
      }
      // Usar el nombre como base para un ID amigable (slug)
      const slug = cropData.nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const docRef = doc(collectionRef, slug);
      
      const { posicion, ...restOfData } = cropData;
      const dataToSet: { [key: string]: any } = { ...restOfData };

      // Convertir el objeto {lat, lon} a un GeoPoint de Firestore
      if (posicion && typeof posicion.lat === 'number' && typeof posicion.lon === 'number') {
        dataToSet.posicion = new GeoPoint(posicion.lat, posicion.lon);
      }
      
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

export const seedArticles = async () => {
    console.log('La función seedArticles está definida pero actualmente no tiene contenido.');
    // En el futuro, aquí se podría añadir la lógica para sembrar artículos.
};


async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedFichasTecnicas();
  // Aquí podríamos añadir llamadas a otras funciones de siembra, ej: await seedGlosario();
  console.log('--- Proceso de Siembra Finalizado ---');
}

// Ejecuta la función principal si el script es llamado directamente
if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
