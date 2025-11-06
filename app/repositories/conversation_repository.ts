import redis from '@adonisjs/redis/services/main'
import { nanoid } from 'nanoid'

import {
  conversationValidator,
  CreateConversationRequest,
} from '#validators/conversation_validator'
import { ConversationModel, ConversationMessageModel } from '#models/conversation_model'

export class ConversationRepository {
  private readonly prefix = 'conversation'

  async create(data: CreateConversationRequest) {
    const conversation: ConversationModel = {
      id: nanoid(),
      agentId: data.agentId,
      messages: [
        {
          id: nanoid(),
          role: 'user' as const,
          content: data.message,
          createdAt: new Date(),
        },
      ] as ConversationMessageModel[],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const conversationKey = `${this.prefix}:${conversation.agentId}:${conversation.id}`
    await redis.set(conversationKey, JSON.stringify(conversation))

    return conversation
  }

  async update(conversation: ConversationModel) {
    conversation.updatedAt = new Date()

    const conversationKey = `${this.prefix}:${conversation.agentId}:${conversation.id}`
    await redis.set(conversationKey, JSON.stringify(conversation))

    return conversation
  }

  async getConversation(conversationId: string) {
    const conversationKeyPattern = `${this.prefix}:*:${conversationId}`
    const keys = await redis.keys(conversationKeyPattern)

    if (keys.length === 0) {
      return null
    }

    const conversation = await redis.get(keys[0])

    return conversationValidator.parse(JSON.parse(conversation as string))
  }
}
