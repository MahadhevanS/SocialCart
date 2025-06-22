'use server';
/**
 * @fileOverview An AI flow to interpret voice commands for the EcoCart assistant.
 *
 * - interpretCommand - A function that takes a user's transcribed query and returns a structured command.
 * - VoiceCommandInput - The input type for the interpretCommand function.
 * - VoiceCommandOutput - The return type for the interpretCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceCommandInputSchema = z.object({
  query: z.string().describe('The transcribed text from the user\'s voice input.'),
  availableProducts: z.array(z.string()).describe('A list of available product names for context.'),
});
export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;

const VoiceCommandOutputSchema = z.object({
  action: z
    .enum(['SEARCH_PRODUCTS', 'ADD_TO_CART', 'VIEW_CART', 'NAVIGATE_HOME', 'NAVIGATE_SOCIAL', 'NAVIGATE_CHAT', 'UNKNOWN'])
    .describe('The specific action the user wants to perform.'),
  payload: z.object({
    productName: z.string().optional().describe('The name of the product if relevant to the action.'),
    quantity: z.number().optional().describe('The quantity of the product, defaults to 1.'),
    responseText: z.string().describe('A natural language response to speak back to the user confirming the action.'),
  }),
});
export type VoiceCommandOutput = z.infer<typeof VoiceCommandOutputSchema>;

export async function interpretCommand(input: VoiceCommandInput): Promise<VoiceCommandOutput> {
  return voiceCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCommandPrompt',
  input: { schema: VoiceCommandInputSchema },
  output: { schema: VoiceCommandOutputSchema },
  prompt: `You are the EcoCart Voice Bot, a helpful shopping assistant.
Your task is to interpret the user's voice command and translate it into a structured JSON action.

User's command: "{{query}}"

Based on this command, determine the user's intent. The available actions are:
- SEARCH_PRODUCTS: When the user wants to find or search for an item.
- ADD_TO_CART: When the user wants to add an item to their shopping cart.
- VIEW_CART: When the user wants to see their shopping cart.
- NAVIGATE_HOME: When the user wants to go to the main product listing.
- NAVIGATE_SOCIAL: When the user wants to go to the social page.
- NAVIGATE_CHAT: When the user wants to go to the chat page.
- UNKNOWN: If the command is unclear or cannot be mapped to an action.

Here is a list of available products you can use for context to identify the correct product name:
{{#each availableProducts}}
- {{this}}
{{/each}}

- For ADD_TO_CART, you MUST identify a product name from the query and the list. If a product is mentioned that is not in the list, choose the closest match. Also extract quantity if mentioned, otherwise default to 1.
- For SEARCH_PRODUCTS, extract the search term or product name.
- For all actions, generate a friendly and concise 'responseText' to confirm what you are doing. For example, if adding an item, say "Sure, adding [Product Name] to your cart." If navigating, say "Navigating to the [Page Name] page." If unknown, say "I'm sorry, I didn't understand that. Please try again."
- Only populate the payload fields relevant to the action. For navigation actions, 'productName' and 'quantity' should be omitted.
`,
});

const voiceCommandFlow = ai.defineFlow(
  {
    name: 'voiceCommandFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
