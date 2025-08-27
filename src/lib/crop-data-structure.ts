
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
  atribucion?: {
    text: string;
    link: string;
  };
}

export interface CultivationStep {
    orden: number;
    titulo: string;
    descripcion: string;
    materiales_paso?: string[];
    indicadores?: string;
    tiempo_dias?: string;
    evitar?: string;
    notas?: string;
    alerta_plagas?: string | null;
}

export interface CultivationMethod {
    id: string;
    nombre: string;
    ambito: string;
    descripcion_corta: string;
    materiales: string[];
    herramientas: string[];
    notas_clave: string;
    contenedor_volumen_min_L: number;
    requisitos_ambiente: {
      temperatura_C: string;
      horas_luz: string;
    };
    tiempo_estimado_cosecha_dias: string;
    pasos: CultivationStep[];
}

export interface LifeCycleStage {
    etapa: string;
    orden: number;
    duracion_dias_min: number | null;
    duracion_dias_max: number | null;
    duracion_dias_tipico: number | null;
    riego: {
        frecuencia_dias: number | string | null;
        metodo: string[] | null;
        notas: string;
    };
    fertilizacion: {
        momento_dias: number | number[] | null;
        notas: string | null;
    };
    labores: string[];
    notas: string;
    indicadores_cambio_fase: string;
    objetivo_nutricional: string;
    alertas_plagas: string[] | string;
}

/**
 * Represents the complete data for a single crop, stored as one document in Firestore.
 */
export interface CropTechnicalSheet {
  id?: string; // Firestore Document ID (e.g., 'lechuga')
  
  // --- General Information ---
  nombre: string; 
  nombreCientifico: string;
  descripcion: string;
  tags: string[];
  dificultad: 'Fácil' | 'Media' | 'Difícil' | string;
  espacioRequerido: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande (10+ L)' | 'Jardín';
  clima: {
    clase: string[];
  };
  region: {
    principal: string[];
    nota: string;
  };
  compatibilidades: string[];
  incompatibilidades: string[];
  plagasComunes?: string[]; // Array of pest slugs
  posicion: any; // Using 'any' for seeding flexibility with {lat, lon} object before converting to GeoPoint
  imagenes: ImageWithAttribution[];
  articulosRelacionados: string[];
  tipo_planta: string;
  
  // --- Embedded Detailed Data ---
  tecnica: {
    temperatura_ideal: string;
    riego: string;
    luz_solar: string;
    ph_suelo: string;
    humedad_ideal: string;
    altitud_ideal: string;
    epoca_siembra: string;
    suelo: {
        drenaje: string;
        textura: string;
        materia_organica: string;
        retencion_agua: string;
        notas: string;
    };
    espaciamiento: {
        entre_plantas_cm_min: number;
        entre_plantas_cm_max: number;
        entre_surcos_cm: number;
        patron: string;
    };
    nutricion: {
        enmiendas_fondo: string[];
        refuerzos: string[];
        restricciones: string;
        criticos: string[];
    };
    post_cosecha: {
        temperatura_ideal: string;
        vida_util_dias_frio: string;
        vida_util_dias_ambiente: string;
        notas: string;
    };
  };

  cicloVida: LifeCycleStage[];
  metodos: CultivationMethod[];
  
  // --- Programmatic data for app logic ---
  datos_programaticos: {
    frecuencia_riego_dias: number;
    dias_para_cosecha: number;
  };
}
