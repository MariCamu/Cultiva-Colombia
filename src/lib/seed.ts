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

const pestsAndDiseasesData: Pest[] = [
    {
      id: "pulgones", // Este es el ID del documento
      slug: "pulgones",
      nombreComun: "Pulgones",
      nombreCientifico: "Aphididae spp.",
      tipo: "insecto",
      descripcion: "Chupadores de savia; colonias en brotes tiernos y enves de hojas; excretan melaza y transmiten virus.",
      danos: "Enrulado, clorosis, retraso de crecimiento, fumagina sobre melaza; vectores de virosis.",
      cultivosAfectados: ['lechuga', 'cilantro', 'fresa', 'cebolla-larga', 'aj-dulce', 'pepino-cohombro', 'albahaca', 'espinaca', 'hierbabuena', 'calabacn', 'perejil', 'rbano', 'tomate-cherry', 'organo', 'acelga', 'pepino-dulce', 'frijol', 'pimentn', 'yuca_dulce'],
      prevencion: ["Monitoreo del enves", "Control de hormigas", "Asociacion con aromaticas (ajo/cebolla/calendula)"],
      solucion: "Jabon potasico o aceite de neem; liberar depredadores (mariquitas, sirfidos); retirar focos.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Pestes%2Fpulgon.jpg?alt=media&token=c27e2a39-c5d0-4e31-897d-6062cc8f0f0c", 
      dataAiHint: "aphids on plant" 
    },
    // --- PEGA AQUÍ EL RESTO DE TUS DATOS DE PLAGAS ---
];


async function seedPestsAndDiseases() {
  if (pestsAndDiseasesData.length === 0) {
    console.log('No hay datos de plagas para sembrar. Saltando...');
    return;
  }
    
  const collectionRef = collection(db, 'plagas_y_enfermedades');
  console.log(`Iniciando siembra de ${pestsAndDiseasesData.length} plagas y enfermedades...`);

  const batch = writeBatch(db);
  pestsAndDiseasesData.forEach(pestData => {
    // Usar el campo `id` de tus datos como el ID del documento.
    const docRef = doc(collectionRef, pestData.id); 
    
    // Crear un nuevo objeto sin el campo 'slug' para no guardarlo en Firestore
    const { slug, ...dataToSave } = pestData;
    
    batch.set(docRef, dataToSave);
  });

  try {
    await batch.commit();
    console.log(`Lote de ${pestsAndDiseasesData.length} documentos de plagas subido exitosamente.`);
  } catch (error) {
    console.error("Error al subir lote de plagas a Firestore:", error);
  }
}

