
/**
 * @fileOverview Defines the structure for the 'fichas_tecnicas_cultivos' Firestore collection
 * and provides an example document for "Tomate Cherry".
 *
 * Collection: fichas_tecnicas_cultivos
 * Each document in this collection will conform to the CropTechnicalSheet interface.
 */

export interface Step {
    descripcion: string;
}

export interface CultivationMethod {
    nombre: string;
    pasos: Step[];
}

export interface ImageWithAttribution {
    url: string;
    attribution?: {
        text: string;
        link: string;
    }
}

export interface CropTechnicalSheet {
  id?: string; // For client-side use after fetching.
  slug: string; // URL-friendly identifier
  nombre: string;
  imagen: ImageWithAttribution; // Replaced imagen_url
  tipo_planta: 'Fruto' | 'Hoja' | 'Raíz' | 'Aromática' | 'Tubérculo' | 'Leguminosa' | 'Otro';
  clima: string;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  descripcion_general: string;
  ciclo_vida: {
    etapa: string;
    duracion: string;
    descripcion: string;
  }[];
  datos_tecnicos: {
    riego: string;
    temperatura_ideal: string;
    luz_solar: string;
    ph_suelo: string;
  };
  datos_programaticos: {
    frecuencia_riego_dias: number; // e.g., 3 for every 3 days
    dias_para_cosecha: number;    // e.g., 90 for 90 days
  };
  compatibilidades: string[];
  incompatibilidades: string[];
  articulos_relacionados_ids: string[];
  metodos_cultivo?: CultivationMethod[];
}

// Example Document: To be stored with ID 'tomate-cherry'
export const tomatoCherryData: Omit<CropTechnicalSheet, 'id'> = {
  slug: 'tomate-cherry',
  nombre: 'Tomate Cherry',
  imagen: {
    url: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ftomate_cherry.jpg?alt=media&token=44504067-71d1-4ee0-838b-54f70e31c451',
    // No attribution needed for this example image
  },
  tipo_planta: 'Fruto',
  clima: 'Templado',
  dificultad: 'Media',
  descripcion_general: 'El tomate cherry es una variedad de tomate de tamaño pequeño, ideal para cultivos caseros y espacios reducidos. Es una excelente opción para principiantes debido a su resistencia y facilidad de cultivo en macetas o jardines pequeños.',
  ciclo_vida: [
    { etapa: 'Semilla', duracion: '0-7 días', descripcion: 'Germinación inicial en semillero.' },
    { etapa: 'Plántula', duracion: '7-21 días', descripcion: 'Desarrollo de las primeras hojas verdaderas.' },
    { etapa: 'Crecimiento', duracion: '21-60 días', descripcion: 'La planta crece vigorosamente y necesita tutores.' },
    { etapa: 'Floración', duracion: '60-75 días', descripcion: 'Aparición de las flores amarillas.' },
    { etapa: 'Cosecha', duracion: '75-120 días', descripcion: 'Los frutos maduran y se pueden cosechar.' },
  ],
  datos_tecnicos: {
    riego: '2-3 veces por semana',
    temperatura_ideal: '18°C - 28°C',
    luz_solar: '6-8 horas diarias',
    ph_suelo: '6.0 - 6.8',
  },
  datos_programaticos: {
    frecuencia_riego_dias: 3,
    dias_para_cosecha: 90,
  },
  compatibilidades: ['Albahaca', 'Zanahoria', 'Cebolla', 'Lechuga'],
  incompatibilidades: ['Brócoli', 'Coliflor', 'Papa', 'Hinojo'],
  articulos_relacionados_ids: ['control_de_plagas_organico', 'el_arte_de_cultivar_en_macetas'],
  metodos_cultivo: [
    {
      nombre: 'Siembra en Semillero',
      pasos: [
        { descripcion: 'Rellena un semillero con sustrato húmedo y presiona ligeramente.' },
        { descripcion: 'Coloca 2-3 semillas por alvéolo, a no más de 1 cm de profundidad.' },
        { descripcion: 'Cubre las semillas con una fina capa de sustrato y riega suavemente con un pulverizador.' },
        { descripcion: 'Mantén el semillero en un lugar cálido y luminoso hasta que las semillas germinen.' },
      ],
    },
    {
      nombre: 'Trasplante a Maceta Definitiva',
      pasos: [
        { descripcion: 'Cuando las plántulas tengan 4-6 hojas verdaderas, elige la más fuerte de cada alvéolo.' },
        { descripcion: 'Prepara una maceta de al menos 20 litros con buen drenaje y sustrato rico en compost.' },
        { descripcion: 'Con cuidado, saca la plántula del semillero y entiérrala en la maceta hasta los primeros cotiledones para fomentar un buen sistema radicular.' },
        { descripcion: 'Riega abundantemente después del trasplante y coloca un tutor para guiar su crecimiento.' },
      ],
    },
  ],
};
