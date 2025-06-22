'use server';
/**
 * @fileOverview Analyzes product reviews for eco-friendly sentiment.
 *
 * - analyzeEcoSentiment - A function that takes product reviews and returns an analysis.
 * - EcoSentimentInput - The input type for the analysis function.
 * - EcoSentimentOutput - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcoSentimentInputSchema = z.object({
  reviews: z
    .array(z.string())
    .describe('A list of customer review comments for a product.'),
});
export type EcoSentimentInput = z.infer<typeof EcoSentimentInputSchema>;

const EcoSentimentOutputSchema = z.object({
    positivePoints: z.array(z.string()).describe("A list of key positive points from the reviews related to eco-friendliness, durability, or sustainable packaging."),
    negativePoints: z.array(z.string()).describe("A list of key negative points from the reviews related to waste, plastic, or poor durability."),
    summary: z.string().describe("A brief, neutral, one-sentence summary of the overall eco-sentiment from the reviews.")
});
export type EcoSentimentOutput = z.infer<typeof EcoSentimentOutputSchema>;

export async function analyzeEcoSentiment(
  input: EcoSentimentInput
): Promise<EcoSentimentOutput> {
  return ecoSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ecoSentimentPrompt',
  input: {schema: EcoSentimentInputSchema},
  output: {schema: EcoSentimentOutputSchema},
  prompt: `You are a sustainability expert working for an e-commerce company. Your job is to analyze customer reviews for a product to find insights about its eco-friendliness.

Carefully read the following reviews:
{{#each reviews}}
- "{{this}}"
{{/each}}

From these reviews, extract key points related to:
- Packaging (e.g., "plastic-free", "too much plastic")
- Durability and longevity (e.g., "long-lasting", "broke quickly")
- Material quality (e.g., "sustainably sourced", "feels cheap")
- Overall environmental impact.

Summarize your findings in the JSON output format. Keep the points concise and directly related to the reviews. If there are no relevant points, return empty arrays.
`,
});

const ecoSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'ecoSentimentAnalysisFlow',
    inputSchema: EcoSentimentInputSchema,
    outputSchema: EcoSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
