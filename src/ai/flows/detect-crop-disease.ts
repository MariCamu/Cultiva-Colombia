
'use server';

/**
 * @fileOverview Analyzes a plant image to identify the plant and assess its health.
 * The AI will respond in Spanish.
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
      "Una foto de una planta, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzePlantImageInput = z.infer<typeof AnalyzePlantImageInputSchema>;

const PlantIdentificationSchema = z.object({
  isPlant: z.boolean().describe('Indica si la imagen contiene principalmente una planta.'),
  commonName: z.string().optional().describe('El nombre común de la planta identificada, si es una planta e identificable.'),
  scientificName: z.string().optional().describe('El nombre científico (latín) de la planta identificada, si es una planta e identificable.'),
});

const PlantHealthProblemSchema = z.object({
    name: z.string().describe('Nombre del problema detectado (ej. enfermedad, plaga, deficiencia nutricional).'),
    description: z.string().describe('Breve descripción del problema y posibles causas específicas para la especie identificada, si es posible.'),
});

const PlantHealthSchema = z.object({
  isHealthy: z.boolean().describe('Indica si la planta identificada parece saludable.'),
  problems: z.array(PlantHealthProblemSchema).optional().describe('Una lista de problemas detectados si la planta no está saludable. Vacío si está sana o no se detectan problemas.'),
  suggestions: z.array(z.string()).optional().describe('Sugerencias generales de cuidado o posibles remedios para cualquier problema identificado, o para el cuidado general de la planta.'),
});

const AnalyzePlantImageOutputSchema = z.object({
  identification: PlantIdentificationSchema,
  health: PlantHealthSchema.optional().describe('Evaluación de salud, proporcionada si se identifica una planta.'),
});

export type AnalyzePlantImageOutput = z.infer<typeof AnalyzePlantImageOutputSchema>;

export async function analyzePlantImage(input: AnalyzePlantImageInput): Promise<AnalyzePlantImageOutput> {
  return analyzePlantImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlantImagePrompt',
  input: {schema: AnalyzePlantImageInputSchema},
  output: {schema: AnalyzePlantImageOutputSchema},
  prompt: `Eres un experto botánico y fitopatólogo. Responde siempre en español. Analiza la imagen proporcionada.
1. Determina si la imagen contiene principalmente una planta. Establece 'identification.isPlant' correspondientemente.
2. Si es una planta, intenta identificar su nombre común y nombre científico (latín). Popula 'identification.commonName' y 'identification.scientificName'. Si no puedes identificar con confianza la especie, puedes omitir estos campos pero aún así confirmar que es una planta.
3. Si se identifica una planta, evalúa su salud.
    - Establece 'health.isHealthy' a true si parece saludable, o false en caso contrario.
    - Si no está saludable, identifica cualquier problema visible (ej. enfermedades, plagas, deficiencias nutricionales). Para cada problema, proporciona un 'name' (nombre) y una 'description' (descripción). Si la especie de la planta ha sido identificada, en la descripción del problema, intenta explicar las posibles causas específicas para esa especie. Por ejemplo, si ves hojas amarillas en un tomate, menciona causas comunes de amarillamiento en tomates. Popula 'health.problems' con estos objetos. Si la planta está sana o no se pueden identificar problemas específicos a partir de la imagen, esta lista puede estar vacía u omitida.
    - Proporciona 'suggestions' (sugerencias) generales de cuidado o posibles remedios. Estas sugerencias deben ser útiles tanto si la planta está sana como si tiene problemas. Esta lista puede estar vacía si no se te ocurren sugerencias específicas.
Si no se detecta ninguna planta en la imagen, la sección 'health' del resultado puede omitirse.

Imagen: {{media url=photoDataUri}}
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
