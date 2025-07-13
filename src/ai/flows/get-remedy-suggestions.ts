// 'use server';

/**
 * @fileOverview Provides remedy suggestions for crop diseases based on a diagnosis.
 *
 * - getCropDiseaseRemedySuggestions - A function that suggests remedies for a given crop disease.
 * - CropDiseaseRemedySuggestionsInput - The input type for the getCropDiseaseRemedySuggestions function.
 * - CropDiseaseRemedySuggestionsOutput - The return type for the getCropDiseaseRemedySuggestions function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDiseaseRemedySuggestionsInputSchema = z.object({
  diseaseName: z.string().describe('The description of the problem or disease observed in the crop.'),
  cropName: z.string().describe('The name of the crop affected by the disease.'),
});
export type CropDiseaseRemedySuggestionsInput = z.infer<
  typeof CropDiseaseRemedySuggestionsInputSchema
>;

const RemedySuggestionSchema = z.object({
    title: z.string().describe('Un título corto y descriptivo para el remedio.'),
    description: z.string().describe('Una explicación detallada del remedio. Usa **negritas** para resaltar palabras clave importantes (ej. **Jabón potásico**, **aceite de Neem**, **buen drenaje**).'),
});

const CropDiseaseRemedySuggestionsOutputSchema = z.object({
  remedySuggestions: z
    .array(RemedySuggestionSchema)
    .describe('Una lista de al menos dos remedios o tratamientos sugeridos para el problema del cultivo, cada uno con un título y una descripción formateada.'),
});
export type CropDiseaseRemedySuggestionsOutput = z.infer<
  typeof CropDiseaseRemedySuggestionsOutputSchema
>;

export async function getCropDiseaseRemedySuggestions(
  input: CropDiseaseRemedySuggestionsInput
): Promise<CropDiseaseRemedySuggestionsOutput> {
  return getCropDiseaseRemedySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropDiseaseRemedySuggestionsPrompt',
  input: {schema: CropDiseaseRemedySuggestionsInputSchema},
  output: {schema: CropDiseaseRemedySuggestionsOutputSchema},
  prompt: `Eres un agrónomo experto y amigable. Un agricultor necesita ayuda con un problema en su cultivo.
Responde siempre en español.

Cultivo: {{{cropName}}}
Problema observado: {{{diseaseName}}}

Basado en el problema descrito para este cultivo específico, sugiere al menos dos remedios o tratamientos posibles. Para cada remedio:
1.  Proporciona un 'title' (título) corto y claro.
2.  Proporciona una 'description' (descripción) detallada. En esta descripción, usa la sintaxis de Markdown con doble asterisco (p. ej., **Jabón potásico**) para resaltar en negrita las palabras más importantes como ingredientes, técnicas o conceptos clave.
Explica cada remedio de forma sencilla, mencionando opciones orgánicas o caseras si es posible. Concéntrate en dar soluciones prácticas.
`,
});

const getCropDiseaseRemedySuggestionsFlow = ai.defineFlow(
  {
    name: 'getCropDiseaseRemedySuggestionsFlow',
    inputSchema: CropDiseaseRemedySuggestionsInputSchema,
    outputSchema: CropDiseaseRemedySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
