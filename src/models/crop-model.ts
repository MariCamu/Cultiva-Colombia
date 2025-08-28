
/**
 * @fileOverview Defines the data structures for user-specific data and crops
 * stored in the Firestore database.
 */

import type { Timestamp } from 'firebase/firestore';
import type { ReactElement } from 'react';
import type { CropTechnicalSheet } from './crop-data-structure';

// --- USER PROFILE STRUCTURE ---
// Firestore Path: /usuarios/{userId}

export interface UserProfile {
    nombre: string;
    email: string;
    fecha_registro: Timestamp;
    preferencia_tema: string;
    harvestedCropsCount: number; // Counter for harvested crops (for Dashboard)
    totalHarvestWeight: number; // Sum of all harvest weights in kg (for Dashboard)
    region?: string;
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
   * Example: "Tomates del balcón" (nombre_cultivo_personal) vs. the generic name "Tomate Cherry".
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
  /**
   * Optional initial notes a user adds when setting up a new crop in their dashboard.
   * It captures the state of the plant at the beginning of tracking (e.g., "Already has 3 real leaves").
   * This is also used to create the very first entry in the crop's journal.
   */
  notas_progreso_inicial?: string;
  
  // This field is added to carry the real programmatic data from the main sheet
  // It is NOT stored in the user's crop document, but attached on the client-side.
  datos_programaticos: {
    frecuencia_riego_dias: number;
    dias_para_cosecha: number;
  };
}

// --- USER ALERT STRUCTURE ---
// This data is stored in a SUBCOLLECTION.
// Firestore Path: /usuarios/{userId}/alertas/{alertId}
// These are generated automatically by the system based on crop data.

export interface UserAlert {
    id: string;
    cropId: string;
    cropName: string;
    message: string;
    type: 'riego' | 'abono' | 'cosecha' | 'info';
    date: Timestamp;
    /**
     * A boolean flag to track if the user has seen and dismissed the alert.
     * - When an alert is created, it's set to `false`.
     * - The Dashboard UI only displays alerts where `isRead` is `false`.
     * - When the user clicks "Mark as Done", this field is updated to `true`.
     * This keeps the user's alert panel clean and only shows pending tasks.
     */
    isRead: boolean;
    icon: React.ElementType;
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
  clima: 'Frío' | 'Templado' | 'Cálido' | 'Muy cálido' | string;
  duration: 'Corta (1–2 meses)' | 'Media (3–5 meses)' | 'Larga (6+ meses)';
  spaceRequired: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande (10+ L)' | 'Jardín';
  plantType: 'Hortalizas de hoja' | 'Hortalizas de raíz' | 'Hortalizas de fruto' | 'Hortalizas de flor' | 'Leguminosas' | 'Cereales' | 'Plantas aromáticas' | 'Plantas de bulbo' | 'Frutales' | 'Tubérculos' | 'Otro' | string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  datos_programaticos: {
    dias_para_cosecha: number;
    frecuencia_riego_dias: number;
  };
  lifeCycle?: { name: string }[];
  lifeCycleDetails?: CropTechnicalSheet['cicloVida'];
  pancoger: boolean;
  patrimonial: boolean;
  sembrable_en_casa: 'sí' | 'no' | 'parcialmente';
  educativo: 'sí' | 'no' | 'parcialmente';
  tags?: string[];
}
    
