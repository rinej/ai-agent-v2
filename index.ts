import 'dotenv/config';
import { runAgent } from './src/agent';
import { z } from 'zod';

const userMessage = process.argv[2];

if (!userMessage) {
  console.error('Please provide a message');
  process.exit(1);
}

const weatherTool = {
  name: 'get_weather',
  description: 'use this to get weather',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick up that tool?'), // add to every tool call! Makes sure that ai will thinkg about reason
  }),
};

const response = await runAgent({
  userMessage,
  tools: [weatherTool],
});

// console.log(JSON.stringify(response));
