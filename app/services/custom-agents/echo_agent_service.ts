import { nanoid } from 'nanoid'

import { AbstractCustomAgent } from '#services/custom-agents/abstract_custom_agent'
import { ConversationMessageModel } from '#models/conversation_model'
import { delay } from '#utilities/util'

export class EchoCustomAgentService extends AbstractCustomAgent {
  async answer(messages: ConversationMessageModel[]): Promise<ConversationMessageModel> {
    await delay(300) // Simulate a delay

    return {
      id: nanoid(),
      role: 'assistant',
      content: `Echo: ${messages[messages.length - 1].content}`,
      createdAt: new Date(),
    }
  }
}
