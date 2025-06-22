'use server';
/**
 * @fileOverview An AI flow for generating eco-friendly event plans and product suggestions.
 *
 * - getEcoPlan - A function that takes an event type and returns a sustainable plan and product ideas.
 * - EcoPlannerInput - The input type for the function.
 * - EcoPlannerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcoPlannerInputSchema = z.object({
  eventType: z.string().describe('The type of event the user is planning, e.g., "Wedding", "Birthday Party", "Holiday Celebration".'),
  availableProducts: z.array(z.string()).describe('A list of available product names for context.'),
});
export type EcoPlannerInput = z.infer<typeof EcoPlannerInputSchema>;

const EcoPlannerOutputSchema = z.object({
  suggestedProducts: z.array(z.string()).describe("A list of 3-5 specific, relevant product names from the available products list that would be useful for this event."),
  planner: z.array(z.object({
    task: z.string().describe("A high-level task or category for the plan, e.g., 'Invitations', 'Decorations', 'Food & Drinks'."),
    description: z.string().describe("A brief, actionable tip on how to make this task eco-friendly."),
  })).describe("A checklist of eco-friendly planning tips for the event."),
});
export type EcoPlannerOutput = z.infer<typeof EcoPlannerOutputSchema>;

export async function getEcoPlan(input: EcoPlannerInput): Promise<EcoPlannerOutput> {
  return ecoPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ecoPlannerPrompt',
  input: {schema: EcoPlannerInputSchema},
  output: {schema: EcoPlannerOutputSchema},
  prompt: `You are an expert eco-conscious event planner. A user is planning a "{{eventType}}". Your goal is to provide them with sustainable product suggestions from a list of available products and a simple, actionable eco-friendly planner.

List of available products:
{{#each availableProducts}}
- {{this}}
{{/each}}

Based on the "{{eventType}}", please provide:
1.  A list of 3-5 **specific product names** from the provided list that are most relevant for the event. For a wedding, you might suggest food wraps for leftovers or bamboo cutlery for a casual reception. For a birthday, a recycled notebook could be a good gift.
2.  A helpful, eco-friendly planner with 3-4 key tasks. For each task, provide a short, actionable tip on how to make it sustainable. For example, for "Decorations", suggest "Use reusable items like fabric banners or rent decorations instead of buying single-use plastic items."

Generate the output in the required JSON format.
`,
});

const ecoPlannerFlow = ai.defineFlow(
  {
    name: 'ecoPlannerFlow',
    inputSchema: EcoPlannerInputSchema,
    outputSchema: EcoPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
