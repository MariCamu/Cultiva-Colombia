
export interface SampleCrop {
  id: string;
  name: string;
  description: string;
  regionSlug: string;
  imageUrl: string;
  dataAiHint: string;
  estimatedPrice: 'Precio bajo' | 'Precio moderado' | 'Precio alto';
  duration: 'Corta (1–2 meses)' | 'Media (3–5 meses)' | 'Larga (6 meses o más)';
  spaceRequired: 'Maceta pequeña (1–3 L)' | 'Maceta mediana (4–10 L)' | 'Maceta grande o jardín (10+ L)';
  plantType: 'Hortalizas de hoja' | 'Hortalizas de raíz' | 'Hortalizas de fruto' | 'Hortalizas de flor' | 'Leguminosas' | 'Cereales' | 'Plantas aromáticas' | 'Plantas de bulbo' | 'Frutales' | 'Tubérculos' | 'Otro';
  difficulty: 1 | 2 | 3 | 4 | 5;
  daysToHarvest: number;
  lifeCycle?: { name: string }[];
}

import type { Timestamp } from 'firebase/firestore';

export interface UserCrop {
  id: string; 
  ficha_cultivo_id: string;
  nombre_cultivo_personal: string;
  fecha_plantacion: Timestamp;
  imageUrl: string;
  dataAiHint: string;
  daysToHarvest: number;
  progress: number;
  nextTask: { name: string; dueInDays: number; iconName: 'Droplets' | 'Sun' | 'Wind' };
  lastNote: string;
  estado_actual_cultivo?: string;
  notas_progreso_inicial?: string;
}

    