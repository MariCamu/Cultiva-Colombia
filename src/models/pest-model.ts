/**
 * @fileOverview Defines the structure for the 'plagas_y_enfermedades' Firestore collection,
 * adapted to the user's provided data structure.
 */

export interface Pest {
  id: string; // Document ID (slug, e.g., 'pulgones')
  slug: string;
  nombreComun: string;
  nombreCientifico?: string;
  tipo: string; // e.g., 'insecto', 'hongo', 'bacteria'
  descripcion: string;
  danos: string; // Description of damages caused by the pest/disease
  cultivosAfectados: string[]; // Array of crop slugs
  prevencion: string[]; // Array of prevention tips
  solucion: string; // Recommended solution
  imageUrl: string; // Added for UI purposes
  dataAiHint: string; // Added for UI purposes
}