// --- DATOS PARA GUÍAS EDUCATIVAS ---
// IMPORTANTE: Asegúrate de que cada objeto tenga un campo "id" único.
const educationalGuidesData: EducationalGuideDocument[] = [ 
  {
    "id": "01_suelo_franco",
    "titulo": "🌿 Guía práctica: Cómo preparar un suelo franco",
    "subtitulo": "La base perfecta para que tus plantas crezcan felices",
    "descripcion": "El suelo franco es equilibrado: ni muy duro como la arcilla ni muy suelto como la arena. Tiene buena aireación, retiene agua y es fértil.",
    "materiales": [
      "Compost o estiércol bien curado",
      "Arena de río",
      "Hojarasca triturada o cascarilla de arroz",
      "Fibra de coco (opcional)",
      "Cal dolomita (si pH < 6)",
      "Yeso agrícola (opcional en suelos arcillosos)",
      "Herramientas: pala, azadón, rastrillo"
    ],
    "pasos": [
      "Retira piedras y raíces.",
      "Afloja 20–30 cm de suelo.",
      "Mezcla compost (20–30%).",
      "Si arcilloso: +10–20% arena + 5–10% hojarasca.",
      "Si arenoso: +10–20% compost extra + 5–10% fibra de coco.",
      "Nivela con ligera panza al centro.",
      "Riega suave y deja 24–48 h."
    ],
    "exito": [
      "Al apretar, el suelo forma un bollo que se desmorona fácil.",
      "Drena sin charcos.",
      "Raíces blancas y finas tras 1–2 semanas."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "02_sustrato_aireado",
    "titulo": "🪴 Guía práctica: Sustrato aireado casero",
    "subtitulo": "Macetas con buen drenaje y humedad justa",
    "descripcion": "Mezcla casera de coco, compost y arena/perlita que drena bien y mantiene la humedad según el tamaño de la maceta.",
    "materiales": [
      "Fibra de coco",
      "Compost maduro",
      "Arena de río o perlita",
      "Carbón vegetal fino o cascarilla de arroz",
      "Grava para el fondo"
    ],
    "pasos": [
      "Verifica que la maceta tenga orificios.",
      "Coloca 2–3 cm de grava en el fondo.",
      "Maceta pequeña (3–7 L): 60% coco + 40% compost.",
      "Mediana (8–15 L): 50% coco + 40% compost + 10% arena.",
      "Grande (20+ L): 45% coco + 35% compost + 10% arena + 10% cascarilla/carbón.",
      "Llena sin compactar y riega suave."
    ],
    "exito": [
      "Agua infiltra sin charcos.",
      "Maceta no suda por debajo mucho tiempo.",
      "Raíces blancas y sanas a 2–3 semanas."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "03_acolchado_organico",
    "titulo": "🌾 Guía práctica: Acolchado orgánico",
    "subtitulo": "Protege el suelo, conserva humedad y evita malezas",
    "descripcion": "El acolchado es una capa protectora (mulch) que cubre el suelo, conserva la humedad, reduce salpicaduras y favorece la vida microbiana.",
    "materiales": [
      "Paja seca",
      "Hojas secas trituradas",
      "Cascarilla de arroz",
      "Cartón corrugado o mulch biodegradable"
    ],
    "pasos": [
      "Riega el suelo antes de colocar el acolchado.",
      "Distribuye material en 3–5 cm (2–3 cm en macetas pequeñas).",
      "Deja 2–3 cm libres alrededor del cuello/corona.",
      "Reponer cada 4–8 semanas."
    ],
    "exito": [
      "Menos manchas foliares.",
      "Suelo fresco y húmedo.",
      "Menos riego necesario."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "04_siembra_hileras",
    "titulo": "🌱 Guía práctica: Siembra en hileras",
    "subtitulo": "Siembra directa con orden y buen espacio",
    "descripcion": "Técnica sencilla para sembrar hortalizas en hileras con espaciamiento uniforme y aclareo posterior.",
    "materiales": [
      "Semillas (rábano, cilantro, espinaca, acelga)",
      "Compost",
      "Paja/hojarasca (acolchado fino)",
      "Herramientas: cuerda, palín, regadera"
    ],
    "pasos": [
      "Afloja 20–30 cm de suelo con 10–30% compost.",
      "Marca líneas con cuerda.",
      "Siembra 2–3 semillas cada 3–5 cm en surcos poco profundos.",
      "Cubre 0.5–1 cm de tierra.",
      "Riega suave y mantén humedad.",
      "Aclara cuando tengan 2–3 hojas."
    ],
    "exito": [
      "Emergencia uniforme en 7–14 días.",
      "Plantas con espacio y sin competencia."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","cebolla-larga","rbano","calabacn","pepino-cohombro","maz","frijol"]
  },
  {
    "id": "05_maceta_hojas",
    "titulo": "🪴 Guía práctica: Maceta para hortalizas de hoja",
    "subtitulo": "Ideal para balcones y terrazas",
    "descripcion": "Prepara macetas aireadas para iniciar cultivos de hoja como lechuga, cilantro o acelga baby.",
    "materiales": [
      "Maceta ≥25 cm con orificios",
      "60% coco + 40% compost",
      "Grava para el fondo"
    ],
    "pasos": [
      "Coloca 2–3 cm de grava en el fondo.",
      "Llena con mezcla coco + compost y humedece.",
      "Siembra 2–3 semillas por punto a 0.5–1 cm.",
      "Mantén humedad constante sin encharcar.",
      "Aclara dejando 10–15 cm según especie."
    ],
    "exito": [
      "Brotes verdes, compactos y turgentes.",
      "Crecimiento uniforme."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","oregano","cebolla-larga"]
  },
  {
    "id": "06_hidroponia_kratky",
    "titulo": "💧 Guía práctica: Hidroponía casera (Kratky)",
    "subtitulo": "Sistema sin bombas ni electricidad",
    "descripcion": "Método simple para cultivar hojas en botellas o recipientes cerrados, con solución nutritiva y cámara de aire.",
    "materiales": [
      "Botella PET o balde con tapa",
      "Vasos malla",
      "Medio inerte (esponja, lana de roca, coco)",
      "Solución nutritiva casera",
      "Medidor de pH/EC"
    ],
    "pasos": [
      "Perfora la tapa para el vaso malla.",
      "Llena con solución hasta tocar el medio (solo inicio).",
      "Coloca plántula en el medio.",
      "Cubre el recipiente para evitar luz.",
      "Mantén cámara de aire 2–4 cm."
    ],
    "exito": [
      "Raíces blancas y limpias.",
      "Solución clara y sin olor.",
      "Hojas firmes y verdes."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga"]
  },
  {
    "id": "07_hidroponia_dwc",
    "titulo": "💨 Guía práctica: Hidroponía DWC casera",
    "subtitulo": "Depósito profundo con aireador",
    "descripcion": "Sistema hidropónico con bomba de aire y piedra difusora, ideal para climas cálidos y cultivos de hojas y aromáticas.",
    "materiales": [
      "Contenedor con tapa opaca",
      "Vasos malla",
      "Medio inerte (lana de roca, perlita, esponja)",
      "Bomba de aire + difusor",
      "Solución nutritiva"
    ],
    "pasos": [
      "Perfora la tapa para vasos malla.",
      "Instala piedra difusora en el fondo.",
      "Llena con solución y ajusta pH.",
      "Coloca plántulas y enciende aireador.",
      "Mantén aireación continua."
    ],
    "exito": [
      "Raíces blancas y plumosas.",
      "Crecimiento más rápido que en suelo."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga","oregano"]
  },
  {
    "id": "08_hidroponia_nft",
    "titulo": "🌊 Guía práctica: Hidroponía NFT básico",
    "subtitulo": "Película nutritiva en canales inclinados",
    "descripcion": "Sistema eficiente de recirculación de agua y nutrientes en canales de PVC, ideal para producción continua de hojas.",
    "materiales": [
      "Canal de PVC o canaleta",
      "Depósito y bomba de agua",
      "Vasos malla y medio ligero",
      "Mangueras y llaves",
      "Medidor de pH/EC"
    ],
    "pasos": [
      "Perfora el canal para vasos malla.",
      "Instala depósito y bomba.",
      "Calibra pendiente 1–3%.",
      "Llena con solución nutritiva y enciende bomba.",
      "Coloca plántulas con base tocando película de agua."
    ],
    "exito": [
      "Raíces siempre húmedas pero aireadas.",
      "Crecimiento parejo en todo el canal."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga","fresa"]
  },
  {
    "id": "09_solucion_hidroponica",
    "titulo": "🥤 Guía práctica: Solución hidropónica casera",
    "subtitulo": "Orgánica filtrada o mineral simple",
    "descripcion": "Recetas caseras de soluciones nutritivas: orgánica (té de compost, biol) o mineral con fertilizante soluble + sales de Epsom.",
    "materiales": [
      "Té de compost filtrado o fertilizante soluble",
      "Sales de Epsom",
      "Agua limpia",
      "Tiras de pH/EC"
    ],
    "pasos": [
      "Orgánica: filtra té de compost/biol muy bien.",
      "Diluye hasta EC 0.8–1.2; pH 6.0–6.5.",
      "Mineral: disuelve fertilizante + sales de Epsom.",
      "Ajusta pH con vinagre o bicarbonato."
    ],
    "exito": [
      "pH y EC estables.",
      "Raíces limpias y crecimiento continuo."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga","fresa"]
  },
  {
    "id": "10_mantenimiento_solucion",
    "titulo": "🧴 Guía práctica: Cambio y mantenimiento de la solución",
    "subtitulo": "Mantén tu sistema limpio y balanceado",
    "descripcion": "Rutina de cambio parcial, limpieza y reposición de solución nutritiva en hidroponía.",
    "materiales": [
      "Agua limpia",
      "Nutriente preparado",
      "Esponja y vinagre diluido",
      "Medidor de pH y EC"
    ],
    "pasos": [
      "Drena 30–50% de la solución.",
      "Limpia paredes con vinagre diluido.",
      "Prepara nueva solución y ajusta pH/EC.",
      "Rellena suavemente y revisa flujo.",
      "Registra fecha, pH y EC."
    ],
    "exito": [
      "Solución clara y sin olores.",
      "Plantas vigorosas tras el cambio."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga","fresa"]
  },
  {
    "id": "11_flujo_continuo",
    "titulo": "💦 Guía práctica: Flujo continuo en hidroponía",
    "subtitulo": "Caudal y pendiente correctos para raíces felices",
    "descripcion": "Aprende a ajustar pendiente y caudal en sistemas NFT para que el agua circule sin charcos ni zonas secas.",
    "materiales": [
      "Bomba de agua con válvulas",
      "Mangueras y filtro de malla",
      "Canales PVC o canaletas",
      "Nivel/burbuja",
      "Cronómetro y recipiente medidor"
    ],
    "pasos": [
      "Mide caudal con vaso en 60 s.",
      "Equilibra ramas con válvulas.",
      "Ajusta pendiente 1–3%.",
      "Observa raíces: siempre húmedas pero aireadas.",
      "Sombrea depósito si el agua pasa de 25 °C."
    ],
    "exito": [
      "Flujo estable y silencioso.",
      "Raíces blancas en todo el canal.",
      "Crecimiento parejo de inicio a fin."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","acelga","perejil","albahaca","hierbabuena","cebolla-larga","fresa"]
  },
  {
    "id": "12_compost_casero",
    "titulo": "🌱 Guía práctica: Compost casero básico",
    "subtitulo": "Convierte tus restos orgánicos en abono natural",
    "descripcion": "Aprende a preparar compost en pilas o cajas usando restos de cocina y jardín, creando un abono rico y esponjoso.",
    "materiales": [
      "Restos verdes (frutas, verduras, café)",
      "Restos cafés (hojas secas, cartón, aserrín)",
      "Agua limpia",
      "Caja o pila con malla"
    ],
    "pasos": [
      "Coloca capa de material café y luego verde.",
      "Humedece como esponja exprimida.",
      "Repite capas y tapa con café.",
      "Voltea cada 7–14 días.",
      "Listo en 6–10 semanas (olor a tierra)."
    ],
    "exito": [
      "Olor agradable a tierra.",
      "Textura suelta y marrón oscuro.",
      "Restos ya no reconocibles."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "13_te_compost",
    "titulo": "🍵 Guía práctica: Té de compost",
    "subtitulo": "Un extracto líquido lleno de vida para tus plantas",
    "descripcion": "Preparado líquido aireado que concentra microorganismos benéficos y nutrientes suaves para aplicar en riego o foliar.",
    "materiales": [
      "Compost maduro",
      "Agua declorada",
      "Melaza o panela",
      "Bomba de aire y difusor",
      "Bolsa/filtro de tela"
    ],
    "pasos": [
      "Coloca compost en la bolsa dentro del agua + melaza.",
      "Airea 24–36 h.",
      "Retira bolsa y filtra si usarás aspersión.",
      "Aplica al suelo o diluido foliar."
    ],
    "exito": [
      "Olor agradable a bosque.",
      "Plantas con hojas brillantes.",
      "Suelo con vida y buen olor."
    ],
    "cultivosRelacionados":["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "14_medidas_huerto",
    "titulo": "📏 Guía práctica: Medidas y cálculos en el huerto",
    "subtitulo": "Convierte porcentajes y distancias en pasos simples",
    "descripcion": "Trucos rápidos para calcular proporciones, espaciamientos y riegos sin fórmulas complicadas.",
    "materiales": [
      "Baldes iguales",
      "Cinta métrica",
      "Regadera graduada",
      "Regla con marcas"
    ],
    "pasos": [
      "Usa baldes para medir porcentajes (ej: 6 L coco + 4 L compost).",
      "Marca profundidades de siembra en regla (0.5–3 cm).",
      "Calcula plantas por cama con cinta métrica.",
      "Aprende peso seco vs. húmedo en macetas."
    ],
    "exito": [
      "Espaciamientos uniformes.",
      "Sustratos bien proporcionados.",
      "Riego ajustado y eficiente."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "15_macetas_tamano",
    "titulo": "🪴 Guía práctica: Macetas por tamaño",
    "subtitulo": "Elige la maceta correcta para cada cultivo",
    "descripcion": "Define qué significa pequeña, mediana o grande y qué hortalizas van en cada una, con densidades sugeridas.",
    "materiales": [
      "Macetas con orificios",
      "Grava para el fondo",
      "Sustrato aireado",
      "Varas o cuerdas para tutores"
    ],
    "pasos": [
      "Pequeñas (3–7 L, 20 cm): cilantro, espinaca, rábano.",
      "Medianas (8–15 L, 30 cm): fresa, cebolla larga, tomate cherry.",
      "Grandes (20+ L, 40 cm): pepino, calabacín, maíz en saco.",
      "Siempre agrega grava y acolchado arriba."
    ],
    "exito": [
      "Plantas erguidas y verdes.",
      "Raíces bien desarrolladas.",
      "Cosechas más abundantes."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "16_trasplante",
    "titulo": "🌱 Guía práctica: Siembra por trasplante",
    "subtitulo": "Mueve plántulas con éxito al sitio definitivo",
    "descripcion": "Cómo pasar plántulas desde almácigos a camas o macetas evitando estrés y logrando buen enraizamiento.",
    "materiales": [
      "Plántulas sanas",
      "Agua limpia",
      "Compost maduro",
      "Acolchado (paja/hojarasca)",
      "Sombrío ligero"
    ],
    "pasos": [
      "Riega semillero 1–2 h antes.",
      "Haz hoyos según cultivo (tomate más profundo, lechuga no cubras cogollo).",
      "Agrega compost al hoyo.",
      "Coloca plántula con cepellón intacto.",
      "Riega bien y sombrea 2–3 días."
    ],
    "exito": [
      "Plántulas turgentes a los 2–3 días.",
      "Nuevos brotes en 1 semana.",
      "Raíces firmes y blancas."
    ],
    "cultivosRelacionados": ["lechuga","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","calabacn","perejil","tomate-cherry","oregano","acelga","pepino-dulce","pimentn","fresa"]
  },
  {
    "id": "17_germinacion_esponja",
    "titulo": "🌱 Guía práctica: Germinación en esponja o lana de roca",
    "subtitulo": "Almácigos limpios y con alta tasa de éxito",
    "descripcion": "Método limpio para iniciar semillas en plugs de esponja o lana de roca, ideal para trasplantes a suelo o hidroponía.",
    "materiales": [
      "Plugs de esponja o lana de roca",
      "Bandeja con tapa transparente",
      "Agua declorada",
      "Atomizador fino"
    ],
    "pasos": [
      "Remoja lana de roca en pH 5.5–5.8.",
      "Coloca 1–2 semillas en cada orificio.",
      "Mantén humedad con domo ventilado.",
      "Trasplanta cuando raíces asomen."
    ],
    "exito": [
      "Emergencia uniforme.",
      "Plántulas compactas y verdes.",
      "Raíces blancas visibles."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","espinaca","perejil","cebolla-larga","tomate-cherry","pimentn","aj-dulce","pepino-cohombro","calabacn","acelga","fresa","pepino-dulce","albahaca","oregano"]
  },
  {
    "id": "18_sanidad_ecologica",
    "titulo": "🛡️ Guía práctica: Sanidad ecológica básica",
    "subtitulo": "Control casero de plagas y hongos",
    "descripcion": "Manejo seguro de plagas con jabón potásico, trampas y extractos naturales como ajo o neem.",
    "materiales": [
      "Jabón potásico",
      "Trampas amarillas",
      "Cerveza (babosas)",
      "Bicarbonato",
      "Ajo/ají macerado"
    ],
    "pasos": [
      "Prevención: acolchado, ventilación y riego al pie.",
      "Pulveriza jabón potásico (10–20 ml/L).",
      "Usa trampas amarillas y de cerveza.",
      "Aplica extractos caseros al atardecer."
    ],
    "exito": [
      "Menos plagas en hojas.",
      "Plantas con brotes nuevos sanos.",
      "Hojas limpias sin melaza ni hongos."
    ],
    "cultivosRelacionados":  ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "19_tutorado",
    "titulo": "🪢 Guía práctica: Tutorado casero",
    "subtitulo": "Soportes simples para tus cultivos",
    "descripcion": "Usa estacas, cuerdas o mallas para dar soporte a tomates, pepinos, frijoles y más, mejorando aireación y cosecha.",
    "materiales": [
      "Estacas de guadua/madera",
      "Cuerdas o malla plástica",
      "Tijeras y alambre"
    ],
    "pasos": [
      "Instala tutores antes de que crezca demasiado.",
      "Amarra con nudo en 8 sin apretar.",
      "Revisa y sube amarres cada semana.",
      "Usa espalderas para pepinos y tipis para frijol."
    ],
    "exito": [
      "Plantas erguidas y sanas.",
      "Frutos limpios y fáciles de cosechar.",
      "Mejor entrada de luz y aire."
    ],
    "cultivosRelacionados": ["pepino-cohombro","calabacn","tomate-cherry","pepino-dulce","frijol","pimentn"]
  },
  {
    "id": "20_plan_riego",
    "titulo": "💧 Guía práctica: Plan rápido de riego",
    "subtitulo": "Ajusta el agua según clima y maceta",
    "descripcion": "Frecuencia y dosis de riego según tamaño de maceta y clima, con la prueba del dedo y el peso como referencia.",
    "materiales": [
      "Regadera o botella perforada",
      "Platos para capilaridad",
      "Mulch (paja/hojarasca)"
    ],
    "pasos": [
      "Frío (10–17 °C): riega menos (cada 3–5 días).",
      "Templado (18–23 °C): cada 2–3 días.",
      "Cálido (24–30 °C): diario.",
      "Muy cálido (>30 °C): 1–2 veces al día ligero.",
      "Haz prueba del dedo o peso de maceta antes de regar."
    ],
    "exito": [
      "Hojas firmes al mediodía.",
      "Suelo húmedo pero sin charcos.",
      "Menos rajado en frutos."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "21_arranque_fosforo",
    "titulo": "⚡ Guía práctica: Arranque de fósforo casero",
    "subtitulo": "Raíces fuertes desde el inicio",
    "descripcion": "El fósforo (P) ayuda al buen enraizamiento en siembra y trasplante. Puedes aportarlo con harina de huesos o fosfato natural mezclado con compost.",
    "materiales": [
      "Harina de huesos molida o fosfato natural",
      "Compost o humus maduro",
      "Melaza (opcional, activa microbios)",
      "Yeso agrícola (opcional)"
    ],
    "pasos": [
      "Aplica 7–14 días antes de trasplante o al hoyo.",
      "Maceta pequeña: 1 cdita de harina de huesos mezclada.",
      "Maceta mediana: 1–2 cdas.",
      "Maceta grande: 2–3 cdas.",
      "En suelo: 30–60 g/m² junto con compost."
    ],
    "exito": [
      "Raíces blancas y delgadas.",
      "Plántulas vigorosas en 1–3 semanas.",
      "Menos trasplantes débiles."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","espinaca","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "22_n_vegetativo",
    "titulo": "🌿 Guía práctica: Nitrógeno vegetativo casero",
    "subtitulo": "Más hojas verdes y tallos vigorosos",
    "descripcion": "El nitrógeno (N) impulsa el crecimiento de hojas y tallos. Se puede aportar con té de compost, lixiviados o emulsión de pescado.",
    "materiales": [
      "Té de compost aireado",
      "Lixiviado de lombriz",
      "Emulsión de pescado (opcional)",
      "Regadera o pulverizador"
    ],
    "pasos": [
      "Aplica cada 2–3 semanas en fase vegetativa.",
      "Té de compost: diluir 1:10 en riego.",
      "Lixiviado: 1:10–1:20 si concentrado.",
      "Emulsión de pescado: 5 ml/L en riego o foliar.",
      "Suspende antes de cosechar hojas."
    ],
    "exito": [
      "Hojas verde sano.",
      "Crecimiento activo sin tallos débiles.",
      "Plantas más frondosas."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "23_alto_k",
    "titulo": "🍌 Guía práctica: Potasio alto casero",
    "subtitulo": "Mejora floración y sabor de frutos",
    "descripcion": "El potasio (K) fortalece flores, frutos y su sabor. Puedes usar ceniza de madera o extracto de cáscara de banano.",
    "materiales": [
      "Ceniza de madera limpia",
      "Cáscaras de banano",
      "Agua y frasco con tapa",
      "Colador o filtro de tela"
    ],
    "pasos": [
      "Ceniza: aplica 1 cdita/mes en maceta mediana.",
      "En suelo: 50–100 g/m² en fructificación.",
      "Banano: fermenta 4–6 cáscaras en 2 L agua × 48–72 h.",
      "Cuela y diluye 1:10 en riego cada 1–2 semanas."
    ],
    "exito": [
      "Flores abiertas y firmes.",
      "Frutos más sabrosos.",
      "Menos frutos deformes o blandos."
    ],
    "cultivosRelacionados": ["cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "24_calcio_boro",
    "titulo": "🥚 Guía práctica: Calcio + Boro en floración",
    "subtitulo": "Flores fértiles y frutos firmes",
    "descripcion": "El calcio (Ca) fortalece paredes celulares y el boro (B) ayuda al cuaje. Se aplican en microdosis para no dañar la planta.",
    "materiales": [
      "Cáscaras de huevo molidas",
      "Vinagre (para Ca acetato)",
      "Bórax (microdosis)",
      "Yeso agrícola (opcional)"
    ],
    "pasos": [
      "Prepara polvo de cáscara y mezcla en superficie.",
      "Ca acetato: mezcla cáscara + vinagre, deja 48 h, filtra.",
      "Usa 5–10 ml/L en riego o foliar suave.",
      "Boro: 0.1 g/L máx. 1 vez al mes en floración."
    ],
    "exito": [
      "Menos frutos con peseta.",
      "Flores fértiles y buen cuaje.",
      "Frutos más firmes."
    ],
    "cultivosRelacionados": ["fresa","tomate-cherry","pepino-dulce","pimentn"]
  },
  {
    "id": "25_hierro_disponible",
    "titulo": "🟡 Guía práctica: Hierro disponible casero",
    "subtitulo": "Corrige clorosis en pH alto",
    "descripcion": "Cuando las hojas nuevas amarillean con nervaduras verdes puede faltar hierro (Fe). Se soluciona con un citrato casero.",
    "materiales": [
      "Sulfato ferroso",
      "Ácido cítrico o jugo de limón",
      "Agua declorada",
      "Frasco ámbar"
    ],
    "pasos": [
      "Mezcla 1 g sulfato ferroso + 1 g ácido cítrico en 1 L de agua.",
      "Aplica 100–150 ml por maceta mediana cada 7–14 días.",
      "Máx. 3 aplicaciones.",
      "No aplicar foliar."
    ],
    "exito": [
      "Brotes nuevos reverdecen en 7–14 días.",
      "Menos clorosis en hojas jóvenes.",
      "Planta más vigorosa."
    ],
    "cultivosRelacionados": ["fresa","jengibre","perejil","crcuma"]
  },
  {
    "id": "26_magnesio_azufre",
    "titulo": "🌿 Guía práctica: Magnesio + Azufre casero",
    "subtitulo": "Hojas más verdes y fotosíntesis activa",
    "descripcion": "El magnesio (Mg) es parte de la clorofila y el azufre (S) forma aminoácidos. Se aplican con sales de Epsom.",
    "materiales": [
      "Sales de Epsom",
      "Agua declorada",
      "Regadera o pulverizador"
    ],
    "pasos": [
      "Maceta mediana: disolver 1 g/L y aplicar 250–500 ml cada 15–30 días.",
      "En suelo: 10–20 g/m² cada 30–45 días.",
      "Foliar: 1 g/L al atardecer cada 15 días.",
      "Evita mezclar el mismo día con calcio."
    ],
    "exito": [
      "Reverdor en 1–2 semanas.",
      "Menos clorosis intervenal.",
      "Hojas nuevas sanas."
    ],
    "cultivosRelacionados": ["cebolla-larga","espinaca","acelga"]
  },
  {
    "id": "27_siembra_baby_leaf",
    "titulo": "🥬 Guía práctica: Siembra baby leaf",
    "subtitulo": "Cosecha hojas tiernas para ensaladas",
    "descripcion": "Siembra densa para cortar hojas jóvenes de lechuga, espinaca, acelga y cilantro en macetas o camas pequeñas.",
    "materiales": [
      "Semillas de hojas (lechuga, espinaca, cilantro, acelga)",
      "Sustrato aireado",
      "Regadera o atomizador",
      "Tijeras limpias"
    ],
    "pasos": [
      "Siembra densa a voleo o en surcos de 5–7 cm.",
      "Cubre ligero y riega fino.",
      "Corta a 2–3 cm cuando alcancen 6–10 cm.",
      "Permite 2–3 rebrotes."
    ],
    "exito": [
      "Hojas tiernas y crujientes.",
      "Rebrote uniforme.",
      "Cosecha continua cada 10–14 días."
    ],
    "cultivosRelacionados": ["lechuga","espinaca","acelga","cilantro","perejil"]
  },
  {
    "id": "28_solarizacion",
    "titulo": "☀️ Guía práctica: Solarización casera",
    "subtitulo": "Usa el sol para limpiar el suelo",
    "descripcion": "Técnica para reducir hongos y semillas de maleza cubriendo el suelo húmedo con plástico transparente por varias semanas.",
    "materiales": [
      "Plástico transparente",
      "Manguera/aspersor",
      "Cinta o estacas",
      "Termómetro de suelo (opcional)"
    ],
    "pasos": [
      "Riega y afloja suelo a 20–30 cm.",
      "Cubre con plástico bien tensado.",
      "Sella bordes con tierra.",
      "Deja 4–6 semanas en pleno sol.",
      "Reincorpora compost después."
    ],
    "exito": [
      "Menos malezas emergiendo.",
      "Mejor sanidad en cultivo siguiente.",
      "Temperaturas de 45–55 °C en suelo."
    ],
    "cultivosRelacionados": ["cebolla-larga"]
  },
  {
    "id": "29_fertirriego_te_biol",
    "titulo": "💧 Guía práctica: Fertirriego con té o biol",
    "subtitulo": "Nutre por el agua sin tapar boquillas",
    "descripcion": "Cómo aplicar té de compost o biol por riego, usando filtrado múltiple para evitar obstrucciones.",
    "materiales": [
      "Té de compost o biol",
      "Filtros (tela, media, filtro café)",
      "Embudo y jarra",
      "Vinagre y cepillo para limpieza"
    ],
    "pasos": [
      "Filtra en 3 pasos: grueso, medio, fino.",
      "Aplica 1:10 en riego o 1:20 foliar.",
      "Siempre lava líneas con agua limpia al final.",
      "Desarma y limpia boquillas semanalmente."
    ],
    "exito": [
      "Sin taponamientos en riego.",
      "Plantas con brillo y vigor.",
      "Solución sin mal olor."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "30_rotacion_asociacion",
    "titulo": "🔄 Guía práctica: Rotación y asociación casera",
    "subtitulo": "Menos plagas y mejor cosecha en poco espacio",
    "descripcion": "Combina cultivos y rota familias para evitar plagas y aprovechar luz y nutrientes en balcones y patios.",
    "materiales": [
      "Macetas o sacos",
      "Sustrato aireado y compost",
      "Estacas y malla"
    ],
    "pasos": [
      "Rota hojas → frutos → raíces cada ciclo.",
      "Asocia tomate + albahaca, pepino + frijol, fresa + hierbabuena.",
      "Siembra escalonada cada 2–3 semanas.",
      "Usa milpa compacta: maíz + frijol + calabacín si tienes espacio."
    ],
    "exito": [
      "Menos plagas repetitivas.",
      "Aprovechamiento vertical.",
      "Cosecha continua."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
  },
  {
    "id": "31_micronutrientes",
      "titulo": "⚖️ Guía práctica: Micronutrientes caseros (Zn, Mn, Mo)",
      "subtitulo": "Microdosis seguras para plantas más sanas",
      "descripcion": "Zinc, manganeso y molibdeno son claves en hojas y fijación de nitrógeno. Se aplican en dosis muy pequeñas para evitar toxicidad.",
      "materiales": [
        "Compost diverso",
        "Té de compost bien filtrado",
        "Harina de roca",
        "Opcional: sulfato de zinc, sulfato de manganeso, molibdato sódico"
      ],
      "pasos": [
        "Aplica harina de roca 1–2 cditas/m² cada 3–4 meses.",
        "Usa té de compost 1:10 al suelo cada 2–3 semanas.",
        "Si consigues sales: ZnSO₄ 0.25–0.5 g/L, MnSO₄ 0.25 g/L, Mo 0.05 g/L, siempre separados."
      ],
      "exito": [
        "Hojas de tamaño normal.",
        "Color más parejo en 10–20 días.",
        "Mejor cuaje en leguminosas."
      ],
      "cultivosRelacionados": ["frijol","pimentn","tomate-cherry","fresa"]
    },
    {
      "id":"32_yeso_vs_cal",
      "titulo": "⚒️ Guía práctica: Yeso vs Cal",
      "subtitulo": "Aprende cuándo usar cada una sin dañar el suelo",
      "descripcion": "El yeso agrícola aporta Ca y S sin cambiar el pH, mientras que la cal dolomita o agrícola eleva el pH y corrige suelos ácidos.",
      "materiales": [
        "Yeso agrícola",
        "Cal dolomita o agrícola",
        "Balde medidor"
      ],
      "pasos": [
        "Usa yeso si tu pH ya está 6.0–7.0 o en suelos salinos.",
        "Dosis: 30–50 g/m² cada 6–8 semanas.",
        "Usa cal si el pH <6.0; 100–150 g/m² mezclada en el suelo.",
        "Nunca apliques cal en pH alto."
      ],
      "exito": [
        "pH estable en 6.0–6.8.",
        "Plantas más firmes y sin deficiencia de Ca.",
        "Mejor estructura del suelo."
      ],
      "cultivosRelacionados":["pimentn","tomate-cherry","fresa","pepino-cohombro","frijol","lechuga"]
    },
    {
    "id":"33_quelatos_caseros",
    "titulo": "🧪 Guía práctica: Quelatos caseros (Fe y Mn con citrato)",
    "subtitulo": "Disponibilidad de nutrientes en suelos alcalinos",
    "descripcion": "Con ácido cítrico puedes preparar quelatos suaves de hierro y manganeso para mejorar la absorción en suelos con pH alto.",
    "materiales": [
      "Sulfato ferroso y/o sulfato de manganeso",
      "Ácido cítrico o limón filtrado",
      "Agua declorada",
      "Frasco ámbar"
    ],
    "pasos": [
      "Disuelve 1 g de sal (Fe o Mn) + 1 g de ácido cítrico en 1 L de agua.",
      "Aplica al suelo: Fe 100–150 ml/maceta, Mn 50–100 ml/maceta.",
      "No mezclar con fosfatos el mismo día.",
      "No usar en hidroponía."
    ],
    "exito": [
      "Brotes reverdecen (Fe).",
      "Mejora en clorosis con punteado (Mn).",
      "Plantas más vigorosas."
    ],
    "cultivosRelacionados": ["fresa","jengibre","perejil","crcuma","tomate-cherry","pimentn","espinaca"]
    },
    {
    "id":"34_plan_fertilizacion",
    "titulo": "📅 Guía práctica: Plan de fertilización casero",
    "subtitulo": "Nutrición balanceada según etapa y cultivo",
    "descripcion": "Un esquema simple para huertos caseros en Colombia usando enmiendas orgánicas, ceniza, compost y preparados caseros.",
    "materiales": [
      "Compost o humus",
      "Té de compost",
      "Ceniza de madera",
      "Yeso o cal dolomita",
      "Sales de Epsom",
      "Cáscara de huevo"
    ],
    "pasos": [
      "Hojas: P al inicio, N en vegetativo, Mg si amarillean.",
      "Frutos: P al inicio, N temprano, Ca+B en floración, K alto en fructificación.",
      "Raíces: más P y K, menos N.",
      "Rizomas: P al inicio, N moderado, K en engorde."
    ],
    "exito": [
      "Plantas equilibradas.",
      "Menos deficiencias visibles.",
      "Cosecha continua y sana."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
    },
    {
    "id":"35_foliar_seguro",
    "titulo": "🌧️ Guía práctica: Aplicación foliar segura",
    "subtitulo": "Nutre por la hoja sin riesgo de quemado",
    "descripcion": "Consejos para aplicar nutrientes en hoja con seguridad: horario, pH, dosis y compatibilidades.",
    "materiales": [
      "Pulverizador fino",
      "Agua declorada",
      "Tiras de pH",
      "Tés, extractos o preparados caseros"
    ],
    "pasos": [
      "Aplica temprano en la mañana o al final de la tarde.",
      "Mantén pH foliar 5.8–6.5.",
      "Usa niebla fina, no chorrear.",
      "No mezcles Ca con sulfatos/fosfatos, ni Fe con fosfatos.",
      "Haz prueba en 2–3 hojas antes de aplicar a todo."
    ],
    "exito": [
      "Hojas con brillo leve.",
      "Absorción rápida sin manchas.",
      "Crecimiento más uniforme."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
    },
    {
    "id":"riego_goteo",
    "titulo": "💧 Guía práctica: Riego por goteo casero",
    "subtitulo": "Mantén el suelo húmedo sin mojar las hojas",
    "descripcion": "Sistema de bajo costo con botellas, baldes elevados u ollas de barro para un riego constante y eficiente.",
    "materiales": [
      "Botellas o baldes",
      "Mangueras finas",
      "Aguja o alfiler",
      "Ollas de barro (opcional)"
    ],
    "pasos": [
      "Botella: perfora tapa y entierra 3–5 cm al pie.",
      "Balde elevado: conecta manguera con micro-orificios.",
      "Olla de barro: entierra y llena periódicamente.",
      "Siempre filtra el agua y limpia boquillas."
    ],
    "exito": [
      "Suelo húmedo uniforme.",
      "Menos hongos en hojas.",
      "Ahorro de agua."
    ],
    "cultivosRelacionados": ["lechuga","cilantro","fresa","cebolla-larga","aj-dulce","pepino-cohombro","albahaca","espinaca","hierbabuena","jengibre","calabacn","perejil","rbano","crcuma","yuca-dulce","tomate-cherry","oregano","acelga","pepino-dulce","maz","pia","frijol","pimentn"]
    },
    {
    "id": "acolchado_antihongos",
    "titulo": "🍂 Guía práctica: Acolchado antihongos casero",
    "subtitulo": "Protege el suelo y evita hongos foliares",
    "descripcion": "Capa protectora que conserva la humedad, reduce salpicaduras y evita tizones y botrytis.",
    "materiales": [
      "Paja o cascarilla de arroz",
      "Cartón o mulch bio",
      "Hojas secas trituradas"
    ],
    "pasos": [
      "Deshierba y riega ligero.",
      "Coloca capa de 3–5 cm dejando cuello libre.",
      "Reponer tras lluvias.",
      "Usa pajote seco en frutos como fresa o pepino."
    ],
    "exito": [
      "Menos manchas en hojas.",
      "Suelo fresco y mullido.",
      "Riego más espaciado."
    ],
    "cultivosRelacionados": ["fresa","tomate-cherry","pepino-dulce","pimentn"]
    },
  {
    "id": "manejo_estolones_fresa",
    "titulo": "🌱 Guía práctica: Manejo de estolones en fresa",
    "subtitulo": "Decide entre hijas nuevas o más fruta en la planta madre",
    "descripcion": "Los estolones son tallos rastreros que producen nuevas plantas. Puedes enraizarlos en macetas o eliminarlos para que la madre dé más frutos.",
    "materiales": [
      "Ganchos caseros",
      "Macetas pequeñas",
      "Sustrato aireado",
      "Tijeras limpias"
    ],
    "pasos": [
      "Selecciona 1–2 estolones sanos por planta.",
      "Apoya la hija en una macetica con sustrato y sujétala con un clip.",
      "Mantén húmedo 3–4 semanas hasta que enraíce.",
      "Corta el cordón o elimina estolones si prefieres fruta en la madre."
    ],
    "exito": [
      "Hijas firmes con raíces.",
      "Planta madre vigorosa.",
      "Mayor control de la producción."
    ],
    "cultivosRelacionados": ["fresa"]
  },
  {
    "id": "malla_antipajaros",
    "titulo": "🕸️ Guía práctica: Malla anti-pájaros low-cost",
    "subtitulo": "Protege frutos sin usar químicos",
    "descripcion": "Un túnel sencillo con tul o malla evita que los pájaros picoteen frutos como fresa y tomate.",
    "materiales": [
      "Tul o malla mosquitera",
      "Arcos de alambre/bambú",
      "Grapas o estacas",
      "Pinzas"
    ],
    "pasos": [
      "Forma arcos sobre el cantero o macetas.",
      "Cubre con tul y fija los bordes.",
      "Deja un acceso para cosecha y polinización.",
      "Tensa para que no toque los frutos."
    ],
    "exito": [
      "Frutos sin picoteo.",
      "Plantas seguras sin agroquímicos.",
      "Mayor producción aprovechable."
    ],
    "cultivosRelacionados": ["fresa"]
  },
  {
    "id": "poda_despunte",
    "titulo": "✂️ Guía práctica: Poda y despunte casero",
    "subtitulo": "Mantén tus aromáticas compactas y tiernas",
    "descripcion": "Con cortes simples puedes retrasar la floración y tener más hojas útiles en aromáticas como albahaca u orégano.",
    "materiales": [
      "Tijeras desinfectadas",
      "Alcohol 70%"
    ],
    "pasos": [
      "Corta encima de un nudo dejando 2–3 pares de hojas.",
      "Repite cada 2–3 semanas.",
      "Retira flores tempranas.",
      "No quites más del 30% de hojas a la vez."
    ],
    "exito": [
      "Plantas compactas.",
      "Más hojas tiernas.",
      "Aromáticas con mejor sabor."
    ],
    "cultivosRelacionados": ["albahaca","oregano"]
  },
  {
    "id": "polinizacion_manual",
    "titulo": "🌸 Guía práctica: Polinización manual casera",
    "subtitulo": "Asegura el cuaje en cucurbitáceas y cultivos de interior",
    "descripcion": "Cuando hay pocos polinizadores, puedes usar un pincel o cotonete para pasar el polen de la flor macho a la hembra.",
    "materiales": [
      "Pincel o cotonete",
      "Etiquetas para marcar flores"
    ],
    "pasos": [
      "Hazlo en la mañana.",
      "Identifica flor macho (sin fruto) y hembra (con mini-fruto).",
      "Pasa polen del macho al estigma de la hembra.",
      "Marca la flor para seguimiento."
    ],
    "exito": [
      "Frutos simétricos.",
      "Engorde continuo.",
      "Mayor porcentaje de cuaje."
    ],
    "cultivosRelacionados": ["calabacn"]
  },
  {
    "id": "propagacion_estacas_yuca",
    "titulo": "🌿 Guía práctica: Propagación de yuca por estacas",
    "subtitulo": "Reproduce yuca fácil con tallos cortados",
    "descripcion": "La yuca se multiplica por estacas, trozos de tallo que generan nuevas plantas vigorosas.",
    "materiales": [
      "Estacas de 20–25 cm",
      "Cuchillo limpio",
      "Ceniza o canela",
      "Azadón"
    ],
    "pasos": [
      "Corta estacas de 20–25 cm con 2–3 yemas.",
      "Sella cortes con ceniza o canela.",
      "Planta vertical o inclinada enterrando 10–15 cm.",
      "Aporque a las 4–6 semanas."
    ],
    "exito": [
      "Brotes uniformes.",
      "Tallos firmes.",
      "Raíces blancas nuevas."
    ],
    "cultivosRelacionados": ["yuca-dulce"]
  },
  {
    "id": "secado_hierbas",
    "titulo": "🌬️ Guía práctica: Secado de hierbas casero",
    "subtitulo": "Conserva aroma y sabor de tus aromáticas",
    "descripcion": "Orégano, albahaca e hierbabuena se secan mejor en sombra ventilada para mantener su aroma.",
    "materiales": [
      "Cordel",
      "Bolsas de papel",
      "Rejilla",
      "Frascos opacos"
    ],
    "pasos": [
      "Corta al inicio de la floración.",
      "Haz manojos pequeños y cuelga en sombra ventilada.",
      "Seca 1–2 semanas sin sol directo.",
      "Deshoja y guarda en frascos."
    ],
    "exito": [
      "Hojas crujientes.",
      "Aroma intenso.",
      "Conservación por meses."
    ],
    "cultivosRelacionados": ["oregano"]
  },
  {
    "id": "esquejes_oregano",
    "titulo": "🌱 Guía práctica: Multiplicación de orégano por esquejes",
    "subtitulo": "Obtén nuevas plantas idénticas en pocas semanas",
    "descripcion": "Los esquejes de tallo permiten reproducir orégano de manera rápida y efectiva en casa.",
    "materiales": [
      "Tijeras limpias",
      "Canela o miel",
      "Macetas pequeñas",
      "Sustrato aireado",
      "Bolsa transparente perforada"
    ],
    "pasos": [
      "Corta esquejes de 8–12 cm con 2–3 nudos.",
      "Retira hojas bajas dejando 1–2 pares arriba.",
      "Opcional: sumerge la base en canela o miel.",
      "Planta en sustrato aireado y cubre con domo perforado.",
      "Ventila a diario y retira domo al ver rebrote."
    ],
    "exito": [
      "Brotes nuevos.",
      "Raíces visibles en 2–3 semanas.",
      "Planta lista para trasplante en 3–4 semanas."
    ],
    "cultivosRelacionados": ["oregano"]
  },
  {
    "id": "aporque",
    "titulo": "⛰️ Guía práctica: Aporque casero",
    "subtitulo": "Soporta tallos y mejora el drenaje",
    "descripcion": "El aporque es amontonar tierra al pie del tallo para dar soporte, favorecer raíces adventicias y mejorar drenaje.",
    "materiales": [
      "Azada o azadón",
      "Compost",
      "Guantes"
    ],
    "pasos": [
      "Hazlo cuando tallos midan 30–40 cm.",
      "Deshierba y riega ligero.",
      "Amontona tierra suelta al tallo (8–12 cm).",
      "Repite a las 2–3 semanas si hace falta."
    ],
    "exito": [
      "Tallos firmes.",
      "Raíces blancas nuevas.",
      "Menos plantas tumbadas."
    ],
    "cultivosRelacionados": ["maz","frijol"]
  },
  {
    "id": "asociacion_milpa",
    "titulo": "🌽 Guía práctica: Asociación milpa casera",
    "subtitulo": "Maíz, frijol y calabaza en equipo",
    "descripcion": "La milpa combina maíz (soporte), frijol (fija N) y calabaza (cubre el suelo) para aprovechar mejor el espacio.",
    "materiales": [
      "Semillas de maíz",
      "Semillas de frijol",
      "Semillas de calabaza",
      "Estacas o malla",
      "Paja para acolchado"
    ],
    "pasos": [
      "Siembra maíz en lomas o sacos (3–4 plantas).",
      "A los 10–15 días siembra frijol junto al maíz.",
      "A los 15–20 días siembra calabaza al borde.",
      "Mantén riegos y acolchado."
    ],
    "exito": [
      "Maíz erguido.",
      "Frijol trepando.",
      "Suelo cubierto por calabaza."
    ],
    "cultivosRelacionados": ["maz"]
  },
  {
    "id": "induccion_pina",
    "titulo": "🍍 Guía práctica: Inducción floral en piña",
    "subtitulo": "Usa fruta madura para uniformar la floración",
    "descripcion": "Con etileno natural de manzana o banano puedes inducir la floración en piña cuando la planta ya es madura.",
    "materiales": [
      "Fruta madura (manzana o banano)",
      "Bolsa plástica grande",
      "Pinzas o ligas"
    ],
    "pasos": [
      "Asegúrate que la planta tenga 30–40 hojas (12–18 meses).",
      "Coloca la fruta dentro de una bolsa cubriendo la roseta 3–5 días.",
      "Retira bolsa y fruta.",
      "Mantén riego regular y refuerza K + Ca."
    ],
    "exito": [
      "Espiga floral centrada.",
      "Floración uniforme.",
      "Frutos de buen tamaño."
    ],
    "cultivosRelacionados": ["pia"]
  },
  {
    "id": "propagacion_pina",
    "titulo": "🍍 Guía práctica: Propagación de piña por corona o hijuelos",
    "subtitulo": "Multiplica piñas fácil desde el fruto o sus hijuelos",
    "descripcion": "La piña puede reproducirse por la corona del fruto o los hijuelos laterales (‘slips’).",
    "materiales": [
      "Cuchillo limpio",
      "Canela o ceniza",
      "Macetas",
      "Mezcla arenosa (arena + compost)"
    ],
    "pasos": [
      "Separa la corona y limpia la pulpa.",
      "Quita 2–3 anillos de hojas bajas.",
      "Deja secar 24–48 h.",
      "Planta superficialmente en mezcla arenosa.",
      "Mantén humedad sin charcos."
    ],
    "exito": [
      "Raíces nuevas en 2–4 semanas.",
      "Hojas nuevas centrales.",
      "Planta lista para trasplante."
    ],
    "cultivosRelacionados": ["pia"]
  },
  {
    "id": "inoculacion_rhizobium",
    "titulo": "🦠 Guía práctica: Inoculación de frijol con Rhizobium",
    "subtitulo": "Mejora la fijación biológica de nitrógeno",
    "descripcion": "El Rhizobium ayuda a que el frijol fije nitrógeno del aire, reduciendo la necesidad de fertilizantes externos.",
    "materiales": [
      "Inoculante específico para frijol",
      "Melaza o panela",
      "Recipiente",
      "Guantes"
    ],
    "pasos": [
      "Disuelve 1 cdita de melaza en 50 ml de agua.",
      "Humedece semillas y agrega inoculante.",
      "Seca 20 min a la sombra.",
      "Siembra el mismo día."
    ],
    "exito": [
      "Nódulos rosados en raíces a las 4–6 semanas.",
      "Plantas verdes y vigorosas.",
      "Menos necesidad de N externo."
    ],
    "cultivosRelacionados": ["frijol"]
  },
  {
    "id": "rotacion_allium",
    "titulo": "🔄 Guía práctica: Rotación para Allium",
    "subtitulo": "Evita plagas y hongos en cebolla, ajo y cebollín",
    "descripcion": "No repitas Allium en la misma cama por 3–4 años. Rota con hojas, leguminosas o cereales para cortar ciclos de enfermedades.",
    "materiales": [
      "Plan impreso de rotación",
      "Marcadores",
      "Plástico para solarización (opcional)"
    ],
    "pasos": [
      "No siembres Allium seguidos en la misma cama.",
      "Rota con lechuga, espinaca, frijol o cereales.",
      "Si hubo pudrición blanca: solariza el suelo 4–6 semanas.",
      "Siempre retira restos enfermos."
    ],
    "exito": [
      "Menos pudrición de cuello.",
      "Camas más sanas.",
      "Producción continua y estable."
    ],
    "cultivosRelacionados": ["cebolla-larga"]
  }
    // --- PEGA AQUÍ EL RESTO DE TUS GUÍAS ---
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
        // CORREGIDO: Usar el guideData.id si existe. Si no, generar uno del título.
        const docId = guideData.id || guideData.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

// Esta línea permite ejecutar el script directamente desde la terminal con `npm run db:seed`
if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
