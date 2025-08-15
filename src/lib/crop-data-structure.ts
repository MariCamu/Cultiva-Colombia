
/**
 * @fileOverview Defines the structure for the 'fichas_tecnicas_cultivos' Firestore collection
 * and provides an example document for "Tomate Cherry".
 *
 * Collection: fichas_tecnicas_cultivos
 * Each document in this collection will conform to the CropTechnicalSheet interface.
 */

export interface CropTechnicalSheet {
  id?: string; // For client-side use after fetching.
  slug: string; // URL-friendly identifier
  nombre: string;
  imagen_url: string;
  tipo_planta: 'Fruto' | 'Hoja' | 'Raíz' | 'Aromática' | 'Tubérculo' | 'Leguminosa' | 'Otro';
  region_recomendada: string[];
  clima: string;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  duracion_cultivo_dias: string; // e.g., "90-120"
  espacio_requerido: string;
  descripcion_general: string;
  ciclo_vida: {
    etapa: string;
    duracion: string;
    descripcion: string;
  }[];
  datos_tecnicos: {
    riego: string;
    temperatura_ideal: string;
    duracion_cosecha: string;
    ph_suelo: string;
    luz_solar: string;
    humedad: string;
  };
  compatibilidades: string[];
  incompatibilidades: string[];
  advertencias_comunes: string[];
  costos_aproximados: {
    insumo: string;
    cantidad: string;
    costo_unitario: number;
    costo_total: number;
  }[];
  duracion_post_cosecha: string;
  recomendaciones_finales: string;
  articulos_relacionados_ids: string[];
  cultivos_relacionados_ids: string[];
}

// Example Document: To be stored with ID 'tomate-cherry'
export const tomatoCherryData: Omit<CropTechnicalSheet, 'id'> = {
  slug: 'tomate-cherry',
  nombre: 'Tomate Cherry',
  imagen_url: 'https://firebasestorage.googleapis.com/v0/b/agrinavigate.firebasestorage.app/o/Cultivos%2Ftomate_cherry.jpg?alt=media&token=44504067-71d1-4ee0-838b-54f70e31c451',
  tipo_planta: 'Fruto',
  region_recomendada: ['Andina', 'Caribe'],
  clima: 'Templado',
  dificultad: 'Media',
  duracion_cultivo_dias: '90-120',
  espacio_requerido: 'Maceta Grande (10L+)',
  descripcion_general: 'El tomate cherry es una variedad de tomate de tamaño pequeño, ideal para cultivos caseros y espacios reducidos. Es una excelente opción para principiantes debido a su resistencia y facilidad de cultivo en macetas o jardines pequeños.',
  ciclo_vida: [
    { etapa: 'Semilla', duracion: '0-7 días', descripcion: 'Germinación inicial en semillero.' },
    { etapa: 'Plántula', duracion: '7-21 días', descripcion: 'Desarrollo de las primeras hojas verdaderas.' },
    { etapa: 'Crecimiento', duracion: '21-60 días', descripcion: 'La planta crece vigorosamente. Necesita tutores.' },
    { etapa: 'Floración', duracion: '60-75 días', descripcion: 'Aparición de las flores amarillas.' },
    { etapa: 'Cosecha', duracion: '75-120 días', descripcion: 'Los frutos maduran y se pueden cosechar.' },
  ],
  datos_tecnicos: {
    riego: '2-3 veces por semana',
    temperatura_ideal: '18°C - 28°C',
    duracion_cosecha: '60-90 días después de floración',
    ph_suelo: '6.0 - 6.8',
    luz_solar: '6-8 horas diarias',
    humedad: '60-70%',
  },
  compatibilidades: ['Albahaca', 'Zanahoria', 'Cebolla', 'Lechuga'],
  incompatibilidades: ['Brócoli', 'Coliflor', 'Papa', 'Hinojo'],
  advertencias_comunes: ['Exceso de agua puede causar hongos.', 'Vigilar plagas como pulgones y mosca blanca.'],
  costos_aproximados: [
    { insumo: 'Semillas', cantidad: '1 paquete', costo_unitario: 5000, costo_total: 5000 },
    { insumo: 'Tierra', cantidad: '10L', costo_unitario: 10000, costo_total: 10000 },
  ],
  duracion_post_cosecha: '7-10 días en refrigeración',
  recomendaciones_finales: 'Cultivar tomate cherry en casa es gratificante. Asegúrate de podar los brotes laterales (chupones) para una mejor producción y ventilación de la planta.',
  articulos_relacionados_ids: ['control_de_plagas_organico', 'el_arte_de_cultivar_en_macetas'],
  cultivos_relacionados_ids: ['lechuga-romana', 'albahaca'],
};
