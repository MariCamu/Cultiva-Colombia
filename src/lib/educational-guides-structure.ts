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
  title: string;
  description: string;
  target_audience: string[];
  subcategories: Subcategory[];
}

// Example Document 1: To be stored with ID 'practical_guides'
export const practicalGuidesData: EducationalGuideDocument = {
  title: "Guías prácticas de cultivo",
  description: "Para cualquier persona (niños, adultos, familias, docentes) que quiera aprender a cultivar de forma sencilla y natural.",
  target_audience: ["general", "principiantes", "hogares", "huertas urbanas"],
  subcategories: [
    {
      name: "Métodos de siembra",
      description: "Guías paso a paso para cultivar en macetas, en tierra o con sistemas hidropónicos."
    },
    {
      name: "Tierra y sustratos",
      description: "Cómo preparar tierra de calidad, hacer compost y conocer los materiales necesarios y sus costos."
    },
    {
      name: "Cuidado natural",
      description: "Uso de abonos orgánicos, insecticidas caseros y calendarios de siembra y riego."
    },
    {
      name: "Herramientas recicladas",
      description: "Ideas para crear macetas, regaderas o sistemas de riego con materiales reciclables."
    },
    {
      name: "Glosario visual",
      description: "Definiciones ilustradas de conceptos como pH, surcos, buferizado, entre otros."
    }
  ]
};

// Example Document 2: To be stored with ID 'educational_activities'
export const educationalActivitiesData: EducationalGuideDocument = {
  title: "Actividades educativas y didácticas",
  description: "Pensadas para docentes, talleristas y programas escolares de huertas para involucrar a niños y jóvenes en el cultivo.",
  target_audience: ["docentes", "estudiantes", "huertas escolares"],
  subcategories: [
    {
      name: "Montaje de huerta escolar",
      description: "Cómo iniciar una huerta con niños: planificación, materiales y cronograma."
    },
    {
      name: "Actividades por ciclo",
      description: "Actividades didácticas según el ciclo de cultivo: germinación, cuidado y cosecha."
    },
    {
      name: "Proyectos por edad",
      description: "Actividades específicas para primaria baja, primaria alta y secundaria: observación, gráficas, compostaje y más."
    },
    {
      name: "Materiales imprimibles",
      description: "Carteles, calendarios de siembra y fichas descargables para trabajar con niños."
    },
    {
      name: "Evaluación educativa",
      description: "Bitácoras y hojas simples para hacer seguimiento al aprendizaje de los estudiantes."
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
