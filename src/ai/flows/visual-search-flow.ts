'use server';
/**
 * @fileOverview An AI flow to find products based on an image.
 *
 * - findProductsInImage - A function that takes a user's photo and returns matching products.
 * - VisualSearchInput - The input type for the function.
 * - VisualSearchOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisualSearchInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo from the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  availableProducts: z.array(z.object({
      id: z.string(),
      name: z.string()
  })).describe('A list of available products with their IDs and names for context.'),
});
export type VisualSearchInput = z.infer<typeof VisualSearchInputSchema>;

const VisualSearchOutputSchema = z.object({
  matchedProductIds: z
    .array(z.string())
    .describe('A list of product IDs that are a visual match for the object in the image.'),
  reasoning: z.string().describe('A brief explanation of why these products were chosen.'),
});
export type VisualSearchOutput = z.infer<typeof VisualSearchOutputSchema>;

export async function findProductsInImage(input: VisualSearchInput): Promise<VisualSearchOutput> {
  return visualSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualSearchPrompt',
  input: { schema: VisualSearchInputSchema },
  output: { schema: VisualSearchOutputSchema },
  prompt: `You are an expert visual product matcher for an e-commerce store called SocialCart. Your task is to identify the main object in the user's photo and find the closest matching products from the provided list.

Here is the list of available products:
{{#each availableProducts}}
- {{name}} (ID: {{id}})
{{/each}}

Analyze the user's image provided below.
User's image: {{media url=imageDataUri}}

Based on the image, identify the top 3 most relevant products from the list. The match should be based on the object type, style, and color.

Provide a brief, one-sentence reasoning for your selection, for example: "The image shows a pair of headphones, and these are the most similar headphone products we offer."

Return the IDs of the matched products. If no products are a good match, return an empty array.
`,
});

const visualSearchFlow = ai.defineFlow(
  {
    name: 'visualSearchFlow',
    inputSchema: VisualSearchInputSchema,
    outputSchema: VisualSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
