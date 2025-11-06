import { nanoid } from 'nanoid'
import OpenAI from 'openai'
import Env from '#start/env'

import { AbstractCustomAgent } from '#services/custom-agents/abstract_custom_agent'
import { ConversationMessageModel } from '#models/conversation_model'
import { EchoCustomAgentService } from '#services/custom-agents/echo_agent_service'

export class OpenAICustomAgentService extends AbstractCustomAgent {
  async answer(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): Promise<ConversationMessageModel> {
    const openAiKey = Env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      return new EchoCustomAgentService().answer(data)
    }

    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    const inputs = data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [{ role: 'user', content: data.persona }, ...inputs],
    })

    return {
      id: nanoid(),
      role: 'assistant',
      content: response.output_text,
      createdAt: new Date(response.created_at * 1000),
    }
  }
}
