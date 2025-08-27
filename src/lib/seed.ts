
// Añadido para cargar las variables de entorno (API Keys) ANTES que cualquier otra cosa.
import { config } from 'dotenv';
config();

'use server';

import { writeBatch, collection, doc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { CropTechnicalSheet } from './crop-data-structure';
import type { Pest } from '@/models/pest-model';

// INSTRUCCIONES:
// 1. Pega tus datos en la variable `pestsAndDiseasesData`.
//    Asegúrate de que cada item es un objeto {} dentro del array [], separado por comas.
//    El ejemplo a continuación usa exactamente la estructura de columnas que proporcionaste.
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tus colecciones 'fichas_tecnicas_cultivos' y 'plagas_y_enfermedades' en Firestore se llenarán.

const pestsAndDiseasesData: Omit<Pest, 'slug' | 'imageUrl' | 'dataAiHint'>[] = [
  // EJEMPLO - REEMPLAZA ESTO CON TUS DATOS
  {
    id: "pulgon",
    nombreComun: "Pulgón",
    nombreCientifico: "Aphididae spp.",
    tipo: "insecto",
    descripcion: "Pequeños insectos chupadores de savia que se agrupan en los brotes tiernos y envés de las hojas, debilitando la planta y pudiendo transmitir virus. Secretan una melaza pegajosa que atrae hormigas y favorece el hongo negrilla.",
    danos: "Enrulado de hojas, clorosis (amarillamiento), retraso del crecimiento, y aparición de fumagina (hongo negro) sobre la melaza que secretan. Son importantes vectores de virus.",
    cultivosAfectados: ["tomate-cherry", "lechuga", "pimenton", "fresa", "frijol"],
    prevencion: [
      "Fomentar la presencia de mariquitas, su depredador natural.",
      "Revisar periódicamente el envés de las hojas.",
      "Evitar el exceso de abonos nitrogenados que provocan un crecimiento demasiado tierno.",
      "Plantar aromáticas repelentes como la albahaca o la hierbabuena cerca de los cultivos sensibles."
    ],
    solucion: "Aplicar jabón potásico o aceite de Neem. Liberar depredadores naturales como mariquitas. Retirar manualmente los focos iniciales."
  },
  {
    id: "mildiu-polvoroso",
    nombreComun: "Mildiu Polvoroso (Oídio)",
    nombreCientifico: "Erysiphales",
    tipo: "hongo",
    descripcion: "Enfermedad fúngica que se manifiesta como un polvo blanco o ceniciento en hojas, tallos y a veces frutos. Limita la fotosíntesis, debilita la planta y puede causar la caída prematura de las hojas.",
    danos: "Manchas pulverulentas blancas en hojas que se extienden, causando amarillamiento, deformación y caída prematura. Reduce la capacidad de fotosíntesis y debilita la planta.",
    cultivosAfectados: ["calabacin", "pepino-cohombro", "tomate-cherry", "fresa"],
    prevencion: [
      "Asegurar una buena ventilación entre plantas, evitando cultivos demasiado densos.",
      "Regar directamente en la base de la planta, evitando mojar el follaje.",
      "Eliminar y destruir las hojas afectadas en cuanto se detecten.",
      "Realizar podas para mejorar la circulación de aire en el interior de la planta."
    ],
    solucion: "Aplicar fungicidas a base de azufre, bicarbonato de sodio o una solución de leche y agua. Eliminar las partes afectadas para evitar su propagación."
  }
];

// URLs de imágenes de ejemplo para añadir a los datos de siembra.
// Asegúrate de que los IDs aquí coincidan con los IDs de tus datos.
// SI UN ID NO ESTÁ AQUÍ, SE LE ASIGNARÁ UNA IMAGEN DE MARCADOR DE POSICIÓN.
const pestImages: { [id: string]: { imageUrl: string; dataAiHint: string } } = {
  pulgon: {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Plagas%2Fpulgon.jpg?alt=media&token=e1f7b055-0af2-430c-9c7b-839e55a33116",
    dataAiHint: "aphids on plant"
  },
  "mildiu-polvoroso": {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Plagas%2Fo%C3%ADdio.jpg?alt=media&token=8557c61d-7649-43c2-ab4c-d9c0850220c5",
    dataAiHint: "powdery mildew leaf"
  }
};


const fichasTecnicasCultivos: Partial<CropTechnicalSheet>[] = [
  // COMIENZO DEL CULTIVO DE LECHUGA (PLANTILLA)
  // PEGA AQUÍ TUS DATOS CONVERTIDOS DE EXCEL A JSON
  {
    "id": "acelga",
    "nombre": "Acelga",
    "nombreCientifico": "Beta vulgaris var. cicla",
    "descripcion": "La acelga (Beta vulgaris var. cicla) es una hortaliza bianual cultivada como anual. Destaca por sus hojas grandes y pecíolos anchos; permite cosecha continua al cortar sólo las hojas externas.",
    "tags": [
      "maceta_mediana",
      "medio",
      "calido",
      "templado",
      "Andina",
      "Caribe",
      "Pacifica"
    ],
    "dificultad": "Fácil",
    "clima": {
      "clase": [
        "frio",
        "templado",
        "calido"
      ]
    },
    "region": {
      "principal": [
        "Andina",
        "Caribe",
        "Pacifica"
      ],
      "nota": "Óptima en región Andina; en Caribe y Pacífica conviene sombra parcial y riego constante."
    },
    "compatibilidades": [
      "pepino_cohombro",
      "calabacin"
    ],
    "incompatibilidades": [],
    "plagasComunes": ["pulgon", "mildiu-polvoroso"],
    "posicion": {
      "lat": 5.78,
      "lon": -73.118
    },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Facelga.jpg?alt=media&token=e1dd9c89-2353-4c92-b2e4-f52f3913e75e",
        "atribucion": {
          "text": "Image by wirestock on Freepik",
          "link": "https://www.freepik.com/free-photo/high-angle-shot-spinach-plant-with-fresh-leaves-garden_10499898.htm#fromView=search&page=1&position=5&uuid=56642c59-53a3-416b-9fb9-4f63c78078d1&query=espinaca+cultivo"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Mg_S_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Herbácea anual",
    "tecnica": {
      "temperatura_ideal": "5-30 °C",
      "riego": "frecuencia 2 días; método: goteo, manual, aspersión; mantener humedad constante sin encharcar. En clima fresco regar cada ~2 días; en cálido diariamente o dos veces/día en dosis pequeñas; con aspersión, preferir por la mañana.",
      "luz_solar": "Pleno sol en clima fresco; media sombra en horas pico en clima cálido. Con 4–5 h de sol directo aún produce.",
      "ph_suelo": "6.0-7.5",
      "humedad_ideal": "50-70 %",
      "altitud_ideal": "800-2800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "Evitar suelos pedregosos o muy arenosos que se sequen rápido; ideal tipo espinaca, mullido y fértil. Rotar con otras hortalizas."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 40,
        "entre_plantas_cm_max": 50,
        "entre_surcos_cm": 50,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": [
          "compost",
          "estiercol_bien_curado",
          "gallinaza_curada",
          "cal_dolomita_si_ph_bajo"
        ],
        "refuerzos": [
          "refuerzo_n_3_sem",
          "purin_ortiga",
          "estiercol_diluido",
          "20_10_10_baja_dosis",
          "10_10_10_mitad_ciclo",
          "te_compost_mitad_ciclo",
          "post_corte_refuerzo_n",
          "ceniza_madera_k_baja_dosis",
          "urea_muy_diluida_si_palidez"
        ],
        "restricciones": "[evitar_exceso_n_cerca_cosecha, evitar_acumulacion_nitratos, evitar_sobrefertilizar_quimico, preferir_organico_balanceado, evitar_boro_alto]",
        "criticos": [
          "N",
          "K",
          "Mg",
          "Ca"
        ]
      },
      "post_cosecha": {
        "temperatura_ideal": "4 °C",
        "vida_util_dias_frio": "7-14",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Cosechar en horas frescas; no lavar hasta consumir para evitar pudriciones."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 7,
        "duracion_dias_max": 15,
        "duracion_dias_tipico": 10,
        "riego": {
          "frecuencia_dias": "1 (diario)",
          "metodo": [
            "aspersion"
          ],
          "notas": "Mantener suelo húmedo y fresco; regar con rocío fino para no desenterrar semillas."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "No requiere fertilización; la semilla aporta nutrientes."
        },
        "labores": [
          "Remojar las semillas y sembrar 2–3 por hoyo, cubrir con 1 cm de tierra suelta."
        ],
        "notas": "Cubrir la cama con periódico húmedo o plástico perforado para conservar humedad.",
        "indicadores_cambio_fase": "Emergen plántulas con cotiledones alargados.",
        "objetivo_nutricional": "Activar el crecimiento: la semilla hidrata sus tejidos y libera el embrión.",
        "alertas_plagas": "damping_off"
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 10,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": {
          "frecuencia_dias": "1-2",
          "metodo": [
            "aspersión ligera"
          ],
          "notas": "Mantener el sustrato húmedo; vigilar plántulas en sol directo."
        },
        "fertilizacion": {
          "momento_dias": 14,
          "notas": "Aplicar humus de lombriz líquido diluido si hay poco vigor."
        },
        "labores": [
          "Aclareo: dejar 1 planta vigorosa por posición; proteger de caracoles y babosas."
        ],
        "notas": "Trasplantar al lugar definitivo cuando tenga 4–6 hojas.",
        "indicadores_cambio_fase": "Plántulas de 4–6 hojas y ~8 cm.",
        "objetivo_nutricional": "Formar plántulas saludables con hojas verdes y raíz vigorosa.",
        "alertas_plagas": [
          "babosas_caracoles",
          "damping_off_residual"
        ]
      },
      {
        "etapa": "Aclareo/Trasplante",
        "orden": 3,
        "duracion_dias_min": 1,
        "duracion_dias_max": 7,
        "duracion_dias_tipico": 3,
        "riego": {
          "frecuencia_dias": "1",
          "metodo": [
            "riego abundante al trasplantar"
          ],
          "notas": "Mantener muy húmedo el primer par de días."
        },
        "fertilizacion": {
          "momento_dias": 0,
          "notas": "Incorporar compost o bocashi en el sitio de siembra."
        },
        "labores": [
          "Trasplantar con cepellón de tierra o aclarar dejando 1 planta cada 20 cm."
        ],
        "notas": "Evitar enterrar el cogollo.",
        "indicadores_cambio_fase": "Planta establecida en su lugar definitivo.",
        "objetivo_nutricional": "Establecer la planta sin estrés.",
        "alertas_plagas": ""
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 4,
        "duracion_dias_min": 20,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 25,
        "riego": {
          "frecuencia_dias": "2-3",
          "metodo": [
            "riego regular al surco"
          ],
          "notas": "Mantener humedad uniforme; evitar que el suelo se seque por completo."
        },
        "fertilizacion": {
          "momento_dias": 30,
          "notas": "Aplicar fertilizante equilibrado o compost alrededor."
        },
        "labores": [
          "Deshierbe frecuente; eliminar hojas basales amarillas."
        ],
        "notas": "La planta crece rápido en hojas y tallos.",
        "indicadores_cambio_fase": "Comienzan a formarse botones florales.",
        "objetivo_nutricional": "Generar masa foliar robusta.",
        "alertas_plagas": [
          "pulgones",
          "orugas_defoliadoras",
          "mildiu"
        ]
      },
      {
        "etapa": "Cosecha continua",
        "orden": 5,
        "duracion_dias_min": 35,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": {
          "frecuencia_dias": "2",
          "metodo": [
            "riego regular"
          ],
          "notas": "Mantener humedad constante."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "Aplicar refuerzos líquidos cada 2–3 semanas."
        },
        "labores": [
          "Cortar hojas externas cada semana o según necesidad; mantener acolchado."
        ],
        "notas": "Cosechar según demanda, sin arrancar la planta.",
        "indicadores_cambio_fase": "Planta mantiene crecimiento pero inicia espigado.",
        "objetivo_nutricional": "Mantener producción de hojas de calidad.",
        "alertas_plagas": [
          "pulgones"
        ]
      },
      {
        "etapa": "Floración y semillaje",
        "orden": 6,
        "duracion_dias_min": 180,
        "duracion_dias_max": 540,
        "duracion_dias_tipico": 365,
        "riego": {
          "frecuencia_dias": "7",
          "metodo": [
            "riego esporádico"
          ],
          "notas": "Requiere menos riego; basta una vez por semana."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "No se fertiliza en esta fase final."
        },
        "labores": [
          "Entutorar tallos florales si hay viento; recolectar semillas cuando las vainas se tornen de color pajizo."
        ],
        "notas": "La planta produce racimos de flores verde-amarillentas.",
        "indicadores_cambio_fase": "Semillas maduras listas en la planta.",
        "objetivo_nutricional": "Completar el ciclo produciendo semillas.",
        "alertas_plagas": [
          "pulgon_lechuga",
          "botrytis"
        ]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Hojas grandes en contenedor; cosecha por hojas.",
        "materiales": [
          "maceta 7–10 l", "mezcla 60% coco + 40% compost", "acolchado", "semillas/plantín"
        ],
        "herramientas": [
          "tijeras",
          "regadera"
        ],
        "notas_clave": "Cortes de hojas externas; riego constante sin encharcar.",
        "contenedor_volumen_min_L": 7,
        "requisitos_ambiente": {
          "temperatura_C": "16-24 grados",
          "horas_luz": "8-10 h luz"
        },
        "tiempo_estimado_cosecha_dias": "35-55",
        "pasos": [
        {
          "orden": 1,
          "titulo": "Preparar maceta",
          "descripcion": "Usar maceta 7–10 L con mezcla 60% coco + 40% compost y acolchado.",
          "materiales_paso": ["maceta 7–10 L", "coco", "compost", "acolchado"],
          "indicadores": "Sustrato aireado y maceta con buen drenaje",
          "tiempo_dias": "0",
          "evitar": "Sustrato compacto → mal crecimiento",
          "notas": "Maceta lista para siembra",
          "alerta_plagas": null
        },
        {
          "orden": 2,
          "titulo": "Siembra/trasplante",
          "descripcion": "Sembrar semillas a 1 cm o trasplantar plantín en el centro.",
          "materiales_paso": ["semillas/plantín"],
          "indicadores": "Plántula erguida y verde",
          "tiempo_dias": "0–7",
          "evitar": "Siembra muy profunda → baja germinación",
          "notas": "Plántula enraizando correctamente",
          "alerta_plagas": null
        },
        {
          "orden": 3,
          "titulo": "Cuidados básicos",
          "descripcion": "Riego constante sin encharcar; cortar hojas externas para estimular rebrote.",
          "materiales_paso": ["tijeras", "regadera"],
          "indicadores": "Hojas verdes y firmes",
          "tiempo_dias": "7–35",
          "evitar": "Exceso de agua → hongos",
          "notas": "Planta frondosa lista para corte",
          "alerta_plagas": null
        },
        {
          "orden": 4,
          "titulo": "Cosecha",
          "descripcion": "Cortar hojas externas a partir de 35–55 días.",
          "materiales_paso": ["tijeras"],
          "indicadores": "Rebrote vigoroso tras corte",
          "tiempo_dias": "35–55",
          "evitar": "Corte muy bajo → estrés",
          "notas": "Manojos tiernos y verdes",
          "alerta_plagas": null
        }
      ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Cama fresca y fértil con acolchado; producción prolongada.",
        "materiales": [
          "cama con abundante compost",  "acolchado (paja/hojarasca)"
        ],
        "herramientas": [
          "azadín",
          "rastrillo",
          "regadera"
        ],
        "notas_clave": "Espaciar bien para buena aireación; cosecha continua por hojas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "14-22 grados",
          "horas_luz": "6-8 h luz"
        },
        "tiempo_estimado_cosecha_dias": "40-60",
        "pasos": [
        {
          "orden": 1,
          "titulo": "Preparar cama",
          "descripcion": "Armar cama fresca y fértil con compost y acolchado (paja/hojarasca).",
          "materiales_paso": ["azadín", "compost", "rastrillo"],
          "indicadores": "Suelo mullido y aireado",
          "tiempo_dias": "0",
          "evitar": "Suelo compactado → raíces débiles",
          "notas": "Cama lista para siembra",
          "alerta_plagas": null
        },
        {
          "orden": 2,
          "titulo": "Siembra",
          "descripcion": "Sembrar en surcos de 1–2 cm de profundidad con separación de 25–30 cm.",
          "materiales_paso": ["semillas", "regadera"],
          "indicadores": "Germinación uniforme",
          "tiempo_dias": "0–7",
          "evitar": "Siembra muy densa → baja aireación",
          "notas": "Plántulas emergiendo",
          "alerta_plagas": null
        },
        {
          "orden": 3,
          "titulo": "Cuidados básicos",
          "descripcion": "Mantener humedad constante; cortar hojas externas para estimular rebrote.",
          "materiales_paso": ["regadera", "tijeras"],
          "indicadores": "Hojas grandes y sanas",
          "tiempo_dias": "7–40",
          "evitar": "Falta de agua → hojas duras",
          "notas": "Plantas frondosas listas para corte",
          "alerta_plagas": null
        },
        {
          "orden": 4,
          "titulo": "Cosecha",
          "descripcion": "Cosechar hojas cada 40–60 días.",
          "materiales_paso": ["tijeras"],
          "indicadores": "Rebrote constante tras corte",
          "tiempo_dias": "40–60",
          "evitar": "Corte excesivo → pérdida de vigor",
          "notas": "Manojos frescos y verdes",
          "alerta_plagas": null
        }
      ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas uniformes y tiernas, ciclo largo.",
        "materiales": [
          "plancha flotante o canal NFT", "vasos malla", "esponjas", "solución nutritiva"
        ],
        "herramientas": [
          "bomba",
          "aireador",
          "medidor pH"
        ],
        "notas_clave": "pH ~6.0; buena aireación; reponer nutrientes cada 2–3 semanas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "16-24 grados",
          "horas_luz": "10-12 h luz"
        },
        "tiempo_estimado_cosecha_dias": "28-45",
        "pasos": [
        {
          "orden": 1,
          "titulo": "Preparar sistema",
          "descripcion": "Configurar plancha flotante o NFT con vasos malla y solución nutritiva.",
          "materiales_paso": ["bomba", "aireador", "plancha", "esponjas"],
          "indicadores": "Sistema estable y con buena aireación",
          "tiempo_dias": "0",
          "evitar": "Mal flujo de agua → raíces dañadas",
          "notas": "Sistema en circulación continua",
          "alerta_plagas": null
        },
        {
          "orden": 2,
          "titulo": "Siembra/trasplante",
          "descripcion": "Colocar semillas germinadas o plantín en vasos con sustrato inerte.",
          "materiales_paso": ["semillas/plantín", "solución nutritiva"],
          "indicadores": "Plántula firme y verde",
          "tiempo_dias": "0–5",
          "evitar": "Plántula floja → mala adaptación",
          "notas": "Plántulas enraizadas y creciendo",
          "alerta_plagas": null
        },
        {
          "orden": 3,
          "titulo": "Cuidados básicos",
          "descripcion": "Mantener pH ~6.0; reponer nutrientes cada 2–3 semanas; asegurar buena aireación.",
          "materiales_paso": ["medidor pH", "solución nutritiva"],
          "indicadores": "Hojas tiernas y uniformes",
          "tiempo_dias": "5–28",
          "evitar": "pH inadecuado → clorosis",
          "notas": "Planta frondosa lista para corte",
          "alerta_plagas": null
        },
        {
          "orden": 4,
          "titulo": "Cosecha",
          "descripcion": "Cortar hojas externas a los 28–45 días.",
          "materiales_paso": ["tijeras"],
          "indicadores": "Rebrote continuo tras corte",
          "tiempo_dias": "28–45",
          "evitar": "Corte total → frena producción",
          "notas": "Manojos limpios y tiernos",
          "alerta_plagas": null
        }
      ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 45
    }
  }
  // ... Aquí puedes pegar los datos de tus otros 60+ cultivos
];

async function seedPestsAndDiseases() {
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

async function seedFichasTecnicas() {
  const collectionRef = collection(db, 'fichas_tecnicas_cultivos');
  console.log(`Iniciando siembra de ${fichasTecnicasCultivos.length} fichas técnicas de cultivo...`);

  const chunkSize = 400; // Firestore permite hasta 500 operaciones por lote
  for (let i = 0; i < fichasTecnicasCultivos.length; i += chunkSize) {
    const chunk = fichasTecnicasCultivos.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    chunk.forEach(cropData => {
      if (!cropData.id) {
        console.warn('Se encontró un objeto de cultivo sin ID, será omitido.', cropData);
        return;
      }
      const docRef = doc(collectionRef, cropData.id);
      
      const { posicion, ...restOfData } = cropData;
      const dataToSet: { [key: string]: any } = { ...restOfData };

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
      return;
    }
  }

  console.log('¡Siembra de fichas técnicas completada!');
}

export const seedArticles = async () => {
    console.log('La función seedArticles está definida pero actualmente no tiene contenido.');
};

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedFichasTecnicas();
  await seedPestsAndDiseases();
  console.log('--- Proceso de Siembra Finalizado ---');
}

if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
