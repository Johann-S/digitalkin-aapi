import { nanoid } from 'nanoid'
import OpenAI from 'openai'
import Env from '#start/env'

import { CustomAgent } from '#models/custom_agent'
import { ConversationMessageModel } from '#models/conversation_model'
import { EchoCustomAgentService } from '#services/custom-agents/echo_custom_agent_service'

export class OpenAICustomAgentService implements CustomAgent {
  private getOpenAIClient(): OpenAI | null {
    const openAiKey = Env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      return null
    }

    return new OpenAI({
      apiKey: openAiKey,
    })
  }

  async *answerStream(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): AsyncGenerator<string, ConversationMessageModel> {
    const openai = this.getOpenAIClient()

    if (!openai) {
      return yield* new EchoCustomAgentService().answerStream(data)
    }

    const messages = [
      { role: 'system' as const, content: data.persona },
      ...data.messages.map((message) => ({
        role: message.role as 'user' | 'assistant',
        content: message.content,
      })),
    ]

    const stream = await openai.chat.completions.create({
      messages,
      model: 'gpt-4o-mini',
      stream: true,
    })

    let fullContent = ''
    const messageId = nanoid()
    const createdAt = new Date()

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''

      if (content) {
        fullContent += content
        yield content
      }
    }

    return {
      id: messageId,
      role: 'assistant',
      content: fullContent,
      createdAt,
    }
  }
}
