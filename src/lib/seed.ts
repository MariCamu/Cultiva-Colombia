
// Añadido para cargar las variables de entorno (API Keys) ANTES que cualquier otra cosa.
import { config } from 'dotenv';
config();

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
    "posicion": { "lat": 4.816667, "lon": -74.350000 },
    "imagenes": [{
      "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flechuga.jpg?alt=media&token=fdf580f3-6e74-4e0a-8047-34dfaa7ef4a3",
      "atribucion": {
        "text": "Image by jcomp on Freepik",
        "link": "https://www.freepik.com/free-photo/green-salad-that-is-ready-be-harvested-garden_5490731.htm"
      }
    }],
    "articulosRelacionados": ["arranque_P_casero", "N_vegetativo_casero", "riego_goteo_casero", "alto_k_casero"],
    "tipo_planta": "Hortalizas de hoja",
    "tecnica": {
      "temperatura_ideal": "10-21°C",
      "riego": "Mantener humedad constante sin encharcar. En semillero y plántulas, aplicar riego diario en forma de rocío; si hay humedad ambiental alta, preferir goteo/manual al pie.",
      "luz_solar": "Prefiere sol pleno en clima fresco; en clima cálido agradece sol filtrado o semisombra, ya que el sol directo intenso puede marchitarla.",
      "ph_suelo": "5.7-6.8",
      "humedad_ideal": "60-80%",
      "altitud_ideal": "1500-2800 m.a.s.l",
      "epoca_siembra": "All year round (mejor transición lluvias→secas)",
      "suelo": {
        "drenaje": "Bien drenado",
        "textura": "Franco arenoso",
        "materia_organica": "Alta",
        "retencion_agua": "Moderado",
        "notas": "Evitar suelos mal drenados para prevenir pudriciones. Prefiere suelos sueltos y ricos en materia orgánica."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 40,
        "patron": "Tresbolillo"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado"],
        "refuerzos": ["arranque_balanceado_10_30_10_trasplante", "refuerzo_n_ligero_15_20d", "balanceado_20_20_20_medio_ciclo"],
        "restricciones": "Evitar exceso de nitrógeno cerca de la cosecha",
        "criticos": ["N", "K", "Ca"]
      },
      "post_cosecha": {
        "temperatura_ideal": "4-8 °C",
        "vida_util_dias_frio": "7-15",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Se recomienda cosechar en las horas más frescas y enfriar pronto. Nevera doméstica ≈4 °C: 7–10 días típicos; óptimo comercial 0–2 °C puede acercarse a 10–15 días con alta humedad."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 3,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 5,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersion"], "notas": "Mantener sustrato humedo sin encharcar" },
        "fertilizacion": { "momento_dias": 0, "notas": "Reservas de la semilla; sustrato fertil" },
        "labores": ["siembra_directa", "mantener_humedad"],
        "notas": "Temperatura optima 18_21°C",
        "indicadores_cambio_fase": "Radicula visible y brote emergente",
        "objetivo_nutricional": "Iniciar raiz y brote",
        "alertas_plagas": ["damping_off"]
      },
      {
        "etapa": "Crecimiento de Plántula",
        "orden": 2,
        "duracion_dias_min": 15,
        "duracion_dias_max": 20,
        "duracion_dias_tipico": 18,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Mantener humedad constante." },
        "fertilizacion": { "momento_dias": 15, "notas": "Refuerzo ligero de nitrógeno." },
        "labores": ["aclareo"],
        "notas": "Mantener espaciamiento adecuado.",
        "indicadores_cambio_fase": "4-5 hojas verdaderas",
        "objetivo_nutricional": "Desarrollo vegetativo",
        "alertas_plagas": ["pulgones", "babosas"]
      },
      {
        "etapa": "Formación de Cabeza",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Mantener la humedad constante para evitar amargor." },
        "fertilizacion": { "momento_dias": 30, "notas": "Aplicar un balanceado 20-20-20" },
        "labores": ["control_de_malezas", "manejo_de_plagas"],
        "notas": "Evitar estrés por calor.",
        "indicadores_cambio_fase": "Cabeza está firme y ha alcanzado el tamaño deseado.",
        "objetivo_nutricional": "Desarrollo de cabeza compacta",
        "alertas_plagas": ["gusanos_hojas", "hongos"]
      },
      {
        "etapa": "Cosecha",
        "orden": 4,
        "duracion_dias_min": null,
        "duracion_dias_max": null,
        "duracion_dias_tipico": null,
        "riego": { "frecuencia_dias": null, "metodo": null, "notas": "Suspender riegos 1-2 días antes para mejor conservación." },
        "fertilizacion": { "momento_dias": null, "notas": null },
        "labores": ["cosechar_en_la_manana"],
        "notas": "Cosechar en horas frescas.",
        "indicadores_cambio_fase": "La cabeza está firme y ha alcanzado el tamaño deseado.",
        "objetivo_nutricional": "N/A",
        "alertas_plagas": ["N/A"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "En Maceta",
        "ambito": "maceta",
        "descripcion_corta": "Siembra densa en contenedor pequeño para cabezas compactas u hojas sueltas.",
        "materiales": ["maceta o botella pet 5 l", "mezcla 60% fibra de coco + 40% compost maduro", "acolchado (hojarasca/paja)", "semillas"],
        "herramientas": ["tijeras", "punzón", "regadera"],
        "notas_clave": "Siembra superficial (0.5 cm); mantener humedad sin encharcar; semisombra >28 °C",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": {
          "temperatura_C": "16-22",
          "horas_luz": "10-12"
        },
        "tiempo_estimado_cosecha_dias": "35-55",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar el contenedor",
            "descripcion": "Llenar una maceta (≥25 cm, ideal 30 cm) con mezcla suelta 60% fibra de coco + 40% compost/humus; colocar grava/arena abajo para drenaje.",
            "materiales_paso": ["maceta o botella ≥5 L", "mezcla 60% coco + 40% compost/humus", "acolchado (paja/hojarasca)"],
            "indicadores": "sustrato aireado; agua drena en ≤1 min",
            "tiempo_dias": "1-20",
            "evitar": "maceta <25 cm; tierra arcillosa compacta",
            "notas": "Dejar 1 lechuga por maceta; separar 15–25 cm de otras plantas al trasplantar",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Sembrar las semillas",
            "descripcion": "Humedecer sustrato; colocar 2–3 semillas por punto a ~0.5 cm; rociar suave. Cubierta plástica perforada opcional en climas secos.",
            "materiales_paso": ["semillas de lechuga"],
            "indicadores": "semillas cubiertas ligero y buen contacto con sustrato",
            "tiempo_dias": "0.20",
            "evitar": "sembrar demasiado profundo; semillas secas o exceso de agua",
            "notas": "Avanzar cuando haya plántulas con 2–3 hojas. La germinación suele tardar 4–10 días (referencial)",
            "alerta_plagas": "retirar flores si aparece “espigado” por calor (>25 °C). Aplicar acolchado de paja para conservar la humedad y prevenir malezas"
          },
          {
            "orden": 3,
            "titulo": "Riego y cuidados",
            "descripcion": "Mantener sustrato húmedo sin encharcar (plato por capilaridad). Evitar sol intenso >25–30 °C; acolchar para conservar humedad.",
            "materiales_paso": ["plato para riego", "acolchado"],
            "indicadores": "humedad constante; hojas turgentes",
            "tiempo_dias": 0,
            "evitar": "sustrato seco; exceso de riego (raíces podridas); plagas (pulgón/babosas)",
            "notas": "Avanzar cuando hojas externas alcancen 10–15 cm",
            "alerta_plagas": "Si espiga por calor, retirar flores; regar al sustrato evitando mojar hojas"
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar planta entera al nivel del sustrato o cosecha por hojas externas con tijeras limpias.",
            "materiales_paso": ["tijeras limpias"],
            "indicadores": "hojas crujientes y sin fibrosidad",
            "tiempo_dias": "0.5_10",
            "evitar": "cosechar muy tarde (amargor/espigado); tijeras sucias (hongos)",
            "notas": "Planta compacta o hojas externas de buen tamaño",
            "alerta_plagas": "Cosechar temprano por la mañana para mayor frescura"
          }
        ]
      },
      {
        "id": "jardin",
        "nombre": "En Jardín",
        "ambito": "jardin",
        "descripcion_corta": "Cantero suelto y fértil para cabezas o corte por hojas.",
        "materiales": ["cama elevada", "compost", "acolchado", "semillas"],
        "herramientas": ["azadín", "rastrillo", "regadera"],
        "notas_clave": "Riegos ligeros frecuentes; rotar con no-brásicas; sombra parcial en calor",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "14-20",
          "horas_luz": "8-10"
        },
        "tiempo_estimado_cosecha_dias": "40-60",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar el cantero",
            "descripcion": "Aflojar 20–30 cm; incorporar 20–30% compost/estiércol maduro; nivelar; asegurar drenaje (pH 6–7).",
            "materiales_paso": ["azada", "rastrillo", "compost orgánico"],
            "indicadores": "suelo mullido y rico en MO",
            "tiempo_dias": "2-3",
            "evitar": "suelo pesado/mal drenado; pH <5.5 o >7.5",
            "notas": "Suelo suelto y enriquecido. Listo para trazar hileras. Rotar cultivo con plantas no crucíferas para evitar plagas comunes (pulgón, caracoles)",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Sembrar en el huerto",
            "descripcion": "Hacer surcos poco profundos; 2–3 semillas cada 5 cm; cubrir ~0.5 cm; luego aclarar a 15–30 cm (25–30 cm para cabeza).",
            "materiales_paso": ["semillas", "palita"],
            "indicadores": "plántulas uniformes y bien separadas",
            "tiempo_dias": 10,
            "evitar": "siembra profunda; falta de aclareo; damping-off por exceso de agua",
            "notas": "Queda 1 plántula vigorosa por sitio",
            "alerta_plagas": "Rotar con no crucíferas para reducir plagas"
          },
          {
            "orden": 3,
            "titulo": "Riego, mulch y manejo",
            "descripcion": "Regar cuando se seque la superficie; aplicar mulch (paja/hojarasca); control ecológico: jabón potásico, barreras anti-caracoles.",
            "materiales_paso": ["manguera", "paja", "jabón potásico"],
            "indicadores": "suelo cubierto y húmedo; pocas malezas",
            "tiempo_dias": 0,
            "evitar": "suelo seco; malezas; plagas sin control",
            "notas": "Plantas vigorosas con hojas de 10–15 cm",
            "alerta_plagas": "Mantener acolchado"
          },
          {
            "orden": 4,
            "titulo": "Protección solar",
            "descripcion": "En calor fuerte, dar sombra parcial con malla o asociación con plantas altas para evitar espigado.",
            "materiales_paso": ["malla sombra", "tutores/plantas altas"],
            "indicadores": "corazón tierno; sin floración prematura",
            "tiempo_dias": 10,
            "evitar": "no dar sombra en >30 °C (espigado)",
            "notas": "Plantas creciendo sin espigar",
            "alerta_plagas": "Usar malla 30–50%"
          },
          {
            "orden": 5,
            "titulo": "Cosecha",
            "descripcion": "Cortar hojas cuando midan 15–20 cm o cabeza firme según variedad; usar cuchillo/tijeras limpios.",
            "materiales_paso": ["cuchillo afilado", "tijeras"],
            "indicadores": "hojas frescas, sin amargor",
            "tiempo_dias": "0.5_10",
            "evitar": "cosecha tardía (amargor); poca agua (crecimiento lento)",
            "notas": "Cabeza firme o hojas en tamaño objetivo",
            "alerta_plagas": "Recolectar en fresco y lavar suavemente"
          }
        ]
      },
      {
        "id": "hidroponia",
        "nombre": "Hidroponía (Flotante/NFT)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas tiernas y ciclo corto con solución suave.",
        "materiales": ["plancha flotante/canal nft", "vasos malla", "esponja/lana", "aireador", "solución nutritiva"],
        "herramientas": ["bomba", "medidor pH básico"],
        "notas_clave": "pH 5.8–6.2; flujo continuo; evitar >24 °C para prevenir espigado",
        "contenedor_volumen_min_L": 2,
        "requisitos_ambiente": {
          "temperatura_C": "18-22",
          "horas_luz": "12-14"
        },
        "tiempo_estimado_cosecha_dias": "30-45",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Montar el sistema",
            "descripcion": "Armar NFT o cama flotante con bomba y depósito; colocar vasos malla y medio (esponja/lana de roca); llenar con agua limpia.",
            "materiales_paso": ["canaletas/tubos NFT o bandeja", "bomba", "depósito", "vasos", "esponja/lana"],
            "indicadores": "Sistema sin fugas; flujo estable",
            "tiempo_dias": "3-5",
            "evitar": "fugas; mala circulación u oxigenación",
            "notas": "Flujo continuo verificado y estable. Cubrir canales para evitar algas.",
            "alerta_plagas": "asegurarse de buena oxigenación en el agua con un aireador para evitar ahogamiento de raíces"
          },
          {
            "orden": 2,
            "titulo": "Sembrar las semillas",
            "descripcion": "Colocar 1–2 semillas por cubo; apenas cubrir; mantener base húmeda hasta emergencia.",
            "materiales_paso": ["semillas", "cubos", "bandeja de germinación"],
            "indicadores": "plántulas sanas; raíces explorando medio",
            "tiempo_dias": "0.5",
            "evitar": "exceso de agua sin oxígeno; siembra profunda",
            "notas": "Plántulas con 2–3 hojas y raíces visibles. Aclarar a 1 plántula fuerte por cubo.",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Mantener la solución",
            "descripcion": "Mantener flujo continuo; pH 5.8–6.5 (ideal ~6.0); CE 1.2–1.8 mS/cm; agua <25 °C; reponer solución.",
            "materiales_paso": ["medidor pH/EC", "aireador", "termómetro"],
            "indicadores": "parámetros estables; hojas verdes",
            "tiempo_dias": 0,
            "evitar": "agua caliente; bomba apagada; nutrientes bajos (clorosis)",
            "notas": "Plantas vigorosas con hojas 10–15 cm. Registrar pH/EC para ajustes.",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar planta entera u hojas inferiores cuando estén grandes y crujientes; tijeras limpias.",
            "materiales_paso": ["tijeras"],
            "indicadores": "hojas verdes, sin manchas",
            "tiempo_dias": "0.5-10",
            "evitar": "solución pobre (hojas pálidas); retrasar cosecha",
            "notas": "Plantas en tamaño objetivo (cabeza/hojas). Hidroponía suele estar lista en 30–45 días (referencial)",
            "alerta_plagas": null
          }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 60
    }
  }
  // ... Aquí puedes pegar los datos de tus otros 60+ cultivos
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
      const slug = cropData.nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const docRef = doc(collectionRef, slug);
      
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
  console.log('--- Proceso de Siembra Finalizado ---');
}

if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
