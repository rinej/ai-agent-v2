import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({
  model = 'gpt-4o-mini',
  messages,
  temperature = 0.1, // reduced the chaos. Reduces the randomnes. Indicates how creative model can be. max 2.
}: {
  messages: AIMessage[]
  temperature?: number
  model?: string
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
  })

  return response.choices[0].message
}
