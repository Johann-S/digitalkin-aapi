import { nanoid } from 'nanoid'

import { AbstractCustomAgent } from '#services/custom-agents/abstract_custom_agent'
import { ConversationMessageModel } from '#models/conversation_model'
import { delay } from '#utilities/util'

export class EchoCustomAgentService extends AbstractCustomAgent {
  async *answerStream(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): AsyncGenerator<string, ConversationMessageModel> {
    await delay(300) // Simulate a delay

    const content = `Echo: ${data.messages[data.messages.length - 1].content}`
    yield content

    return {
      id: nanoid(),
      role: 'assistant',
      content,
      createdAt: new Date(),
    }
  }
}
