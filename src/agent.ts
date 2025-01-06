import type { AIMessage } from '../types';
import { runLLM } from './llm';
import { z } from 'zod';
import { runTool } from './toolRunner';
import { addMessages, getMessages, saveToolResponse } from './memory';
import { logMessage, showLoader } from './ui';

export const runAgent = async ({
  turns = 10,
  userMessage,
  tools = [],
}: {
  turns?: number;
  userMessage: string;
  tools?: { name: string; parameters: z.AnyZodObject }[];
}) => {
  await addMessages([
    {
      role: 'user',
      content: userMessage,
    },
  ]);

  const loader = showLoader('Thinking...');

  while (true) {
    const history = await getMessages();
    const response = await runLLM({
      messages: history,
      tools,
    });

    await addMessages([response]);

    logMessage(response);

    // There is either content or tool_calls. When content we can assume its done and AI has the final answer
    if (response.content) {
      loader.stop();
      logMessage(response);
      return getMessages();
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0];
      loader.update(`executing: ${toolCall.function.name}`);

      const toolResponse = await runTool(toolCall, userMessage);
      await saveToolResponse(toolCall.id, toolResponse);

      loader.update(`executed: ${toolCall.function.name}`);
    }
  }
};
