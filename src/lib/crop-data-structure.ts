
/**
 * @fileOverview Defines the structure for the 'fichas_tecnicas_cultivos' Firestore collection
 * based on the user's provided data model.
 *
 * Collection: fichas_tecnicas_cultivos
 * Each document in this collection will conform to the CropTechnicalSheet interface.
 */

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

export interface CropTechnicalSheet {
  id?: string; // Firestore Document ID (e.g., 'lechuga')
  nombre: string; // nombreComun in spreadsheet
  nombreCientifico: string;
  descripcion: string;
  tags: string[];
  dificultad: 'Fácil' | 'Media' | 'Difícil' | string; // Allow string for flexibility
  clima: {
    clase: string[];
  };
  region: {
    principal: string[];
    nota: string;
  };
  compatibilidades: string[];
  incompatibilidades: string[];
  posicion: { // Corresponds to Lat Lon
    lat: number;
    lng: number;
  };
  imagenes: ImageWithAttribution[];
  articulos_relacionados_ids: string[]; // articulosRelacionados
  
  // Embedded data from other Excel sheets
  tipo_planta: string;
  ciclo_vida: LifeCycleStage[];
  metodos_cultivo: CultivationMethod[];

  // Programmatic data for app logic
  datos_tecnicos: {
    riego: string;
    temperatura_ideal: string;
    luz_solar: string;
    ph_suelo: string;
  };
  datos_programaticos: {
    frecuencia_riego_dias: number;
    dias_para_cosecha: number;
  };
}
