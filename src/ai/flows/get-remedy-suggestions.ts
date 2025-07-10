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

const CropDiseaseRemedySuggestionsOutputSchema = z.object({
  remedySuggestions: z
    .array(z.string())
    .describe('A list of at least two suggested remedies or treatments for the crop problem, explained in simple terms.'),
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

Basado en el problema descrito para este cultivo específico, sugiere al menos dos remedios o tratamientos posibles. Explica cada remedio de forma clara y sencilla, idealmente mencionando opciones orgánicas o caseras si es posible.
Concéntrate en dar soluciones prácticas.
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
