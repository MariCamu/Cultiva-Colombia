
/**
 * @fileOverview Defines the structure for the 'educational_guides' Firestore collection
 * and provides example documents.
 *
 * Collection: educational_guides
 * Each document in this collection will conform to the EducationalGuideDocument interface.
 */

interface Subcategory {
  name: string;
  description: string;
}

export interface EducationalGuideDocument {
  id?: string; // For client-side use after fetching
  title: string;
  description: string;
  target_audience: string[]; // Array of strings
  type: "general" | "educativo"; // New field for type
  subcategories: Subcategory[];
}

// Example Document 1: To be stored with ID 'practical_guides'
export const practicalGuidesData: Omit<EducationalGuideDocument, 'id'> = {
  title: "Guías prácticas de cultivo",
  description: "Para cualquier persona (niños, adultos, familias, docentes) que quiera aprender a cultivar de forma sencilla.",
  target_audience: ["general", "principiantes", "hogares", "huertas urbanas"],
  type: "general",
  subcategories: [
    {
      name: "Métodos de siembra",
      description: "Guías paso a paso para sembrar en macetas, suelo o con hidroponía."
    },
    {
      name: "Tierra y sustratos",
      description: "Qué tierra usar, cuánto cuesta y cómo prepararla con compost."
    },
    {
      name: "Cuidado natural",
      description: "Cómo usar abonos orgánicos, insecticidas caseros y seguir calendarios."
    },
    {
      name: "Herramientas recicladas",
      description: "Cómo hacer tus propias macetas, regaderas o sistemas de riego."
    },
    {
      name: "Glosario visual",
      description: "¿Qué es pH? ¿Qué significa buferizado? Definiciones ilustradas."
    }
  ]
};

// Example Document 2: To be stored with ID 'educational_activities'
export const educationalActivitiesData: Omit<EducationalGuideDocument, 'id'> = {
  title: "Actividades educativas y didácticas",
  description: "Pensadas para docentes, bibliotecas y huertas escolares para enseñar cultivando.",
  target_audience: ["docentes", "niños", "huertas escolares", "formadores"],
  type: "educativo",
  subcategories: [
    {
      name: "Montaje de huerta escolar",
      description: "Cómo planear y montar una huerta con niños paso a paso."
    },
    {
      name: "Actividades por ciclo",
      description: "Juegos para germinar semillas, cuidar plantas y cosechar."
    },
    {
      name: "Proyectos por edad",
      description: "Ideas para primaria baja, alta y secundaria según habilidades."
    },
    {
      name: "Materiales imprimibles",
      description: "Calendarios, carteles y fichas para el aula o talleres."
    },
    {
      name: "Evaluación educativa",
      description: "Bitácoras y hojas para seguir el progreso de los estudiantes."
    }
  ]
};

/**
 * Example of how the data might be structured in Firestore.
 * This is for illustrative purposes and would typically be managed via Firestore SDK calls.
 *
 * Firestore path: /educational_guides/{documentId}
 *
 * Example document IDs and their corresponding data:
 * - /educational_guides/practical_guides -> practicalGuidesData
 * - /educational_guides/educational_activities -> educationalActivitiesData
 */
export const educationalGuidesCollectionExamples = {
  practical_guides: practicalGuidesData,
  educational_activities: educationalActivitiesData,
};
