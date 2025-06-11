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
  diseaseName: z.string().describe('The name of the crop disease.'),
  cropName: z.string().describe('The name of the crop affected by the disease.'),
});
export type CropDiseaseRemedySuggestionsInput = z.infer<
  typeof CropDiseaseRemedySuggestionsInputSchema
>;

const CropDiseaseRemedySuggestionsOutputSchema = z.object({
  remedySuggestions: z
    .array(z.string())
    .describe('A list of suggested remedies for the crop disease.'),
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
  prompt: `You are an expert in plant pathology and agriculture. A farmer is dealing with
  the following crop disease:

  Disease: {{{diseaseName}}}
  Crop: {{{cropName}}}

  Suggest at least three possible remedies or treatments for this disease. Provide detailed
  instructions for each remedy.

  Format your response as a JSON array of strings.`,
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
