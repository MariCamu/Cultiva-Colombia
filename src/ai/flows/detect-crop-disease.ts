
'use server';

/**
 * @fileOverview Analyzes a plant image to identify the plant and assess its health.
 *
 * - analyzePlantImage - A function that handles the plant image analysis process.
 * - AnalyzePlantImageInput - The input type for the analyzePlantImage function.
 * - AnalyzePlantImageOutput - The return type for the analyzePlantImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlantImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzePlantImageInput = z.infer<typeof AnalyzePlantImageInputSchema>;

const PlantIdentificationSchema = z.object({
  isPlant: z.boolean().describe('Whether or not the image primarily contains a plant.'),
  commonName: z.string().optional().describe('The common name of the identified plant, if it is a plant and identifiable.'),
  scientificName: z.string().optional().describe('The scientific (Latin) name of the identified plant, if it is a plant and identifiable.'),
});

const PlantHealthProblemSchema = z.object({
    name: z.string().describe('Name of the detected problem (e.g., disease, pest, nutrient deficiency).'),
    description: z.string().describe('Brief description of the problem.'),
});

const PlantHealthSchema = z.object({
  isHealthy: z.boolean().describe('Whether the identified plant appears healthy.'),
  problems: z.array(PlantHealthProblemSchema).optional().describe('A list of detected problems if the plant is not healthy. Empty if healthy or no problems detected.'),
  suggestions: z.array(z.string()).optional().describe('General care suggestions or potential remedies for any identified problems or for general plant care.'),
});

const AnalyzePlantImageOutputSchema = z.object({
  identification: PlantIdentificationSchema,
  health: PlantHealthSchema.optional().describe('Health assessment, provided if a plant is identified.'),
});

export type AnalyzePlantImageOutput = z.infer<typeof AnalyzePlantImageOutputSchema>;

export async function analyzePlantImage(input: AnalyzePlantImageInput): Promise<AnalyzePlantImageOutput> {
  return analyzePlantImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlantImagePrompt',
  input: {schema: AnalyzePlantImageInputSchema},
  output: {schema: AnalyzePlantImageOutputSchema},
  prompt: `You are an expert botanist and plant pathologist. Analyze the provided image.
1. Determine if the image primarily contains a plant. Set 'identification.isPlant' accordingly.
2. If it is a plant, attempt to identify its common name and scientific (Latin) name. Populate 'identification.commonName' and 'identification.scientificName'. If you cannot confidently identify the species, you can omit these fields but still confirm it's a plant.
3. If a plant is identified, assess its health.
    - Set 'health.isHealthy' to true if it appears healthy, or false otherwise.
    - If it's not healthy, identify any visible problems (e.g., diseases, pests, nutrient deficiencies). For each problem, provide a 'name' and a 'description'. Populate 'health.problems' with these objects. If the plant is healthy or no specific problems are identifiable from the image, this array can be empty or omitted.
    - Provide general care 'suggestions' or potential remedies. These suggestions should be helpful whether the plant is healthy or has issues. This array can be empty if no specific suggestions come to mind.
If no plant is detected in the image, the 'health' section of the output can be omitted.

Image: {{media url=photoDataUri}}
`,
});

const analyzePlantImageFlow = ai.defineFlow(
  {
    name: 'analyzePlantImageFlow',
    inputSchema: AnalyzePlantImageInputSchema,
    outputSchema: AnalyzePlantImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
