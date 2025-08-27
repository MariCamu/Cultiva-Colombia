
'use server';

// AÑADIDO: Cargar las variables de entorno antes que cualquier otra cosa.
import { config } from 'dotenv';
config();

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
    "nombre": "Lechuga",
    "nombreCientifico": "Lactuca sativa",
    "descripcion": "La lechuga (Lactuca sativa) es una planta anual de la familia Asteraceae cultivada como verdura de hoja. Se utiliza principalmente en ensaladas por su textura y frescura.",
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
      "nota": "Andina (óptimo). Caribe/Pacífica: viable con sombra 30–40% y riego frecuente; Orinoquía/Amazonia: en microclimas frescos o invernadero."
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
      "pepino_de_maracuya",
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
    "imagenes": [{
      "url": "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Flechuga.jpg?alt=media&token=fdf580f3-6e74-4e0a-8047-34dfaa7ef4a3",
      "atribucion": {
        "text": "Image by jcomp on Freepik",
        "link": "https://www.freepik.com/free-photo/green-salad-that-is-ready-be-harvested-garden_5490731.htm"
      }
    }],
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
        "tiempo_estimado_cosecha_dias": "35-55",
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
  }
]
