
'use server';

import { writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const articlesToSeed = [
  { 
    slug: 'guia-completa-de-compostaje-casero',
    title: "Guía Completa de Compostaje Casero", 
    summary: "Aprende a transformar tus desechos de cocina en 'oro negro' para tus plantas con esta guía paso a paso.",
    content: `
      <h2 class="text-2xl font-bold mb-4">¿Qué es el Compost?</h2>
      <p class="mb-4">El compost es el resultado de la descomposición de materia orgánica. Es un abono natural rico en nutrientes que mejora la estructura del suelo, retiene la humedad y alimenta tus plantas de forma ecológica.</p>
      <h3 class="text-xl font-bold mb-2">Materiales Verdes (Ricos en Nitrógeno)</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Restos de frutas y verduras</li>
        <li>Cáscaras de huevo trituradas</li>
        <li>Posos de café y bolsitas de té</li>
        <li>Césped recién cortado</li>
      </ul>
      <h3 class="text-xl font-bold mb-2">Materiales Cafés (Ricos en Carbono)</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Hojas secas y paja</li>
        <li>Cartón y papel de periódico (sin tintas de color)</li>
        <li>Serrín de madera no tratada</li>
        <li>Ramas pequeñas y trozos de corteza</li>
      </ul>
      <h3 class="text-xl font-bold text-destructive mb-2">¡Qué Evitar!</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Carnes, pescados y huesos</li>
        <li>Lácteos y grasas</li>
        <li>Excrementos de mascotas</li>
        <li>Plantas enfermas o tratadas con pesticidas</li>
      </ul>
      <h2 class="text-2xl font-bold mb-4">Paso a Paso</h2>
      <ol class="list-decimal list-inside space-y-2">
        <li>Elige un contenedor con buena ventilación (compostera, caja de madera, etc.).</li>
        <li>Crea una base de ramas o material grueso para el drenaje.</li>
        <li>Alterna capas de materiales verdes y cafés. La proporción ideal es aproximadamente 1 parte de verde por 2-3 partes de café.</li>
        <li>Mantén la pila húmeda, ¡pero no empapada! Como una esponja escurrida.</li>
        <li>Remueve la pila cada 1-2 semanas para airearla y acelerar el proceso.</li>
        <li>¡Ten paciencia! En 2-4 meses tendrás un compost oscuro, suelto y con olor a tierra de bosque, listo para usar.</li>
      </ol>
    `,
    imageUrl: "https://placehold.co/400x250.png",
    dataAiHint: "compost bin",
    tags: ["Compostaje", "Sostenibilidad", "DIY"],
  },
  { 
    slug: 'control-de-plagas-organico',
    title: "Control de Plagas Orgánico: Protege tu Huerto", 
    summary: "Descubre cómo combatir las plagas más comunes como pulgones y mosca blanca utilizando remedios naturales y caseros.",
    content: `
      <p class="mb-4">Un huerto sano es un ecosistema equilibrado. Antes de recurrir a químicos, prueba estas soluciones orgánicas.</p>
      <h2 class="text-2xl font-bold mb-4">Remedios Caseros Efectivos</h2>
      <h3 class="text-xl font-bold mb-2">1. Spray de Ajo y Chile</h3>
      <p class="mb-4">Un excelente repelente de amplio espectro. Licúa una cabeza de ajo y 5 chiles picantes en 1 litro de agua. Cuela la mezcla y diluye una parte de la solución en 4 partes de agua. Pulveriza sobre las hojas (evitando las horas de sol directo).</p>
      <h3 class="text-xl font-bold mb-2">2. Jabón Potásico</h3>
      <p class="mb-4">Ideal para pulgones, cochinillas y mosca blanca. Diluye una cucharada de jabón potásico (disponible en tiendas de jardinería) en 1 litro de agua. Rocía directamente sobre los insectos, asegurándote de cubrir el envés de las hojas.</p>
      <h3 class="text-xl font-bold mb-2">3. Aceite de Neem</h3>
      <p class="mb-4">Un potente insecticida y fungicida natural. Sigue las instrucciones del fabricante para la dilución. Actúa por ingestión e interrumpe el ciclo vital de los insectos. Es muy efectivo, pero úsalo con moderación.</p>
      <h2 class="text-2xl font-bold mb-4">Atrae Aliados a tu Huerto</h2>
      <p>Planta flores como la caléndula, la albahaca o el eneldo. Atraen a mariquitas y crisopas, que son depredadores naturales de los pulgones. ¡Deja que la naturaleza trabaje para ti!</p>
    `,
    imageUrl: "https://placehold.co/400x250.png",
    imgAlt: "Control de plagas orgánico",
    dataAiHint: "garden pests",
    tags: ["Plagas", "Orgánico", "Jardinería"],
  },
  { 
    slug: 'el-arte-de-cultivar-en-macetas',
    title: "El Arte de Cultivar en Macetas: Tu Huerto en el Balcón", 
    summary: "Una guía esencial para quienes tienen espacio limitado. Cultiva tus propios alimentos en balcones y patios.",
    content: `
      <p class="mb-4">No necesitas un gran jardín para disfrutar de alimentos frescos. ¡Un balcón o una ventana soleada pueden ser suficientes!</p>
      <h2 class="text-2xl font-bold mb-4">Claves para el Éxito en Macetas</h2>
      <h3 class="text-xl font-bold mb-2">1. Elige la Maceta Correcta</h3>
      <p class="mb-4">El tamaño importa. Las plantas de raíz profunda como los tomates necesitan macetas de al menos 20 litros. Las hierbas aromáticas pueden vivir felices en macetas más pequeñas. <strong>¡El drenaje es crucial!</strong> Asegúrate de que todas tus macetas tengan agujeros en el fondo.</p>
      <h3 class="text-xl font-bold mb-2">2. El Sustrato Perfecto</h3>
      <p class="mb-4">No uses tierra de jardín, ya que se compacta y drena mal. Compra un sustrato específico para macetas o mezcla tu propio compost con fibra de coco y perlita para obtener una textura ligera y aireada.</p>
      <h3 class="text-xl font-bold mb-2">3. Riego y Fertilización</h3>
      <p class="mb-4">Las macetas se secan más rápido que el suelo. Revisa la humedad introduciendo un dedo en la tierra. Riega cuando los primeros 2-3 cm estén secos. Como los nutrientes son limitados, necesitarás fertilizar cada 2-4 semanas con un abono líquido orgánico durante la temporada de crecimiento.</p>
    `,
    imageUrl: "https://placehold.co/400x250.png",
    dataAiHint: "potted plants",
    tags: ["Huerto Urbano", "Macetas", "Principiantes"],
  },
];

export async function seedArticles() {
  const batch = writeBatch(db);
  const articlesCollection = collection(db, 'articulos');

  articlesToSeed.forEach(articleData => {
    const docRef = collection(articlesCollection).doc(); // Auto-generate ID
    batch.set(docRef, {
      ...articleData,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
