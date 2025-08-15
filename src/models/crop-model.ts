
/**
 * @fileOverview Defines the data structures for user-specific data and crops
 * stored in the Firestore database.
 */

import type { Timestamp } from 'firebase/firestore';

// --- USER PROFILE STRUCTURE ---
// Firestore Path: /usuarios/{userId}

export interface UserProfile {
    nombre: string;
    email: string;
    fecha_registro: Timestamp;
    preferencia_tema: string;
    harvestedCropsCount: number; // Counter for harvested crops (for Dashboard)
    totalHarvestWeight: number; // Sum of all harvest weights in kg (for Dashboard)
}

// --- USER'S CROP STRUCTURE ---
// This data is stored in a SUBCOLLECTION.
// Firestore Path: /usuarios/{userId}/cultivos_del_usuario/{cropId}
// This uses a subcollection for scalability, allowing a user to have unlimited crops.

export interface UserCrop {
  id: string; // The Firestore document ID for this crop instance.
  ficha_cultivo_id: string; // ID linking to the main technical sheet (e.g., 'tomate-cherry').
  
  /**
   * The custom name the user gives to their specific plant instance.
   * This allows differentiation if they are growing multiple plants of the same type.
   * Example: "Tomates del balcón" vs. the generic name "Tomate Cherry".
   */
  nombre_cultivo_personal: string;
  
  fecha_plantacion: Timestamp;
  imageUrl: string;
  dataAiHint: string;
  daysToHarvest: number; // Total days from planting to harvest.
  progress: number; // Calculated on the client: (days_since_planted / daysToHarvest) * 100.
  nextTask: { 
    name: string; 
    dueInDays: number; // Days from planting date.
    iconName: 'Droplets' | 'Sun' | 'Wind';
  };
  lastNote: string;
  estado_actual_cultivo?: string;
  notas_progreso_inicial?: string;
}


// --- SAMPLE CROP STRUCTURE ---
// This defines the structure for the general crop data used in the
// /cultivos page and the recommendation test. This is NOT user-specific.

export interface SampleCrop {
  id: string;
  
  /**
   * The generic, common name of the crop species/variety.
   * Example: "Tomate Cherry", "Albahaca Genovesa".
   */
  name: string;

  description: string;
  regionSlugs: string[];
  imageUrl: string;
  dataAiHint: string;
  clima: 'Frío' | 'Templado' | 'Cálido' | 'Muy cálido';
  estimatedPrice: 'Precio bajo' | 'Precio moderado' | 'Precio alto';
  duration: 'Corta (1–2 meses)' | 'Media (3–5 meses)' | 'Larga (6 meses o más)';
  spaceRequired: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande o jardín (10+ L)';
  plantType: 'Hortalizas de hoja' | 'Hortalizas de raíz' | 'Hortalizas de fruto' | 'Hortalizas de flor' | 'Leguminosas' | 'Cereales' | 'Plantas aromáticas' | 'Plantas de bulbo' | 'Frutales' | 'Tubérculos' | 'Otro';
  difficulty: 1 | 2 | 3 | 4 | 5;
  datos_programaticos: {
    dias_para_cosecha: number;
    frecuencia_riego_dias: number;
  };
  lifeCycle?: { name: string }[];
  pancoger: boolean;
  patrimonial: boolean;
  sembrable_en_casa: 'sí' | 'no' | 'parcialmente';
  educativo: 'sí' | 'no' | 'parcialmente';
}
    
