/**
 * @fileOverview Defines the structure for the 'plagas_y_enfermedades' Firestore collection.
 */

export interface Pest {
  id: string; // Document ID (slug)
  slug: string;
  nombre: string;
  nombreCientifico?: string;
  descripcion: string;
  tipo: 'Plaga' | 'Enfermedad';
  imageUrl: string;
  dataAiHint: string;
  cultivosAfectados: string[]; // Array of crop slugs
  prevencion: string[]; // Array of prevention tips
  solucionOrganica: {
    titulo: string;
    descripcion: string;
  }[]; // Array of organic solutions
}
