// This is a server-side file.
'use server';

/**
 * @fileOverview Provides AI-powered product recommendations based on items in the user's cart.
 *
 * - getPairShoppingRecommendations - A function that takes a list of cart items and returns product recommendations.
 * - PairShoppingRecommendationsInput - The input type for the getPairShoppingRecommendations function.
 * - PairShoppingRecommendationsOutput - The return type for the getPairShoppingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PairShoppingRecommendationsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('A list of product names currently in the user cart.'),
});
export type PairShoppingRecommendationsInput = z.infer<
  typeof PairShoppingRecommendationsInputSchema
>;

const PairShoppingRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of product recommendations based on the cart items.'),
});
export type PairShoppingRecommendationsOutput = z.infer<
  typeof PairShoppingRecommendationsOutputSchema
>;

export async function getPairShoppingRecommendations(
  input: PairShoppingRecommendationsInput
): Promise<PairShoppingRecommendationsOutput> {
  return pairShoppingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pairShoppingRecommendationsPrompt',
  input: {schema: PairShoppingRecommendationsInputSchema},
  output: {schema: PairShoppingRecommendationsOutputSchema},
  prompt: `You are a personal shopping assistant. Based on the items in the user's cart, recommend other products that they might be interested in.

Cart items: {{cartItems}}

Recommendations:`,
});

const pairShoppingRecommendationsFlow = ai.defineFlow(
  {
    name: 'pairShoppingRecommendationsFlow',
    inputSchema: PairShoppingRecommendationsInputSchema,
    outputSchema: PairShoppingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
