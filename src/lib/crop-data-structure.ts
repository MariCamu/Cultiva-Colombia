
/**
 * @fileOverview Defines the final, unified structure for the 'fichas_tecnicas_cultivos' 
 * Firestore collection, combining general info and detailed technical data into a single document.
 *
 * Collection: fichas_tecnicas_cultivos
 * Each document in this collection will conform to the CropTechnicalSheet interface.
 */
import type { GeoPoint } from 'firebase/firestore';


export interface ImageWithAttribution {
  url: string;
  attribution?: {
    text: string;
    link: string;
  };
}

export interface Step {
    descripcion: string;
}

export interface CultivationMethod {
    nombre: string;
    pasos: Step[];
}

export interface LifeCycleStage {
    etapa: string;
    duracion: string;
    descripcion: string;
}

/**
 * Represents the complete data for a single crop, stored as one document in Firestore.
 * This structure is optimized for efficient data retrieval, getting all necessary
 * information for a crop in a single read operation.
 */
export interface CropTechnicalSheet {
  id?: string; // Firestore Document ID (e.g., 'lechuga')
  
  // --- General Information ---
  nombre: string; 
  nombreCientifico: string;
  descripcion: string;
  tags: string[];
  dificultad: 'Fácil' | 'Media' | 'Difícil' | string;
  clima: {
    clase: string[];
  };
  region: {
    principal: string[];
    nota: string;
  };
  compatibilidades: string[];
  incompatibilidades: string[];
  posicion: GeoPoint; 
  imagenes: ImageWithAttribution[];
  articulos_relacionados_ids: string[];
  
  // --- Embedded Detailed Data ---
  tipo_planta: string;
  ciclo_vida: LifeCycleStage[];
  metodos_cultivo: CultivationMethod[];

  // --- Detailed Technical Sheet Data (Nested Map) ---
  datos_tecnicos: {
    // Clima
    temperatura_ideal: string; // Ejemplo: "15-20°C"
    // Riego
    riego: string; // Ejemplo: "Frecuente"
    // Luz
    luz_solar: string; // Ejemplo: "6-8 horas"
    // Suelo
    ph_suelo: string; // Ejemplo: "6.0-7.0"
    
    // Placeholder for more detailed fields from the user's Excel
    // Example:
    // epoca_siembra?: string;
    // suelo_drenaje?: 'Bueno' | 'Moderado' | 'Pobre';
    // ... add all other technical fields here
  };

  // --- Programmatic data for app logic ---
  datos_programaticos: {
    frecuencia_riego_dias: number;
    dias_para_cosecha: number;
  };
}
