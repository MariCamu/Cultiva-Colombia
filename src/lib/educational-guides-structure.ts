
/**
 * @fileOverview Defines the structure for the 'guias_educativas' Firestore collection.
 * This structure is based on the user-provided JSON format.
 *
 * Collection: guias_educativas
 * Each document in this collection will conform to the EducationalGuideDocument interface.
 */

export interface EducationalGuideDocument {
  id: string; // Firestore Document ID (e.g., 'guia-practica-inoculacion-rhizobium-frijol')
  titulo: string;
  subtitulo: string;
  descripcion: string;
  materiales?: string[];
  pasos?: string[];
  exito?: string[];
  cultivosRelacionados?: string[]; // Array of crop slugs
}
