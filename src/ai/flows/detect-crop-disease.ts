// 'use server';

/**
 * @fileOverview Detects crop diseases from an image and provides potential remedies.
 *
 * - detectCropDisease - A function that handles the crop disease detection process.
 * - DetectCropDiseaseInput - The input type for the detectCropDisease function.
 * - DetectCropDiseaseOutput - The return type for the detectCropDisease function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type DetectCropDiseaseInput = z.infer<typeof DetectCropDiseaseInputSchema>;

const DetectCropDiseaseOutputSchema = z.object({
  diseaseDetected: z.boolean().describe('Whether a disease is detected or not.'),
  diseaseName: z.string().describe('The name of the detected disease, if any.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the disease detection (0-1).'),
  remedies: z.array(z.string()).describe('Suggested remedies for the detected disease.'),
});

export type DetectCropDiseaseOutput = z.infer<typeof DetectCropDiseaseOutputSchema>;

export async function detectCropDisease(input: DetectCropDiseaseInput): Promise<DetectCropDiseaseOutput> {
  return detectCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCropDiseasePrompt',
  input: {schema: DetectCropDiseaseInputSchema},
  output: {schema: DetectCropDiseaseOutputSchema},
  prompt: `You are an AI assistant that helps farmers detect diseases in their crops.

You will be provided with a photo of a crop, and you will need to analyze the image to determine if there are any diseases present.

Based on the image, identify if a disease is present, the name of the disease, the confidence level of your detection, and suggest remedies.

Photo: {{media url=photoDataUri}}
`,
});

const detectCropDiseaseFlow = ai.defineFlow(
  {
    name: 'detectCropDiseaseFlow',
    inputSchema: DetectCropDiseaseInputSchema,
    outputSchema: DetectCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
