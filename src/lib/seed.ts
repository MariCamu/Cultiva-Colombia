
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
  }, {
    "id": "lechuga",
    "nombre": "Lechuga",
    "nombreCientifico": "Lactuca sativa",
    "descripcion": "La lechuga (Lactuca sativa) es una hortaliza anual de la familia Asteraceae cultivada por sus hojas tiernas y crujientes, consumidas principalmente frescas en ensaladas. De ciclo corto y muy adaptable, agradece suelos sueltos, fértiles y bien drenados.",
    "tags": [
      "maceta_pequena",
      "maceta_mediana",
      "frio",
      "templado",
      "Andina"
    ],
    "dificultad": "Media",
    "clima": {
      "clase": [
        "frio",
        "templado"
      ]
    },
    "region": {
      "principal": [
        "Andina"
      ],
      "nota": "Andina (óptimo). En Caribe/Pacífica es viable con malla sombra 30–40% y riego frecuente; Orinoquía/Amazonia: preferible en microclimas frescos o invernadero."
    },
    "compatibilidades": [
      "cilantro",
      "fresa",
      "aji_dulce",
      "pepino_cohombro",
      "albahaca",
      "espinaca",
      "hierbabuena",
      "jengibre",
      "calabacin",
      "rabano",
      "curcuma",
      "yuca_dulce",
      "tomate_cherry",
      "oregano",
      "acelga",
      "pepino_dulce",
      "pina",
      "pimenton",
      "maiz"
    ],
    "incompatibilidades": [
      "perejil"
    ],
    "posicion": {
      "lat": 4.816667,
      "lon": -74.35
    },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flechuga.jpg?alt=media&token=fdf580f3-6e74-4e0a-8047-34dfaa7ef4a3",
        "atribucion": {
          "text": "Image by jcomp on Freepik",
          "link": "https://www.freepik.com/free-photo/green-salad-that-is-ready-be-harvested-garden_5490731.htm#fromView=search&page=1&position=20&uuid=cc2789d4-71fb-4457-b998-2c382ffc458c&query=lechuga+cultivo"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero"
    ],
    "tipo_planta": "Herbácea anual",
    "tecnica": {
      "temperatura_ideal": "10-21 °C",
      "riego": "Frecuencia típica: cada 2 días. Métodos: goteo, manual, aspersión (preferir en la mañana). Mantener humedad constante sin encharcar; en semilleros/plántulas usar rocío fino diario si el sustrato se seca rápido.",
      "luz_solar": "Pleno sol en clima fresco; en clima cálido, sol filtrado o semisombra (30–40%) para evitar marchitez, amargor y espigado.",
      "ph_suelo": "5.7-6.8",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "1500-2800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado",
        "notas": "Evitar suelos mal drenados (pudriciones). Preferir suelos sueltos, ricos en materia orgánica."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 40,
        "patron": "tresbolillo"
      },
      "nutricion": {
        "enmiendas_fondo": [
          "compost",
          "estiercol_bien_curado"
        ],
        "refuerzos": [
          "arranque_balanceado_10_30_10_trasplante",
          "refuerzo_n_ligero_15_20d",
          "balanceado_20_20_20_medio_ciclo"
        ],
        "restricciones": "[evitar_exceso_n_cerca_cosecha]",
        "criticos": [
          "N",
          "K",
          "Ca"
        ]
      },
      "post_cosecha": {
        "temperatura_ideal": "4 °C",
        "vida_util_dias_frio": "8-15",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Cosechar en horas frescas; enfriar pronto. En nevera doméstica (~4 °C) dura 7–10 días típicamente; no lavar hasta consumir para evitar pudriciones."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 4,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 6,
        "riego": {
          "frecuencia_dias": "1 (diario)",
          "metodo": [
            "aspersion"
          ],
          "notas": "Rocío fino para mantener el sustrato húmedo y fresco sin desplazar semillas."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "La semilla aporta lo necesario; no fertilizar."
        },
        "labores": [
          "Remojar semillas 4–6 h opcional.",
          "Sembrar superficial (0.5–1 cm) y cubrir levemente.",
          "Usar malla sombra 30–40% si hace calor."
        ],
        "notas": "Temperaturas >27–30 °C favorecen espigado posterior; germina mejor con sustrato fresco.",
        "indicadores_cambio_fase": "Emergencia de plántulas con cotiledones.",
        "objetivo_nutricional": "Activar el embrión y asegurar raíces iniciales sanas.",
        "alertas_plagas": "damping_off"
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 10,
        "duracion_dias_max": 20,
        "duracion_dias_tipico": 14,
        "riego": {
          "frecuencia_dias": "1",
          "metodo": [
            "aspersión ligera",
            "manual al pie"
          ],
          "notas": "Mantener el sustrato húmedo; evitar encharques prolongados."
        },
        "fertilizacion": {
          "momento_dias": 14,
          "notas": "Aporte ligero de N si se observa palidez (humus/te de compost)."
        },
        "labores": [
          "Aclareo: dejar 1 plántula vigorosa por sitio.",
          "Endurecimiento 3–5 días antes del trasplante."
        ],
        "notas": "Buena luz para evitar ahilamiento.",
        "indicadores_cambio_fase": "4–6 hojas verdaderas y raíz bien formada.",
        "objetivo_nutricional": "Formar tejido foliar y sistema radical vigoroso.",
        "alertas_plagas": [
          "babosas_caracoles",
          "damping_off_residual"
        ]
      },
      {
        "etapa": "Trasplante/Establecimiento",
        "orden": 3,
        "duracion_dias_min": 1,
        "duracion_dias_max": 7,
        "duracion_dias_tipico": 3,
        "riego": {
          "frecuencia_dias": "1",
          "metodo": [
            "riego abundante al trasplantar"
          ],
          "notas": "Mantener muy húmedo los primeros 1–2 días."
        },
        "fertilizacion": {
          "momento_dias": 0,
          "notas": "Incorporar compost al hoyo o banda de siembra."
        },
        "labores": [
          "Trasplantar sin enterrar el cogollo.",
          "Acolchar para conservar humedad."
        ],
        "notas": "Proteger del sol fuerte las primeras 24–48 h si hace calor.",
        "indicadores_cambio_fase": "Plantas erguidas y en crecimiento activo.",
        "objetivo_nutricional": "Superar el estrés de trasplante y enraizar.",
        "alertas_plagas": ""
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 4,
        "duracion_dias_min": 15,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 20,
        "riego": {
          "frecuencia_dias": "2",
          "metodo": [
            "goteo",
            "manual"
          ],
          "notas": "Humedad uniforme; evitar vaivenes que causen amargor/espigado."
        },
        "fertilizacion": {
          "momento_dias": [
            15,
            30
          ],
          "notas": "Refuerzo N ligero a los 15–20 días y balanceado a mitad de ciclo."
        },
        "labores": [
          "Deshierbe regular.",
          "Reposición de acolchado."
        ],
        "notas": "En clima cálido usar malla sombra en horas pico.",
        "indicadores_cambio_fase": "Cogollo y masa foliar desarrollados.",
        "objetivo_nutricional": "Acumular hojas tiernas y crujientes.",
        "alertas_plagas": [
          "pulgones",
          "orugas_defoliadoras",
          "mildiu"
        ]
      },
      {
        "etapa": "Cosecha",
        "orden": 5,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": {
          "frecuencia_dias": "2",
          "metodo": [
            "goteo",
            "manual",
            "aspersion matutina"
          ],
          "notas": "Mantener humedad constante para hojas tiernas."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "Evitar exceso de N cerca a cosecha (riesgo de nitratos)."
        },
        "labores": [
          "Cosecha por corte de cabeza o por hojas externas (baby leaf)."
        ],
        "notas": "Cosechar en horas frescas y enfriar pronto.",
        "indicadores_cambio_fase": "Cabeza compacta/tamaño comercial o hojas al gusto.",
        "objetivo_nutricional": "Mantener calidad y crocancia.",
        "alertas_plagas": [
          "pulgones",
          "mildiu"
        ]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Cabeza/hojas tiernas en contenedor pequeño-mediano; ciclo corto.",
        "materiales": [
          "maceta 5–10 L",
          "sustrato suelto (tierra negra + compost + arena/perlita)",
          "acolchado",
          "semillas/plantín"
        ],
        "herramientas": [
          "tijeras",
          "regadera"
        ],
        "notas_clave": "Evitar encharcamientos; en calor usar sombra ligera 30–40%.",
        "contenedor_volumen_min_L": 5,
        "requisitos_ambiente": {
          "temperatura_C": "10-21 grados",
          "horas_luz": "4-6 h sol directo (más en clima fresco)"
        },
        "tiempo_estimado_cosecha_dias": "30-55",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar maceta",
            "descripcion": "Llenar con mezcla suelta y rica en MO; asegurar buen drenaje y acolchado superficial.",
            "materiales_paso": [
              "maceta 5–10 L",
              "sustrato",
              "acolchado"
            ],
            "indicadores": "Sustrato aireado, sin compactación y con drenaje fluido",
            "tiempo_dias": "0",
            "evitar": "Sustrato pesado/charcos → pudriciones",
            "notas": "Humedecer ligeramente antes de sembrar",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra o trasplante",
            "descripcion": "Sembrar a 0.5–1 cm o trasplantar plantín con 4–6 hojas.",
            "materiales_paso": [
              "semillas/plantín"
            ],
            "indicadores": "Plántula firme, verde y erguida",
            "tiempo_dias": "0–7",
            "evitar": "Enterrar el cogollo; siembra profunda",
            "notas": "Sombreo ligero 24–48 h si hace calor",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Cuidados",
            "descripcion": "Riego regular (sin encharcar) y deshierbe; en calor, malla sombra ligera.",
            "materiales_paso": [
              "regadera",
              "malla sombra (opcional)"
            ],
            "indicadores": "Hojas firmes, crecimiento continuo",
            "tiempo_dias": "7–35",
            "evitar": "Sequía–exceso de agua alternados → amargor",
            "notas": "Aporte N ligero si palidez",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar cabeza completa o hojas externas según necesidad.",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Cabeza compacta o baby leaves tiernas",
            "tiempo_dias": "30–55",
            "evitar": "Dejar espigar → sabor amargo",
            "notas": "Enfriar pronto para máxima crocancia",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Camas sueltas y fértiles con riego estable; cabezas compactas.",
        "materiales": [
          "cama con abundante compost",
          "acolchado (paja/hojarasca)"
        ],
        "herramientas": [
          "azadín",
          "rastrillo",
          "regadera"
        ],
        "notas_clave": "Tresbolillo 25–30 × 40 cm; humedad constante y buen drenaje.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "10-21 grados",
          "horas_luz": "4-8 h sol (filtrado en cálido)"
        },
        "tiempo_estimado_cosecha_dias": "35-60",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar cama",
            "descripcion": "Aflojar suelo, incorporar compost y colocar acolchado.",
            "materiales_paso": [
              "azadín",
              "compost",
              "rastrillo",
              "acolchado"
            ],
            "indicadores": "Suelo mullido y con MO alta",
            "tiempo_dias": "0",
            "evitar": "Compactación y encharques",
            "notas": "Elevar camas si hay lluvias intensas",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra/trasplante",
            "descripcion": "Sembrar en líneas o trasplantar a 25–30 cm entre plantas y 40 cm entre surcos (tresbolillo).",
            "materiales_paso": [
              "semillas/plantines",
              "regadera"
            ],
            "indicadores": "Prendimiento uniforme",
            "tiempo_dias": "0–7",
            "evitar": "Enterrar cogollo; densidad excesiva",
            "notas": "Riego de establecimiento",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Manejo",
            "descripcion": "Mantener humedad constante; deshierbar; reponer acolchado.",
            "materiales_paso": [
              "regadera",
              "tijeras"
            ],
            "indicadores": "Hojas grandes y turgentes",
            "tiempo_dias": "7–40",
            "evitar": "Sequía prolongada → amargor",
            "notas": "Sombra ligera en horas pico en climas cálidos",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar cabezas a los 35–60 días (según variedad y clima).",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Cabeza compacta sin espigar",
            "tiempo_dias": "35–60",
            "evitar": "Demoras que induzcan espigado",
            "notas": "Enfriar rápido tras el corte",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas uniformes y crujientes, ciclo muy corto.",
        "materiales": [
          "plancha flotante o canal NFT",
          "vasos malla",
          "esponjas",
          "solución nutritiva"
        ],
        "herramientas": [
          "bomba",
          "aireador",
          "medidor pH/EC"
        ],
        "notas_clave": "pH 5.7–6.2; alta aireación; fertirriego continuo; sombreo ligero en calor.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "10-22 grados (solución 16-20)",
          "horas_luz": "10-12 h de luz"
        },
        "tiempo_estimado_cosecha_dias": "25-40",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar sistema",
            "descripcion": "Montar plancha/NFT con circulación continua y aireación.",
            "materiales_paso": [
              "bomba",
              "aireador",
              "plancha/canales"
            ],
            "indicadores": "Flujo estable, oxigenación visible",
            "tiempo_dias": "0",
            "evitar": "Estancamientos → raíces asfixiadas",
            "notas": "Desinfectar componentes antes de uso",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra/trasplante",
            "descripcion": "Germinar en esponja y trasplantar a vaso malla cuando tenga 2–3 hojas verdaderas.",
            "materiales_paso": [
              "semillas/plug",
              "solución nutritiva"
            ],
            "indicadores": "Raíces blancas y sanas",
            "tiempo_dias": "0–7",
            "evitar": "pH fuera de 5.7–6.2",
            "notas": "EC baja-moderada al inicio, subir en vegetativo",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Manejo",
            "descripcion": "Mantener pH 5.7–6.2; reponer nutrientes; buena aireación y temperatura de solución 16–20 °C.",
            "materiales_paso": [
              "medidor pH/EC",
              "solución nutritiva"
            ],
            "indicadores": "Hojas firmes, crecimiento rápido",
            "tiempo_dias": "7–25",
            "evitar": "Temperatura >24 °C en solución",
            "notas": "Sombreo 20–30% si hay estrés por calor",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar cabeza completa o baby leaf a los 25–40 días.",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Cogollo formado o hojas del tamaño deseado",
            "tiempo_dias": "25–40",
            "evitar": "Demorar hasta espigado",
            "notas": "Lavar y escurrir suavemente",
            "alerta_plagas": null
          }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 45
    }
  }, {
    "id": "cilantro",
    "nombre": "Cilantro",
    "nombreCientifico": "Coriandrum sativum",
    "descripcion": "El cilantro (Coriandrum sativum) es una hierba aromática anual cuyas hojas y semillas se emplean ampliamente como condimento. Muy apreciado en la cocina colombiana; ciclo corto, prefiere climas frescos y tiende a espigar con calor.",
    "tags": [
      "maceta_pequena",
      "facil",
      "frio",
      "templado",
      "calido",
      "Andina",
      "Caribe"
    ],
    "dificultad": "Fácil",
    "clima": {
      "clase": ["frio", "templado"]
    },
    "region": {
      "principal": ["Andina", "Caribe"],
      "nota": "Óptimo en Andina. En Caribe/Pacífica usar sombra 30–40% y riegos frecuentes para evitar espigado; en Orinoquía/Amazonia preferir microclimas frescos/invernadero."
    },
    "compatibilidades": [
      "lechuga",
      "fresa",
      "pepino_cohombro",
      "espinaca",
      "hierbabuena",
      "calabacin",
      "rabano",
      "tomate_cherry",
      "acelga",
      "maiz",
      "frijol",
      "pimenton"
    ],
    "incompatibilidades": ["albahaca", "perejil"],
    "posicion": { "lat": 8.748, "lon": -75.881 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcilantro.jpg?alt=media&token=da5c9ee8-fc4a-46c1-b13a-c1133a569f61",
        "atribucion": {
          "text": "Image by azerbaijan_stockers on Freepik",
          "link": "https://www.freepik.com/free-photo/wrapping-parsley-bundle-marble-background-high-quality-photo_16928364.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero"
    ],
    "tipo_planta": "Hierba anual aromática",
    "tecnica": {
      "temperatura_ideal": "10-26 °C",
      "riego": "Ligero y frecuente; preferible goteo o manual. Evitar mojar en exceso las hojas; si usas aspersión, que sea temprano en la mañana. Tras establecimiento, espaciar riegos a ~cada 2 días si el clima lo permite.",
      "luz_solar": "Pleno sol en clima fresco; sombra parcial en cálido (>28 °C).",
      "ph_suelo": "5.0-7.5",
      "humedad_ideal": "60-70 %",
      "altitud_ideal": "0-2600 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado",
        "notas": "En climas cálidos, usar acolchado y riegos más frecuentes para retrasar espigado."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 10,
        "entre_plantas_cm_max": 15,
        "entre_surcos_cm": 30,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "materia_organica"],
        "refuerzos": [
          "balanceado_10_10_10_semana_4_6",
          "te_compost_semana_4_6",
          "refuerzo_despues_de_cada_corte"
        ],
        "restricciones": "[evitar_exceso_n, preferir_fuentes_n_nitrato, evitar_kcl_si_salinidad]",
        "criticos": ["N", "K"]
      },
      "post_cosecha": {
        "temperatura_ideal": "4 °C",
        "vida_util_dias_frio": "7-14",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Conservar con tallo en vaso con agua (cambiar cada 1–2 días) o en bolsa perforada en nevera."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 7,
        "duracion_dias_max": 15,
        "duracion_dias_tipico": 10,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["aspersion"], "notas": "Mantener humedad constante hasta emergencia." },
        "fertilizacion": { "momento_dias": null, "notas": "Semilla con reservas; remojo previo opcional." },
        "labores": ["Siembra directa a 1–2 cm de profundidad.", "Cubrir ligeramente con suelo mullido."],
        "notas": "Germinación 70–85%.",
        "indicadores_cambio_fase": "Plántulas emergen con cotiledones.",
        "objetivo_nutricional": "Iniciar plántulas vigorosas con raíz pivotante.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      {
        "etapa": "Plántula inicial",
        "orden": 2,
        "duracion_dias_min": 15,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 21,
        "riego": { "frecuencia_dias": "5-6", "metodo": ["aspersion", "surcos"], "notas": "Riegos ligeros y espaciados." },
        "fertilizacion": { "momento_dias": 0, "notas": "Fertilización de fondo P y K al sembrar." },
        "labores": ["Deshierbe a los 20 días.", "Aporque ligero si hay acame."],
        "notas": "Crecimiento inicial más lento.",
        "indicadores_cambio_fase": "Plántula con 2 hojas verdaderas.",
        "objetivo_nutricional": "Establecer follaje y raíces.",
        "alertas_plagas": ["damping_off_residual", "competencia_malezas"]
      },
      {
        "etapa": "Crecimiento vegetativo acelerado",
        "orden": 3,
        "duracion_dias_min": 20,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 40,
        "riego": { "frecuencia_dias": "6-7", "metodo": ["goteo", "surcos"], "notas": "Mayor demanda desde ~día 20." },
        "fertilizacion": { "momento_dias": 35, "notas": "Primera cobertura con N (~35 DDS)." },
        "labores": ["Deshierbe", "Aporque", "Monitoreo constante"],
        "notas": "Altura 15–20 cm; follaje cierra entresurcos.",
        "indicadores_cambio_fase": "Máximo desarrollo de hojas.",
        "objetivo_nutricional": "Lograr hojas abundantes y aromáticas.",
        "alertas_plagas": ["pulgones", "trips", "septoria_manchas_foliares"]
      },
      {
        "etapa": "Prefloración (opcional)",
        "orden": 4,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": { "frecuencia_dias": "7-10", "metodo": ["goteo", "surcos"], "notas": "Espaciar riegos para mantener calidad." },
        "fertilizacion": { "momento_dias": 50, "notas": "Segunda cobertura con N (~50 DDS)." },
        "labores": ["Monitoreo de inicio de floración", "Despunte para retrasar flor"],
        "notas": "Botones florales visibles en algunos tallos.",
        "indicadores_cambio_fase": "Aparición de tallos florales.",
        "objetivo_nutricional": "Mantener hojas antes de floración.",
        "alertas_plagas": ["pulgones_inducen_flor", "acaros_si_clima_seco"]
      },
      {
        "etapa": "Cosecha de hoja",
        "orden": 5,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": { "frecuencia_dias": "ligero antes de corte", "metodo": [], "notas": "Mantener humedad ligera." },
        "fertilizacion": { "momento_dias": null, "notas": "Refuerzo suave después de cada corte." },
        "labores": ["Corte a 2–3 cm del suelo", "Formar manojos"],
        "notas": "Posibles 1–2 cortes con rebrote menor.",
        "indicadores_cambio_fase": "Follaje verde intenso (20–35 cm) sin espigar.",
        "objetivo_nutricional": "Obtener hojas tiernas y aromáticas.",
        "alertas_plagas": ["pulgones", "alternaria_postcosecha"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Manojos por sitio para cortes continuos.",
        "materiales": [
          "maceta/pet 3 l",
          "mezcla 50% fibra coco + 50% compost",
          "acolchado",
          "semilla (fruto partido)"
        ],
        "herramientas": ["tijeras", "regadera"],
        "notas_clave": "Siembra directa (sin trasplante); sombra al mediodía en calor; riegos regulares.",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": { "temperatura_C": "18-26 grados", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "30-45",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar maceta y sustrato",
            "descripcion": "Usar maceta ≥15 cm con buen drenaje; llenar con mezcla suelta 60% fibra de coco + 40% compost; verificar orificios.",
            "materiales_paso": ["maceta ≥15 cm", "sustrato", "compost"],
            "indicadores": "Sustrato suelto, drena sin charcos",
            "tiempo_dias": "0",
            "evitar": "Sustrato compactado; mal drenaje",
            "notas": "Preferir compost bien curado (ecológico)",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra",
            "descripcion": "Humedecer sustrato; sembrar a 0.5–1 cm; 3–4 semillas por punto; espaciar puntos 10 cm.",
            "materiales_paso": ["semillas de cilantro", "regadera"],
            "indicadores": "Semillas cubiertas ligero y buen contacto",
            "tiempo_dias": "0-10",
            "evitar": "Enterrar demasiado; superficie seca",
            "notas": "Germinación típica 7–14 días",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Germinación y aclarado",
            "descripcion": "Mantener humedad sin encharcar; cuando haya 2–3 hojas, aclarar dejando 1 planta cada 10–15 cm.",
            "materiales_paso": ["regadera", "tijeras pequeñas"],
            "indicadores": "Plántulas vigorosas y separadas",
            "tiempo_dias": "7-14",
            "evitar": "No aclarar (competencia); exceso de riego (podredumbre)",
            "notas": "Semisombra en climas cálidos para evitar espigado",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Riego y cuidados",
            "descripcion": "Riego ligero y frecuente; té de compost suave cada 2–3 semanas; regar al sustrato sin mojar en exceso hojas.",
            "materiales_paso": ["regadera", "compost líquido (opcional)"],
            "indicadores": "Hojas verdes y con aroma",
            "tiempo_dias": "continuo",
            "evitar": "Exceso de riego (amarillamiento); sequía (marchitez)",
            "notas": "Evitar abonados fuertes (favorecen espigado)",
            "alerta_plagas": null
          },
          {
            "orden": 5,
            "titulo": "Cosecha",
            "descripcion": "Cortar hojas/tallos externos cuando la planta mida 15–25 cm; usar tijeras limpias.",
            "materiales_paso": ["tijeras limpias"],
            "indicadores": "Hojas aromáticas y frescas",
            "tiempo_dias": "30-50",
            "evitar": "Cortar en exceso debilita; esperar demasiado amarga",
            "notas": "Siembras sucesivas cada 2–3 semanas",
            "alerta_plagas": null
          },
          {
            "orden": 6,
            "titulo": "Manejo de floración",
            "descripcion": "Si florece, cortar para seguir con hojas o dejar para semilla (coriandro) y recolectar frutos secos.",
            "materiales_paso": ["tijeras"],
            "indicadores": "Decisión tomada (hojas vs semilla)",
            "tiempo_dias": "según estado",
            "evitar": "Dejar florecer sin intención → menor calidad",
            "notas": "Hojas = cilantro; semillas = coriandro",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Siembra directa en bandas para cosecha por manojos.",
        "materiales": ["cantero suelto", "compost", "acolchado", "semilla"],
        "herramientas": ["azadín", "rastrillo"],
        "notas_clave": "Escalonar siembras cada 2–3 semanas; evitar encharcamientos.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "16-24 grados", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "30-50",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar cantero",
            "descripcion": "Aflojar suelo 20–30 cm; enmendar con 10–30% compost; retirar piedras; asegurar drenaje.",
            "materiales_paso": ["azadín", "rastrillo", "compost orgánico"],
            "indicadores": "Suelo suelto y con MO",
            "tiempo_dias": "0",
            "evitar": "Suelo pesado o mal drenado",
            "notas": "pH ideal 6.0–7.0 (opcional medir)",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra directa",
            "descripcion": "Sembrar en hileras: semillas cada 3–5 cm; cubrir 0.5–1 cm; 20–30 cm entre hileras; o siembra densa y aclarar a 10 cm.",
            "materiales_paso": ["semillas", "regadera"],
            "indicadores": "Semillas cubiertas y alineadas",
            "tiempo_dias": "0-10",
            "evitar": "Siembra muy profunda; suelo seco",
            "notas": "Siembra sucesiva cada 15 días para continuidad",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Germinación y aclarado",
            "descripcion": "Riego ligero hasta germinar (7–14 días); aclarar a 10–15 cm entre plantas tras 3–4 semanas.",
            "materiales_paso": ["regadera"],
            "indicadores": "Plántulas sanas y separadas",
            "tiempo_dias": "7-21",
            "evitar": "Falta de aclarado; aves comen plántulas",
            "notas": "Proteger con malla si hay aves",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Mantenimiento ecológico",
            "descripcion": "Aplicar mulch orgánico; controlar pulgones con jabón potásico; desmalezar manualmente.",
            "materiales_paso": ["mulch", "jabón potásico"],
            "indicadores": "Suelo cubierto; pocas plagas",
            "tiempo_dias": "continuo",
            "evitar": "Maleza excesiva; sobreabonado",
            "notas": "Evitar exceso de nitrógeno (espigado)",
            "alerta_plagas": null
          },
          {
            "orden": 5,
            "titulo": "Cosecha",
            "descripcion": "Cosechar hojas cuando midan 10–20 cm; cortar tallos exteriores o la planta al ras antes de floración.",
            "materiales_paso": ["tijeras", "cesta"],
            "indicadores": "Hojas frescas y aromáticas",
            "tiempo_dias": "30-50",
            "evitar": "Cosecha tardía reduce calidad",
            "notas": "Guardar semillas (coriandro) si se deja florecer",
            "alerta_plagas": null
          },
          {
            "orden": 6,
            "titulo": "Rotación y reposición",
            "descripcion": "No repetir cilantro en el mismo lugar; rotar con leguminosas o solanáceas; resembrar cada 2–3 semanas.",
            "materiales_paso": ["planificación de rotación"],
            "indicadores": "Suelo saludable y menos plagas",
            "tiempo_dias": "—",
            "evitar": "Monocultivo continuo acumula plagas",
            "notas": "La rotación mejora la sanidad del suelo",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Manojos uniformes, limpios y de ciclo corto.",
        "materiales": [
          "canal NFT o cama flotante",
          "esponjas",
          "vasos malla",
          "solución nutritiva suave"
        ],
        "herramientas": ["bomba", "medidor pH básico"],
        "notas_clave": "Siembra en sitio definitivo; pH ~5.8–6.2; alta humedad radicular.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-24 grados", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "25-40",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Montaje del sistema",
            "descripcion": "Preparar NFT o bandeja flotante con bomba y depósito; medios de germinación (esponja/lana de roca); llenar con agua limpia.",
            "materiales_paso": ["NFT/bandeja", "bomba", "depósito", "medios", "medidor pH"],
            "indicadores": "Sistema sin fugas; circulación estable",
            "tiempo_dias": "2-3",
            "evitar": "Mala circulación o fugas",
            "notas": "Cubrir canales para evitar algas",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Preparar solución y pH",
            "descripcion": "Añadir solución nutritiva suave (EC 0.8–1.2 mS/cm); ajustar pH 6.0–6.5; airear depósito si estático.",
            "materiales_paso": ["solución nutritiva", "medidor pH", "aireador"],
            "indicadores": "pH 6.0–6.5 y EC adecuados",
            "tiempo_dias": "0.5",
            "evitar": "pH fuera de rango; EC muy alta",
            "notas": "Mantener agua <24–25 °C",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Germinación en medio",
            "descripcion": "Colocar 2 semillas por cubo; mantener medio húmedo hasta emergencia (7–14 días); aclarar a 1 plántula al ver raíces y pasar a NFT.",
            "materiales_paso": ["semillas", "cubos", "bandejas"],
            "indicadores": "Plántulas con raíces blancas y fuertes",
            "tiempo_dias": "7-14",
            "evitar": "Secado del medio; baja oxigenación",
            "notas": "Ambiente controlado mejora uniformidad",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Operación y monitoreo",
            "descripcion": "Flujo continuo/recirculación; revisar pH cada 2–3 días y EC semanal; vigilar 18–24 °C y oxigenación.",
            "materiales_paso": ["medidor pH", "medidor EC", "termómetro"],
            "indicadores": "Valores estables; plantas verdes",
            "tiempo_dias": "continuo",
            "evitar": "pH inestable; agua caliente",
            "notas": "Evitar exceso de nitrógeno (espigado)",
            "alerta_plagas": null
          },
          {
            "orden": 5,
            "titulo": "Cosecha",
            "descripcion": "Cortar hojas/tallos cuando midan 10–20 cm; ideal temprano en la mañana; ciclo típico 30–45 días desde siembra.",
            "materiales_paso": ["tijeras"],
            "indicadores": "Hojas aromáticas y sanas",
            "tiempo_dias": "30-45",
            "evitar": "Solución empobrecida → plantas pálidas",
            "notas": "La hidroponía acelera la cosecha",
            "alerta_plagas": null
          },
          {
            "orden": 6,
            "titulo": "Mantenimiento del sistema",
            "descripcion": "Cambiar parte de la solución cada 1–2 semanas; limpiar depósitos; revisar bombas; cubrir para evitar algas.",
            "materiales_paso": ["bomba", "materiales de limpieza", "solución nueva"],
            "indicadores": "Sistema limpio y bomba funcionando",
            "tiempo_dias": "7-14",
            "evitar": "Sedimentos/algas; bomba fallida",
            "notas": "Registrar pH/EC para ajustes",
            "alerta_plagas": null
          }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 40
    }
  }, {
    "id": "fresa",
    "nombre": "Fresa",
    "nombreCientifico": "Fragaria × ananassa",
    "descripcion": "La fresa (Fragaria × ananassa) es una planta estolonífera perenne de la familia Rosaceae cultivada por su fruto rojo dulce y aromático. En Colombia se siembran variedades mejoradas (ej. 'Albión').",
    "tags": [
      "maceta_mediana",
      "medio",
      "frio",
      "templado",
      "Andina",
      "Pacifica"
    ],
    "dificultad": "Media",
    "clima": {
      "clase": ["frio", "templado"]
    },
    "region": {
      "principal": ["Andina", "Pacifica"],
      "nota": "Óptima en región Andina. En Pacífica viable con buen drenaje, camas elevadas y control de humedad/ventilación; en Caribe/Orinoquía/Amazonia solo en microclimas frescos o bajo sombra/invernadero ligero."
    },
    "compatibilidades": [
      "lechuga",
      "cilantro",
      "espinaca",
      "hierbabuena",
      "jengibre",
      "curcuma",
      "acelga",
      "cebolla_larga",
      "oregano"
    ],
    "incompatibilidades": [
      "tomate_cherry",
      "maiz",
      "yuca",
      "yuca_dulce"
    ],
    "posicion": { "lat": 4.933, "lon": -74.172 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ffresa.jpg?alt=media&token=43cad582-fb6a-464f-9cb7-21858dd9e206",
        "atribucion": {
          "text": "Image by serhii_bobyk on Freepik",
          "link": "https://www.freepik.com/free-photo/fresh-organic-strawberries-ripen-large-greenhouse_15099372.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Ca_B_floracion_casero",
      "Mg_S_casero",
      "sustrato_lowcost",
      "manejo_de_estolones",
      "malla_anti_pajaros_lowcost",
      "acolchado_antihongos_casero"
    ],
    "tipo_planta": "Planta estolonífera perenne",
    "tecnica": {
      "temperatura_ideal": "14-24 °C",
      "riego": "Frecuente y moderado; mantener suelo/sustrato húmedo sin encharcar. Mayor demanda durante fructificación.",
      "luz_solar": "Pleno sol en clima fresco; en cálido preferir 6-8 h de sol y sombra ligera en horas críticas.",
      "ph_suelo": "5.5-6.5",
      "humedad_ideal": "70-80 %",
      "altitud_ideal": "1500-2600 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "Prefiere camas elevadas con acolchado; corona al ras del suelo; rotar cultivo cada 3 años para sanidad."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 30,
        "entre_plantas_cm_max": 40,
        "entre_surcos_cm": 60,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol bien curado", "fosfórico (moderado)"],
        "refuerzos": [
          "fertirrigación N balanceada (vegetativo)",
          "alto P en inducción floral",
          "K y Ca durante fructificación"
        ],
        "restricciones": "[evitar_exceso_nitrogeno, evitar_cloruros, rotar_cultivo_3_años]",
        "criticos": ["N", "P", "K", "Ca", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "0-2 °C",
        "vida_util_dias_frio": "5-7",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Recolectar frutos en estado rojo uniforme y firmes; refrigerar pronto; manipular con pedúnculo para prolongar vida útil."
      }
    },
    "cicloVida": [
      {
        "etapa": "Trasplante/Establecimiento",
        "orden": 1,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["goteo"], "notas": "Mantener humedad constante; alta HR los primeros días." },
        "fertilizacion": { "momento_dias": 0, "notas": "Aporte de compost + fósforo al trasplante." },
        "labores": ["Acolchado con paja/plástico", "Control inicial de malezas"],
        "notas": "Usar plantín o estolón enraizado; evitar semilla.",
        "indicadores_cambio_fase": "Raíces nuevas blancas y hojas nuevas.",
        "objetivo_nutricional": "Enraizar y establecer la planta.",
        "alertas_plagas": ["phytophthora", "verticillium"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 2,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["goteo", "aspersión"], "notas": "Riego regular, evitar encharcamiento." },
        "fertilizacion": { "momento_dias": [15, 30, 45], "notas": "Fertirriego balanceado, énfasis en N." },
        "labores": ["Deshoje de hojas secas", "Eliminar estolones si se prioriza fruta"],
        "notas": "Plantas con 6-8 hojas, estolones activos.",
        "indicadores_cambio_fase": "Corona fuerte y masa foliar densa.",
        "objetivo_nutricional": "Acumular biomasa y preparar para floración.",
        "alertas_plagas": ["ácaro araña roja", "pulgones", "oídio"]
      },
      {
        "etapa": "Inducción floral y floración",
        "orden": 3,
        "duracion_dias_min": 15,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 20,
        "riego": { "frecuencia_dias": "2", "metodo": ["goteo"], "notas": "Humedad uniforme, crítica en floración." },
        "fertilizacion": { "momento_dias": 45, "notas": "Fertilizante alto en P y microelementos." },
        "labores": ["Polinización manual si es necesario", "Control de estolones restantes"],
        "notas": "Depende de fotoperiodo y temperatura.",
        "indicadores_cambio_fase": "Botones florales visibles.",
        "objetivo_nutricional": "Promover cuaje y vigor floral.",
        "alertas_plagas": ["trips", "botrytis"]
      },
      {
        "etapa": "Fructificación y cuajado",
        "orden": 4,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": "2", "metodo": ["goteo"], "notas": "Alta demanda hídrica en fructificación." },
        "fertilizacion": { "momento_dias": [55, 65], "notas": "Refuerzos en K y Ca para firmeza y calidad." },
        "labores": ["Colocar paja bajo frutos", "Deshierbe mínimo (cobertura)"],
        "notas": "Cosecha escalonada cada 3 días por 4–6 meses.",
        "indicadores_cambio_fase": "Frutos enrojeciendo y engordando.",
        "objetivo_nutricional": "Maximizar producción y firmeza del fruto.",
        "alertas_plagas": ["botrytis", "caracoles", "trips"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta colgante",
        "ambito": "maceta",
        "descripcion_corta": "Plantín en maceta colgante drenante; fruta limpia y accesible.",
        "materiales": ["maceta colgante 5–7 L", "70% fibra coco + 30% compost", "acolchado", "plantines"],
        "herramientas": ["tijeras de poda", "regadera"],
        "notas_clave": "Eliminar estolones si priorizas fruta; malla antipájaros low-cost.",
        "contenedor_volumen_min_L": 5,
        "requisitos_ambiente": { "temperatura_C": "16-24 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "70-100",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta colgante 5–7 L con mezcla 70% coco + 30% compost y acolchado.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato aireado", "tiempo_dias": "1", "evitar": "Sustrato compacto", "notas": "Ubicar en sitio con 8–10 h de luz.", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar plantines dejando la corona al nivel del sustrato, espaciar ≥20 cm si varias plantas.", "materiales_paso": ["plantines", "regadera"], "indicadores": "Corona visible y raíces cubiertas", "tiempo_dias": "0.5", "evitar": "Enterrar corona → pudrición", "notas": "Elegir plantines vigorosos.", "alerta_plagas": null },
          { "orden": 3, "titulo": "Riego y cuidados", "descripcion": "Riego moderado y constante; retirar estolones; usar malla antipájaros.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Sustrato húmedo; plantas verdes", "tiempo_dias": "continuo", "evitar": "Exceso agua → hongos", "notas": "Dirigir energía a frutos.", "alerta_plagas": null },
          { "orden": 4, "titulo": "Fertilización ligera", "descripcion": "Aplicar té de compost o biofertilizante cada 15 días; evitar exceso N.", "materiales_paso": ["té de compost"], "indicadores": "Flores sanas y frutos firmes", "tiempo_dias": "15-70", "evitar": "Exceso de abono → solo hojas", "notas": "No usar químicos.", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar frutos rojos brillantes con tijeras, dejando pedúnculo; revisar cada 2–3 días.", "materiales_paso": ["tijeras de poda"], "indicadores": "Frutos firmes y dulces", "tiempo_dias": "70-100", "evitar": "Recolectar verdes o sobremaduros", "notas": "Consumir o refrigerar pronto.", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Camas elevadas y acolchadas para mejor sanidad; producción prolongada.",
        "materiales": ["camas elevadas", "compost", "acolchado (paja/hojarasca)", "plantines"],
        "herramientas": ["azadón", "regadera"],
        "notas_clave": "Drenaje clave; corona sin enterrar; proteger frutos con malla antipájaros.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "14-22 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "80-120",
        "pasos": [
          { "orden": 1, "titulo": "Preparar camas", "descripcion": "Camas elevadas con compost y acolchado de paja/hojarasca; buen drenaje.", "materiales_paso": ["cama elevada", "compost", "acolchado"], "indicadores": "Suelo mullido y cubierto", "tiempo_dias": "2", "evitar": "Encharcamiento", "notas": "Mantiene humedad y frutos limpios.", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar plantines a 30–40 cm y surcos de 60–70 cm; coronas al ras.", "materiales_paso": ["plantines", "regadera"], "indicadores": "Coronas visibles", "tiempo_dias": "0.5", "evitar": "Enterrar corona", "notas": "Mejor inicio en primavera.", "alerta_plagas": null },
          { "orden": 3, "titulo": "Riego y cuidados", "descripcion": "Riego frecuente pero sin encharcar; acolchado; instalar goteo; usar malla antipájaros.", "materiales_paso": ["regadera", "goteo", "malla antipájaros"], "indicadores": "Suelo húmedo constante", "tiempo_dias": "continuo", "evitar": "Sequía → frutos pequeños", "notas": "Sombra parcial en calor extremo.", "alerta_plagas": null },
          { "orden": 4, "titulo": "Fertilización ecológica", "descripcion": "Aplicar compost al inicio y biofertilizantes líquidos durante floración/fructificación.", "materiales_paso": ["compost", "biofertilizante"], "indicadores": "Plantas con flores y frutos firmes", "tiempo_dias": "20-80", "evitar": "Déficit nutricional → poca floración", "notas": "Rotar cultivo cada 3 años.", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar frutos rojos y firmes con tijeras; revisar diariamente en temporada.", "materiales_paso": ["tijeras", "cesta"], "indicadores": "Frutos dulces y brillantes", "tiempo_dias": "80-120", "evitar": "Cosecha muy temprano o tarde → menor calidad", "notas": "Recolectar en la mañana mejora firmeza.", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Producción continua en sistemas NFT o torres; frutos limpios y firmes.",
        "materiales": ["sistema NFT/torre", "vasos malla", "sustrato inerte", "solución nutritiva", "aireación"],
        "herramientas": ["bomba", "medidor pH/EC básico"],
        "notas_clave": "pH 5.8–6.2; EC 1.5–2.0; agua 18–22 °C; polinización asistida en interior.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-24 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "60-90",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Instalar NFT, torre o flotante con vasos malla y sustrato inerte; asegurar aireación.", "materiales_paso": ["NFT/torre", "bomba", "aireador"], "indicadores": "Sistema estable y aireado", "tiempo_dias": "3", "evitar": "Mala circulación → raíces enfermas", "notas": "Mantener agua 18–22 °C", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plantines en vasos malla con lana de roca/perlita; coronas al ras.", "materiales_paso": ["plantines", "sustrato inerte"], "indicadores": "Plántula firme", "tiempo_dias": "0.5", "evitar": "Enterrar corona", "notas": "Usar plantines libres de plagas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Solución nutritiva", "descripcion": "Mantener pH 5.8–6.2 y EC 1.5–2.0; revisar semanalmente y reponer.", "materiales_paso": ["medidor pH/EC", "solución nutritiva"], "indicadores": "Valores estables", "tiempo_dias": "0.5-60", "evitar": "pH fuera de rango", "notas": "Lavar sistema para evitar sales", "alerta_plagas": null },
          { "orden": 4, "titulo": "Monitoreo y cuidados", "descripcion": "Flujo continuo; raíces blancas y sanas; polinizar manualmente si es interior.", "materiales_paso": ["cepillo suave", "bioinsumos"], "indicadores": "Plantas vigorosas y florecidas", "tiempo_dias": "continuo", "evitar": "Raíces marrones (falta oxígeno)", "notas": "Ventilador en interior para simular viento", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar frutos rojos y firmes a los 60–90 días.", "materiales_paso": ["tijeras", "cesta"], "indicadores": "Frutos maduros y dulces", "tiempo_dias": "60-90", "evitar": "Recolectar verdes o sobremaduros", "notas": "Mayor producción si temp <28 °C", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 90
    }
  }, {
    "id": "cebolla_larga",
    "nombre": "Cebolla larga",
    "nombreCientifico": "Allium fistulosum",
    "descripcion": "La cebolla larga (Allium fistulosum) es una herbácea perenne que se cosecha tierna, sin formar bulbo seco; se corta cuando el tallo engrosa ~1–2 cm.",
    "tags": [
      "maceta_mediana",
      "medio",
      "frio",
      "templado",
      "calido",
      "Andina"
    ],
    "dificultad": "Media",
    "clima": { "clase": ["frio", "templado", "calido"] },
    "region": {
      "principal": ["Andina"],
      "nota": "Óptima en Andina; en Caribe/Pacífica usar camas elevadas, buen drenaje y riego cuidadoso; en Orinoquía/Amazonia, microclimas frescos o invernadero ligero."
    },
    "compatibilidades": ["fresa", "acelga", "tomate_cherry"],
    "incompatibilidades": ["lechuga", "frijol", "perejil"],
    "posicion": { "lat": 5.519, "lon": -72.883 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2FcebollaLarga.jpg?alt=media&token=20e88acc-d4cc-4719-8343-e550c60548d2",
        "atribucion": {
          "text": "Image by Dragana_Gordic on Freepik",
          "link": "https://www.freepik.com/free-photo/neat-row-spring-onions-bundled-with-red-elastic-ready-sale-market-spring-onion-ripe-spring-green-onion-green-onion-leaves_1190059.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Mg_S_casero",
      "sustrato_lowcost",
      "solarizacion_casera",
      "rotaciones_allium"
    ],
    "tipo_planta": "Herbácea perenne",
    "tecnica": {
      "temperatura_ideal": "15-24 °C",
      "riego": "Riegos ligeros y frecuentes al inicio (cada 1–2 días en maceta o huerto). En campo, cada 3–5 días según suelo y clima. Evitar encharcamientos.",
      "luz_solar": "Pleno sol; tolera semisombra ligera.",
      "ph_suelo": "6.0-7.0",
      "humedad_ideal": "60-70 %",
      "altitud_ideal": "1200-2800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado",
        "notas": "Suelos mullidos y fértiles; evitar compactación y encharques."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 10,
        "entre_plantas_cm_max": 15,
        "entre_surcos_cm": 30,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado"],
        "refuerzos": ["fertilizacion_30_dds", "aporte_NyK_90_dds"],
        "restricciones": "[evitar_exceso_n, evitar_compactacion, rotar_allium]",
        "criticos": ["N", "K", "Ca"]
      },
      "post_cosecha": {
        "temperatura_ideal": "0-2 °C",
        "vida_util_dias_frio": "7-10",
        "vida_util_dias_ambiente": "2-3",
        "notas": "Cortar en la mañana; mantener fresca y limpia."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 5,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersion"], "notas": "Riegos diarios ligeros en semillero." },
        "fertilizacion": { "momento_dias": 0, "notas": "Mezcla inicial con compost." },
        "labores": ["Siembra en almácigo a 0.5 cm", "Mantener humedad constante"],
        "notas": "Emergen plumillas verdes.",
        "indicadores_cambio_fase": "Emergencia uniforme en semillero.",
        "objetivo_nutricional": "Plántulas con buena raíz fibrosa.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      {
        "etapa": "Plántula en almácigo",
        "orden": 2,
        "duracion_dias_min": 30,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": 2, "metodo": ["aspersion"], "notas": "Cada 2 días en huerto casero; en campo hasta cada 5 días." },
        "fertilizacion": { "momento_dias": 0, "notas": "Materia orgánica y fórmula completa." },
        "labores": ["Deshierbe cuidadoso", "Despunte opcional"],
        "notas": "Listas para trasplante a 3–4 mm de grosor.",
        "indicadores_cambio_fase": "Hojas erectas y raíces desarrolladas.",
        "objetivo_nutricional": "Plántulas vigorosas para trasplante.",
        "alertas_plagas": ["mosca_de_la_cebolla"]
      },
      {
        "etapa": "Trasplante y establecimiento",
        "orden": 3,
        "duracion_dias_min": 10,
        "duracion_dias_max": 15,
        "duracion_dias_tipico": 12,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Riego diario los primeros días; luego cada 2–3 días." },
        "fertilizacion": { "momento_dias": 30, "notas": "Fertilización a los 30 DDS (aporque bajo)." },
        "labores": ["Aporque bajo", "Eliminar hojas secas"],
        "notas": "Reanuda crecimiento con hojas nuevas.",
        "indicadores_cambio_fase": "Rebrote visible.",
        "objetivo_nutricional": "Recuperar raíces e iniciar engrosamiento.",
        "alertas_plagas": ["trips"]
      },
      {
        "etapa": "Crecimiento y engrosamiento",
        "orden": 4,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": { "frecuencia_dias": 3, "metodo": ["surcos", "goteo"], "notas": "En campo cada 3–5 días; en maceta cada 1–2 días." },
        "fertilizacion": { "momento_dias": 90, "notas": "Segunda fertilización (~90 DDS; aporque alto)." },
        "labores": ["Aporque alto", "Deshierbe frecuente"],
        "notas": "Pseudotallos >1 cm; hojas 30–40 cm.",
        "indicadores_cambio_fase": "Tallos engrosados.",
        "objetivo_nutricional": "Equilibrio N–K para buen engrosamiento.",
        "alertas_plagas": ["trips", "peronospora", "pudricion_basal"]
      },
      {
        "etapa": "Cosecha",
        "orden": 5,
        "duracion_dias_min": 45,
        "duracion_dias_max": 75,
        "duracion_dias_tipico": 60,
        "riego": { "frecuencia_dias": null, "metodo": [], "notas": "Suspender riego 3–5 días antes del corte." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza." },
        "labores": ["Arranque o corte", "Limpieza y empaque"],
        "notas": "Posible rebrote a los ~60 días.",
        "indicadores_cambio_fase": "Hojas firmes y tallos engrosados.",
        "objetivo_nutricional": "Calidad y sabor.",
        "alertas_plagas": []
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Cortes sucesivos en contenedor pequeño.",
        "materiales": ["maceta o botella PET 3–5 L", "60% fibra coco + 40% compost", "acolchado fino"],
        "herramientas": ["regadera", "tijeras"],
        "notas_clave": "Regar suave y frecuente; permite rebrote.",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": { "temperatura_C": "15-24 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "45-65",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla 60% coco + 40% compost; cubrir con acolchado fino.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato aireado", "tiempo_dias": "0", "evitar": "Sin drenaje", "notas": "Ubicar con 10–12 h de luz", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar 4–6 semillas/bulbitos a 1 cm; cubrir ligero.", "materiales_paso": ["semillas/bulbitos"], "indicadores": "Emergencia 7–10 días", "tiempo_dias": "7-10", "evitar": "Profundidad excesiva", "notas": "Aclarar si nacen densas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riegos diarios o cada 2 días; controlar malezas; fertilización ligera si palidez.", "materiales_paso": ["regadera"], "indicadores": "Plantas vigorosas", "tiempo_dias": "continuo", "evitar": "Sequía → hojas duras", "notas": "Riego suave al pie", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar a 3–5 cm de la base; permite 3–4 rebrotes.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote activo", "tiempo_dias": "45-65", "evitar": "Corte muy bajo", "notas": "Cortes sucesivos", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Camas sueltas con cortes por manojos.",
        "materiales": ["cama suelta", "compost", "acolchado", "semillas/bulbitos"],
        "herramientas": ["azadín", "rastrillo", "regadera", "tijeras"],
        "notas_clave": "Rotar cultivo; suelo mullido y drenado.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "15-24 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "55-75",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, incorporar compost, cubrir con paja.", "materiales_paso": ["azadín", "compost"], "indicadores": "Suelo mullido", "tiempo_dias": "0", "evitar": "Compactación", "notas": "Rotar cultivo", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar a 1 cm de profundidad; 10–15 cm entre plantas; 30 cm entre surcos.", "materiales_paso": ["semillas/bulbitos"], "indicadores": "Hileras uniformes", "tiempo_dias": "7-12", "evitar": "Siembra profunda", "notas": "Aclarar si es necesario", "alerta_plagas": null },
          { "orden": 3, "titulo": "Mantenimiento", "descripcion": "Riegos cada 3–5 días; acolchado conserva humedad; deshierbe frecuente.", "materiales_paso": ["regadera"], "indicadores": "Plantas vigorosas", "tiempo_dias": "continuo", "evitar": "Sequía o exceso agua", "notas": "En calor extremo, riegos más frecuentes", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar a 3–5 cm de la base en manojos.", "materiales_paso": ["tijeras"], "indicadores": "Hojas tiernas y verdes", "tiempo_dias": "55-75", "evitar": "Corte muy bajo", "notas": "Recolectar temprano", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas tiernas y uniformes; rebrote continuo.",
        "materiales": ["canal NFT o cama flotante", "vasos malla", "esponjas", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH"],
        "notas_clave": "Riego continuo; agua 18–22 °C; buena aireación.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-22 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "30-40",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Armar NFT/flotante con vasos malla y esponjas; revisar aireación.", "materiales_paso": ["canal NFT", "aireador"], "indicadores": "Oxigenación constante", "tiempo_dias": "0", "evitar": "Agua sin oxígeno", "notas": "Mantener agua 18–22 °C", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra directa", "descripcion": "Colocar 4–6 semillas o un bulbito por vaso; germinan en 5–7 días.", "materiales_paso": ["semillas", "esponjas"], "indicadores": "Plántulas firmes", "tiempo_dias": "5-7", "evitar": "Mover plántulas", "notas": "Siembra definitiva", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo nutritivo", "descripcion": "Mantener pH 5.8–6.2; renovar solución cada 2–3 semanas.", "materiales_paso": ["solución nutritiva"], "indicadores": "Plantas verdes brillantes", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "EC moderada", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas a 2–3 cm de la base; permiten rebrote.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote activo", "tiempo_dias": "30-40", "evitar": "Corte muy bajo", "notas": "Produce varios cortes", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 60
    }
  }, {
    "id": "aji_dulce",
    "nombre": "Ají dulce",
    "nombreCientifico": "Capsicum chinense",
    "descripcion": "El ají dulce (Capsicum chinense) es una variedad de chile/pimiento de sabor suave, sin picor intenso. Es muy apreciado en la cocina caribeña y costeña, donde se usa en sofritos y condimentos por su aroma característico.",
    "tags": [
      "maceta_mediana",
      "medio",
      "calido",
      "templado",
      "Caribe",
      "Orinoquia"
    ],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Caribe", "Orinoquia"],
      "nota": "Óptimo en Caribe y Orinoquía. En Andina baja/piedemonte es viable con buena radiación y temperaturas >17 °C. En Pacífica húmeda requiere drenaje excelente y manejo sanitario."
    },
    "compatibilidades": [
      "lechuga",
      "albahaca",
      "cebolla_larga",
      "oregano",
      "tomate_cherry",
      "pimenton"
    ],
    "incompatibilidades": ["frijol"],
    "posicion": { "lat": 9.305, "lon": -75.398 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Faji%20dulce.png?alt=media&token=a97ef2d6-277f-46c0-9b04-daa2137cf11b",
        "atribucion": {
          "text": "Foto AGROSAVIA Tropical — autor Daniel Mulford",
          "link": "https://www.agrosavia.co/productos-y-servicios/oferta-tecnol%C3%B3gica/l%C3%ADnea-agr%C3%ADcola/hortalizas-y-plantas-arom%C3%A1ticas/material-reproductivo/765-agrosavia-tropical-variedad-de-aj%C3%AD-dulce-tipo-topito"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Ca_B_floracion_casero",
      "Fe_disponible_casero",
      "acolchado_antihongos_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Herbácea anual (perenne en climas sin heladas)",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "Moderado y frecuente; mantener humedad sin encharcar. En floración y fructificación aumentar la frecuencia.",
      "luz_solar": "Pleno sol; mínimo 6 h de luz directa.",
      "ph_suelo": "5.8-7.0",
      "humedad_ideal": "60-70 %",
      "altitud_ideal": "0-1500 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso a franco-limoso",
        "materia_organica": "media-alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos encharcados. Requiere cama fértil con buen abonado de base."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 40,
        "entre_plantas_cm_max": 50,
        "entre_surcos_cm": 60,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol bien curado", "fosfórico (moderado)"],
        "refuerzos": ["compost en floración", "aporte K y Ca en fructificación"],
        "restricciones": "[evitar_exceso_nitrogeno, evitar_encharcamiento]",
        "criticos": ["N", "K", "Ca", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "7-10 °C",
        "vida_util_dias_frio": "14-20",
        "vida_util_dias_ambiente": "5-7",
        "notas": "Recolectar con tijeras dejando pedúnculo. No lavar hasta usar."
      }
    },
    "cicloVida": [
      { "etapa": "Germinación", "orden": 1, "duracion_dias_min": 10, "duracion_dias_max": 21, "duracion_dias_tipico": 15,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión ligera"], "notas": "Mantener sustrato húmedo." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere fertilización inicial." },
        "labores": ["Siembra en almácigo a 0.5–1 cm de profundidad."],
        "notas": "Brotación irregular.",
        "indicadores_cambio_fase": "Plántulas con cotiledones.",
        "objetivo_nutricional": "Plántulas sanas y homogéneas.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      { "etapa": "Plántula en almácigo", "orden": 2, "duracion_dias_min": 30, "duracion_dias_max": 45, "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": 2, "metodo": ["aspersión ligera"], "notas": "Mantener humedad uniforme." },
        "fertilizacion": { "momento_dias": 20, "notas": "Aplicar té de humus si hay palidez." },
        "labores": ["Deshierbe", "Aclareo"],
        "notas": "Trasplantar con 5–6 hojas verdaderas.",
        "indicadores_cambio_fase": "Plántula de 15–20 cm.",
        "objetivo_nutricional": "Plántulas robustas.",
        "alertas_plagas": ["mosca_blanca", "trips"]
      },
      { "etapa": "Trasplante y establecimiento", "orden": 3, "duracion_dias_min": 7, "duracion_dias_max": 15, "duracion_dias_tipico": 10,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Riego abundante al trasplante." },
        "fertilizacion": { "momento_dias": 0, "notas": "Compost al hoyo." },
        "labores": ["Tutor inicial", "Control malezas"],
        "notas": "Planta se adapta y comienza a brotar.",
        "indicadores_cambio_fase": "Rebrote de hojas.",
        "objetivo_nutricional": "Establecer planta sana.",
        "alertas_plagas": []
      },
      { "etapa": "Crecimiento vegetativo", "orden": 4, "duracion_dias_min": 30, "duracion_dias_max": 45, "duracion_dias_tipico": 40,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo"], "notas": "Riego parejo." },
        "fertilizacion": { "momento_dias": 30, "notas": "Aplicar compost o té de humus." },
        "labores": ["Entutorar", "Acolchado", "Deshierbe"],
        "notas": "Plantas vigorosas.",
        "indicadores_cambio_fase": "Botones florales visibles.",
        "objetivo_nutricional": "Acumular biomasa.",
        "alertas_plagas": ["pulgones", "trips"]
      },
      { "etapa": "Floración y fructificación", "orden": 5, "duracion_dias_min": 40, "duracion_dias_max": 60, "duracion_dias_tipico": 50,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo"], "notas": "Mayor demanda." },
        "fertilizacion": { "momento_dias": 45, "notas": "K y Ca para firmeza." },
        "labores": ["Tutorar ramas cargadas", "Control sanitario"],
        "notas": "Cosecha escalonada.",
        "indicadores_cambio_fase": "Frutos con color definido.",
        "objetivo_nutricional": "Frutos firmes y sabrosos.",
        "alertas_plagas": ["mosca_blanca", "botrytis"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Plantas compactas con tutor y riego frecuente; cosecha escalonada.",
        "materiales": ["maceta 10–15 L", "mezcla 60% coco + 40% compost", "tutor"],
        "herramientas": ["regadera", "tijeras"],
        "notas_clave": "Requiere tutor; riegos frecuentes; abonar cada 3–4 semanas.",
        "contenedor_volumen_min_L": 10,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "6-8 h" },
        "tiempo_estimado_cosecha_dias": "85-120",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta 10–15 L con mezcla suelta; instalar tutor.", "materiales_paso": ["maceta", "sustrato", "tutor"], "indicadores": "Maceta aireada y estable", "tiempo_dias": "0", "evitar": "Maceta pequeña → estrés", "notas": "Colocar en pleno sol", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plantín de 15–20 cm dejando cuello al ras.", "materiales_paso": ["plantín"], "indicadores": "Planta erguida", "tiempo_dias": "0-1", "evitar": "Enterrar tallo", "notas": "Plántula vigorosa", "alerta_plagas": null },
          { "orden": 3, "titulo": "Tutorado", "descripcion": "Atar tallo al tutor con hilo suave.", "materiales_paso": ["tutor", "hilo"], "indicadores": "Tallo sostenido", "tiempo_dias": "0-10", "evitar": "No tutorar → tallo quiebra", "notas": "Revisar amarres", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cuidados básicos", "descripcion": "Riego parejo cada 1–2 días; retirar primeras flores si planta es pequeña; abonar cada 3–4 semanas.", "materiales_paso": ["regadera", "compost líquido"], "indicadores": "Hojas verdes y ramas firmes", "tiempo_dias": "continuo", "evitar": "Exceso de agua", "notas": "Acolchar base", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar frutos rojos/naranja con tijeras cada pocos días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos firmes y color uniforme", "tiempo_dias": "85-120", "evitar": "Arrancar frutos", "notas": "Cosecha escalonada", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Plantación en camas fértiles con tutor y acolchado; producción prolongada.",
        "materiales": ["cama fértil", "compost", "acolchado", "tutores"],
        "herramientas": ["azadón", "tijeras", "regadera"],
        "notas_clave": "Espaciar bien; tutorar; acolchar; cosecha escalonada.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "6-8 h" },
        "tiempo_estimado_cosecha_dias": "90-130",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, enriquecer con compost y acolchar con paja.", "materiales_paso": ["azadón", "compost"], "indicadores": "Suelo mullido", "tiempo_dias": "0", "evitar": "Suelo compactado", "notas": "Pleno sol", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar a 40–50 cm entre plantas y 60–70 cm entre surcos.", "materiales_paso": ["plantines", "regadera"], "indicadores": "Plantas firmes", "tiempo_dias": "0-1", "evitar": "Plantar muy junto", "notas": "Enterrar hasta cuello", "alerta_plagas": null },
          { "orden": 3, "titulo": "Tutorado y cuidados", "descripcion": "Instalar tutores; riego cada 2 días; acolchar base; abonar al inicio de floración.", "materiales_paso": ["tutores", "hilo", "regadera"], "indicadores": "Ramas erguidas", "tiempo_dias": "continuo", "evitar": "Falta de tutor → ramas caídas", "notas": "Mantener humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar frutos maduros con tijeras; recolección escalonada.", "materiales_paso": ["tijeras"], "indicadores": "Frutos brillantes y firmes", "tiempo_dias": "90-130", "evitar": "Arrancar frutos", "notas": "Cosechar seguido estimula más", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Producción en NFT o flotante; frutos limpios y firmes.",
        "materiales": ["sistema NFT/flotante", "vasos malla", "lana de roca/perlita", "solución nutritiva"],
        "herramientas": ["bomba", "medidor pH/EC", "aireador"],
        "notas_clave": "pH 5.8–6.2; EC 1.5–2.0; agua 20–24 °C; tutorado y polinización asistida.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-28 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "80-110",
        "pasos": [
          { "orden": 1, "titulo": "Montar sistema", "descripcion": "Instalar NFT/flotante con circulación y aireación constante.", "materiales_paso": ["NFT/flotante", "bomba", "aireador"], "indicadores": "Flujo estable y oxigenación", "tiempo_dias": "0", "evitar": "Agua estancada", "notas": "Desinfectar antes de uso", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plantines en lana de roca o perlita dentro de vasos malla.", "materiales_paso": ["plantines", "lana de roca"], "indicadores": "Raíces blancas y fuertes", "tiempo_dias": "0-1", "evitar": "Raíces maltratadas", "notas": "Plántulas con 5–6 hojas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo solución", "descripcion": "Mantener pH 5.8–6.2 y EC 1.5–2.0; reponer nutrientes semanalmente.", "materiales_paso": ["solución nutritiva", "medidor pH/EC"], "indicadores": "Parámetros estables", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "Revisar temperatura de agua", "alerta_plagas": null },
          { "orden": 4, "titulo": "Tutorado y polinización", "descripcion": "Entutorar tallos y realizar polinización asistida en interior.", "materiales_paso": ["tutores", "cepillo suave"], "indicadores": "Flores cuajadas", "tiempo_dias": "30-60", "evitar": "Falta de polinización → aborto floral", "notas": "Ventilador ayuda en interior", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar frutos maduros a los 80–110 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos firmes y coloreados", "tiempo_dias": "80-110", "evitar": "Arrancar frutos", "notas": "Cosecha escalonada prolongada", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 100
    }
  }, {
    "id": "pepino_cohombro",
    "nombre": "Pepino cohombro",
    "nombreCientifico": "Cucumis sativus",
    "descripcion": "El pepino cohombro (Cucumis sativus) es una cucurbitácea anual de fruto alargado y verde, consumido fresco, en encurtidos o jugos.",
    "tags": [
      "maceta_grande",
      "medio",
      "calido",
      "templado",
      "Caribe"
    ],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Caribe"],
      "nota": "Óptimo en Caribe. Andina baja/valle interandino: viable con buen calor y riego estable. Pacífica húmeda: camas elevadas y drenaje. Orinoquía: viable con riego y sombra ligera en calor; Amazonia: solo en microclimas o invernadero."
    },
    "compatibilidades": ["lechuga", "cilantro", "rabano", "maiz", "frijol"],
    "incompatibilidades": ["hierbabuena"],
    "posicion": { "lat": 8.748, "lon": -75.881 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2FpepinoCohombro.jpg?alt=media&token=c8bde17c-e590-47b1-98ba-35d194655735",
        "atribucion": {
          "text": "Image by Freepik",
          "link": "https://www.freepik.com/free-photo/stacked-harvested-cucumber_3365788.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "tutorado_casero"
    ],
    "tipo_planta": "Herbácea anual rastrera o trepadora",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "Frecuente, sin mojar el follaje; mantener humedad constante, evitar encharques.",
      "luz_solar": "Pleno sol, 8–12 h de luz.",
      "ph_suelo": "6.0-7.0",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "0-1500 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Prefiere suelos fértiles, profundos y aireados."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 40,
        "entre_plantas_cm_max": 50,
        "entre_surcos_cm": 120,
        "patron": "hilera con tutor"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol bien curado"],
        "refuerzos": ["aporte K en floración y fructificación", "fertilización balanceada en crecimiento"],
        "restricciones": "[evitar_exceso_nitrogeno, evitar_encharcamiento]",
        "criticos": ["N", "K", "Ca", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "10-15",
        "vida_util_dias_ambiente": "3-5",
        "notas": "No lavar antes de almacenar; evitar golpes."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 5,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener humedad constante hasta emergencia." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere fertilización inicial." },
        "labores": ["Siembra a 1–2 cm de profundidad en semillero o maceta."],
        "notas": "Semillas germinan rápido en clima cálido.",
        "indicadores_cambio_fase": "Emergencia de plántulas con 2 cotiledones.",
        "objetivo_nutricional": "Lograr plántulas vigorosas y sanas.",
        "alertas_plagas": ["damping_off"]
      },
      {
        "etapa": "Crecimiento vegetativo y floración",
        "orden": 2,
        "duracion_dias_min": 25,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Evitar mojar follaje; riego frecuente y moderado." },
        "fertilizacion": { "momento_dias": 20, "notas": "Aplicar compost o fertilizante balanceado." },
        "labores": ["Tutorado de ramas", "Deshierbe regular"],
        "notas": "Plantas desarrollan guías largas y hojas grandes.",
        "indicadores_cambio_fase": "Aparición de flores amarillas.",
        "objetivo_nutricional": "Formar biomasa y preparar floración.",
        "alertas_plagas": ["pulgones", "trips", "mildiu_polvoriento"]
      },
      {
        "etapa": "Fructificación y cosecha",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo"], "notas": "Mayor demanda durante fructificación." },
        "fertilizacion": { "momento_dias": 30, "notas": "Refuerzo con potasio." },
        "labores": ["Recolección continua de frutos cada 2–3 días."],
        "notas": "Cosechar frutos tiernos, de color verde brillante.",
        "indicadores_cambio_fase": "Frutos alcanzan 15–20 cm.",
        "objetivo_nutricional": "Mantener producción abundante y frutos de calidad.",
        "alertas_plagas": ["mosca_blanca", "araña_roja"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_grande",
        "nombre": "maceta grande",
        "ambito": "maceta",
        "descripcion_corta": "Cultivo en contenedor amplio con tutor; cosecha de frutos frescos.",
        "materiales": ["maceta 20–30 L", "sustrato fértil (60% coco + 40% compost)", "tutor"],
        "herramientas": ["regadera", "tijeras"],
        "notas_clave": "Necesita espacio y tutorado vertical.",
        "contenedor_volumen_min_L": 20,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "8-12 h" },
        "tiempo_estimado_cosecha_dias": "50-70",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta de 20–30 L con mezcla fértil y tutorado.", "materiales_paso": ["maceta", "sustrato", "tutor"], "indicadores": "Maceta firme y bien drenada", "tiempo_dias": "0", "evitar": "Contenedor pequeño", "notas": "Colocar en pleno sol", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Sembrar 2–3 semillas a 1–2 cm o trasplantar plantín.", "materiales_paso": ["semillas/plantín"], "indicadores": "Plántula erguida", "tiempo_dias": "7-10", "evitar": "Sembrar profundo", "notas": "Aclareo dejando la más vigorosa", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riegos frecuentes, tutorado y control de malezas.", "materiales_paso": ["regadera", "tutor"], "indicadores": "Planta vigorosa", "tiempo_dias": "continuo", "evitar": "Encharcar", "notas": "Mantener acolchado", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar frutos cada 2–3 días a los 50–70 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos tiernos y verdes", "tiempo_dias": "50-70", "evitar": "Frutos sobremaduros", "notas": "Recolección continua estimula más producción", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin_enrejado",
        "nombre": "jardin (enrejado)",
        "ambito": "jardin",
        "descripcion_corta": "Plantado en hileras con espaldera; alta sanidad y rendimiento.",
        "materiales": ["cama fértil con compost", "malla espaldera", "semillas/plantines"],
        "herramientas": ["azadón", "regadera", "estacas"],
        "notas_clave": "Variedades partenocárpicas facilitan cuaje.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-32 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "55-75",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, incorporar compost y colocar malla de tutorado.", "materiales_paso": ["azadón", "compost", "malla"], "indicadores": "Suelo mullido y malla firme", "tiempo_dias": "0", "evitar": "Suelo compactado", "notas": "Cama soleada", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar semillas o trasplantar plántulas a 40–50 cm.", "materiales_paso": ["semillas/plantines"], "indicadores": "Plantas vigorosas", "tiempo_dias": "7-10", "evitar": "Exceso densidad", "notas": "Cubrir ligeramente", "alerta_plagas": null },
          { "orden": 3, "titulo": "Tutorado y cuidados", "descripcion": "Guiar guías por la malla; riego cada 2 días evitando mojar hojas.", "materiales_paso": ["regadera"], "indicadores": "Ramas guiadas y verdes", "tiempo_dias": "continuo", "evitar": "Mojar follaje", "notas": "Acolchado conserva humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar frutos verdes cada 2–3 días entre 55–75 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos uniformes", "tiempo_dias": "55-75", "evitar": "Frutos sobremaduros", "notas": "Estimula más floración", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(nft/dwc/goteo)",
        "nombre": "hidroponia (NFT/DWC/goteo)",
        "ambito": "hidroponia",
        "descripcion_corta": "Crecimiento rápido y frutos uniformes en hidroponía.",
        "materiales": ["NFT ancho o baldes con coco/perlita", "vasos malla", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH/EC"],
        "notas_clave": "pH 5.8–6.2; tutorado vertical; aumentar K en fructificación.",
        "contenedor_volumen_min_L": 12,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "12-14 h" },
        "tiempo_estimado_cosecha_dias": "35-55",
        "pasos": [
          { "orden": 1, "titulo": "Montar sistema", "descripcion": "Instalar NFT, DWC o goteo con flujo continuo y aireación.", "materiales_paso": ["NFT/DWC", "bomba", "aireador"], "indicadores": "Agua oxigenada y estable", "tiempo_dias": "0", "evitar": "Estancamientos", "notas": "Desinfectar antes de uso", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plántulas en vasos malla con sustrato inerte.", "materiales_paso": ["plantines", "coco/perlita"], "indicadores": "Plántulas firmes", "tiempo_dias": "0-1", "evitar": "Raíces maltratadas", "notas": "Plántulas con 2–3 hojas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo nutritivo", "descripcion": "Mantener pH 5.8–6.2; EC adecuada; reforzar K en floración.", "materiales_paso": ["medidor pH/EC", "solución nutritiva"], "indicadores": "Parámetros estables", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "Asegurar flujo constante", "alerta_plagas": null },
          { "orden": 4, "titulo": "Tutorado", "descripcion": "Guiar ramas verticalmente; colocar soporte para frutos pesados.", "materiales_paso": ["tutores"], "indicadores": "Plantas erguidas", "tiempo_dias": "continuo", "evitar": "Ramas caídas", "notas": "Podar rebrotes excesivos", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Recolectar frutos verdes a los 35–55 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos uniformes", "tiempo_dias": "35-55", "evitar": "Frutos sobremaduros", "notas": "Cosecha escalonada", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 60
    }
  }, {
    "id": "albahaca",
    "nombre": "Albahaca",
    "nombreCientifico": "Ocimum basilicum",
    "descripcion": "La albahaca (Ocimum basilicum) es una hierba aromática anual, cultivada por sus hojas verdes intensamente aromáticas, muy usadas en la cocina mediterránea y tropical.",
    "tags": [
      "maceta_pequena",
      "facil",
      "templado",
      "calido",
      "Andina",
      "Caribe",
      "Pacifica",
      "Orinoquia"
    ],
    "dificultad": "Fácil",
    "clima": { "clase": ["templado", "calido"] },
    "region": {
      "principal": ["Andina", "Caribe", "Pacifica", "Orinoquia"],
      "nota": "Óptimo en climas templado–cálidos. En Andina alta >2200 m conviene usar invernadero/microtúnel. En calor extremo (>30 °C), dar sombra ligera y riego más frecuente."
    },
    "compatibilidades": ["lechuga", "tomate_cherry", "pimenton"],
    "incompatibilidades": ["cilantro"],
    "posicion": { "lat": 3.4516, "lon": -76.532 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Falbahaca%20(2).jpg?alt=media&token=6cc15b3f-a9d5-459b-a7ed-cf4ecfda7d53",
        "atribucion": {
          "text": "Imagen de Alicja en Pixabay",
          "link": "https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2759319"
        }
      }
    ],
    "articulosRelacionados": [
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "poda_despunte_casero"
    ],
    "tipo_planta": "Hierba aromática anual",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "Frecuente y ligero, cada 1–2 días en maceta; en campo cada 2–3 días. Evitar mojar hojas bajo sol fuerte.",
      "luz_solar": "Pleno sol (6–10 h); semisombra ligera en calor intenso.",
      "ph_suelo": "5.5-7.0",
      "humedad_ideal": "60-70 %",
      "altitud_ideal": "0-2200 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "media_alta",
        "retencion_agua": "moderado",
        "notas": "Evitar suelos compactos; en maceta, añadir perlita/arena."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 45,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "humus"],
        "refuerzos": ["te_compost_mensual", "post_corte_refuerzo"],
        "restricciones": "[evitar_encharcamiento, despunte_florecimiento_temprano]",
        "criticos": ["N", "K"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10-12 °C",
        "vida_util_dias_frio": "5-7",
        "vida_util_dias_ambiente": "1-2",
        "notas": "No refrigerar bajo 8 °C (necrosis). Guardar fresca en agua o bolsas perforadas."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 5,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Pulverizar 1–2 veces al día; mantener cálido (20–25 °C)." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere fertilización inicial; sustrato con compost basta." },
        "labores": ["Siembra superficial, cubrir con capa fina.", "Plástico translúcido opcional."],
        "notas": "Emergencia de plántulas con cotiledones verdes.",
        "indicadores_cambio_fase": "Cotiledones desplegados.",
        "objetivo_nutricional": "Plántulas viables; nutrición de semilla.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 10,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": { "frecuencia_dias": 2, "metodo": ["riego al pie"], "notas": "Regar cuando la superficie se vea seca." },
        "fertilizacion": { "momento_dias": null, "notas": "Si el sustrato está abonado, no fertilizar." },
        "labores": ["Trasplante a 4 hojas verdaderas.", "Aclarar y aclimatar."],
        "notas": "Plántulas listas para trasplante y crecimiento acelerado.",
        "indicadores_cambio_fase": "Plántula con varias hojas y raíces llenando almácigo.",
        "objetivo_nutricional": "Formar plántulas vigorosas.",
        "alertas_plagas": ["babosas_caracoles", "hongos_exceso_riego"]
      },
      {
        "etapa": "Crecimiento vegetativo y cosecha de hojas",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 120,
        "duracion_dias_tipico": 60,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "al pie"], "notas": "Riego moderado y constante; evitar mojar hojas al sol." },
        "fertilizacion": { "momento_dias": 30, "notas": "Abonado ligero cada 6–8 semanas; compost tras cada corte." },
        "labores": ["Poda y cosecha regular", "Eliminar flores", "Deshierbe"],
        "notas": "Follaje abundante de 20–40 cm.",
        "indicadores_cambio_fase": "Planta frondosa lista para cosecha.",
        "objetivo_nutricional": "Hojas tiernas y aromáticas.",
        "alertas_plagas": ["pulgones", "mosca_blanca", "mildiu", "orugas"]
      },
      {
        "etapa": "Floración y semillas",
        "orden": 4,
        "duracion_dias_min": 20,
        "duracion_dias_max": 45,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": 3, "metodo": ["riego al pie"], "notas": "Riego regular; tolera ligeros periodos secos." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza al final del ciclo." },
        "labores": ["Dejar flores para semillas", "Cortar espigas secas"],
        "notas": "Planta 50–60 cm con espigas florales.",
        "indicadores_cambio_fase": "Semillas maduras en espigas.",
        "objetivo_nutricional": "Producir semillas viables.",
        "alertas_plagas": ["pulgones_en_inflorescencias", "hongos_suelo"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Arbusto aromático en contenedor pequeño; cortes frecuentes.",
        "materiales": ["maceta/pet 4–7 L", "60% coco + 40% compost", "acolchado fino", "semillas o esquejes"],
        "herramientas": ["tijeras", "punzón", "regadera"],
        "notas_clave": "Pinzar puntas para ramificar; evitar frío <15 °C.",
        "contenedor_volumen_min_L": 4,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "8-12 h" },
        "tiempo_estimado_cosecha_dias": "25-40",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla 60% coco + 40% compost; buen drenaje; acolchar ligero.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato mullido y aireado", "tiempo_dias": "0", "evitar": "Sustrato compacto", "notas": "Colocar en sitio soleado", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra o esquejes", "descripcion": "Sembrar semillas superficiales (0.5 cm) o colocar esquejes enraizados.", "materiales_paso": ["semillas/esquejes"], "indicadores": "Germinación en 5–10 días", "tiempo_dias": "5-10", "evitar": "Enterrar demasiado", "notas": "Mantener sustrato húmedo", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados y pinzado", "descripcion": "Riego cada 1–2 días; pinzar puntas al tener 15 cm para ramificar.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Planta frondosa y verde", "tiempo_dias": "15-30", "evitar": "Sequía → floración temprana", "notas": "Acolchar para retener humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas tiernas o ramas enteras a partir de 25–40 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y aromáticas", "tiempo_dias": "25-40", "evitar": "Corte muy bajo", "notas": "Dejar 2/3 de la planta", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Surcos cálidos y bien drenados; producción continua.",
        "materiales": ["cama con compost", "acolchado paja/hojarasca", "semillas/plantines"],
        "herramientas": ["azadín", "rastrillo", "regadera"],
        "notas_clave": "Pleno sol o semisombra cálida; cosecha por ramas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-30 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "30-45",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, enriquecer con compost y acolchar con paja/hojarasca.", "materiales_paso": ["azadín", "compost", "acolchado"], "indicadores": "Suelo mullido y cubierto", "tiempo_dias": "0", "evitar": "Suelo compactado", "notas": "Rotar para evitar plagas", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Sembrar semillas superficiales o trasplantar plántulas a 25–30 cm.", "materiales_paso": ["semillas/plantines"], "indicadores": "Plántulas firmes", "tiempo_dias": "5-10", "evitar": "Siembra profunda", "notas": "Cubrir apenas con tierra suelta", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 2–3 días; eliminar malezas; pinzar para evitar floración.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Plantas vigorosas", "tiempo_dias": "continuo", "evitar": "Sequía prolongada", "notas": "Flores reducen calidad de hojas", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar ramas jóvenes cada 30–45 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y aromáticas", "tiempo_dias": "30-45", "evitar": "Corte total", "notas": "Dejar parte de la planta", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(nft/dwc)",
        "nombre": "hidroponia (NFT/DWC)",
        "ambito": "hidroponia",
        "descripcion_corta": "Crecimiento rápido y hojas limpias en sistema hidropónico.",
        "materiales": ["canales NFT/DWC", "vasos malla", "sustrato inerte", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH"],
        "notas_clave": "pH 6.0–6.2; podas semanales; luz intensa.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "12-16 h" },
        "tiempo_estimado_cosecha_dias": "25-35",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Montar NFT o DWC con vasos malla y sustrato inerte; iniciar circulación.", "materiales_paso": ["canales", "bomba", "aireador"], "indicadores": "Flujo continuo y oxigenación", "tiempo_dias": "0", "evitar": "Estancamiento", "notas": "Agua 20–24 °C", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Colocar semillas germinadas o plántulas en vasos malla.", "materiales_paso": ["semillas/plantines"], "indicadores": "Plántulas firmes", "tiempo_dias": "5-7", "evitar": "Raíces maltratadas", "notas": "Mantener humedad inicial", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo solución nutritiva", "descripcion": "Mantener pH 6.0–6.2; renovar solución cada 2–3 semanas.", "materiales_paso": ["medidor pH", "solución nutritiva"], "indicadores": "Plantas verdes y aromáticas", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "Controlar EC 1.2–1.6", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas y brotes tiernos desde los 25–35 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y fragantes", "tiempo_dias": "25-35", "evitar": "Corte total", "notas": "Cosechar por tandas", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 30
    }
  }, {
    "id": "espinaca",
    "nombre": "Espinaca",
    "nombreCientifico": "Spinacia oleracea",
    "descripcion": "La espinaca (Spinacia oleracea) es una hortaliza de hoja verde oscuro, consumida fresca o cocida; rica en hierro, vitaminas y fibra, con sabor ligeramente amargo.",
    "tags": [
      "maceta_pequena",
      "maceta_mediana",
      "frio",
      "templado",
      "Andina"
    ],
    "dificultad": "Media",
    "clima": { "clase": ["frio", "templado"] },
    "region": {
      "principal": ["Andina"],
      "nota": "Óptima en Andina. Caribe/Pacífica: viable con sombra 30–40% y riego constante; Orinoquía/Amazonia: sólo en microclimas frescos o invernadero."
    },
    "compatibilidades": ["lechuga", "cilantro", "fresa", "rabano", "acelga"],
    "incompatibilidades": ["pimenton"],
    "posicion": { "lat": 4.809, "lon": -74.101 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fespinaca.jpg?alt=media&token=523d4e22-0895-4401-bc2f-349bd2213c45",
        "atribucion": {
          "text": "Image by Freepik",
          "link": "https://www.freepik.com/free-photo/spinach-leaves_3552947.htm"
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
      "temperatura_ideal": "14-22 °C",
      "riego": "Ligero y frecuente; cada 1–2 días en maceta, cada 2–3 días en campo. Evitar sequía (espigado rápido).",
      "luz_solar": "Prefiere clima fresco y pleno sol; en calor dar semisombra parcial.",
      "ph_suelo": "6.0-7.5",
      "humedad_ideal": "60-70 %",
      "altitud_ideal": "800-2600 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos pesados; acolchar para mantener frescura."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 10,
        "entre_plantas_cm_max": 15,
        "entre_surcos_cm": 30,
        "patron": "surcos"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "humus"],
        "refuerzos": ["fertilizacion_ligera_30dds", "te_compost_si_palidez"],
        "restricciones": "[evitar_exceso_calor, evitar_sequias]",
        "criticos": ["N", "K", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "0-4 °C",
        "vida_util_dias_frio": "7-14",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Cosechar en la mañana; no lavar hasta consumir."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 7,
        "duracion_dias_max": 14,
        "duracion_dias_tipico": 10,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión"], "notas": "Mantener tierra húmeda; sombra ligera hasta emergencia." },
        "fertilizacion": { "momento_dias": null, "notas": "Suelo con compost previo; no fertilizar." },
        "labores": ["Siembra directa a 1 cm; sombra ligera hasta emergencia."],
        "notas": "Plántulas emergen con cotiledones verdes.",
        "indicadores_cambio_fase": "Primera hoja verdadera.",
        "objetivo_nutricional": "Germinación uniforme y rápida.",
        "alertas_plagas": ["fusarium", "pythium", "hormigas", "aves"]
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 7,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": { "frecuencia_dias": 2, "metodo": ["al pie"], "notas": "Riego ligero manteniendo superficie húmeda." },
        "fertilizacion": { "momento_dias": null, "notas": "Aporte ligero de N si hay palidez." },
        "labores": ["Raleo a 2 hojas verdaderas.", "Deshierbe inicial.", "Proteger del sol fuerte al mediodía."],
        "notas": "Roseta inicial de hojas.",
        "indicadores_cambio_fase": "Plántulas con varias hojas (~5 cm).",
        "objetivo_nutricional": "Raíz y base foliar robusta.",
        "alertas_plagas": ["babosas_caracoles", "damping_off"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 20,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": "1-3", "metodo": ["goteo", "al pie"], "notas": "Mantener humedad constante; sequía induce espigado." },
        "fertilizacion": { "momento_dias": 30, "notas": "Fertilización ligera con compost o té de humus." },
        "labores": ["Cosecha escalonada de hojas externas.", "Mulch orgánico.", "Eliminar plantas espigadas."],
        "notas": "Roseta densa y hojas listas a los 40–50 días.",
        "indicadores_cambio_fase": "Hojas bien desarrolladas.",
        "objetivo_nutricional": "Producir hojas tiernas continuamente.",
        "alertas_plagas": ["pulgones", "minador_de_hoja", "mildiu", "trips"]
      },
      {
        "etapa": "Floración y espigamiento",
        "orden": 4,
        "duracion_dias_min": 7,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": { "frecuencia_dias": 3, "metodo": ["al pie"], "notas": "Reducir ligeramente riego." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza en esta fase." },
        "labores": ["Dejar florecer para semillas.", "Retirar residuos al final."],
        "notas": "Tallo floral emerge, hojas se reducen.",
        "indicadores_cambio_fase": "Semillas maduras.",
        "objetivo_nutricional": "Completar ciclo y producir semilla.",
        "alertas_plagas": ["pulgones", "aves"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Siembra densa en contenedor pequeño para hojas tiernas.",
        "materiales": ["maceta/pet 3–5 L", "60% coco + 40% compost", "acolchado", "semillas"],
        "herramientas": ["tijeras", "regadera"],
        "notas_clave": "Prefiere clima fresco; dar semisombra si calor >26 °C.",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": { "temperatura_C": "14-22 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "30-45",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta 3–5 L con mezcla 60% coco + 40% compost y acolchado.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato aireado", "tiempo_dias": "0", "evitar": "Sin drenaje → pudrición", "notas": "Mantener maceta húmeda", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar semillas a 1–1.5 cm de profundidad, densas.", "materiales_paso": ["semillas"], "indicadores": "Emergencia 5–10 días", "tiempo_dias": "0-10", "evitar": "Sembrar profundo", "notas": "Requiere humedad constante", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riegos frecuentes; semisombra en calor; acolchar.", "materiales_paso": ["regadera"], "indicadores": "Hojas verdes y tiernas", "tiempo_dias": "10-30", "evitar": "Calor >26 °C", "notas": "Acolchado conserva frescura", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas con tijera cuando midan 8–10 cm.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote continuo", "tiempo_dias": "30-45", "evitar": "Corte total", "notas": "Cosecha escalonada", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Camas frescas y sueltas para cortes sucesivos.",
        "materiales": ["cama con compost", "acolchado", "semillas"],
        "herramientas": ["azadín", "rastrillo", "regadera"],
        "notas_clave": "Evitar calor >26 °C para no espigar; escalonar siembras.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "10-20 °C", "horas_luz": "6-8 h" },
        "tiempo_estimado_cosecha_dias": "35-55",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, añadir compost y acolchado.", "materiales_paso": ["azadín", "compost"], "indicadores": "Suelo fértil y fresco", "tiempo_dias": "0", "evitar": "Compactación", "notas": "Ambiente fresco ideal", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar semillas en surcos de 1–1.5 cm, a 10–15 cm entre líneas.", "materiales_paso": ["semillas"], "indicadores": "Emergencia uniforme", "tiempo_dias": "0-10", "evitar": "Profundidad excesiva", "notas": "Escalonar siembras prolonga cosecha", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego constante sin exceso; deshierbe; proteger de calor >26 °C.", "materiales_paso": ["regadera"], "indicadores": "Hojas tiernas y verdes", "tiempo_dias": "10-30", "evitar": "Sequía → espigado", "notas": "Rotar cultivo para evitar plagas", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas o plantas enteras según necesidad.", "materiales_paso": ["tijeras"], "indicadores": "Hojas sanas", "tiempo_dias": "35-55", "evitar": "Corte total sin planificación", "notas": "Cosechar antes de espigado", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas uniformes y tiernas en hidroponía.",
        "materiales": ["plancha flotante o NFT", "vasos malla", "esponjas", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH"],
        "notas_clave": "pH ~6.0; sombra ligera si >24 °C; buena aireación.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "16-22 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "28-40",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Armar plancha flotante/NFT con esponjas y solución nutritiva.", "materiales_paso": ["plancha", "esponjas", "bomba"], "indicadores": "Sistema aireado y estable", "tiempo_dias": "0", "evitar": "Falta de oxigenación", "notas": "Mantener <24 °C", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Colocar semillas germinadas o plántulas en vasos malla.", "materiales_paso": ["semillas/plántulas"], "indicadores": "Plántulas firmes y verdes", "tiempo_dias": "0-7", "evitar": "Plántula floja", "notas": "También viable siembra directa", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo de solución", "descripcion": "Mantener pH ~6.0 y aireación; dar semisombra ligera si calor.", "materiales_paso": ["medidor pH", "solución nutritiva"], "indicadores": "Hojas verdes uniformes", "tiempo_dias": "7-28", "evitar": "pH fuera de rango", "notas": "Aumentar luz mejora vigor", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas a los 28–40 días, dejando centro para rebrote.", "materiales_paso": ["tijeras"], "indicadores": "Hojas tiernas y limpias", "tiempo_dias": "28-40", "evitar": "Corte total", "notas": "Cosecha por tandas", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 40
    }
  },  {
    "id": "hierbabuena",
    "nombre": "Hierbabuena",
    "nombreCientifico": "Mentha spicata",
    "descripcion": "La hierbabuena (Mentha spicata) es una hierba aromática perenne, de porte semirastrero, muy apreciada por su aroma mentolado. Se usa en infusiones, bebidas como mojitos, y en la cocina tradicional.",
    "tags": [
      "maceta_pequena",
      "maceta_mediana",
      "facil",
      "templado",
      "calido",
      "frio",
      "Andina",
      "Caribe",
      "Pacifica"
    ],
    "dificultad": "Fácil",
    "clima": { "clase": ["templado", "calido", "frio"] },
    "region": {
      "principal": ["Andina", "Caribe", "Pacifica"],
      "nota": "Óptimo en Andina. En Caribe y Pacífica: viable con semisombra y riego constante. En Orinoquía/Amazonia: mejor en microclimas frescos con riego frecuente."
    },
    "compatibilidades": ["lechuga", "cilantro", "fresa", "oregano"],
    "incompatibilidades": ["pepino_cohombro"],
    "posicion": { "lat": 5.0187, "lon": -74.3385 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fhierbabuena%20(2).jpg?alt=media&token=aa34d030-8b9c-4903-8dcb-8b239f84f15f",
        "atribucion": {
          "text": "Imagen de Miguel Pujante en Pixabay",
          "link": "https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5211744"
        }
      }
    ],
    "articulosRelacionados": [
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "poda_despunte_casero"
    ],
    "tipo_planta": "Hierba aromática perenne",
    "tecnica": {
      "temperatura_ideal": "16-26 °C",
      "riego": "Frecuente, cada 1–2 días en maceta; en jardín cada 2–3 días. Evitar encharcamientos. Mejor riego matutino.",
      "luz_solar": "Pleno sol en clima fresco; semisombra en cálido.",
      "ph_suelo": "6.0-7.5",
      "humedad_ideal": "70-80 %",
      "altitud_ideal": "1000-2000 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "Suelos compactos favorecen pudrición; contener raíces con macetas o barreras."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 30,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado"],
        "refuerzos": ["te_compost_cada_4_6_sem", "te_estiercol_cada_4_6_sem"],
        "restricciones": "[evitar_exceso_n, preferir_fuentes_n_nitrato, evitar_kcl_en_suelos_salinos]",
        "criticos": ["N", "K", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10-12 °C",
        "vida_util_dias_frio": "5-7",
        "vida_util_dias_ambiente": "1-2",
        "notas": "Cosechar fresca según necesidad; excedentes en vaso con agua o bolsa perforada en nevera."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación/enraizamiento",
        "orden": 1,
        "duracion_dias_min": 7,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión", "al pie"], "notas": "Mantener humedad constante; evitar exceso de agua en esquejes." },
        "fertilizacion": { "momento_dias": null, "notas": "Sustrato rico en compost; no requiere fertilización inicial." },
        "labores": ["Cortar esquejes de 10–15 cm; enterrar 2–3 nudos bajo tierra; cubrir con bolsa perforada."],
        "notas": "Brotes y raíces nuevas a los 10–14 días.",
        "indicadores_cambio_fase": "Esquejes con raíces activas.",
        "objetivo_nutricional": "Desarrollar raíces fuertes.",
        "alertas_plagas": ["damping_off", "pudricion_esqueje", "moho", "hormigas"]
      },
      {
        "etapa": "Establecimiento",
        "orden": 2,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["al pie"], "notas": "Riego regular sin encharcar." },
        "fertilizacion": { "momento_dias": 30, "notas": "Primer abonado ligero a los 30 días." },
        "labores": ["Deshierbe", "Pinzado", "Control de expansión."],
        "notas": "Planta bien enraizada, 20–30 cm; lista para primera cosecha.",
        "indicadores_cambio_fase": "Mata vigorosa y aromática.",
        "objetivo_nutricional": "Desarrollar masa foliar densa.",
        "alertas_plagas": ["pulgones", "araña_roja", "roya"]
      },
      {
        "etapa": "Crecimiento vegetativo y producción",
        "orden": 3,
        "duracion_dias_min": 60,
        "duracion_dias_max": 180,
        "duracion_dias_tipico": 120,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "al pie"], "notas": "Alta demanda hídrica; mantener suelo húmedo." },
        "fertilizacion": { "momento_dias": 60, "notas": "Abonado de mantenimiento cada 6–8 semanas." },
        "labores": ["Cortes a 5 cm para rebrote", "Podas de control", "Dividir matas cada 4–6 meses."],
        "notas": "Producción continua de tallos y hojas.",
        "indicadores_cambio_fase": "Planta con follaje abundante.",
        "objetivo_nutricional": "Mantener hojas frescas y aromáticas.",
        "alertas_plagas": ["pulgones", "ácaros", "trips", "roya"]
      },
      {
        "etapa": "Floración y renovación",
        "orden": 4,
        "duracion_dias_min": 15,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 21,
        "riego": { "frecuencia_dias": 3, "metodo": ["al pie"], "notas": "Menos agua, evitar sequía total." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza en esta fase." },
        "labores": ["Permitir algunas flores", "Poda drástica post-floración", "Retirar restos."],
        "notas": "La planta pierde vigor; se recomienda renovar.",
        "indicadores_cambio_fase": "Tallos con inflorescencias.",
        "objetivo_nutricional": "Completar ciclo y regenerar la mata.",
        "alertas_plagas": ["pulgones_en_puntas", "hongos_por_residuos"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Ideal para contener raíces invasivas; cosecha continua.",
        "materiales": ["maceta/pet 7–10 L", "60% coco + 40% compost", "acolchado", "esquejes"],
        "herramientas": ["tijeras", "regadera"],
        "notas_clave": "Maceta ayuda a contener rizomas; podar frecuentemente.",
        "contenedor_volumen_min_L": 7,
        "requisitos_ambiente": { "temperatura_C": "16-26 °C", "horas_luz": "6-10 h" },
        "tiempo_estimado_cosecha_dias": "60-80",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Colocar mezcla 60% coco + 40% compost; buen drenaje.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato aireado", "tiempo_dias": "0", "evitar": "Exceso de agua en fondo", "notas": "Ubicar en sitio luminoso", "alerta_plagas": null },
          { "orden": 2, "titulo": "Plantación de esquejes", "descripcion": "Sembrar esquejes de 10–15 cm, enterrando 2–3 nudos.", "materiales_paso": ["esquejes"], "indicadores": "Esquejes firmes y verdes", "tiempo_dias": "7-14", "evitar": "Enterrar completamente tallo", "notas": "Mantener humedad", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 1–2 días; pinzar tallos; controlar expansión.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Planta frondosa", "tiempo_dias": "continuo", "evitar": "Sequía prolongada", "notas": "Podar para estimular rebrote", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar tallos a 5–10 cm cada 2–3 semanas.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote activo", "tiempo_dias": "60-80", "evitar": "Arrancar plantas", "notas": "Dejar tallos bajos para rebrote", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Borduras húmedas con control de expansión; cosecha cada 2–3 semanas.",
        "materiales": ["cama con compost", "barreras anti-rizomas opcionales", "esquejes"],
        "herramientas": ["azadín", "regadera", "tijeras"],
        "notas_clave": "Planta invasiva; delimitar bordes.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "16-28 °C", "horas_luz": "6-8 h" },
        "tiempo_estimado_cosecha_dias": "70-90",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, enriquecer con compost; instalar barreras.", "materiales_paso": ["azadín", "compost"], "indicadores": "Suelo mullido", "tiempo_dias": "0", "evitar": "Compactación", "notas": "Mantener semisombra ligera", "alerta_plagas": null },
          { "orden": 2, "titulo": "Plantación", "descripcion": "Colocar esquejes a 25–30 cm; enterrar 2–3 nudos.", "materiales_paso": ["esquejes"], "indicadores": "Plantas firmes", "tiempo_dias": "7-14", "evitar": "Enterrar tallo completo", "notas": "Riego inmediato", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 2–3 días; pinzar tallos; controlar invasión.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Mata vigorosa", "tiempo_dias": "continuo", "evitar": "Exceso de humedad", "notas": "Podar bordes regularmente", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar tallos a 5–10 cm cada 2–3 semanas.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y aromáticas", "tiempo_dias": "70-90", "evitar": "Corte muy bajo", "notas": "Mantener parte basal", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(nft/dwc/torre)",
        "nombre": "hidroponia (NFT/DWC/torre)",
        "ambito": "hidroponia",
        "descripcion_corta": "Crecimiento veloz con esquejes en sistemas recirculados.",
        "materiales": ["NFT/DWC o torre", "canastillas", "sustrato inerte", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH", "tijeras"],
        "notas_clave": "pH ~6.0; recirculación y oxigenación constantes; podas frecuentes.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-26 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "45-70",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Instalar NFT/DWC o torre con solución nutritiva y aireación.", "materiales_paso": ["sistema NFT/DWC", "bomba", "aireador"], "indicadores": "Flujo constante", "tiempo_dias": "0", "evitar": "Agua sin oxigenación", "notas": "Mantener agua 18–22 °C", "alerta_plagas": null },
          { "orden": 2, "titulo": "Plantación", "descripcion": "Colocar esquejes en canastillas con sustrato inerte.", "materiales_paso": ["esquejes", "canastillas"], "indicadores": "Esquejes enraizando", "tiempo_dias": "7-14", "evitar": "Esquejes débiles", "notas": "Usar esquejes sanos", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo solución", "descripcion": "Mantener pH ~6.0; renovar cada 2–3 semanas; vigilar EC.", "materiales_paso": ["solución nutritiva", "medidor pH"], "indicadores": "Parámetros estables", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "EC 1.2–1.6", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar tallos a 5–10 cm cada 45–70 días.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote vigoroso", "tiempo_dias": "45-70", "evitar": "Corte muy bajo", "notas": "Cosechar escalonado", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 70
    }
  }, {
    "id": "jengibre",
    "nombre": "Jengibre",
    "nombreCientifico": "Zingiber officinale",
    "descripcion": "El jengibre (Zingiber officinale) es una planta herbácea perenne tropical cultivada por su rizoma aromático y picante, muy usado en cocina y medicina tradicional.",
    "tags": [
      "maceta_mediana",
      "medio",
      "calido",
      "templado",
      "Amazonia",
      "Caribe",
      "Pacifica",
      "Orinoquia"
    ],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Amazonia", "Caribe", "Pacifica", "Orinoquia"],
      "nota": "Óptimo en regiones tropicales. Andina baja/piedemonte: viable hasta ~1500 m con sombra parcial y riego estable; Andina alta: no recomendado a campo abierto (usar invernadero)."
    },
    "compatibilidades": ["fresa", "lechuga", "curcuma"],
    "incompatibilidades": [],
    "posicion": { "lat": 4.142, "lon": -73.626 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fjengibre.jpg?alt=media&token=684d01b3-f207-483a-88b5-a795fabd6671",
        "atribucion": {
          "text": "Image by pvproductions on Freepik",
          "link": "https://www.freepik.com/free-photo/ginger-root-supermarket-closeup-food-background_38369907.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Fe_disponible_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Herbácea perenne (cultivada como anual por sus rizomas)",
    "tecnica": {
      "temperatura_ideal": "22-30 °C",
      "riego": "Mantener suelo húmedo sin encharcar. Prefiere semisombra y alta humedad.",
      "luz_solar": "Luz filtrada/semisombra brillante. Sol directo solo con humedad suficiente.",
      "ph_suelo": "5.5-7.5",
      "humedad_ideal": "70-80 %",
      "altitud_ideal": "0-1500 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "Suelo profundo, mullido y fértil; evitar arenas muy pobres o arcillas pesadas."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 65,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado", "gallinaza_compostada", "fosforo_fondo"],
        "refuerzos": ["refuerzo_n_60d", "alto_k_mes_4_5", "sulfato_potasio", "ceniza_madera_dosis_baja", "micros_mg_zn_b", "quelato_fe_si_clorosis"],
        "restricciones": "[evitar_encharcamiento, preferir_sulfato_potasio, limitar_n_tardio_post_mes4, aplicar_p_al_fondo, evitar_salinizacion]",
        "criticos": ["N", "K", "P", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10-12 °C",
        "vida_util_dias_frio": "60-90",
        "vida_util_dias_ambiente": "14-28",
        "notas": "No refrigerar <10 °C (daño por frío). Conservar en sitio fresco y ventilado; se puede secar o encurtir."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación y brotación",
        "orden": 1,
        "duracion_dias_min": 14,
        "duracion_dias_max": 45,
        "duracion_dias_tipico": 28,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["al pie"], "notas": "Riego ligero; exceso pudre el rizoma." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere al inicio; usar rizomas sanos con brotes." },
        "labores": ["Cortar rizomas de 3–5 cm con una yema, curar 1–2 días y sembrar a 5 cm de profundidad en suelo cálido (>20 °C)."],
        "notas": "Brote emerge en 2–6 semanas.",
        "indicadores_cambio_fase": "Brote verde visible.",
        "objetivo_nutricional": "Activar yemas y formar primeras raíces.",
        "alertas_plagas": ["pudricion_rizoma", "insectos_suelo", "hormigas"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 2,
        "duracion_dias_min": 120,
        "duracion_dias_max": 210,
        "duracion_dias_tipico": 180,
        "riego": { "frecuencia_dias": "1-3", "metodo": ["goteo", "surcos"], "notas": "Mucha agua sin encharcar; dejar orear capa superficial." },
        "fertilizacion": { "momento_dias": [60, 150], "notas": "N al 2º mes; desde mes 5 aumentar K; repetir cada 6–8 semanas." },
        "labores": ["Aporcar rizomas expuestos", "Deshierbe", "Tutorado si hay viento", "Mantener semisombra."],
        "notas": "Máxima frondosidad al mes 5–6; luego énfasis en rizomas.",
        "indicadores_cambio_fase": "Follaje abundante; engrosamiento de rizomas.",
        "objetivo_nutricional": "Acumular biomasa y engrosar rizomas.",
        "alertas_plagas": ["mancha_foliar", "pulgones", "trips", "nematodos", "cochinillas"]
      },
      {
        "etapa": "Maduración y cosecha",
        "orden": 3,
        "duracion_dias_min": 60,
        "duracion_dias_max": 120,
        "duracion_dias_tipico": 90,
        "riego": { "frecuencia_dias": "5-7", "metodo": ["al pie"], "notas": "Disminuir riego y suspender 10–14 días antes de cosecha." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar en esta fase final." },
        "labores": ["Desenterrar con cuidado", "Seleccionar rizomas sanos como semilla", "Orearlos 1–2 días antes de guardar."],
        "notas": "Hojas amarillean y tallos se secan parcialmente.",
        "indicadores_cambio_fase": "Planta seca, rizomas firmes y aromáticos.",
        "objetivo_nutricional": "Concentrar reservas y sabor en rizomas.",
        "alertas_plagas": ["podredumbres", "roedores", "insectos_suelo"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_profunda",
        "nombre": "maceta profunda",
        "ambito": "maceta",
        "descripcion_corta": "Cultivo de rizomas en contenedor grande y sombreado.",
        "materiales": ["maceta/pet 15–20 L", "60% coco + 30% compost + 10% arena", "rizomas sanos con ojos", "acolchado"],
        "herramientas": ["cuchillo limpio", "regadera"],
        "notas_clave": "Semisombra y humedad constante; evitar macetas pequeñas que deforman rizomas.",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "6-8 h luz filtrada" },
        "tiempo_estimado_cosecha_dias": "210-300",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta 15–20 L con mezcla 60% coco, 30% compost, 10% arena; cubrir con acolchado.", "materiales_paso": ["maceta", "coco", "compost", "arena"], "indicadores": "Sustrato suelto y aireado", "tiempo_dias": "0", "evitar": "Maceta pequeña → rizomas deformes", "notas": "Mantener semisombra", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra de rizomas", "descripcion": "Cortar rizomas con ojos, dejar secar 1 día, enterrar horizontal a 3–5 cm.", "materiales_paso": ["rizomas", "cuchillo"], "indicadores": "Brotes visibles en 3–6 semanas", "tiempo_dias": "0-30", "evitar": "Enterrar profundo → pudrición", "notas": "Usar rizomas frescos y brotados", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego frecuente sin encharcar; mantener semisombra; reponer acolchado.", "materiales_paso": ["regadera", "acolchado"], "indicadores": "Planta vigorosa con hojas verdes", "tiempo_dias": "30-210", "evitar": "Suelo seco o exceso agua", "notas": "Acolchado conserva humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Extraer rizomas a los 7–10 meses; cortar manos externas dejando planta madre.", "materiales_paso": ["tijeras", "cuchillo"], "indicadores": "Rizomas firmes y aromáticos", "tiempo_dias": "210-300", "evitar": "Corte total → sin rebrote", "notas": "Secar 3–5 días para mejor sabor", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin_sombreado",
        "nombre": "jardin sombreado",
        "ambito": "jardin",
        "descripcion_corta": "Camellón mullido y drenado para rizomas grandes.",
        "materiales": ["cama con compost y arena", "acolchado orgánico", "rizomas"],
        "herramientas": ["azadón", "rastrillo", "regadera"],
        "notas_clave": "Prefiere zonas húmedas con sombra parcial; siembra escalonada prolonga cosecha.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "6-8 h filtrada" },
        "tiempo_estimado_cosecha_dias": "150-300",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Armar camellón mullido con compost y arena; cubrir con acolchado.", "materiales_paso": ["compost", "arena", "acolchado"], "indicadores": "Suelo suelto y aireado", "tiempo_dias": "0", "evitar": "Suelo compacto", "notas": "Mantener humedad", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra de rizomas", "descripcion": "Colocar rizomas sanos a 3–5 cm de profundidad y 20 cm entre sí.", "materiales_paso": ["rizomas"], "indicadores": "Brotes en 3–6 semanas", "tiempo_dias": "0-30", "evitar": "Rizomas muy juntos → competencia", "notas": "Siembra escalonada prolonga cosecha", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego regular manteniendo humedad; semisombra natural; reponer acolchado.", "materiales_paso": ["regadera", "acolchado"], "indicadores": "Plantas verdes y vigorosas", "tiempo_dias": "30-150", "evitar": "Sequía o exceso de agua", "notas": "Controlar maleza en bordes", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Levantar rizomas a los 5–10 meses; cosechar por manos dejando parte madre.", "materiales_paso": ["azadón", "tijeras"], "indicadores": "Rizomas grandes y aromáticos", "tiempo_dias": "150-300", "evitar": "Cosecha prematura", "notas": "Conservar en sitio seco y ventilado", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 3,
      "dias_para_cosecha": 240
    }
  }, {
    "id": "calabacin",
    "nombre": "Calabacín",
    "nombreCientifico": "Cucurbita pepo",
    "descripcion": "El calabacín (Cucurbita pepo) es una cucurbitácea anual de rápido crecimiento y alta producción. Sus frutos tiernos se consumen en guisos, ensaladas o asados, apreciados por su textura suave y alto contenido de agua.",
    "tags": [
      "maceta_mediana",
      "facil",
      "calido",
      "templado",
      "Amazonia",
      "Caribe",
      "Orinoquia"
    ],
    "dificultad": "Fácil",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Caribe", "Orinoquia"],
      "nota": "Óptimo en Caribe y Orinoquía. Andina baja/valle interandino: viable con calor y riego estable. Pacífica húmeda: necesita camas elevadas y ventilación por riesgo de mildiu. Amazonia: en microclimas o invernadero ligero."
    },
    "compatibilidades": ["maiz", "frijol", "lechuga", "pepino_cohombro"],
    "incompatibilidades": ["papa"],
    "posicion": { "lat": 8.5, "lon": -74.2 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcalabacin.jpg?alt=media&token=a7db653e-58f6-402f-9c48-b30f1b9cfb11",
        "atribucion": {
          "text": "Image by Freepik",
          "link": "https://www.freepik.com/free-photo/top-view-zucchini-slices-arrangement_8795469.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "tutorado_casero"
    ],
    "tipo_planta": "Herbácea anual rastrera o trepadora",
    "tecnica": {
      "temperatura_ideal": "20-32 °C",
      "riego": "Constante, cada 2 días; evitar mojar follaje. Mayor demanda en fructificación.",
      "luz_solar": "Pleno sol, 8–12 h.",
      "ph_suelo": "6.0-7.5",
      "humedad_ideal": "65-80 %",
      "altitud_ideal": "0-1800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos arcillosos que favorecen hongos; requiere espacio amplio."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 80,
        "entre_plantas_cm_max": 100,
        "entre_surcos_cm": 120,
        "patron": "enrejado o guía con tutor"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol bien curado"],
        "refuerzos": ["abonado_equilibrado_30dds", "alto_p_prefloracion", "alto_k_fructificacion"],
        "restricciones": "[evitar_exceso_n, evitar_encharcamiento]",
        "criticos": ["N", "P", "K", "Ca"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "10-14",
        "vida_util_dias_ambiente": "3-5",
        "notas": "No lavar antes de almacenar; frutos grandes se fibrosan."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 4,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 6,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener humedad constante sin encharcar." },
        "fertilizacion": { "momento_dias": null, "notas": "Semilla con reservas; aplicar compost de base en siembra." },
        "labores": ["Siembra directa a 2–3 cm, 2–3 semillas por golpe; aclareo dejando la más vigorosa."],
        "notas": "Germina rápido en clima cálido.",
        "indicadores_cambio_fase": "Emergencia de cotiledones.",
        "objetivo_nutricional": "Activar raíz y primeras hojas.",
        "alertas_plagas": ["damping_off", "babosas_caracoles"]
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 10,
        "duracion_dias_max": 20,
        "duracion_dias_tipico": 15,
        "riego": { "frecuencia_dias": "1-2", "metodo": ["goteo", "aspersión ligera"], "notas": "Riego suave; proteger plántula de sol fuerte." },
        "fertilizacion": { "momento_dias": 15, "notas": "Fertilización ligera (compost o té de compost diluido)." },
        "labores": ["Trasplante (si aplica) a sitio definitivo.", "Aclareo de siembra múltiple.", "Proteger de malezas."],
        "notas": "Plántula con 3–4 hojas verdaderas (~15 cm).",
        "indicadores_cambio_fase": "Plántula vigorosa y enraizada.",
        "objetivo_nutricional": "Formar raíces fuertes y base foliar.",
        "alertas_plagas": ["pulgones", "damping_off"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 20,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["al pie"], "notas": "Mantener humedad uniforme; deshierbe regular." },
        "fertilizacion": { "momento_dias": 30, "notas": "Aporte rico en N + compost; algo de P para raíces." },
        "labores": ["Tutorado ligero", "Deshierbe frecuente", "Eliminar hojas viejas."],
        "notas": "Planta vigorosa con hojas grandes.",
        "indicadores_cambio_fase": "Aparición de botones florales.",
        "objetivo_nutricional": "Generar biomasa y preparar floración.",
        "alertas_plagas": ["oidio", "pulgones", "mosca_blanca"]
      },
      {
        "etapa": "Floración",
        "orden": 4,
        "duracion_dias_min": 5,
        "duracion_dias_max": 15,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "surcos"], "notas": "Evitar mojar flores; riego por la mañana." },
        "fertilizacion": { "momento_dias": 45, "notas": "Abono rico en fósforo + microelementos (Boro)." },
        "labores": ["Monitorear polinización natural o manual.", "Eliminar malezas."],
        "notas": "Flores masculinas primero, luego femeninas con fruto en base.",
        "indicadores_cambio_fase": "Apertura de flores femeninas.",
        "objetivo_nutricional": "Favorecer polinización y cuajado.",
        "alertas_plagas": ["trips", "abejas_bajas", "mildiu"]
      },
      {
        "etapa": "Fructificación",
        "orden": 5,
        "duracion_dias_min": 30,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 60,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "manual"], "notas": "Constante; mayor demanda mientras engordan frutos." },
        "fertilizacion": { "momento_dias": 60, "notas": "Fertilización rica en potasio (ceniza, compost de banano)." },
        "labores": ["Cosecha continua cada 2–3 días.", "Deshoje de hojas viejas."],
        "notas": "Frutos listos con 15–20 cm, piel tierna.",
        "indicadores_cambio_fase": "Frutos verdes brillantes y firmes.",
        "objetivo_nutricional": "Engordar y madurar frutos.",
        "alertas_plagas": ["podredumbre_apical", "gusano_barrenador", "mosca_fruta", "oidio", "mildiu"]
      },
      {
        "etapa": "Fin de ciclo",
        "orden": 6,
        "duracion_dias_min": 1,
        "duracion_dias_max": 14,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": null, "metodo": null, "notas": "Reducir y suspender riego antes de arrancar plantas." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar al final del ciclo." },
        "labores": ["Arrancar planta agotada o enferma.", "Aprovechar restos sanos para compost."],
        "notas": "Producción baja o deformidad en frutos = fin del ciclo.",
        "indicadores_cambio_fase": "Follaje amarillento y sin nuevas flores.",
        "objetivo_nutricional": "Cerrar ciclo y preparar suelo.",
        "alertas_plagas": ["virosis", "nematodos", "hongos_residuos"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta con tutor",
        "ambito": "maceta",
        "descripcion_corta": "Planta vigorosa en contenedor grande; cosecha continua.",
        "materiales": ["maceta 25–35 L", "60% coco + 30% compost + 10% drenante", "estaca/malla", "semillas/plantín"],
        "herramientas": ["estacas", "tijeras", "regadera"],
        "notas_clave": "Requiere espacio y tutor; corte de frutos jóvenes estimula producción.",
        "contenedor_volumen_min_L": 25,
        "requisitos_ambiente": { "temperatura_C": "20-32 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "45-60",
        "pasos":  [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Colocar sustrato aireado en maceta de 25–35 L; instalar tutor o malla.", "materiales_paso": ["maceta", "sustrato", "tutor"], "indicadores": "Maceta aireada y con buen drenaje", "tiempo_dias": "0", "evitar": "Contenedor pequeño → estrés", "notas": "Colocar en sol directo", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Sembrar 2–3 semillas a 2 cm de profundidad o trasplantar plántula vigorosa.", "materiales_paso": ["semillas/plantín"], "indicadores": "Emergencia en 4–8 días", "tiempo_dias": "4-8", "evitar": "Enterrar demasiado", "notas": "Dejar solo la más fuerte", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 2 días; guiar tallos al tutor; eliminar hojas viejas.", "materiales_paso": ["regadera", "tutor"], "indicadores": "Planta vigorosa con guías firmes", "tiempo_dias": "10-40", "evitar": "Falta de agua → frutos amargos", "notas": "Mantener acolchado", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar frutos de 15–20 cm cada 2–3 días desde los 45–60 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos verdes brillantes", "tiempo_dias": "45-60", "evitar": "Frutos sobremaduros", "notas": "Recolección continua estimula más producción", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin (enrejado)",
        "ambito": "jardin",
        "descripcion_corta": "Cama fértil con tutorado; polinización natural clave.",
        "materiales": ["cama con compost", "malla/tutor", "acolchado", "semillas/plantines"],
        "herramientas": ["azadón", "estacas", "regadera"],
        "notas_clave": "Requiere polinización de abejas; cosecha frecuente mantiene rendimiento.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-32 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "45-65",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, añadir compost y acolchado; colocar malla tutor.", "materiales_paso": ["compost", "malla"], "indicadores": "Suelo mullido y malla firme", "tiempo_dias": "0", "evitar": "Compactación", "notas": "Ubicar en pleno sol", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Sembrar a 80–100 cm o trasplantar plántulas vigorosas.", "materiales_paso": ["semillas/plantines"], "indicadores": "Plántulas firmes", "tiempo_dias": "4-8", "evitar": "Exceso de densidad", "notas": "Dejar solo las más fuertes", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 2 días; guiar ramas en la malla; fertilizar en floración.", "materiales_paso": ["regadera", "fertilizante"], "indicadores": "Plantas erguidas con flores", "tiempo_dias": "15-40", "evitar": "Falta de polinización → frutos deformes", "notas": "Acolchar para conservar humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar frutos tiernos de 15–20 cm cada 2–3 días desde los 45–65 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos verdes y brillantes", "tiempo_dias": "45-65", "evitar": "Dejar frutos grandes → detiene producción", "notas": "Cosecha frecuente prolonga ciclo", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(goteo/dwc/nft)",
        "nombre": "hidroponia (goteo/dwc/nft ancho)",
        "ambito": "hidroponia",
        "descripcion_corta": "Fructificación rápida y controlada en hidroponía.",
        "materiales": ["baldes con coco/perlita o DWC", "soporte/tutor", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH/EC"],
        "notas_clave": "pH 5.8–6.2; aumentar K en fructificación; tutorado obligatorio.",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "12-14 h" },
        "tiempo_estimado_cosecha_dias": "35-55",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Montar NFT ancho, DWC o baldes con goteo; instalar tutor.", "materiales_paso": ["sistema hidroponia", "tutor"], "indicadores": "Sistema estable y aireado", "tiempo_dias": "0", "evitar": "Agua estancada", "notas": "Desinfectar antes de uso", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plántulas en vasos con sustrato inerte (coco/perlita).", "materiales_paso": ["plantines", "coco/perlita"], "indicadores": "Plántulas erguidas y verdes", "tiempo_dias": "4-8", "evitar": "Raíces dañadas", "notas": "Usar plántulas de 2–3 hojas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Manejo solución nutritiva", "descripcion": "Mantener pH 5.8–6.2; EC 1.8–2.5; refuerzo en K durante fructificación.", "materiales_paso": ["solución nutritiva", "medidor pH/EC"], "indicadores": "Parámetros estables", "tiempo_dias": "continuo", "evitar": "pH fuera de rango", "notas": "Revisar semanalmente", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar frutos de 15–20 cm a los 35–55 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos uniformes y verdes", "tiempo_dias": "35-55", "evitar": "Frutos sobremaduros", "notas": "Recolección escalonada", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 55
    }
  }, {
    "id": "perejil",
    "nombre": "Perejil",
    "nombreCientifico": "Petroselinum crispum",
    "descripcion": "El perejil (Petroselinum crispum) es una hierba bienal cultivada como anual por sus hojas, muy usada como condimento fresco en la cocina.",
    "tags": ["maceta_pequena", "facil", "templado", "Andina"],
    "dificultad": "Fácil",
    "clima": { "clase": ["templado"] },
    "region": {
      "principal": ["Andina"],
      "nota": "Óptimo en Andina. Caribe/Pacífica: viable con sombra parcial y riego constante; Orinoquía/Amazonia: en microclimas frescos o invernadero."
    },
    "compatibilidades": ["tomate_cherry", "acelga"],
    "incompatibilidades": ["lechuga", "cebolla_larga"],
    "posicion": { "lat": 4.72, "lon": -73.969 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fperejil.jpg?alt=media&token=b7a98291-84cc-4f38-91f5-aeff06fdf741",
        "atribucion": {
          "text": "Imagen de Hans en Pixabay",
          "link": "https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5766"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Fe_disponible_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Hierba bienal (cultivada como anual)",
    "tecnica": {
      "temperatura_ideal": "15-25 °C",
      "riego": "Mantener humedad constante; cada 2–3 días en templado, diario ligero en calor.",
      "luz_solar": "Pleno sol en templado; semisombra en cálido.",
      "ph_suelo": "6.0-7.2",
      "humedad_ideal": "60-75 %",
      "altitud_ideal": "1200-2800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "Raíz pivotante; suelo fértil y profundo, evitar encharques."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 20,
        "entre_plantas_cm_max": 25,
        "entre_surcos_cm": 25,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado"],
        "refuerzos": ["te_compost_mensual", "emulsion_pescado_diluida", "purin_mensual", "post_corte_refuerzo"],
        "restricciones": "[evitar_exceso_n, evitar_suelo_encharcado]",
        "criticos": ["N", "K", "Ca", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "7-14",
        "vida_util_dias_ambiente": "2-3",
        "notas": "Conservar en bolsa perforada en refrigeración; no lavar hasta usar."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 10,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 18,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener húmedo constante; germinación lenta (2–4 semanas)." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar; semilla tiene reservas." },
        "labores": ["Remojar semillas 12–24 h para acelerar germinación.", "Sembrar superficial, cubrir apenas con tierra."],
        "notas": "Siembra lenta, requiere paciencia.",
        "indicadores_cambio_fase": "Emergen cotiledones verdes.",
        "objetivo_nutricional": "Activar brote y raíz inicial.",
        "alertas_plagas": ["hongos_semilla", "hormigas", "aves"]
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 21,
        "duracion_dias_max": 45,
        "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": "1-2", "metodo": ["al pie"], "notas": "Riego moderado; evitar exceso en superficie." },
        "fertilizacion": { "momento_dias": 35, "notas": "Aplicar compost al trasplante o aclareo." },
        "labores": ["Trasplante al sitio definitivo a los 30–35 días.", "Aclareo dejando 10 cm entre plantas.", "Proteger del sol fuerte tras trasplante."],
        "notas": "Plántulas con 4 hojas verdaderas (~15 cm).",
        "indicadores_cambio_fase": "Plantas enraizadas y vigorosas.",
        "objetivo_nutricional": "Formar raíz pivotante y base foliar.",
        "alertas_plagas": ["damping_off", "caracoles", "pulgones"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 60,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["goteo", "manual"], "notas": "Mantener suelo fresco; sequía → hojas amargas." },
        "fertilizacion": { "momento_dias": 60, "notas": "Té de compost o abono orgánico balanceado cada 3–4 semanas." },
        "labores": ["Deshierbe frecuente.", "Despunte ligero para más brotes."],
        "notas": "Planta de 20–30 cm, hojas listas para uso parcial.",
        "indicadores_cambio_fase": "Primeras hojas grandes utilizables.",
        "objetivo_nutricional": "Acumular follaje aromático.",
        "alertas_plagas": ["pulgones", "mosca_blanca", "minador", "mildiu"]
      },
      {
        "etapa": "Producción de hojas",
        "orden": 4,
        "duracion_dias_min": 90,
        "duracion_dias_max": 210,
        "duracion_dias_tipico": 150,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["manual"], "notas": "Riego constante, preferible en la mañana." },
        "fertilizacion": { "momento_dias": 120, "notas": "Aporte mensual de compost o té orgánico." },
        "labores": ["Cosecha escalonada de hojas externas.", "Dejar siempre centro para rebrote."],
        "notas": "Producción continua de 6–8 meses.",
        "indicadores_cambio_fase": "Tallos florales visibles → inicio floración.",
        "objetivo_nutricional": "Mantener nitrógeno moderado para rebrotes.",
        "alertas_plagas": ["ácaros", "oidio"]
      },
      {
        "etapa": "Floración y semillas",
        "orden": 5,
        "duracion_dias_min": 150,
        "duracion_dias_max": 300,
        "duracion_dias_tipico": 240,
        "riego": { "frecuencia_dias": "4-7", "metodo": ["manual ligero"], "notas": "Reducir riego para favorecer semillas." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar; planta dirige energía a semillas." },
        "labores": ["Permitir espigado y tutorar tallo floral.", "Recolectar semillas secas de umbelas."],
        "notas": "Hojas se tornan amargas; ciclo completo.",
        "indicadores_cambio_fase": "Umbelas secas con semillas marrón claro.",
        "objetivo_nutricional": "Acumular reservas en semillas.",
        "alertas_plagas": ["pulgones_flor", "oidio", "hormigas"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Manojos tiernos y aromáticos, cortes sucesivos.",
        "materiales": ["maceta 3–5 L", "60% coco + 40% compost", "acolchado", "semillas"],
        "herramientas": ["tijeras", "regadera"],
        "notas_clave": "Germinación lenta; remojar semillas 12–24 h.",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": { "temperatura_C": "16-26 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "60-90",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar maceta con mezcla 60% coco + 40% compost y buen drenaje.", "materiales_paso": ["maceta", "coco", "compost"], "indicadores": "Sustrato mullido y aireado", "tiempo_dias": "0", "evitar": "Macetas sin orificios", "notas": "Ubicar en lugar soleado", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Remojar semillas 12–24 h, sembrar superficial (0.5 cm).", "materiales_paso": ["semillas"], "indicadores": "Emergencia a los 15–25 días", "tiempo_dias": "15-25", "evitar": "Enterrar demasiado profundo", "notas": "Cubrir con capa ligera de sustrato", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 1–2 días; mantener humedad; aclareo dejando 1 planta cada 20 cm.", "materiales_paso": ["regadera"], "indicadores": "Plántulas verdes y firmes", "tiempo_dias": "25-60", "evitar": "Exceso de agua", "notas": "Rotar maceta 1 vez/semana", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas con tijeras desde los 60–90 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y aromáticas", "tiempo_dias": "60-90", "evitar": "Arrancar plantas completas", "notas": "Dejar centro para rebrote", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Borduras húmedas y frescas; producción prolongada.",
        "materiales": ["cama con compost", "acolchado", "semillas"],
        "herramientas": ["azadín", "rastrillo", "regadera"],
        "notas_clave": "Siembra densa y aclareo en clima templado.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "14-24 °C", "horas_luz": "6-8 h" },
        "tiempo_estimado_cosecha_dias": "70-100",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo, enriquecer con compost y cubrir con acolchado.", "materiales_paso": ["azadín", "compost", "acolchado"], "indicadores": "Suelo fértil y mullido", "tiempo_dias": "0", "evitar": "Suelo compacto", "notas": "Rotar ubicación cada año", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar semillas remojadas en surcos superficiales a 20–25 cm.", "materiales_paso": ["semillas"], "indicadores": "Emergencia a 15–30 días", "tiempo_dias": "15-30", "evitar": "Sembrar demasiado profundo", "notas": "Mantener suelo húmedo", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 2–3 días; deshierbe regular; aclareo dejando 20 cm entre plantas.", "materiales_paso": ["regadera"], "indicadores": "Plantas vigorosas", "tiempo_dias": "30-70", "evitar": "Sequía prolongada", "notas": "Acolchar para conservar humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas con tijera desde los 70–100 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y sanas", "tiempo_dias": "70-100", "evitar": "Cosecha total de plantas", "notas": "Cosechar escalonado prolonga ciclo", "alerta_plagas": null }
        ]
      },
      {
        "id": "hidroponia_(flotante/nft)",
        "nombre": "hidroponia (flotante/nft)",
        "ambito": "hidroponia",
        "descripcion_corta": "Producción continua de manojos uniformes.",
        "materiales": ["NFT o flotante", "esponjas o vasos malla", "solución nutritiva"],
        "herramientas": ["bomba", "aireador", "medidor pH"],
        "notas_clave": "pH 6.0–6.5; profundidad para raíz pivotante.",
        "contenedor_volumen_min_L": 1.5,
        "requisitos_ambiente": { "temperatura_C": "18-24 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "50-75",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Montar sistema NFT o flotante con solución nutritiva aireada.", "materiales_paso": ["sistema NFT/flotante", "bomba", "aireador"], "indicadores": "Oxigenación visible", "tiempo_dias": "0", "evitar": "Agua estancada", "notas": "Mantener EC 1.4–1.8", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Colocar semillas germinadas en esponjas o vasos malla.", "materiales_paso": ["semillas germinadas"], "indicadores": "Plántulas firmes y verdes", "tiempo_dias": "10-20", "evitar": "Plántulas débiles", "notas": "Mantener humedad hasta enraizar", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Mantener pH 6.0–6.5, solución aireada y nutritiva estable.", "materiales_paso": ["medidor pH", "solución nutritiva"], "indicadores": "Crecimiento uniforme", "tiempo_dias": "20-50", "evitar": "pH fuera de rango", "notas": "Renovar solución cada 2 semanas", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar hojas externas o manojos desde los 50–75 días.", "materiales_paso": ["tijeras"], "indicadores": "Hojas verdes y aromáticas", "tiempo_dias": "50-75", "evitar": "Corte total", "notas": "Cosechar escalonado", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 75
    }
  }, {
    "id": "rabano",
    "nombre": "Rábano",
    "nombreCientifico": "Raphanus sativus",
    "descripcion": "El rábano es una hortaliza de raíz comestible, de ciclo muy corto (3–5 semanas) y sabor picante. Va perfecto para siembras escalonadas en maceta, jardín o hidroponía.",
    "tags": [
      "maceta_pequena",
      "facil",
      "templado",
      "frio",
      "Andina"
    ],
    "dificultad": "Fácil",
    "clima": {
      "clase": [
        "templado",
        "frio"
      ]
    },
    "region": {
      "principal": [
        "Andina"
      ],
      "nota": "Óptimo en región Andina fresca. En Caribe y Pacífica conviene sombra parcial y riego frecuente; en Orinoquía/Amazonia, sólo en microclimas frescos o invernadero."
    },
    "compatibilidades": [
      "lechuga",
      "espinaca",
      "pepino_cohombro"
    ],
    "incompatibilidades": [
      "col",
      "nabo"
    ],
    "posicion": {
      "lat": 4.61,
      "lon": -74.08
    },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Frabano.jpg?alt=media&token=2a51720a-1e0a-4b84-b9f6-1c2ab8d69b89",
        "atribucion": {
          "text": "Imagen de Lebensmittelfotos en Pixabay",
          "link": "https://pixabay.com/photos/radish-bunch-red-vegetables-351031/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Hortaliza de raíz anual",
    "tecnica": {
      "temperatura_ideal": "15-22 °C",
      "riego": "Mantener humedad constante; cada 1–2 días según clima. Evitar encharcamientos para prevenir pudriciones.",
      "luz_solar": "Pleno sol en templado; semisombra ligera en cálido.",
      "ph_suelo": "5.8-7.0",
      "humedad_ideal": "60-75 %",
      "altitud_ideal": "1500-2800 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "media",
        "retencion_agua": "moderada",
        "notas": "Suelo mullido, sin piedras y no compacto para obtener raíces rectas y uniformes."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 5,
        "entre_plantas_cm_max": 7,
        "entre_surcos_cm": 15,
        "patron": "hilera"
      },
      "nutricion": {
        "enmiendas_fondo": [
          "compost_ligero",
          "humus_lombriz"
        ],
        "refuerzos": [
          "te_compost_si_palidez",
          "baja_dosis_k_3_sem"
        ],
        "restricciones": "[evitar_exceso_n, evitar_suelo_pesado]",
        "criticos": [
          "K",
          "Ca"
        ]
      },
      "post_cosecha": {
        "temperatura_ideal": "4-6 °C",
        "vida_util_dias_frio": "7-10",
        "vida_util_dias_ambiente": "2-3",
        "notas": "Consumir pronto; refrigerar en bolsa perforada. No dejar madurar en suelo para evitar textura leñosa."
      }
    },
    "cicloVida": [
      {
        "etapa": "Siembra y germinación",
        "orden": 1,
        "duracion_dias_min": 3,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 5,
        "riego": {
          "frecuencia_dias": 1,
          "metodo": [
            "aspersión fina"
          ],
          "notas": "Riego muy suave para no descubrir semillas; mantener humedad constante."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "No requiere fertilización; las semillas germinan rápido en sustrato abonado ligero."
        },
        "labores": [
          "Siembra directa a 1 cm de profundidad, separación ~5 cm; cubrir ligeramente.",
          "Escalonar siembras cada 2–3 semanas para cosecha continua."
        ],
        "notas": "Germina muy rápido en condiciones frescas.",
        "indicadores_cambio_fase": "Emergencia de plántulas con 2 cotiledones redondos.",
        "objetivo_nutricional": "Activar raíz primaria que será el tubérculo.",
        "alertas_plagas": [
          "damping_off",
          "aves",
          "hormigas"
        ]
      },
      {
        "etapa": "Plántula (hojas iniciales)",
        "orden": 2,
        "duracion_dias_min": 4,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": {
          "frecuencia_dias": "1-2",
          "metodo": [
            "manual_ligero"
          ],
          "notas": "Suelo húmedo sin encharcar; evitar sequía que frene el crecimiento."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "Suficiente con el abonado previo del suelo."
        },
        "labores": [
          "Aclareo a 5–7 cm cuando aparezca la primera hoja verdadera.",
          "Deshierbe manual cuidadoso para no extraer plántulas."
        ],
        "notas": "Evitar ahilamiento manteniendo buena luz.",
        "indicadores_cambio_fase": "Primera hoja verdadera visible y plántula vigorosa.",
        "objetivo_nutricional": "Formar roseta foliar básica.",
        "alertas_plagas": [
          "altica",
          "gusanos_trozadores",
          "babosas"
        ]
      },
      {
        "etapa": "Desarrollo vegetativo (hojas y raíz)",
        "orden": 3,
        "duracion_dias_min": 7,
        "duracion_dias_max": 20,
        "duracion_dias_tipico": 14,
        "riego": {
          "frecuencia_dias": 2,
          "metodo": [
            "al_surco",
            "manual"
          ],
          "notas": "Riego constante y moderado para crecimiento parejo; evitar encharcamientos."
        },
        "fertilizacion": {
          "momento_dias": 15,
          "notas": "Si hojas pálidas, aplicar té de compost suave; evitar exceso de N."
        },
        "labores": [
          "Aporque ligero si el “hombro” del rábano asoma para evitar verdeo.",
          "Deshierbe regular."
        ],
        "notas": "La raíz empieza a engrosar hacia la 3ª semana.",
        "indicadores_cambio_fase": "Parte superior del tubérculo visible en superficie.",
        "objetivo_nutricional": "Estimular engorde inicial del tubérculo.",
        "alertas_plagas": [
          "pulgones",
          "larvas_mosca_col",
          "mildiu"
        ]
      },
      {
        "etapa": "Engrosamiento del tubérculo",
        "orden": 4,
        "duracion_dias_min": 10,
        "duracion_dias_max": 20,
        "duracion_dias_tipico": 15,
        "riego": {
          "frecuencia_dias": "2-3",
          "metodo": [
            "manual"
          ],
          "notas": "Mantener humedad pero reducir hacia el final para evitar rajado."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "No fertilizar cerca de cosecha para evitar nitratos y alterar sabor."
        },
        "labores": [
          "Monitorear tamaño a diario y aflojar tierra compacta si se requiere."
        ],
        "notas": "Diámetro objetivo de 2–3 cm en rabanitos.",
        "indicadores_cambio_fase": "Tubérculo firme y con diámetro comercial.",
        "objetivo_nutricional": "Acumular carbohidratos con buen sabor y textura.",
        "alertas_plagas": [
          "rajado_por_exceso_agua",
          "gusanos_alambre",
          "roedores"
        ]
      },
      {
        "etapa": "Cosecha",
        "orden": 5,
        "duracion_dias_min": 25,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 30,
        "riego": {
          "frecuencia_dias": null,
          "metodo": null,
          "notas": "Humedecer el suelo unas horas antes facilita la extracción."
        },
        "fertilizacion": {
          "momento_dias": null,
          "notas": "No fertilizar en la recta final."
        },
        "labores": [
          "Extraer tirando del follaje cerca de la base; aflojar con pala de mano si el suelo está duro."
        ],
        "notas": "No dejar en tierra tras maduros: se vuelven leñosos y picantes.",
        "indicadores_cambio_fase": "Raíz firme, crujiente y del tamaño deseado.",
        "objetivo_nutricional": "Cosechar en punto óptimo y liberar el espacio para la siguiente ronda.",
        "alertas_plagas": [
          "espigado_si_se_retrasa",
          "hongos_postcosecha"
        ]
      }
    ],
    "metodos": [
      {
        "id": "maceta_profunda",
        "nombre": "maceta profunda",
        "ambito": "maceta",
        "descripcion_corta": "Raíces crujientes en ciclo ultra corto.",
        "materiales": [
          "maceta 5–7 L (≥22 cm profundidad)",
          "50% fibra de coco + 40% compost + 10% arena",
          "semillas"
        ],
        "herramientas": [
          "regadera",
          "punzón",
          "tijeras"
        ],
        "notas_clave": "Siembra directa y aclareo a 5–7 cm. Humedad constante.",
        "contenedor_volumen_min_L": 5,
        "requisitos_ambiente": {
          "temperatura_C": "16-24 °C",
          "horas_luz": "8-10 h"
        },
        "tiempo_estimado_cosecha_dias": "25-35",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar maceta",
            "descripcion": "Llenar la maceta con sustrato aireado (coco/compost/arena) y buen drenaje.",
            "materiales_paso": [
              "maceta",
              "coco",
              "compost",
              "arena"
            ],
            "indicadores": "Sustrato mullido y húmedo",
            "tiempo_dias": "0",
            "evitar": "Sustrato compacto → raíces deformes",
            "notas": "Ubicar a pleno sol",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra directa",
            "descripcion": "Sembrar a 1–2 cm de profundidad con separación ~5 cm; regar suave.",
            "materiales_paso": [
              "semillas"
            ],
            "indicadores": "Germinación en 3–7 días",
            "tiempo_dias": "0-7",
            "evitar": "Siembra demasiado profunda",
            "notas": "Cubrir apenas con sustrato",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Aclareo y cuidados",
            "descripcion": "Aclarar a 5–7 cm; riego cada 1–2 días; mantener acolchado fino.",
            "materiales_paso": [
              "tijeras",
              "regadera"
            ],
            "indicadores": "Plántulas bien espaciadas, crecimiento uniforme",
            "tiempo_dias": "7-20",
            "evitar": "No aclarar → raíces delgadas",
            "notas": "Evitar encharcamientos",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Extraer rábanos firmes a los 25–35 días.",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Bulbos uniformes y crujientes",
            "tiempo_dias": "25-35",
            "evitar": "Retrasar cosecha → raíces huecas",
            "notas": "Consumir frescos o refrigerar",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Hileras en cama suelta y fresca, cosecha rápida.",
        "materiales": [
          "cama con compost",
          "acolchado fino",
          "semillas"
        ],
        "herramientas": [
          "azadín",
          "rastrillo",
          "regadera"
        ],
        "notas_clave": "Suelo suelto sin piedras; riegos ligeros; siembras escalonadas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": {
          "temperatura_C": "14-22 °C",
          "horas_luz": "6-8 h"
        },
        "tiempo_estimado_cosecha_dias": "25-35",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar cama",
            "descripcion": "Aflojar suelo, mezclar compost y cubrir con acolchado fino.",
            "materiales_paso": [
              "compost",
              "acolchado"
            ],
            "indicadores": "Suelo mullido y fresco",
            "tiempo_dias": "0",
            "evitar": "Piedras/compactación → raíces torcidas",
            "notas": "Pleno sol, buen drenaje",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra directa",
            "descripcion": "Sembrar en surcos superficiales, cubrir ligero y regar suave.",
            "materiales_paso": [
              "semillas"
            ],
            "indicadores": "Emergencia uniforme en 3–7 días",
            "tiempo_dias": "0-7",
            "evitar": "Siembra muy densa",
            "notas": "Separación final 5–7 cm",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Aclareo y cuidados",
            "descripcion": "Aclarar a 5–7 cm; riego cada 2 días; deshierbe frecuente.",
            "materiales_paso": [
              "rastrillo",
              "regadera"
            ],
            "indicadores": "Bulbos parejos",
            "tiempo_dias": "7-25",
            "evitar": "Exceso de agua → pudrición",
            "notas": "No tolera calor >26 °C",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Extraer rábanos jóvenes entre 25–35 días.",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Raíces tiernas y jugosas",
            "tiempo_dias": "25-35",
            "evitar": "Esperar demasiado → textura leñosa",
            "notas": "Cosecha escalonada para continuidad",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "hidroponia_(sustrato/nft)",
        "nombre": "hidroponia (sustrato/nft poco profundo)",
        "ambito": "hidroponia",
        "descripcion_corta": "Bulbos muy uniformes en sustrato inerte húmedo; ciclo corto.",
        "materiales": [
          "canales bajos o cestas con coco/perlita",
          "solución nutritiva suave"
        ],
        "herramientas": [
          "bomba",
          "aireador",
          "medidor pH"
        ],
        "notas_clave": "pH ~6.0; evitar calor alto que induce espigado prematuro.",
        "contenedor_volumen_min_L": 2,
        "requisitos_ambiente": {
          "temperatura_C": "18-22 °C",
          "horas_luz": "10-12 h"
        },
        "tiempo_estimado_cosecha_dias": "25-30",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar sistema",
            "descripcion": "Instalar canales poco profundos o cestas con sustrato inerte; llenar con solución nutritiva aireada.",
            "materiales_paso": [
              "canales o cestas",
              "coco/perlita",
              "solución nutritiva"
            ],
            "indicadores": "Sistema estable y húmedo",
            "tiempo_dias": "0",
            "evitar": "Sustrato compacto → raíces deformes",
            "notas": "Oxigenación constante",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra",
            "descripcion": "Colocar semillas pregerminadas o plántulas en esponjas/vasos malla.",
            "materiales_paso": [
              "semillas germinadas"
            ],
            "indicadores": "Plántulas firmes en 3–5 días",
            "tiempo_dias": "0-5",
            "evitar": "Exceso de calor → espigado",
            "notas": "Germinar aparte acelera el trasplante",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Cuidados básicos",
            "descripcion": "Mantener pH cercano a 6.0, buena aireación y recirculación constante.",
            "materiales_paso": [
              "medidor pH",
              "bomba/aireador"
            ],
            "indicadores": "Bulbos parejos y hojas verdes",
            "tiempo_dias": "5-20",
            "evitar": "pH fuera de rango → clorosis",
            "notas": "Renovar solución cada 2 semanas",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cosechar rábanos tiernos a los 25–30 días.",
            "materiales_paso": [
              "tijeras"
            ],
            "indicadores": "Raíces firmes y uniformes",
            "tiempo_dias": "25-30",
            "evitar": "Retrasar cosecha → raíces fibrosas",
            "notas": "Ideal para hidroponía rápida",
            "alerta_plagas": null
          }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 30
    }
  }, {
    "id": "curcuma",
    "nombre": "Cúrcuma",
    "nombreCientifico": "Curcuma longa",
    "descripcion": "La cúrcuma es una planta perenne tropical de la familia Zingiberaceae, cultivada por sus rizomas ricos en curcumina, con usos culinarios, cosméticos y medicinales.",
    "tags": ["maceta_mediana", "medio", "calido", "templado", "Pacifica", "Amazonia"],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Pacifica", "Amazonia"],
      "nota": "Óptimo en Pacífica y Amazonia. Caribe/Orinoquía: viable con sombra parcial y riego estable. Andina baja (≤1500 m): posible con humedad y semisombra; Andina alta: no recomendado a campo abierto."
    },
    "compatibilidades": ["cilantro", "frijol"],
    "incompatibilidades": [],
    "posicion": { "lat": 5.6947, "lon": -76.661 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fcurcuma.jpg?alt=media&token=04bb2e9b-bf58-4e98-b30e-2ade4432dc9a",
        "atribucion": {
          "text": "Imagen de Sergio Yahni en Pixabay",
          "link": "https://pixabay.com/es/photos/turmeric-curcuma-root-spice-3580418/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Fe_disponible_casero",
      "sustrato_lowcost"
    ],
    "tipo_planta": "Planta herbácea perenne (cultivada como anual)",
    "tecnica": {
      "temperatura_ideal": "22-30 °C",
      "riego": "Riegos constantes cada 2–3 días en crecimiento; reducir al final para maduración.",
      "luz_solar": "Semisombra luminosa; tolera sol parcial en clima húmedo.",
      "ph_suelo": "5.5-7.0",
      "humedad_ideal": "70-85 %",
      "altitud_ideal": "0-1500 m (óptimo); hasta 1800 m en climas cálidos.",
      "epoca_siembra": "comienzo_epoca_lluvia",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso con algo de limo",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos arcillosos o compactos que pudren rizomas."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 30,
        "entre_plantas_cm_max": 40,
        "entre_surcos_cm": 40,
        "patron": "camellones"
      },
      "nutricion": {
        "enmiendas_fondo": [
          "compost_bien_curado",
          "estiércol_descompuesto",
          "ceniza_madera_pre_siembra"
        ],
        "refuerzos": [
          "abono_foliar_n_2mes",
          "abonado_mensual_balanceado",
          "alto_k_p_5mes"
        ],
        "restricciones": "[evitar_exceso_n, evitar_encharcamiento]",
        "criticos": ["K", "P", "N", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "12-15 °C",
        "vida_util_dias_frio": "60-90",
        "vida_util_dias_ambiente": "15-20",
        "notas": "Lavar, hervir 30–45 min y secar al sol antes de almacenar como especia."
      }
    },
    "cicloVida": [
      {
        "etapa": "Siembra de rizomas",
        "orden": 1,
        "duracion_dias_min": 0,
        "duracion_dias_max": 1,
        "duracion_dias_tipico": 0,
        "riego": { "frecuencia_dias": 2, "metodo": ["manual"], "notas": "Mantener sustrato húmedo pero no encharcado tras la siembra." },
        "fertilizacion": { "momento_dias": 0, "notas": "Incorporar compost o estiércol antes de sembrar; no abonar directamente al rizoma." },
        "labores": ["Cortar rizomas sanos con 2–3 yemas y sembrar a 4–6 cm de profundidad."],
        "notas": "Fase latente de varias semanas antes del brote visible.",
        "indicadores_cambio_fase": "Rizomas firmes sin pudrición.",
        "objetivo_nutricional": "Activar raíces iniciales y preparar brote.",
        "alertas_plagas": ["podredumbre_rizoma", "roedores"]
      },
      {
        "etapa": "Brotación",
        "orden": 2,
        "duracion_dias_min": 20,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["manual"], "notas": "Riego ligero y constante." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar hasta ver brote." },
        "labores": ["Mantener cobertura ligera para conservar humedad.", "Retirar acolchado al emerger brotes."],
        "notas": "Emergen pseudotallos verdes tras 3–6 semanas.",
        "indicadores_cambio_fase": "Punta verde visible en superficie.",
        "objetivo_nutricional": "Iniciar desarrollo aéreo.",
        "alertas_plagas": ["babosas", "barrenador_brotes"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 90,
        "duracion_dias_max": 180,
        "duracion_dias_tipico": 150,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["manual", "surco"], "notas": "Mantener suelo siempre húmedo, sin charcos." },
        "fertilizacion": { "momento_dias": 60, "notas": "Abono foliar de N; luego abonos mensuales ricos en N y algo de P." },
        "labores": ["Deshierbe regular.", "Aporques suaves si algún rizoma asoma.", "Mantillo para conservar humedad."],
        "notas": "Plantas alcanzan 60–100 cm con hojas anchas.",
        "indicadores_cambio_fase": "Cese del crecimiento rápido de hojas.",
        "objetivo_nutricional": "Generar biomasa y nutrir rizomas en formación.",
        "alertas_plagas": ["ácaros", "trips", "hongos_foliares"]
      },
      {
        "etapa": "Desarrollo de rizomas",
        "orden": 4,
        "duracion_dias_min": 60,
        "duracion_dias_max": 120,
        "duracion_dias_tipico": 90,
        "riego": { "frecuencia_dias": 3, "metodo": ["manual"], "notas": "Riego regular, sin excesos prolongados." },
        "fertilizacion": { "momento_dias": 150, "notas": "Aplicar K y P (ceniza, harina de hueso). Reducir N." },
        "labores": ["Entutorar plantas altas si hay viento.", "Mantener deshierbe."],
        "notas": "Rizomas comienzan a engordar y adquirir color.",
        "indicadores_cambio_fase": "Hojas bajas amarillean; rizomas visibles más gruesos.",
        "objetivo_nutricional": "Engorde del rizoma con potasio y fósforo.",
        "alertas_plagas": ["cochinilla_rizoma", "nematodos"]
      },
      {
        "etapa": "Maduración (senescencia del follaje)",
        "orden": 5,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": 7, "metodo": ["manual ligero"], "notas": "Reducir riego hasta casi suspenderlo." },
        "fertilizacion": { "momento_dias": null, "notas": "No abonar en esta etapa." },
        "labores": ["Podar follaje seco a 10–15 cm del suelo."],
        "notas": "La planta aparenta morir, hojas y tallos marrones.",
        "indicadores_cambio_fase": "Follaje seco casi total.",
        "objetivo_nutricional": "Permitir que rizomas se curen y concentren curcumina.",
        "alertas_plagas": ["moho_base_tallos", "roedores"]
      },
      {
        "etapa": "Cosecha de rizomas",
        "orden": 6,
        "duracion_dias_min": 210,
        "duracion_dias_max": 300,
        "duracion_dias_tipico": 270,
        "riego": { "frecuencia_dias": null, "metodo": null, "notas": "Regar ligeramente 1 día antes si el suelo está muy duro." },
        "fertilizacion": { "momento_dias": null, "notas": "No fertilizar." },
        "labores": ["Levantar rizomas con azadón o pala.", "Seleccionar parte para resembrar."],
        "notas": "Rizomas firmes, aromáticos, listos para procesar.",
        "indicadores_cambio_fase": "Planta seca, rizomas curados bajo tierra.",
        "objetivo_nutricional": "Extraer rizomas con máxima curcumina.",
        "alertas_plagas": ["hongos_postcosecha", "gorgojos_almacen"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_profunda",
        "nombre": "maceta profunda",
        "ambito": "maceta",
        "descripcion_corta": "Rizomas aromáticos en contenedor amplio y húmedo.",
        "materiales": ["maceta 20–30 L", "60% coco + 30% compost + 10% arena", "acolchado", "rizomas"],
        "herramientas": ["cuchillo limpio", "regadera"],
        "notas_clave": "Enterrar rizoma horizontal a 4–6 cm; mantener semisombra.",
        "contenedor_volumen_min_L": 20,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "6-8 h (semisombra)" },
        "tiempo_estimado_cosecha_dias": "240-300",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla coco+compost+arena y acolchar.", "materiales_paso": ["maceta", "sustrato", "acolchado"], "indicadores": "Sustrato mullido y drenado", "tiempo_dias": "0", "evitar": "Suelo pesado", "notas": "Ubicar en semisombra", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra de rizomas", "descripcion": "Enterrar rizomas sanos con 'ojos' a 4–6 cm en horizontal.", "materiales_paso": ["rizomas", "cuchillo"], "indicadores": "Brotes en 3–6 semanas", "tiempo_dias": "0-30", "evitar": "Enterrar demasiado profundo", "notas": "Usar cortes limpios", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego cada 2–3 días; mantener semisombra; evitar encharcar.", "materiales_paso": ["regadera"], "indicadores": "Hojas verdes y tallos vigorosos", "tiempo_dias": "30-240", "evitar": "Sequía o exceso de agua", "notas": "Planta tropical, no tolera frío", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Levantar rizomas maduros a los 240–300 días.", "materiales_paso": ["tijeras", "guantes"], "indicadores": "Rizomas firmes y aromáticos", "tiempo_dias": "240-300", "evitar": "Cosecha temprana → rizomas pequeños", "notas": "Reservar parte como semilla", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin_sombreado",
        "nombre": "jardin sombreado",
        "ambito": "jardin",
        "descripcion_corta": "Camellón mullido y drenado, cosecha de 'manos' de rizomas.",
        "materiales": ["cama con compost y arena", "acolchado", "rizomas"],
        "herramientas": ["azadón", "rastrillo", "regadera"],
        "notas_clave": "Sembrar en camellones; semisombra natural.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "6-8 h (semisombra)" },
        "tiempo_estimado_cosecha_dias": "240-300",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Formar camellón mullido con compost+arena; acolchar.", "materiales_paso": ["compost", "arena", "acolchado"], "indicadores": "Suelo aireado y drenado", "tiempo_dias": "0", "evitar": "Suelo arcilloso", "notas": "Clima húmedo tropical es ideal", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Enterrar rizomas a 4–6 cm, separados 30–40 cm.", "materiales_paso": ["rizomas", "azadón"], "indicadores": "Brotación en 3–6 semanas", "tiempo_dias": "0-30", "evitar": "Competencia por siembra densa", "notas": "Colocar en semisombra", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Mantener humedad y semisombra; riego cada 2–3 días.", "materiales_paso": ["regadera"], "indicadores": "Plantas vigorosas con hojas amplias", "tiempo_dias": "30-240", "evitar": "Exceso de agua", "notas": "Aplicar acolchado para conservar humedad", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Extraer rizomas maduros a los 240–300 días.", "materiales_paso": ["azadón", "guantes"], "indicadores": "Rizomas gruesos y aromáticos", "tiempo_dias": "240-300", "evitar": "Cosechar antes de tiempo", "notas": "Guardar semilla para próximo ciclo", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 3,
      "dias_para_cosecha": 270
    }
  }, {
    "id": "yuca_dulce",
    "nombre": "Yuca dulce",
    "nombreCientifico": "Manihot esculenta",
    "descripcion": "La yuca dulce es un arbusto perenne cultivado por sus raíces ricas en almidón, base alimentaria en zonas tropicales. Las variedades dulces tienen bajo contenido de toxinas y son aptas para consumo fresco.",
    "tags": ["maceta_grande", "facil", "calido", "Caribe"],
    "dificultad": "Media",
    "clima": { "clase": ["calido"] },
    "region": {
      "principal": ["Caribe"],
      "nota": "Óptima en Caribe. Orinoquía: viable con riego en veranos fuertes. Pacífica: en camas elevadas con drenaje excelente. Andina baja: posible en suelos sueltos con calor. Andina alta: no recomendada a campo abierto."
    },
    "compatibilidades": ["jengibre", "cilantro"],
    "incompatibilidades": ["fresa"],
    "posicion": { "lat": 9.3047, "lon": -75.3978 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fyuca%20(2).jpg?alt=media&token=7b8e644d-c466-4ad0-9656-c030a99fd632",
        "atribucion": {
          "text": "Image by freepik",
          "link": "https://www.freepik.com/free-photo/composition-nutritious-cassava-roots-sliced_18037150.htm"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "propagacion_estacas_casera"
    ],
    "tipo_planta": "Arbusto perenne (cultivado como anual)",
    "tecnica": {
      "temperatura_ideal": "22-30 °C",
      "riego": "Ligero tras la siembra; luego cada 3–7 días según clima. Resiste sequía, pero riego regular mejora tuberización.",
      "luz_solar": "Pleno sol; tolera semisombra ligera.",
      "ph_suelo": "5.5-6.8",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "0-1500 m",
      "epoca_siembra": "inicio_lluvias",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco-arenoso o franco-limoso",
        "materia_organica": "media",
        "retencion_agua": "moderada",
        "notas": "Suelos mullidos, profundos y aireados. Evitar arcillosos o encharcados que pudren estacas y raíces."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 80,
        "entre_plantas_cm_max": 100,
        "entre_surcos_cm": 100,
        "patron": "cuadro o camellón"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol bien descompuesto"],
        "refuerzos": [
          "N y P al mes de siembra",
          "NPK balanceado a los 3 meses",
          "aporte de K en 4–5 meses"
        ],
        "restricciones": "[evitar_exceso_n, evitar_encharcamiento]",
        "criticos": ["N", "P", "K", "Mg", "Zn"]
      },
      "post_cosecha": {
        "temperatura_ideal": "14-18 °C",
        "vida_util_dias_frio": "3-5",
        "vida_util_dias_ambiente": "2-3",
        "notas": "Consumir pronto tras la cosecha; raíces frescas se deterioran rápido. Conservar en arena o tierra fresca unos días."
      }
    },
    "cicloVida": [
      {
        "etapa": "Siembra de estaca y brotación",
        "orden": 1,
        "duracion_dias_min": 15,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 21,
        "riego": { "frecuencia_dias": "2-3", "metodo": ["manual"], "notas": "Riego ligero tras siembra; mantener humedad sin encharcar." },
        "fertilizacion": { "momento_dias": 0, "notas": "Incorporar compost o estiércol como fondo sin contacto directo con la estaca." },
        "labores": ["Sembrar estacas leñosas de 30 cm, enterradas 2/3 en suelo mullido."],
        "notas": "Brotes verdes aparecen a las 2–4 semanas.",
        "indicadores_cambio_fase": "Yemas brotadas y raíces adventicias visibles.",
        "objetivo_nutricional": "Iniciar enraizamiento y emisión de brotes.",
        "alertas_plagas": ["pudricion_estaca", "termitas", "babosas"]
      },
      {
        "etapa": "Desarrollo vegetativo",
        "orden": 2,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": { "frecuencia_dias": "3-4", "metodo": ["manual"], "notas": "Riego regular; importante en sequías." },
        "fertilizacion": { "momento_dias": 30, "notas": "Aplicar N y P (ej. bocashi o NPK 15-15-15 en microdosis). Repetir al mes 3." },
        "labores": ["Deshierbe constante.", "Raleo: dejar 1-2 brotes fuertes por estaca."],
        "notas": "Planta de 1–1.5 m, follaje vigoroso, aún sin raíces engrosadas.",
        "indicadores_cambio_fase": "Máximo desarrollo foliar inicial (~3 meses).",
        "objetivo_nutricional": "Formar tallos y raíces iniciales.",
        "alertas_plagas": ["gusano_cachon", "ácaros", "mosca_blanca", "bacteriosis"]
      },
      {
        "etapa": "Formación y engrosamiento de raíces",
        "orden": 3,
        "duracion_dias_min": 90,
        "duracion_dias_max": 180,
        "duracion_dias_tipico": 120,
        "riego": { "frecuencia_dias": "4-5", "metodo": ["manual"], "notas": "Mantener humedad moderada; riego ocasional en secano." },
        "fertilizacion": { "momento_dias": 90, "notas": "Aplicar K (ceniza, 40–60 g/planta de K2O) y micronutrientes (Mg, Zn)." },
        "labores": ["Aporque al mes 4–5.", "Control fitosanitario en base de tallos."],
        "notas": "Raíces engrosan y acumulan almidón desde 4° mes.",
        "indicadores_cambio_fase": "Raíces tuberosas visibles al excavar superficialmente.",
        "objetivo_nutricional": "Almacenar reservas energéticas en raíces.",
        "alertas_plagas": ["mosca_yuca", "gorgojo_raiz", "fitofthora"]
      },
      {
        "etapa": "Maduración de raíces",
        "orden": 4,
        "duracion_dias_min": 60,
        "duracion_dias_max": 120,
        "duracion_dias_tipico": 90,
        "riego": { "frecuencia_dias": 7, "metodo": ["manual"], "notas": "Riego mínimo; reducir en últimos 2–3 meses." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza; absorción mínima." },
        "labores": ["Despunte foliar opcional 2 semanas antes para engorde final."],
        "notas": "Hojas amarillean >50%, tallos lignificados.",
        "indicadores_cambio_fase": "Raíces con almidón lechoso y cáscara fácil de desprender.",
        "objetivo_nutricional": "Engorde y maduración final de raíces.",
        "alertas_plagas": ["roedores", "antracnosis"]
      },
      {
        "etapa": "Cosecha",
        "orden": 5,
        "duracion_dias_min": 270,
        "duracion_dias_max": 360,
        "duracion_dias_tipico": 300,
        "riego": { "frecuencia_dias": null, "metodo": null, "notas": "Si suelo duro, regar un día antes para facilitar arranque." },
        "fertilizacion": { "momento_dias": null, "notas": "No aplica." },
        "labores": ["Cortar tallos a 30 cm y usarlos como palanca para jalar raíces.", "Excavar con pala para sacar raíces completas."],
        "notas": "Cosechar al final de época seca. Raíces frescas se deterioran rápido.",
        "indicadores_cambio_fase": "Raíces maduras con máximo almidón.",
        "objetivo_nutricional": "Extraer raíces en su punto de mejor calidad.",
        "alertas_plagas": ["manchas_postcosecha", "hongos_suelo"]
      }
    ],
    "metodos": [
      {
        "id": "jardin_camellon",
        "nombre": "jardín en camellón",
        "ambito": "jardin",
        "descripcion_corta": "Siembra tradicional en camas elevadas para raíces largas y rectas.",
        "materiales": ["camellones", "compost", "estacas de yuca"],
        "herramientas": ["azadón", "pala", "machete"],
        "notas_clave": "Requiere espacio amplio; cosecha tras 9–12 meses.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "270-360",
        "pasos": [
          { "orden": 1, "titulo": "Preparar camellón", "descripcion": "Formar camellón aireado con compost; espaciar 1x1 m.", "materiales_paso": ["camellón", "compost"], "indicadores": "Suelo mullido y profundo", "tiempo_dias": "0", "evitar": "Suelos encharcados", "notas": "Permite raíces largas", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra de estacas", "descripcion": "Plantar estacas de 30 cm enterradas 2/3 en posición inclinada.", "materiales_paso": ["estacas de yuca"], "indicadores": "Brotación en 2–4 semanas", "tiempo_dias": "0-30", "evitar": "Estacas podridas", "notas": "Usar tallos de 8–12 meses", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados vegetativos", "descripcion": "Riego cada 3–4 días; deshierbe y raleo de brotes débiles.", "materiales_paso": ["pala", "agua"], "indicadores": "Plantas vigorosas de 1 m", "tiempo_dias": "30-90", "evitar": "Competencia de malezas", "notas": "Dejar 1–2 brotes fuertes", "alerta_plagas": null },
          { "orden": 4, "titulo": "Engorde y maduración", "descripcion": "Aplicar K al 4° mes; riego cada 5–7 días; despunte opcional 2 semanas antes.", "materiales_paso": ["ceniza", "agua"], "indicadores": "Raíces engrosando", "tiempo_dias": "90-270", "evitar": "Exceso de agua", "notas": "Hojas amarillentas indican madurez", "alerta_plagas": null },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cortar tallos y usar de palanca; extraer raíces con pala.", "materiales_paso": ["machete", "pala"], "indicadores": "Raíces maduras y firmes", "tiempo_dias": "270-360", "evitar": "Retrasar cosecha → raíces fibrosas", "notas": "Consumir o procesar rápido", "alerta_plagas": null }
        ]
      },
      {
        "id": "maceta_grande",
        "nombre": "maceta grande",
        "ambito": "maceta",
        "descripcion_corta": "Cultivo en contenedor profundo; raíces más pequeñas pero manejables.",
        "materiales": ["maceta ≥60 L", "sustrato aireado (50% arena + 30% compost + 20% tierra)", "estacas"],
        "herramientas": ["cuchillo", "regadera"],
        "notas_clave": "No apto para gran producción; útil como cultivo demostrativo.",
        "contenedor_volumen_min_L": 60,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "300-360",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla aireada y buen drenaje.", "materiales_paso": ["maceta", "sustrato"], "indicadores": "Sustrato suelto y profundo", "tiempo_dias": "0", "evitar": "Macetas poco profundas", "notas": "Colocar en lugar soleado", "alerta_plagas": null },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Sembrar estaca de 30 cm, enterrada 2/3.", "materiales_paso": ["estaca"], "indicadores": "Brotación en 2–4 semanas", "tiempo_dias": "0-30", "evitar": "Estaca podrida", "notas": "Mantener humedad ligera", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados", "descripcion": "Riego cada 3–5 días; fertilizar con N y P al mes; aplicar K en mes 4.", "materiales_paso": ["agua", "fertilizante"], "indicadores": "Planta vigorosa", "tiempo_dias": "30-240", "evitar": "Encharcar", "notas": "Maceta limita tamaño final", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Extraer raíces a los 300–360 días.", "materiales_paso": ["cuchillo"], "indicadores": "Raíces firmes", "tiempo_dias": "300-360", "evitar": "Retrasar cosecha", "notas": "Raíces más pequeñas que en campo", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 4,
      "dias_para_cosecha": 300
    }
  }, {
    "id": "tomate_cherry",
    "nombre": "Tomate cherry",
    "nombreCientifico": "Solanum lycopersicum var. cerasiforme",
    "descripcion": "El tomate cherry es una variedad de fruto pequeño (≈2–3 cm), dulce y aromática, ideal para ensaladas y aperitivos. Planta anual de crecimiento usualmente indeterminado (1.5–2 m con tutoreo).",
    "tags": [
      "maceta_mediana",
      "medio",
      "calido",
      "templado",
      "Andina",
      "Caribe"
    ],
    "dificultad": "Media",
    "clima": {
      "clase": ["calido", "templado"]
    },
    "region": {
      "principal": ["Andina", "Caribe"],
      "nota": "Óptimo en Andina. En Caribe es viable con riego estable y manejo sanitario; en Pacífica muy húmeda sólo con drenaje y cubiertas; en Orinoquía/Amazonia, preferir microclimas o sombra ligera en picos de calor."
    },
    "compatibilidades": ["rabano", "pimenton"],
    "incompatibilidades": ["fresa"],
    "posicion": { "lat": 6.155, "lon": -75.373 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2FtomateCherry.jpg?alt=media&token=4cd680d4-f38f-481c-8d5e-2e710f303608",
        "atribucion": {
          "text": "Imagen de Etienne GONTIER en Pixabay",
          "link": "https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3622009"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Ca_B_floracion_casero",
      "acolchado_antihongos_casero",
      "sustrato_lowcost",
      "tutorado_casero"
    ],
    "tipo_planta": "Herbácea anual",
    "tecnica": {
      "temperatura_ideal": "18-30 °C",
      "riego": "Riego profundo y constante; ideal goteo o al pie cada 2–3 días. Evitar sequías seguidas de riegos copiosos para prevenir rajado de frutos.",
      "luz_solar": "Pleno sol, 8–10 h diarias.",
      "ph_suelo": "6.0-6.8",
      "humedad_ideal": "60-75 %",
      "altitud_ideal": "0-2200 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso con abundante compost",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos muy arcillosos y húmedos; rotar para no repetir solanáceas."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 40,
        "entre_plantas_cm_max": 60,
        "entre_surcos_cm": 70,
        "patron": "filas con tutorado"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol bien curado"],
        "refuerzos": [
          "te_compost_diluido_2sem",
          "NPK_15_15_15_al_mes",
          "abonado_balanceado_cada_3_4_sem",
          "aporte_P_K_inicio_floracion",
          "refuerzo_K_en_fructificacion",
          "Ca_B_floracion_casero"
        ],
        "restricciones": "[evitar_exceso_N, evitar_encharcamiento]",
        "criticos": ["N", "P", "K", "Ca", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "10-15",
        "vida_util_dias_ambiente": "3-5",
        "notas": "No lavar antes de almacenar; limpiar al consumir. Evitar golpes."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 5,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": {
          "frecuencia_dias": 1,
          "metodo": ["aspersion suave (nebulizacion)"],
          "notas": "Mantener sustrato húmedo sin encharcar; cubrir semillas con ~5 mm de sustrato."
        },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere; la semilla aporta reservas." },
        "labores": [
          "Cubrir el semillero con film/tapa transparente hasta la emergencia; semisombra cálida."
        ],
        "notas": "Brota en ~1 semana.",
        "indicadores_cambio_fase": "Cotiledones verdes emergidos.",
        "objetivo_nutricional": "Activar raíz y brote inicial.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      {
        "etapa": "Plántula (almácigo)",
        "orden": 2,
        "duracion_dias_min": 21,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 28,
        "riego": {
          "frecuencia_dias": "1-2",
          "metodo": ["aspersion ligera", "riego al pie"],
          "notas": "Humedad constante sin encharcar; regar cuando la capa superior se seque ligeramente."
        },
        "fertilizacion": { "momento_dias": 15, "notas": "Té de compost diluido si hay poco vigor." },
        "labores": [
          "Aclareo si denso; 6–8 h de luz; endurecimiento 1 semana antes del trasplante."
        ],
        "notas": "Listas con 4–6 hojas verdaderas y ~10–15 cm.",
        "indicadores_cambio_fase": "Plántulas firmes y verdes.",
        "objetivo_nutricional": "Raíz y tallo fuertes, tejido compacto.",
        "alertas_plagas": ["pulgones", "babosas", "damping_off"]
      },
      {
        "etapa": "Trasplante/Adaptación",
        "orden": 3,
        "duracion_dias_min": 3,
        "duracion_dias_max": 14,
        "duracion_dias_tipico": 7,
        "riego": {
          "frecuencia_dias": 1,
          "metodo": ["riego al pie abundante"],
          "notas": "Regar inmediatamente tras trasplantar; mantener muy húmedo la 1ª semana."
        },
        "fertilizacion": { "momento_dias": 0, "notas": "Compost o estiércol curado en el hoyo (sin tocar raíces)." },
        "labores": [
          "Trasplantar en tarde/nublado; enterrar tallo hasta primeras hojas; instalar tutor."
        ],
        "notas": "Separar plantas ~50 cm; proteger del sol fuerte los primeros 2–3 días.",
        "indicadores_cambio_fase": "Reanudación del crecimiento (hojas nuevas).",
        "objetivo_nutricional": "Enraizar profundo y superar el shock.",
        "alertas_plagas": ["gusanos_trozadores", "babosas"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 4,
        "duracion_dias_min": 14,
        "duracion_dias_max": 28,
        "duracion_dias_tipico": 21,
        "riego": {
          "frecuencia_dias": "2-3",
          "metodo": ["goteo", "al pie"],
          "notas": "Riego profundo regular; evitar mojar follaje para prevenir hongos."
        },
        "fertilizacion": {
          "momento_dias": 15,
          "notas": "Aporte rico en N (p. ej., estiércol diluido) a mitad de esta fase."
        },
        "labores": [
          "Deschuponado, entutorado progresivo, deshierbe y eliminación de hojas que toquen suelo."
        ],
        "notas": "Planta 30–60 cm; prepara estructura para floración.",
        "indicadores_cambio_fase": "Aparición de botones florales.",
        "objetivo_nutricional": "Acumular follaje y raíces fuertes (alto consumo de N).",
        "alertas_plagas": ["pulgones", "mosca_blanca", "mildiu"]
      },
      {
        "etapa": "Floración",
        "orden": 5,
        "duracion_dias_min": 10,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": {
          "frecuencia_dias": 2,
          "metodo": ["goteo", "al pie (sin mojar flores)"],
          "notas": "Estrés hídrico provoca caída de flores; mantener humedad constante."
        },
        "fertilizacion": { "momento_dias": 0, "notas": "Aplicar P y K (harina de hueso, ceniza) al inicio de floración." },
        "labores": [
          "Favorecer polinización (sacudir plantas, atraer insectos); retirar chupones y algunas hojas bajas."
        ],
        "notas": "Flores amarillas abiertas en racimos; tras polinización caen pétalos.",
        "indicadores_cambio_fase": "Cuaje: comienzan a formarse frutos verdes.",
        "objetivo_nutricional": "Soportar formación de flores y buen cuaje (P y algo de K).",
        "alertas_plagas": ["trips", "mosca_blanca"]
      },
      {
        "etapa": "Fructificación",
        "orden": 6,
        "duracion_dias_min": 14,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 18,
        "riego": {
          "frecuencia_dias": 2,
          "metodo": ["goteo", "surco"],
          "notas": "Suelo uniformemente húmedo para evitar rajado; no alternar sequía con excesos."
        },
        "fertilizacion": {
          "momento_dias": 0,
          "notas": "Refuerzo de K al inicio para tamaño, firmeza y dulzor."
        },
        "labores": [
          "Tutorar racimos; deshojar hojas basales enfermas o que sombreen demasiado; cosechar apenas maduren."
        ],
        "notas": "Frutos verdes engordan y cambian de color en ~2–3 semanas.",
        "indicadores_cambio_fase": "Frutos rojos/ámbar firmes listos para corte.",
        "objetivo_nutricional": "Llenado de frutos con alta demanda de K.",
        "alertas_plagas": ["orugas_perforadoras", "botrytis", "mildiu"]
      },
      {
        "etapa": "Cosecha",
        "orden": 7,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": {
          "frecuencia_dias": "2-3",
          "metodo": ["goteo", "al pie"],
          "notas": "Mantener riego regular durante la cosecha continua; evitar excesos al final."
        },
        "fertilizacion": {
          "momento_dias": 30,
          "notas": "Si la planta sigue vigorosa, compost o té de lombriz cada 3–4 semanas."
        },
        "labores": [
          "Cosecha escalonada cada 2–3 días; retirar frutos dañados; poda de mantenimiento de hojas secas y chupones nuevos."
        ],
        "notas": "Producción continua por varias semanas hasta declive.",
        "indicadores_cambio_fase": "Fin de cosecha por frío o enfermedades.",
        "objetivo_nutricional": "Sostener la producción lo más tiempo posible.",
        "alertas_plagas": ["acaros", "tizon_tardio"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_mediana",
        "nombre": "maceta mediana",
        "ambito": "maceta",
        "descripcion_corta": "Planta de 1–1.5 m en contenedor con tutorado; producción continua.",
        "materiales": [
          "maceta 15–20 L",
          "mezcla 60% coco + 40% compost",
          "tutor o malla",
          "semillas/plantines"
        ],
        "herramientas": ["regadera", "tijeras", "estacas"],
        "notas_clave": "Sol pleno; riego parejo; eliminar chupones en variedades indeterminadas.",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "20-30 grados", "horas_luz": "10-12 h luz" },
        "tiempo_estimado_cosecha_dias": "60-80",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar maceta",
            "descripcion": "Llenar con sustrato aireado y colocar tutor.",
            "materiales_paso": ["maceta", "sustrato", "tutor"],
            "indicadores": "Drenaje correcto; maceta estable",
            "tiempo_dias": "0",
            "evitar": "Sustrato compacto y sin drenaje",
            "notas": "Ubicar a pleno sol",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Siembra/trasplante",
            "descripcion": "Sembrar o trasplantar plantín de 10–15 cm; enterrar hasta primeras hojas.",
            "materiales_paso": ["semillas/plantín"],
            "indicadores": "Plántula erguida y verde",
            "tiempo_dias": "0–7",
            "evitar": "Trasplantar en horas de sol fuerte",
            "notas": "Regar abundantemente al inicio",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Cuidados básicos",
            "descripcion": "Regar cada 2–3 días; podar chupones; amarrar al tutor conforme crece.",
            "materiales_paso": ["regadera", "tijeras"],
            "indicadores": "Planta vigorosa con buen follaje",
            "tiempo_dias": "7–60",
            "evitar": "Encharque y mojar follaje",
            "notas": "Añadir abonos según técnica",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Recolectar frutos firmes y rojos.",
            "materiales_paso": ["tijeras"],
            "indicadores": "Frutos uniformes y dulces",
            "tiempo_dias": "60–80",
            "evitar": "Dejar frutos sobremaduros",
            "notas": "Cosecha escalonada",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "jardin_enrejado",
        "nombre": "jardín enrejado",
        "ambito": "jardin",
        "descripcion_corta": "Surcos fértiles con tutorado; alta ventilación y sanidad.",
        "materiales": [
          "cama con mucho compost",
          "acolchado",
          "estacas/malla",
          "plantines"
        ],
        "herramientas": ["azadón", "estacas", "regadera", "tijeras"],
        "notas_clave": "Riego en la base; buena ventilación; deschuponado; rotar con no-solanáceas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-30 grados", "horas_luz": "8-10 h luz" },
        "tiempo_estimado_cosecha_dias": "65-90",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar cama",
            "descripcion": "Aflojar suelo, incorporar compost y colocar tutores/malla.",
            "materiales_paso": ["compost", "estacas/malla"],
            "indicadores": "Suelo fértil y aireado",
            "tiempo_dias": "0",
            "evitar": "Suelo encharcado y poca ventilación",
            "notas": "Acolchar para sanidad y humedad",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Trasplante",
            "descripcion": "Trasplantar plántulas con 4–6 hojas a ~50 cm entre plantas.",
            "materiales_paso": ["plantines"],
            "indicadores": "Plántulas adaptadas sin marchitez",
            "tiempo_dias": "0–7",
            "evitar": "Sol fuerte post-trasplante",
            "notas": "Enterrar hasta primeras hojas; regar abundante",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Cuidados básicos",
            "descripcion": "Riego al pie; deschuponado; amarre al tutor; deshoje de hojas basales enfermas.",
            "materiales_paso": ["regadera", "tijeras"],
            "indicadores": "Plantas verdes y vigorosas",
            "tiempo_dias": "7–65",
            "evitar": "Humedad en hojas (hongos)",
            "notas": "Controlar polinización si faltan insectos",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cortar racimos/frutos rojos entre 65–90 días.",
            "materiales_paso": ["tijeras", "canasto"],
            "indicadores": "Frutos dulces y firmes",
            "tiempo_dias": "65–90",
            "evitar": "Frutos sobremaduros que se revientan",
            "notas": "Producción escalonada y continua",
            "alerta_plagas": null
          }
        ]
      },
      {
        "id": "hidroponia",
        "nombre": "hidroponia (goteo/nft/dwc)",
        "ambito": "hidroponia",
        "descripcion_corta": "Fructificación rápida y continua bajo control.",
        "materiales": [
          "baldes con coco/perlita o NFT/DWC",
          "vasos malla",
          "solución nutritiva"
        ],
        "herramientas": ["bomba", "aireador", "medidor pH/EC"],
        "notas_clave": "pH 5.8–6.2; soporte vertical; ventilación y polinización suave.",
        "contenedor_volumen_min_L": 12,
        "requisitos_ambiente": { "temperatura_C": "20-28 grados", "horas_luz": "12-14 h luz" },
        "tiempo_estimado_cosecha_dias": "55-75",
        "pasos": [
          {
            "orden": 1,
            "titulo": "Preparar sistema",
            "descripcion": "Configurar baldes con sustrato inerte o canales NFT/DWC y soporte vertical.",
            "materiales_paso": ["baldes/NFT/DWC", "sustrato inerte"],
            "indicadores": "Soporte firme y sustrato aireado",
            "tiempo_dias": "0",
            "evitar": "Mal drenaje que dañe raíces",
            "notas": "Sistema funcionando correctamente",
            "alerta_plagas": null
          },
          {
            "orden": 2,
            "titulo": "Trasplante",
            "descripcion": "Colocar plantines en vasos malla con solución nutritiva inicial.",
            "materiales_paso": ["plantines", "vasos malla", "solución nutritiva"],
            "indicadores": "Plántula adaptada al sistema",
            "tiempo_dias": "0–5",
            "evitar": "Mala adaptación → marchitez",
            "notas": "Raíces blancas y creciendo",
            "alerta_plagas": null
          },
          {
            "orden": 3,
            "titulo": "Cuidados básicos",
            "descripcion": "Mantener pH 5.8–6.2, riego continuo, ventilación y polinización suave.",
            "materiales_paso": ["bomba", "aireador", "medidor pH/EC"],
            "indicadores": "Plantas verdes con flores y cuaje",
            "tiempo_dias": "5–55",
            "evitar": "pH fuera de rango → clorosis",
            "notas": "Polinizar manualmente si falta viento/insectos",
            "alerta_plagas": null
          },
          {
            "orden": 4,
            "titulo": "Cosecha",
            "descripcion": "Cosechar frutos firmes y rojos entre 55–75 días.",
            "materiales_paso": ["tijeras", "guantes"],
            "indicadores": "Frutos de buen tamaño y dulces",
            "tiempo_dias": "55–75",
            "evitar": "Atrasar cosecha → frutos blandos",
            "notas": "Producción escalonada y continua",
            "alerta_plagas": null
          }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 75
    }
  }, {
    "id": "oregano",
    "nombre": "Orégano",
    "nombreCientifico": "Origanum vulgare L.",
    "descripcion": "El orégano es una aromática perenne muy rústica: tolera sequía y suelos pobres si recibe suficiente sol. Se usa fresco y, sobre todo, seco por su sabor concentrado y aroma intenso.",
    "tags": ["maceta_pequena", "facil", "calido", "templado", "Andina"],
    "dificultad": "Fácil",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Andina", "Caribe"],
      "nota": "Óptimo en Andina (templado-seco). Caribe: viable en suelos drenantes con riego espaciado; Pacífica húmeda: solo en maceta/camas elevadas; Orinoquía/Amazonia: en microclimas secos o bajo cubierta ligera."
    },
    "compatibilidades": ["pimenton", "pepino_cohombro"],
    "incompatibilidades": [],
    "posicion": { "lat": 5.6458, "lon": -73.5233 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Foregano.jpg?alt=media&token=7b3c0c7a-caf0-44d0-a115-55fd835c51c6",
        "atribucion": {
          "text": "Imagen de Arcaion en Pixabay",
          "link": "https://pixabay.com/photos/oregano-herb-plant-culinary-3403864/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "secado_hierbas_casero"
    ],
    "tipo_planta": "Hierba perenne",
    "tecnica": {
      "temperatura_ideal": "18-28 °C",
      "riego": "Moderado; cada 3–5 días en maceta o verano seco; tolera periodos secos una vez establecida.",
      "luz_solar": "Pleno sol para maximizar aroma; en calor extremo, sol de mañana y sombra ligera en la tarde.",
      "ph_suelo": "6.0-7.5",
      "humedad_ideal": "50-70 %",
      "altitud_ideal": "0-2400 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "media",
        "retencion_agua": "baja",
        "notas": "Prefiere suelos ligeros; evitar encharcamientos que pudren raíces."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 30,
        "patron": "hileras"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost ligero", "estiércol bien curado"],
        "refuerzos": ["compost anual", "abonado ligero post-corte"],
        "restricciones": "[evitar_exceso_N, evitar_encharque]",
        "criticos": ["N", "K", "Ca", "Mg"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10 °C",
        "vida_util_dias_frio": "7-14",
        "vida_util_dias_ambiente": "2-5",
        "notas": "Secar manojos en sombra ventilada; guardar en frascos opacos para conservar aceites."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 10,
        "duracion_dias_max": 15,
        "duracion_dias_tipico": 12,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener sustrato húmedo, no saturado; temperatura ideal 20 °C." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere; semilla aporta reservas." },
        "labores": ["Sembrar superficial, apenas cubrir con sustrato.", "Cubrir con film/tapa transparente hasta emergencia."],
        "notas": "Emergencia irregular (~1–2 semanas).",
        "indicadores_cambio_fase": "Plántulas minúsculas con 2 cotiledones.",
        "objetivo_nutricional": "Activar embrión y brote inicial.",
        "alertas_plagas": ["damping_off", "hormigas"]
      },
      {
        "etapa": "Plántula (almácigo)",
        "orden": 2,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": "1-2", "metodo": ["riego leve"], "notas": "Mantener humedad sin charcos prolongados." },
        "fertilizacion": { "momento_dias": 30, "notas": "Aplicar compost diluido si hay poco vigor." },
        "labores": ["Trasplante a maceta o cama cuando tengan 4–6 hojas."],
        "notas": "Plántulas delicadas; raíces finas.",
        "indicadores_cambio_fase": "Plántulas con varias hojas verdaderas.",
        "objetivo_nutricional": "Raíz fuerte y tallo ramificado.",
        "alertas_plagas": ["hongos_raiz"]
      },
      {
        "etapa": "Crecimiento vegetativo y producción",
        "orden": 3,
        "duracion_dias_min": 70,
        "duracion_dias_max": 365,
        "duracion_dias_tipico": 180,
        "riego": { "frecuencia_dias": "3-7", "metodo": ["manual", "goteo"], "notas": "Tolera sequía ligera; riego semanal profundo en seco." },
        "fertilizacion": { "momento_dias": 90, "notas": "Abono orgánico anual; refuerzo tras cada corte fuerte." },
        "labores": ["Poda ligera y frecuente para estimular follaje.", "Deshierbe regular.", "Cosechar tallos cada 60–90 días."],
        "notas": "Planta aromática ramificada; producción constante si se corta a tiempo.",
        "indicadores_cambio_fase": "Rebrote vigoroso tras cada corte.",
        "objetivo_nutricional": "Mantener hojas tiernas y aceites esenciales.",
        "alertas_plagas": ["ácaros_rojos", "cochinillas", "hongos_postcorte"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta",
        "ambito": "maceta",
        "descripcion_corta": "Mata compacta y aromática; cortes frecuentes.",
        "materiales": ["maceta 3–5 L", "50% coco + 40% compost + 10% arena", "esqueje/plantín"],
        "herramientas": ["tijeras", "regadera"],
        "notas_clave": "Evitar encharque; poda ligera mantiene densidad.",
        "contenedor_volumen_min_L": 3,
        "requisitos_ambiente": { "temperatura_C": "18-28 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "60-90",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta con mezcla ligera y buen drenaje.", "materiales_paso": ["maceta", "sustrato"], "indicadores": "Sustrato mullido", "tiempo_dias": "0", "evitar": "Compactación", "notas": "Ubicar a pleno sol" },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Colocar esqueje/plantín en el centro, cubrir raíces.", "materiales_paso": ["esqueje"], "indicadores": "Plántula firme", "tiempo_dias": "0–5", "evitar": "Plantar muy hondo", "notas": "Riego moderado inicial" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego cada 3–5 días; podas ligeras.", "materiales_paso": ["tijeras"], "indicadores": "Planta compacta y aromática", "tiempo_dias": "5–60", "evitar": "Exceso de agua", "notas": "Estimula rebrote" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar tallos tiernos desde 60–90 días.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote vigoroso", "tiempo_dias": "60–90", "evitar": "Corte muy bajo", "notas": "Cosechar en la mañana mejora aceites" }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Borduras soleadas y drenadas; muy rústico.",
        "materiales": ["cama con compost y arena", "acolchado ligero", "esquejes/plantines"],
        "herramientas": ["azadín", "rastrillo", "regadera"],
        "notas_clave": "Pleno sol; repelente natural de plagas.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "16-30 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "70-100",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Armar cama con compost+arena y acolchado ligero.", "materiales_paso": ["azadín", "compost"], "indicadores": "Suelo mullido y aireado", "tiempo_dias": "0", "evitar": "Suelos pesados", "notas": "Listo para trasplante" },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar esquejes o plantines en hileras a 25–30 cm.", "materiales_paso": ["plantín"], "indicadores": "Plántula firme y adaptada", "tiempo_dias": "0–7", "evitar": "Siembra muy densa", "notas": "Mantener humedad moderada" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego cada 3–5 días; podas de formación.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Planta vigorosa y aromática", "tiempo_dias": "7–70", "evitar": "Exceso de sombra", "notas": "Mejor aroma con pleno sol" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar tallos cada 70–100 días.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote tras corte", "tiempo_dias": "70–100", "evitar": "Podar en plena floración", "notas": "Mayor aroma al inicio de floración" }
        ]
      },
      {
        "id": "hidroponia",
        "nombre": "hidroponia (NFT/torre)",
        "ambito": "hidroponia",
        "descripcion_corta": "Hojas limpias y aromáticas en sistemas compactos.",
        "materiales": ["NFT o torre", "canastillas", "sustrato inerte", "solución nutritiva"],
        "herramientas": ["bomba", "medidor pH", "tijeras"],
        "notas_clave": "Mantener pH ~6.0; baja EC inicial; podas para evitar floración temprana.",
        "contenedor_volumen_min_L": 2,
        "requisitos_ambiente": { "temperatura_C": "20-28 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "45-75",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Configurar NFT/torre con canastillas y solución nutritiva.", "materiales_paso": ["NFT/torre", "bomba"], "indicadores": "Sistema estable y aireado", "tiempo_dias": "0", "evitar": "Flujo deficiente", "notas": "Solución circulando", "alerta_plagas": null },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar esquejes en canastillas con solución nutritiva inicial.", "materiales_paso": ["esquejes", "solución nutritiva"], "indicadores": "Esquejes firmes", "tiempo_dias": "0–5", "evitar": "EC alta", "notas": "Plántulas adaptadas", "alerta_plagas": null },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Mantener pH 6.0, baja EC; podar para evitar floración temprana.", "materiales_paso": ["medidor pH", "tijeras"], "indicadores": "Plantas verdes y densas", "tiempo_dias": "5–45", "evitar": "Floración temprana", "notas": "Follaje frondoso", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cosechar tallos entre 45–75 días.", "materiales_paso": ["tijeras"], "indicadores": "Rebrote sano", "tiempo_dias": "45–75", "evitar": "Cortes muy agresivos", "notas": "Hojas uniformes y aromáticas", "alerta_plagas": null }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 4,
      "dias_para_cosecha": 75
    }
  }, {
    "id": "pepino_dulce",
    "nombre": "Pepino dulce",
    "nombreCientifico": "Solanum muricatum Aiton",
    "descripcion": "El pepino dulce, también conocido como melón andino o pera melón, es un arbusto perenne andino de fruto jugoso, aromático y dulce, consumido fresco o en postres.",
    "tags": ["maceta_mediana", "medio", "templado", "calido", "Andina", "Pacifica", "Caribe"],
    "dificultad": "Media",
    "clima": { "clase": ["templado", "calido"] },
    "region": {
      "principal": ["Andina", "Pacifica", "Caribe"],
      "nota": "Óptimo en región Andina; Pacífica y Caribe son viables con buen drenaje, riego estable y tutorado. En Orinoquía/Amazonia requiere microclimas o sombra ligera en picos de calor."
    },
    "compatibilidades": ["lechuga"],
    "incompatibilidades": [],
    "posicion": { "lat": 1.2136, "lon": -77.2811 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpepino-1666680_1280.jpg?alt=media&token=438d2958-79cc-46ae-baed-21a069b06d41",
        "atribucion": {
          "text": "Imagen de tegrafik en Pixabay",
          "link": "https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1666680"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Ca_B_floracion_casero",
      "acolchado_antihongos_casero",
      "sustrato_lowcost",
      "tutorado_casero"
    ],
    "tipo_planta": "Arbusto perenne (cultivado como anual o bienal)",
    "tecnica": {
      "temperatura_ideal": "18-25 °C",
      "riego": "Cada 2 días; no tolera sequía. Evitar encharcamiento prolongado. En poscosecha puede espaciarse a semanal.",
      "luz_solar": "Pleno sol en climas moderados; sombra ligera en calor >30 °C.",
      "ph_suelo": "6.0-7.0",
      "humedad_ideal": "60-75 %",
      "altitud_ideal": "500-2500 m",
      "epoca_siembra": "inicio_lluvias",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderada",
        "notas": "Evitar suelos arcillosos y encharcados; prefiere camas elevadas."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 60,
        "entre_plantas_cm_max": 80,
        "entre_surcos_cm": 100,
        "patron": "hileras con tutorado"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol curado"],
        "refuerzos": [
          "NPK moderado al mes de trasplante",
          "abonado ligero antes de floración",
          "alto K en fructificación"
        ],
        "restricciones": "[evitar_exceso_N, evitar_sequía]",
        "criticos": ["N", "K", "P", "Ca", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10 °C",
        "vida_util_dias_frio": "10-14",
        "vida_util_dias_ambiente": "7-10",
        "notas": "Consumir pronto; frutos delicados, se magullan fácil. Secundariamente puede rebrotar el siguiente ciclo."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 10,
        "duracion_dias_max": 21,
        "duracion_dias_tipico": 14,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener sustrato húmedo, no encharcado." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere; semilla aporta reservas." },
        "labores": ["Cubrir semillas con 2–3 mm de sustrato, mantener con tapa transparente hasta brote."],
        "notas": "Puede brotar irregular (2–3 semanas).",
        "indicadores_cambio_fase": "Cotiledones verdes visibles.",
        "objetivo_nutricional": "Activar embrión.",
        "alertas_plagas": ["hongos_semillero", "hormigas"]
      },
      {
        "etapa": "Plántula (almácigo)",
        "orden": 2,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": "1-2", "metodo": ["riego suave al pie"], "notas": "Humedad uniforme; evitar exceso de agua." },
        "fertilizacion": { "momento_dias": 30, "notas": "Compost diluido si hay poco vigor." },
        "labores": ["Repicar a bolsas cuando tengan 2–3 hojas verdaderas; endurecer antes de trasplantar."],
        "notas": "Listas al tener 4–5 hojas y 10–15 cm.",
        "indicadores_cambio_fase": "Plántula firme y verde.",
        "objetivo_nutricional": "Raíz fuerte y tallo sano.",
        "alertas_plagas": ["babosas", "gusanos_trozadores"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "al pie"], "notas": "No tolera sequía; riego cada 2 días." },
        "fertilizacion": { "momento_dias": 30, "notas": "NPK equilibrado o compost maduro al mes de trasplante." },
        "labores": ["Tutorado continuo; poda de formación (2–3 ramas principales).", "Desmalezar base."],
        "notas": "Crece tipo arbusto (30–50 cm). Exceso de N genera follaje sin floración.",
        "indicadores_cambio_fase": "Botones florales en axilas.",
        "objetivo_nutricional": "Formar estructura para soportar frutos.",
        "alertas_plagas": ["pulgones", "mosca_blanca"]
      },
      {
        "etapa": "Floración",
        "orden": 4,
        "duracion_dias_min": 14,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 21,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "al pie"], "notas": "Mantener humedad constante; evitar mojar flores." },
        "fertilizacion": { "momento_dias": 0, "notas": "Harina de hueso o fósforo ligero al inicio." },
        "labores": ["Polinización asistida en maceta/invernadero; reforzar amarres.", "Retirar chupones basales."],
        "notas": "Flores blanco-crema con vetas púrpura; floración continua.",
        "indicadores_cambio_fase": "Frutos incipientes cuajando.",
        "objetivo_nutricional": "Favorecer cuaje con P y evitar exceso de N.",
        "alertas_plagas": ["pulgones", "trips"]
      },
      {
        "etapa": "Fructificación",
        "orden": 5,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": 2, "metodo": ["goteo", "surco"], "notas": "Alto consumo de agua; evitar sequías o riegos bruscos." },
        "fertilizacion": { "momento_dias": 15, "notas": "Suplemento alto en K (ceniza, té de plátano) durante engorde." },
        "labores": ["Soportar frutos con redes; deshoje selectivo para maduración."],
        "notas": "Frutos de 10–15 cm, maduran en 4–6 meses desde siembra.",
        "indicadores_cambio_fase": "Frutos crema-amarillos con vetas moradas.",
        "objetivo_nutricional": "Transportar azúcares con alto K.",
        "alertas_plagas": ["mosca_blanca", "ácaros", "babosas"]
      },
      {
        "etapa": "Cosecha",
        "orden": 6,
        "duracion_dias_min": 120,
        "duracion_dias_max": 180,
        "duracion_dias_tipico": 150,
        "riego": { "frecuencia_dias": "3-4", "metodo": ["manual", "goteo"], "notas": "Mantener humedad ligera hasta final." },
        "fertilizacion": { "momento_dias": null, "notas": "Tras cosecha, aplicar compost si se mantiene la planta otro ciclo." },
        "labores": ["Cortar frutos maduros cuando piel esté amarilla-crema y ceda a presión.", "Podar ramas largas si se mantiene la planta."],
        "notas": "Planta puede rebrotar para segunda tanda más pequeña.",
        "indicadores_cambio_fase": "Fruto emite aroma dulce, cáscara definida.",
        "objetivo_nutricional": "Pulpa jugosa y dulce.",
        "alertas_plagas": ["plagas_postcosecha", "cochinillas"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_mediana",
        "nombre": "maceta mediana",
        "ambito": "maceta",
        "descripcion_corta": "Arbusto bajo con frutos dulces en contenedor.",
        "materiales": ["maceta 15–20 L", "sustrato aireado con compost", "tutor", "semillas/plantines"],
        "herramientas": ["regadera", "tijeras", "estacas"],
        "notas_clave": "Tutorar ramas pesadas; riego constante.",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "18-25 °C", "horas_luz": "8-10 h sol" },
        "tiempo_estimado_cosecha_dias": "150-180",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla aireada; instalar tutor.", "materiales_paso": ["maceta", "sustrato", "tutor"], "indicadores": "Maceta estable y aireada", "tiempo_dias": "0", "evitar": "Suelo compacto", "notas": "Colocar a pleno sol" },
          { "orden": 2, "titulo": "Siembra/trasplante", "descripcion": "Colocar plantín al centro; enterrar hasta primeras hojas.", "materiales_paso": ["plantín"], "indicadores": "Planta firme y verde", "tiempo_dias": "0-7", "evitar": "Trasplantar en sol fuerte", "notas": "Regar abundante al inicio" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego cada 2 días; podas ligeras; tutorado de ramas.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Planta vigorosa y con brotes", "tiempo_dias": "7-150", "evitar": "Sequía o encharque", "notas": "Abonar según fase", "alerta_plagas": null },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar frutos maduros de 10–15 cm.", "materiales_paso": ["tijeras"], "indicadores": "Frutos dulces y firmes", "tiempo_dias": "150-180", "evitar": "Frutos sobremaduros", "notas": "Cosecha escalonada", "alerta_plagas": null }
        ]
      },
      {
        "id": "jardin_tutorado",
        "nombre": "jardín tutorado",
        "ambito": "jardin",
        "descripcion_corta": "Arbusto bajo en cama con tutorado; frutos grandes y dulces.",
        "materiales": ["cama abonada", "acolchado", "tutores", "plantines"],
        "herramientas": ["azadón", "regadera", "tijeras"],
        "notas_clave": "Prefiere camas drenadas; tutorado importante.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-25 °C", "horas_luz": "8-10 h sol" },
        "tiempo_estimado_cosecha_dias": "150-180",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Aflojar suelo con compost; instalar tutores.", "materiales_paso": ["compost", "tutores"], "indicadores": "Suelo mullido y fértil", "tiempo_dias": "0", "evitar": "Suelo encharcado", "notas": "Buen drenaje es clave" },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar a 60–80 cm entre plantas; enterrar hasta primeras hojas.", "materiales_paso": ["plantines"], "indicadores": "Planta adaptada", "tiempo_dias": "0-7", "evitar": "Sol fuerte inmediato", "notas": "Regar abundantemente" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Riego cada 2 días; tutorado y podas de formación.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Planta frondosa y sana", "tiempo_dias": "7-150", "evitar": "Sequía prolongada", "notas": "Abonar según fase" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar frutos amarillos-crema con vetas moradas.", "materiales_paso": ["tijeras"], "indicadores": "Fruto dulce y aromático", "tiempo_dias": "150-180", "evitar": "Cosecha tardía → pulpa blanda", "notas": "Frutos muy delicados al manejo" }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 2,
      "dias_para_cosecha": 150
    }
  }, {
    "id": "maiz",
    "nombre": "Maíz",
    "nombreCientifico": "Zea mays L.",
    "descripcion": "El maíz es una gramínea anual de rápido crecimiento y alto requerimiento de sol y nutrientes. Es base alimentaria en Colombia: se cultiva como maíz dulce (choclo) para consumo fresco y como maíz seco para grano o harina.",
    "tags": ["maceta_grande", "facil", "calido", "templado", "Andina", "Caribe", "Orinoquia"],
    "dificultad": "Fácil",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Andina", "Caribe", "Orinoquia"],
      "nota": "Andina y Caribe son óptimas; en Orinoquía se adapta con riego estable; en Pacífica muy húmeda requiere drenaje y siembra escalonada."
    },
    "compatibilidades": ["frijol", "calabacin", "pepino_cohombro"],
    "incompatibilidades": [],
    "posicion": { "lat": 4.65, "lon": -74.1 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fmaiz.jpg?alt=media&token=3b84e0f3-f1ab-4c77-b037-3f582a40ac1c",
        "atribucion": {
          "text": "Imagen de Pexels en Pixabay",
          "link": "https://pixabay.com/photos/cornfield-cornfield-corn-cob-440338/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "aporque_casero",
      "asociacion_milpa_casera"
    ],
    "tipo_planta": "Gramínea anual",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "En siembra: aspersión ligera cada 1–2 días; en crecimiento cada 3 días; en floración y llenado cada 2 días. Evitar encharcamiento.",
      "luz_solar": "Pleno sol, exposición abierta sin sombra.",
      "ph_suelo": "5.5-7.5",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "0-2600 m",
      "epoca_siembra": "comienzo_epoca_lluvia",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_limoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado",
        "notas": "Raíces profundas; suelo suelto y fértil en profundidad; evitar suelos arcillosos compactos."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 25,
        "entre_plantas_cm_max": 40,
        "entre_surcos_cm": 80,
        "patron": "hileras en bloque para polinización"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiercol_bien_curado", "cal_dolomita_si_ph_bajo"],
        "refuerzos": ["NPK_balanceado_1m", "te_estiercol_1m", "te_compost_inicio_floracion", "ceniza_madera_inicio_floracion"],
        "restricciones": "[evitar_exceso_N_en_floracion, evitar_exceso_N_en_fructificacion]",
        "criticos": ["N", "P", "K", "Ca", "Mg", "B"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10 °C",
        "vida_util_dias_frio": "10-21 (dulce)", 
        "vida_util_dias_ambiente": "3-7 (dulce)",
        "notas": "En maíz seco: secar al sol hasta <15% humedad para almacenamiento. Proteger de gorgojos y roedores."
      }
    },
    "cicloVida": [
      {
        "etapa": "Siembra y germinación",
        "orden": 1,
        "duracion_dias_min": 6,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 8,
        "riego": { "frecuencia_dias": "1-2", "metodo": ["aspersion ligera", "surco ligero"], "notas": "Mantener humedad en capa superficial (5 cm). No encharcar." },
        "fertilizacion": { "momento_dias": 0, "notas": "Incorporar compost o estiércol en siembra." },
        "labores": ["Colocar 1–2 semillas a 3–5 cm de profundidad en bloques de hileras.", "Proteger de aves con cintas/espantapájaros."],
        "notas": "Semillas no germinan en suelos fríos (<16 °C).",
        "indicadores_cambio_fase": "Emergen brotes verdes (coleóptilos).",
        "objetivo_nutricional": "Activar embrión y enraizamiento inicial.",
        "alertas_plagas": ["gusanos_cortadores"]
      },
      {
        "etapa": "Plántula y crecimiento vegetativo",
        "orden": 2,
        "duracion_dias_min": 20,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": "3", "metodo": ["goteo", "manual"], "notas": "Riego constante sin charcos; mulch ayuda a conservar humedad." },
        "fertilizacion": { "momento_dias": 20, "notas": "Aporte de N (compost, estiércol diluido)." },
        "labores": ["Deshierbe temprano.", "Aporque a los 30–40 cm."],
        "notas": "Plantas vigorosas con hojas largas.",
        "indicadores_cambio_fase": "Aparecen las primeras panojas.",
        "objetivo_nutricional": "Acumular biomasa y tallos robustos.",
        "alertas_plagas": ["gusanos_de_alambre", "spodoptera (cogollero)"]
      },
      {
        "etapa": "Floración y polinización",
        "orden": 3,
        "duracion_dias_min": 45,
        "duracion_dias_max": 70,
        "duracion_dias_tipico": 60,
        "riego": { "frecuencia_dias": "2", "metodo": ["goteo", "manual"], "notas": "Etapa crítica: humedad constante para buen llenado." },
        "fertilizacion": { "momento_dias": 0, "notas": "Aporte P y K (ceniza, harina de hueso)." },
        "labores": ["Agrupar mínimo 4 hileras para polinización cruzada.", "Aporcar nuevamente si es necesario."],
        "notas": "Panojas liberan polen y barbas receptivas en espigas.",
        "indicadores_cambio_fase": "Granos cuajados en estado lechoso.",
        "objetivo_nutricional": "Favorecer cuaje con buen suministro de K.",
        "alertas_plagas": ["gusano_elotero", "chinche_maizera"]
      },
      {
        "etapa": "Llenado de grano",
        "orden": 4,
        "duracion_dias_min": 20,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": "2", "metodo": ["goteo"], "notas": "Mantener humedad pareja; estrés hídrico vacía mazorcas." },
        "fertilizacion": { "momento_dias": 15, "notas": "Refuerzo K para dulzor y llenado." },
        "labores": ["Vigilar plagas en barbas y espigas; reforzar tutorado si necesario."],
        "notas": "Mazorcas engordando y barbas secándose.",
        "indicadores_cambio_fase": "Mazorcas llenas con granos firmes.",
        "objetivo_nutricional": "Acumular almidón y azúcares.",
        "alertas_plagas": ["diatraea (barrenador)", "gorgojos_postcosecha"]
      },
      {
        "etapa": "Cosecha",
        "orden": 5,
        "duracion_dias_min": 90,
        "duracion_dias_max": 130,
        "duracion_dias_tipico": 110,
        "riego": { "frecuencia_dias": null, "metodo": ["manual"], "notas": "En esta fase no se fertiliza ni riega; sólo logística de cosecha." },
        "fertilizacion": { "momento_dias": null, "notas": "No se fertiliza; algunos aplican N al rastrojo." },
        "labores": ["Cortar mazorcas cuando las barbas estén secas (maíz seco) o en estado lechoso (dulce).", "Secar al sol si se almacenará grano."],
        "notas": "En maíz dulce, cosechar por la mañana y consumir en 24 h para máximo dulzor.",
        "indicadores_cambio_fase": "Mazorcas secas o en punto lechoso según tipo.",
        "objetivo_nutricional": "Finalizar ciclo y recolectar granos.",
        "alertas_plagas": ["gorgojos_almacenamiento"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_sacos",
        "nombre": "maceta/saco grande en bloque",
        "ambito": "maceta",
        "descripcion_corta": "Cultivo en sacos grandes agrupados para polinización adecuada.",
        "materiales": ["sacos 40–60 L", "50% suelo franco + 30% compost + 20% arena", "acolchado"],
        "herramientas": ["pala", "regadera", "tutores"],
        "notas_clave": "Sembrar mínimo 5 sacos juntos para polinización por viento.",
        "contenedor_volumen_min_L": 40,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "90-120",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sacos", "descripcion": "Llenar con mezcla de suelo+compost+arena y acolchado.", "materiales_paso": ["sacos", "compost", "arena"], "indicadores": "Sustrato aireado y con drenaje", "tiempo_dias": "0", "evitar": "Sustrato compacto", "notas": "Colocar en bloque de al menos 5 sacos" },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Colocar 1–2 semillas por saco a 3–5 cm de profundidad.", "materiales_paso": ["semillas", "regadera"], "indicadores": "Plántulas emergen en 7–10 días", "tiempo_dias": "0–10", "evitar": "Sembrar muy profundo", "notas": "Cubrir con capa ligera de tierra" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Agrupar sacos; riego parejo (más en floración); instalar tutores si necesario.", "materiales_paso": ["regadera", "tutores"], "indicadores": "Plantas erguidas con panojas", "tiempo_dias": "10–90", "evitar": "Aislar pocas macetas", "notas": "Mínimo 5 sacos juntos" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cosechar mazorcas a 90–120 días en estado lechoso.", "materiales_paso": ["tijeras"], "indicadores": "Mazorcas llenas y jugosas", "tiempo_dias": "90–120", "evitar": "Dejar hasta que se endurezcan", "notas": "Consumir pronto si es dulce" }
        ]
      },
      {
        "id": "jardin_bloque",
        "nombre": "jardín en bloque",
        "ambito": "jardin",
        "descripcion_corta": "Siembra en hileras en bloque para asegurar polinización y buen rendimiento.",
        "materiales": ["cama abonada", "compost", "semillas"],
        "herramientas": ["azada", "rastrillo", "regadera"],
        "notas_clave": "Siempre sembrar en bloque de ≥4 hileras para polinización por viento.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "100-130",
        "pasos": [
          { "orden": 1, "titulo": "Preparar suelo", "descripcion": "Arar y abonar con compost; formar camas o cuadros de 4 hileras.", "materiales_paso": ["compost", "azadón"], "indicadores": "Suelo fértil y mullido", "tiempo_dias": "0", "evitar": "Suelo duro y pobre", "notas": "Rotar con leguminosas" },
          { "orden": 2, "titulo": "Siembra", "descripcion": "Enterrar semillas a 3–5 cm y espaciar 25–30 cm entre plantas.", "materiales_paso": ["semillas"], "indicadores": "Plántulas emergen en 7–10 días", "tiempo_dias": "0–10", "evitar": "Siembra muy dispersa", "notas": "Bloque cerrado asegura polinización" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Deshierbe; aporque a 30–40 cm; riego profundo en floración y llenado.", "materiales_paso": ["azada", "regadera"], "indicadores": "Plantas vigorosas con panojas", "tiempo_dias": "10–100", "evitar": "Déficit de agua en floración", "notas": "Etapa crítica panoja-barbas" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar mazorcas a 100–130 días cuando barbas estén secas.", "materiales_paso": ["machete"], "indicadores": "Mazorcas llenas y firmes", "tiempo_dias": "100–130", "evitar": "Dejar granos duros", "notas": "Cosecha en la mañana mejora dulzor" }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 3,
      "dias_para_cosecha": 110
    }
  }, {
    "id": "pina",
    "nombre": "Piña",
    "nombreCientifico": "Ananas comosus (L.) Merr.",
    "descripcion": "La piña es una perenne tropical de roseta baja con hojas rígidas y espinosas. Produce un fruto compuesto muy apreciado fresco y en conservas.",
    "tags": ["maceta_grande", "medio", "calido", "Pacifica", "Caribe"],
    "dificultad": "Media",
    "clima": { "clase": ["calido"] },
    "region": {
      "principal": ["Pacifica", "Caribe"],
      "nota": "Óptima en Caribe/Pacífica. En Andina baja (valles de Santander/Valle) viable con suelos drenados y pH ácido. En Orinoquía/Amazonia requiere drenaje excelente."
    },
    "compatibilidades": ["lechuga", "cilantro"],
    "incompatibilidades": [],
    "posicion": { "lat": 7.1136, "lon": -73.2184 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpi%C3%B1a.jpg?alt=media&token=493757b9-fa28-4b4e-9ce9-b316ce40aeac",
        "atribucion": {
          "text": "Imagen de Antonia Lötscher-Juan en Pixabay",
          "link": "https://pixabay.com/es/photos/pineapple-fruit-food-fresh-1758677/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "sustrato_lowcost",
      "induccion_floral_casera",
      "propagacion_corona_hijuelos_casera"
    ],
    "tipo_planta": "Herbácea perenne",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "Ligero y frecuente en hijuelos; cada 7 días en crecimiento; constante en inducción floral y desarrollo de fruto. Suspender antes de cosecha.",
      "luz_solar": "Pleno sol; tolera semisombra ligera en calor extremo.",
      "ph_suelo": "4.5-6.5 (ácido)",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "0-1200 m",
      "epoca_siembra": "todo_el_año",
      "suelo": {
        "drenaje": "excelente",
        "textura": "arenoso o franco_arenoso",
        "materia_organica": "media",
        "retencion_agua": "baja",
        "notas": "Prefiere micro-lomas o camas elevadas para evitar pudrición."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 40,
        "entre_plantas_cm_max": 60,
        "entre_surcos_cm": 80,
        "patron": "hileras en cama"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "abono_organico"],
        "refuerzos": ["aportes_compost_3m", "aporte_P_K_antes_floracion", "enmienda_K_maduracion"],
        "restricciones": "[evitar_encharque, evitar_exceso_N]",
        "criticos": ["K", "P", "N", "Ca"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "10-15",
        "vida_util_dias_ambiente": "3-5",
        "notas": "No lavar antes de almacenar; manipular con cuidado para evitar magulladuras."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación/Enraizamiento",
        "orden": 1,
        "duracion_dias_min": 20,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 30,
        "riego": { "frecuencia_dias": 3, "metodo": ["aspersión ligera"], "notas": "Mantener humedad en hijuelos sin encharcar." },
        "fertilizacion": { "momento_dias": 0, "notas": "Sustrato con compost de base." },
        "labores": ["Seleccionar hijuelos; preparar camas o macetas."],
        "notas": "Etapa clave para asegurar raíces fuertes.",
        "indicadores_cambio_fase": "Plántulas firmes con raíces activas.",
        "objetivo_nutricional": "Activar raíces.",
        "alertas_plagas": ["hongos_sustrato"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 2,
        "duracion_dias_min": 300,
        "duracion_dias_max": 450,
        "duracion_dias_tipico": 365,
        "riego": { "frecuencia_dias": 7, "metodo": ["surcos", "goteo"], "notas": "No tolera encharque." },
        "fertilizacion": { "momento_dias": 60, "notas": "Aportes de compost o abono cada 2-3 meses." },
        "labores": ["Deshierbe", "aporque ligero."],
        "notas": "Planta forma roseta de hojas largas y rígidas.",
        "indicadores_cambio_fase": "Planta robusta con hojas completas.",
        "objetivo_nutricional": "Acumular biomasa.",
        "alertas_plagas": ["cochinilla", "ácaros"]
      },
      {
        "etapa": "Inducción floral",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 45,
        "riego": { "frecuencia_dias": 7, "metodo": ["surcos", "goteo"], "notas": "Riego constante en etapa crítica." },
        "fertilizacion": { "momento_dias": 0, "notas": "Aplicar fósforo y potasio previo a floración." },
        "labores": ["Monitoreo de plagas", "eliminación de hijuelos."],
        "notas": "Puede inducirse naturalmente o con prácticas caseras.",
        "indicadores_cambio_fase": "Inflorescencia central visible.",
        "objetivo_nutricional": "Estimular floración.",
        "alertas_plagas": ["trips", "ácaros"]
      },
      {
        "etapa": "Floración y cuajado",
        "orden": 4,
        "duracion_dias_min": 30,
        "duracion_dias_max": 50,
        "duracion_dias_tipico": 40,
        "riego": { "frecuencia_dias": 7, "metodo": ["goteo"], "notas": "Mantener humedad sin excesos." },
        "fertilizacion": { "momento_dias": 0, "notas": "Aporte ligero de microelementos." },
        "labores": ["Control de malezas", "proteger inflorescencia."],
        "notas": "Floración escalonada.",
        "indicadores_cambio_fase": "Flores abiertas visibles.",
        "objetivo_nutricional": "Nutrición reproductiva.",
        "alertas_plagas": ["trips", "fusarium"]
      },
      {
        "etapa": "Desarrollo y maduración del fruto",
        "orden": 5,
        "duracion_dias_min": 120,
        "duracion_dias_max": 180,
        "duracion_dias_tipico": 150,
        "riego": { "frecuencia_dias": 10, "metodo": ["surcos", "goteo"], "notas": "Reducir al final para mejorar dulzor." },
        "fertilizacion": { "momento_dias": 30, "notas": "Enmiendas orgánicas y potasio mensual." },
        "labores": ["Control de malezas", "monitoreo sanitario."],
        "notas": "Fruto engorda y cambia de color.",
        "indicadores_cambio_fase": "Fruto tamaño comercial y color amarillo.",
        "objetivo_nutricional": "Alto potasio para llenado.",
        "alertas_plagas": ["pudriciones", "cochinilla"]
      },
      {
        "etapa": "Cosecha",
        "orden": 6,
        "duracion_dias_min": 450,
        "duracion_dias_max": 600,
        "duracion_dias_tipico": 540,
        "riego": { "frecuencia_dias": null, "metodo": [], "notas": "Suspender riego antes del corte." },
        "fertilizacion": { "momento_dias": null, "notas": null },
        "labores": ["Corte manual de frutos con corona."],
        "notas": "Planta puede rebrotar con hijuelos.",
        "indicadores_cambio_fase": "Fruto completamente amarillo y aroma intenso.",
        "objetivo_nutricional": "Fruto dulce con alto brix.",
        "alertas_plagas": ["mosca_de_la_fruta"]
      }
    ],
    "metodos": [
      {
        "id": "maceta_grande",
        "nombre": "maceta grande",
        "ambito": "maceta",
        "descripcion_corta": "Cultivo de piña en maceta profunda de 15–25 L con corona o hijuelo.",
        "materiales": ["maceta 15–25 L", "50% fibra de coco + 30% compost + 20% arena", "acolchado mineral", "corona o hijuelo"],
        "herramientas": ["tijeras de poda", "cuchillo limpio", "regadera"],
        "notas_clave": "Necesita drenaje perfecto; crece lento (12–18 meses).",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "360-540",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar maceta profunda con mezcla aireada y acolchado.", "materiales_paso": ["maceta", "sustrato", "acolchado"], "indicadores": "Maceta lista con buen drenaje", "tiempo_dias": "0", "evitar": "Sustrato compacto → pudrición", "notas": "Ubicar a pleno sol" },
          { "orden": 2, "titulo": "Plantar corona/hijuelo", "descripcion": "Enterrar 3–5 cm dejando hojas externas visibles.", "materiales_paso": ["corona/hijuelo", "cuchillo limpio"], "indicadores": "Brotes firmes en 30–45 días", "tiempo_dias": "0-45", "evitar": "Enterrar demasiado profundo → pudrición", "notas": "Riego ligero al inicio" },
          { "orden": 3, "titulo": "Cuidados básicos", "descripcion": "Pleno sol, riego espaciado sin encharcar la base.", "materiales_paso": ["regadera"], "indicadores": "Hojas verdes y rígidas", "tiempo_dias": "45-300", "evitar": "Exceso de agua → hongos", "notas": "Paciencia: crecimiento lento" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cortar fruto a los 12–18 meses, cuando esté dorado y fragante.", "materiales_paso": ["tijeras de poda", "cuchillo"], "indicadores": "Fruto amarillo y aroma dulce", "tiempo_dias": "360-540", "evitar": "Cosecha tardía → sabor fermentado", "notas": "Fruto listo para consumo" }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardin",
        "ambito": "jardin",
        "descripcion_corta": "Camas arenosas y elevadas para evitar encharque; cosecha a los 14–20 meses.",
        "materiales": ["cama arenosa", "compost", "acolchado", "coronas o hijuelos"],
        "herramientas": ["azadón", "rastrillo", "cuchillo o machete"],
        "notas_clave": "Formar micro-lomas o camas elevadas para drenaje.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "420-600",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Arar suelo arenoso con compost y formar micro-lomas con acolchado.", "materiales_paso": ["azadón", "compost", "acolchado"], "indicadores": "Cama fértil y aireada", "tiempo_dias": "0", "evitar": "Suelo arcilloso → pudrición", "notas": "Drenaje clave para éxito" },
          { "orden": 2, "titulo": "Plantar corona/hijuelo", "descripcion": "Enterrar superficialmente dejando hojas externas visibles.", "materiales_paso": ["corona/hijuelo", "cuchillo"], "indicadores": "Plántulas firmes en 30–45 días", "tiempo_dias": "0-45", "evitar": "Plantación en hondonadas → exceso humedad", "notas": "Planta estable y enraizada" },
          { "orden": 3, "titulo": "Crecimiento prolongado", "descripcion": "Mantener sol pleno; riegos ligeros en sequía; poco agua en climas frescos.", "materiales_paso": ["regadera"], "indicadores": "Plantas vigorosas con hijuelos", "tiempo_dias": "45-400", "evitar": "Exceso de riego → hongos", "notas": "Plantas robustas y activas" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Cosechar a los 14–20 meses cuando fruto esté dorado y aromático.", "materiales_paso": ["cuchillo", "machete"], "indicadores": "Fruto maduro y fragante", "tiempo_dias": "420-600", "evitar": "Cosecha temprana → fruta ácida", "notas": "Piña lista para consumo" }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 7,
      "dias_para_cosecha": 540
    }
  }, {
    "id": "frijol",
    "nombre": "Frijol",
    "nombreCientifico": "Phaseolus vulgaris L.",
    "descripcion": "El frijol es una leguminosa anual originaria de América, cultivada tanto por sus vainas tiernas como por su grano seco. Es clave en la dieta latinoamericana y en la rotación de cultivos por su capacidad de fijar nitrógeno.",
    "tags": ["maceta_mediana", "medio", "calido", "templado", "Andina", "Caribe", "Orinoquia"],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Andina", "Caribe", "Orinoquia"],
      "nota": "Óptimo en Andina y Caribe; viable en Orinoquía con riego estable. Pacífica muy húmeda: solo en suelos drenados y con tutorado."
    },
    "compatibilidades": ["maiz", "calabacin", "pepino_cohombro"],
    "incompatibilidades": [],
    "posicion": { "lat": 4.149, "lon": -74.885 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ffrijol.jpg?alt=media&token=889fa1cc-4461-43aa-a7b8-c68a52e15570",
        "atribucion": {
          "text": "Imagen de Couleur en Pixabay",
          "link": "https://pixabay.com/photos/beans-vegetables-food-plant-green-112368/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "aporque_casero",
      "asociacion_milpa_casera",
      "inoculacion_rhizobium_casera"
    ],
    "tipo_planta": "Leguminosa anual",
    "tecnica": {
      "temperatura_ideal": "18-30 °C",
      "riego": "Aspersión ligera al inicio cada 1–2 días; luego cada 3 días; crítico mantener humedad en floración y llenado de vainas.",
      "luz_solar": "Pleno sol, 8–10 h diarias.",
      "ph_suelo": "5.5-7.5",
      "humedad_ideal": "60-80 %",
      "altitud_ideal": "0-2600 m",
      "epoca_siembra": "inicio_lluvias",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_limoso",
        "materia_organica": "media",
        "retencion_agua": "moderada",
        "notas": "Responde bien a suelos mullidos; evitar arcillosos compactos."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 20,
        "entre_plantas_cm_max": 30,
        "entre_surcos_cm": 50,
        "patron": "hileras o bloques"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol curado"],
        "refuerzos": ["inoculación_rhizobium", "té_compost_20d", "abonado_K_Ca_en_floración"],
        "restricciones": "[evitar_exceso_N_químico]",
        "criticos": ["N", "K", "Ca", "P"]
      },
      "post_cosecha": {
        "temperatura_ideal": "10-12 °C",
        "vida_util_dias_frio": "10-20 (grano seco)", 
        "vida_util_dias_ambiente": "3-5 (vaina verde)",
        "notas": "Secar granos al sol hasta <13% humedad; almacenar en recipientes herméticos para evitar gorgojos."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 5,
        "duracion_dias_max": 10,
        "duracion_dias_tipico": 7,
        "riego": { "frecuencia_dias": 2, "metodo": ["aspersión ligera"], "notas": "Mantener humedad uniforme, no encharcar." },
        "fertilizacion": { "momento_dias": null, "notas": "Semilla vigorosa no requiere fertilización inicial." },
        "labores": ["Siembra directa a 2–3 cm de profundidad; proteger de aves."],
        "notas": "Emergencia rápida (5–7 días).",
        "indicadores_cambio_fase": "Cotiledones emergidos.",
        "objetivo_nutricional": "Activar plántula.",
        "alertas_plagas": ["hongos_suelo"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 2,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": 3, "metodo": ["surcos", "goteo"], "notas": "Requiere humedad constante." },
        "fertilizacion": { "momento_dias": 20, "notas": "Aplicar compost o bocashi." },
        "labores": ["Deshierbe temprano.", "Tutorado o aporque en variedades trepadoras."],
        "notas": "Planta desarrolla follaje abundante.",
        "indicadores_cambio_fase": "Aparición de guías y ramas.",
        "objetivo_nutricional": "Producir hojas y tallos.",
        "alertas_plagas": ["pulgones", "trips"]
      },
      {
        "etapa": "Floración y fructificación",
        "orden": 3,
        "duracion_dias_min": 30,
        "duracion_dias_max": 40,
        "duracion_dias_tipico": 35,
        "riego": { "frecuencia_dias": 3, "metodo": ["goteo", "surcos"], "notas": "Necesita más agua en floración." },
        "fertilizacion": { "momento_dias": 30, "notas": "Fertilizante rico en K y Ca." },
        "labores": ["Tutorar guías, polinización asistida si es necesario, deshoje ligero."],
        "notas": "Floración abundante con formación de vainas pequeñas.",
        "indicadores_cambio_fase": "Flores abiertas y vainas cuajadas.",
        "objetivo_nutricional": "Nutrir flores y formación de vainas.",
        "alertas_plagas": ["trips", "mosca_blanca"]
      },
      {
        "etapa": "Cosecha",
        "orden": 4,
        "duracion_dias_min": 60,
        "duracion_dias_max": 90,
        "duracion_dias_tipico": 75,
        "riego": { "frecuencia_dias": null, "metodo": [], "notas": "Suspender riego antes de cosecha." },
        "fertilizacion": { "momento_dias": null, "notas": null },
        "labores": ["Recolección manual de vainas verdes o secas según el uso."],
        "notas": "Dependiendo del tipo, se cosecha como vaina tierna (60–70 días) o como grano seco (90 días).",
        "indicadores_cambio_fase": "Vainas llenas y tiernas o secas.",
        "objetivo_nutricional": "Finalizar producción en vainas.",
        "alertas_plagas": ["oídio", "antracnosis"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta (arbustivo)",
        "ambito": "maceta",
        "descripcion_corta": "Variedades enanas en contenedor mediano; cosecha de vainas tiernas.",
        "materiales": ["maceta 10–15 L", "60% fibra coco + 30% compost + 10% arena", "semillas arbustivas"],
        "herramientas": ["regadera", "punzón"],
        "notas_clave": "Riego parejo sin encharcar.",
        "contenedor_volumen_min_L": 10,
        "requisitos_ambiente": { "temperatura_C": "18-30 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "65-115",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Usar maceta 10–15 L con mezcla aireada y drenante.", "materiales_paso": ["maceta", "sustrato"], "indicadores": "Sustrato mullido y drenado", "tiempo_dias": "0", "evitar": "Sustrato compacto → hongos", "notas": "Maceta lista para siembra" },
          { "orden": 2, "titulo": "Siembra directa", "descripcion": "Sembrar 2–3 semillas, cubrir 2–3 cm y ralear dejando 1–2 plantas.", "materiales_paso": ["semillas", "punzón"], "indicadores": "Plántulas firmes en 5–10 días", "tiempo_dias": "0–10", "evitar": "Siembra profunda → no germina", "notas": "Raleo asegura plantas vigorosas" },
          { "orden": 3, "titulo": "Crecimiento vegetativo", "descripcion": "Riego parejo sin encharcar; ubicar a sol pleno.", "materiales_paso": ["regadera"], "indicadores": "Hojas verdes y tallos fuertes", "tiempo_dias": "10–50", "evitar": "Exceso agua → hojas amarillas", "notas": "Follaje listo para floración" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar vainas verdes y tiernas entre 65–115 días.", "materiales_paso": ["tijeras"], "indicadores": "Vainas verdes y carnosas", "tiempo_dias": "65–115", "evitar": "Cosecha tardía → vainas fibrosas", "notas": "Planta sigue produciendo tras cortes" }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardín (enrejado/enrame)",
        "ambito": "jardin",
        "descripcion_corta": "Variedades trepadoras con malla; alto rendimiento por planta.",
        "materiales": ["cama con compost", "malla espaldera/estacas", "acolchado", "semillas"],
        "herramientas": ["azadín", "estacas", "regadera"],
        "notas_clave": "Sembrar en bloques para buen cuaje; guiado a la malla.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "18-32 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "60-110",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Formar cama fértil con compost e instalar malla o estacas.", "materiales_paso": ["azadín", "compost", "malla"], "indicadores": "Suelo suelto y fértil", "tiempo_dias": "0", "evitar": "Suelo compacto → raíces débiles", "notas": "Malla es clave en trepadoras" },
          { "orden": 2, "titulo": "Siembra directa", "descripcion": "Sembrar en bloques de 4–5 semillas, ralear a 2–3 por sitio.", "materiales_paso": ["semillas"], "indicadores": "Plántulas emergen en 5–10 días", "tiempo_dias": "0–10", "evitar": "Siembra aislada → baja polinización", "notas": "Raleo evita competencia" },
          { "orden": 3, "titulo": "Crecimiento y guiado", "descripcion": "Regar profundo en floración; guiar tallos a la malla.", "materiales_paso": ["regadera"], "indicadores": "Guías trepando con vigor", "tiempo_dias": "10–50", "evitar": "Sin soporte → tallos quebrados", "notas": "Plantas listas para floración" },
          { "orden": 4, "titulo": "Cosecha", "descripcion": "Recolectar vainas tiernas entre 60–110 días.", "materiales_paso": ["tijeras"], "indicadores": "Vainas carnosas y verdes", "tiempo_dias": "60–110", "evitar": "Cosecha tardía → semillas duras", "notas": "Planta sigue produciendo si se corta a tiempo" }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 3,
      "dias_para_cosecha": 75
    }
  }, {
    "id": "pimenton",
    "nombre": "Pimentón",
    "nombreCientifico": "Capsicum annuum L. var. grossum",
    "descripcion": "El pimentón, también llamado pimiento morrón o pimiento dulce, es una hortaliza de la familia Solanaceae. Produce frutos grandes y dulces, ricos en vitamina C. Se adapta bien a climas cálidos o templados con humedad constante y buen drenaje.",
    "tags": ["maceta_mediana", "medio", "calido", "templado", "Andina", "Caribe"],
    "dificultad": "Media",
    "clima": { "clase": ["calido", "templado"] },
    "region": {
      "principal": ["Andina", "Caribe"],
      "nota": "Óptimo en Andina; en Caribe viable con riego y tutorado. En Pacífica húmeda usar camas elevadas y ventilación; Orinoquía/Amazonia solo en microclimas."
    },
    "compatibilidades": ["lechuga", "aji_dulce", "albahaca", "oregano", "tomate_cherry"],
    "incompatibilidades": ["espinaca", "cebolla_larga"],
    "posicion": { "lat": 3.5394, "lon": -76.3035 },
    "imagenes": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Fpimenton.jpg?alt=media&token=fa2e42ba-335c-45e5-a43d-8bb5b965b207",
        "atribucion": {
          "text": "Imagen de NoName_13 en Pixabay",
          "link": "https://pixabay.com/es/photos/paprika-paprika-paprika-paprika-1539491/"
        }
      }
    ],
    "articulosRelacionados": [
      "arranque_P_casero",
      "N_vegetativo_casero",
      "riego_goteo_casero",
      "alto_k_casero",
      "Ca_B_floracion_casero",
      "acolchado_antihongos_casero",
      "sustrato_lowcost",
      "tutorado_casero"
    ],
    "tipo_planta": "Herbácea perenne (cultivada como anual en huerta)",
    "tecnica": {
      "temperatura_ideal": "20-30 °C",
      "riego": "Riego en la base; cada 2–3 días en vegetativo y más frecuente en floración/fructificación. Evitar mojar follaje.",
      "luz_solar": "Pleno sol (6–8 h). En calor extremo (>35 °C) conviene malla ligera de sombra por la tarde.",
      "ph_suelo": "5.5-7.0",
      "humedad_ideal": "60-75 %",
      "altitud_ideal": "0-1500 m",
      "epoca_siembra": "all_year_round",
      "suelo": {
        "drenaje": "bien_drenado",
        "textura": "franco_arenoso",
        "materia_organica": "alta",
        "retencion_agua": "moderado_alto",
        "notas": "No soporta saturación prolongada; evitar fatiga de suelo por solanáceas. Rotar cada 2–3 años."
      },
      "espaciamiento": {
        "entre_plantas_cm_min": 30,
        "entre_plantas_cm_max": 50,
        "entre_surcos_cm": 80,
        "patron": "filas"
      },
      "nutricion": {
        "enmiendas_fondo": ["compost", "estiércol curado", "harina de huesos", "ceniza de madera", "cal dolomita si pH bajo"],
        "refuerzos": ["10-30-10 o 15-15-15 a los 15 días", "gallinaza curtida a las 4–6 sem", "té de compost/estiércol", "inicio fructificación alto K (12-6-24 o sulfato potasio)", "calcio regular (nitrato de Ca o yeso)", "compost a mitad de ciclo", "foliar micros (B, Zn, Mo) mensual"],
        "restricciones": "[evitar_exceso_N_en_floracion, evitar_exceso_N_en_fructificacion, evitar_salinidad, usar_dosis_bajas_frecuentes]",
        "criticos": ["Ca", "K", "N", "Mg", "P", "B", "Zn"]
      },
      "post_cosecha": {
        "temperatura_ideal": "8-10 °C",
        "vida_util_dias_frio": "10-15",
        "vida_util_dias_ambiente": "3-7",
        "notas": "No lavar antes de almacenar. Frutos delicados a golpes."
      }
    },
    "cicloVida": [
      {
        "etapa": "Germinación",
        "orden": 1,
        "duracion_dias_min": 15,
        "duracion_dias_max": 35,
        "duracion_dias_tipico": 20,
        "riego": { "frecuencia_dias": 1, "metodo": ["aspersión fina"], "notas": "Mantener sustrato húmedo, no encharcado." },
        "fertilizacion": { "momento_dias": null, "notas": "No requiere; semilla aporta reservas." },
        "labores": ["Sembrar a 0.5–1 cm de profundidad en semillero protegido."],
        "notas": "Emergencia lenta en clima frío.",
        "indicadores_cambio_fase": "Plántulas con 2 hojas verdaderas.",
        "objetivo_nutricional": "Activar embrión.",
        "alertas_plagas": ["damping_off"]
      },
      {
        "etapa": "Plántula",
        "orden": 2,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": 2, "metodo": ["aspersión ligera"], "notas": "Evitar exceso de humedad." },
        "fertilizacion": { "momento_dias": 20, "notas": "Fertilizante balanceado o compost ligero." },
        "labores": ["Trasplante a maceta o campo cuando tengan 4–6 hojas."],
        "notas": "Necesita tutorado temprano.",
        "indicadores_cambio_fase": "Plántula firme y tallo engrosado.",
        "objetivo_nutricional": "Formar raíz y tallo vigoroso.",
        "alertas_plagas": ["mosca_blanca"]
      },
      {
        "etapa": "Crecimiento vegetativo",
        "orden": 3,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": 3, "metodo": ["goteo", "surcos"], "notas": "Mayor demanda hídrica tras trasplante." },
        "fertilizacion": { "momento_dias": 20, "notas": "Compost o NPK balanceado." },
        "labores": ["Tutorado ligero", "deshierbe", "podas de brotes débiles."],
        "notas": "Hojas verdes, tallo engrosado.",
        "indicadores_cambio_fase": "Ramas nuevas visibles.",
        "objetivo_nutricional": "Nutrición foliar para hojas y tallos.",
        "alertas_plagas": ["trips", "pulgones"]
      },
      {
        "etapa": "Floración",
        "orden": 4,
        "duracion_dias_min": 20,
        "duracion_dias_max": 30,
        "duracion_dias_tipico": 25,
        "riego": { "frecuencia_dias": 3, "metodo": ["goteo"], "notas": "No debe faltar agua." },
        "fertilizacion": { "momento_dias": 0, "notas": "Aplicar fósforo y calcio." },
        "labores": ["Control de polinizadores", "podas ligeras."],
        "notas": "Floración abundante.",
        "indicadores_cambio_fase": "Caída de pétalos y formación de ovarios.",
        "objetivo_nutricional": "Nutrición reproductiva.",
        "alertas_plagas": ["mosca_blanca", "mildiu"]
      },
      {
        "etapa": "Fructificación y maduración",
        "orden": 5,
        "duracion_dias_min": 40,
        "duracion_dias_max": 60,
        "duracion_dias_tipico": 50,
        "riego": { "frecuencia_dias": 3, "metodo": ["goteo"], "notas": "Aumentar agua en fructificación." },
        "fertilizacion": { "momento_dias": 15, "notas": "Fertilizante rico en K y Ca." },
        "labores": ["Tutorar", "retirar frutos débiles."],
        "notas": "Frutos cambian de verde a rojo/amarillo.",
        "indicadores_cambio_fase": "Color y tamaño adecuados.",
        "objetivo_nutricional": "Aporte de potasio.",
        "alertas_plagas": ["pudriciones", "trips"]
      },
      {
        "etapa": "Cosecha",
        "orden": 6,
        "duracion_dias_min": 90,
        "duracion_dias_max": 130,
        "duracion_dias_tipico": 110,
        "riego": { "frecuencia_dias": null, "metodo": [], "notas": "Reducir riego antes de cosecha." },
        "fertilizacion": { "momento_dias": null, "notas": null },
        "labores": ["Cosechar frutos verdes o maduros según preferencia."],
        "notas": "Cosecha escalonada por varias semanas.",
        "indicadores_cambio_fase": "Frutos firmes, color uniforme.",
        "objetivo_nutricional": "Finalizar frutos de calidad.",
        "alertas_plagas": ["antracnosis", "mosca_blanca"]
      }
    ],
    "metodos": [
      {
        "id": "maceta",
        "nombre": "maceta con tutor",
        "ambito": "maceta",
        "descripcion_corta": "Planta compacta con soporte; cosecha escalonada verde o madura.",
        "materiales": ["maceta 15–20 L", "60% coco + 30% compost + 10% arena", "tutor", "plantín"],
        "herramientas": ["estaca", "tijeras", "regadera"],
        "notas_clave": "Riego constante sin encharque; tutor indispensable.",
        "contenedor_volumen_min_L": 15,
        "requisitos_ambiente": { "temperatura_C": "20-30 °C", "horas_luz": "10-12 h" },
        "tiempo_estimado_cosecha_dias": "85-120",
        "pasos": [
          { "orden": 1, "titulo": "Preparar maceta", "descripcion": "Llenar con mezcla aireada y colocar tutor firme.", "materiales_paso": ["maceta", "sustrato", "tutor"], "indicadores": "Sustrato mullido y tutor firme", "tiempo_dias": "0", "evitar": "Sustrato compacto", "notas": "Ubicar a pleno sol" },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar al centro, cubrir raíces, regar suave.", "materiales_paso": ["plantín", "regadera"], "indicadores": "Planta erguida y sin inclinación", "tiempo_dias": "0-15", "evitar": "Trasplante profundo", "notas": "Trasplantar en horas frescas" },
          { "orden": 3, "titulo": "Manejo vegetativo", "descripcion": "Riego constante sin encharcar; podar brotes débiles.", "materiales_paso": ["regadera", "tijeras"], "indicadores": "Follaje verde intenso", "tiempo_dias": "15-60", "evitar": "Exceso de agua", "notas": "Planta lista para floración" },
          { "orden": 4, "titulo": "Floración y cuaje", "descripcion": "Retirar frutos pequeños en plantas débiles; polinización manual opcional.", "materiales_paso": ["tijeras", "regadera"], "indicadores": "Frutos bien formados", "tiempo_dias": "60-85", "evitar": "Falta polinización", "notas": "Pleno sol y riego parejo" },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cosechar frutos verdes o maduros de 85–120 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos firmes y brillantes", "tiempo_dias": "85-120", "evitar": "Cosecha tardía", "notas": "Cosecha escalonada" }
        ]
      },
      {
        "id": "jardin",
        "nombre": "jardín",
        "ambito": "jardin",
        "descripcion_corta": "Cantero fértil con tutorado; producción prolongada.",
        "materiales": ["cama fértil con compost", "acolchado", "estacas/malla", "plantines"],
        "herramientas": ["azadón", "estacas", "regadera"],
        "notas_clave": "Riego en la base; tutorado temprano evita daños.",
        "contenedor_volumen_min_L": 0,
        "requisitos_ambiente": { "temperatura_C": "20-32 °C", "horas_luz": "8-10 h" },
        "tiempo_estimado_cosecha_dias": "90-130",
        "pasos": [
          { "orden": 1, "titulo": "Preparar cama", "descripcion": "Formar cama con compost; acolchado; instalar tutores o malla.", "materiales_paso": ["azadón", "compost", "acolchado", "tutores"], "indicadores": "Suelo fértil con soporte", "tiempo_dias": "0", "evitar": "Suelo compacto", "notas": "Cama lista para trasplante" },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Plantar con 40–50 cm entre plantas; regar profundo.", "materiales_paso": ["plantines", "regadera"], "indicadores": "Plantas erguidas y firmes", "tiempo_dias": "0-15", "evitar": "Trasplante deficiente", "notas": "Mejor al atardecer" },
          { "orden": 3, "titulo": "Manejo vegetativo", "descripcion": "Riego en la base; aireación y guiar ramas.", "materiales_paso": ["regadera", "estacas"], "indicadores": "Plantas sanas con botones florales", "tiempo_dias": "15-70", "evitar": "Exceso humedad", "notas": "Podas ligeras favorecen aireación" },
          { "orden": 4, "titulo": "Floración y fructificación", "descripcion": "Mantener humedad; retirar frutos débiles; proteger de plagas.", "materiales_paso": ["tijeras", "regadera"], "indicadores": "Frutos cuajando uniformes", "tiempo_dias": "70-90", "evitar": "Falta de riego", "notas": "Frutos visibles en desarrollo" },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cosechar frutos verdes o maduros entre 90–130 días.", "materiales_paso": ["tijeras"], "indicadores": "Frutos grandes y firmes", "tiempo_dias": "90-130", "evitar": "Cosecha muy tardía", "notas": "Plantas siguen produciendo tras corte" }
        ]
      },
      {
        "id": "hidroponia",
        "nombre": "hidroponía (NFT/goteo)",
        "ambito": "hidroponia",
        "descripcion_corta": "Producción continua en sistemas controlados.",
        "materiales": ["baldes con coco/perlita o NFT ancho", "vasos malla", "solución nutritiva"],
        "herramientas": ["bomba", "medidor pH/EC", "tijeras"],
        "notas_clave": "Mantener pH 5.8–6.2; EC baja al inicio; tutorar con cuerdas; polinizar suavemente.",
        "contenedor_volumen_min_L": 12,
        "requisitos_ambiente": { "temperatura_C": "22-30 °C", "horas_luz": "12-14 h" },
        "tiempo_estimado_cosecha_dias": "70-110",
        "pasos": [
          { "orden": 1, "titulo": "Preparar sistema", "descripcion": "Instalar baldes/NFT con sustrato inerte y solución inicial.", "materiales_paso": ["balde/NFT", "sustrato", "solución nutritiva"], "indicadores": "Sistema limpio y estable", "tiempo_dias": "0", "evitar": "pH desbalanceado", "notas": "Listo para trasplante" },
          { "orden": 2, "titulo": "Trasplante", "descripcion": "Colocar plantín en vaso malla; iniciar goteo suave.", "materiales_paso": ["plantín", "bomba", "aireador"], "indicadores": "Raíces visibles y planta adaptada", "tiempo_dias": "0-12", "evitar": "Plántula muy pequeña", "notas": "Planta erguida y firme" },
          { "orden": 3, "titulo": "Manejo vegetativo", "descripcion": "Mantener pH 5.8–6.2; tutorar con cuerdas; ajustar nutrientes semanal.", "materiales_paso": ["medidor pH/EC", "cuerdas"], "indicadores": "Hojas verdes y crecimiento rápido", "tiempo_dias": "12-50", "evitar": "EC alta", "notas": "Planta lista para floración" },
          { "orden": 4, "titulo": "Floración y cuaje", "descripcion": "Ventilar; polinización manual opcional; retirar frutos débiles.", "materiales_paso": ["tijeras"], "indicadores": "Frutos uniformes y sanos", "tiempo_dias": "50-70", "evitar": "Mala polinización", "notas": "Frutos bien formados" },
          { "orden": 5, "titulo": "Cosecha", "descripcion": "Cosechar frutos entre 70–110 días, verdes o maduros.", "materiales_paso": ["tijeras"], "indicadores": "Frutos firmes y brillantes", "tiempo_dias": "70-110", "evitar": "Cosecha tardía", "notas": "Cosecha continua escalonada" }
        ]
      }
    ],
    "datos_programaticos": {
      "frecuencia_riego_dias": 3,
      "dias_para_cosecha": 110
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
