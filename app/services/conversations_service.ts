import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'

import {
  CreateConversationRequest,
  createConversationValidator,
  SendMessageConversationRequest,
  sendMessageConversationValidator,
} from '#validators/conversation_validator'
import { asyncWrap } from '#utilities/util'
import { EchoCustomAgentService } from '#services/custom-agents/echo_agent_service'

/** Repositories */
import { ConversationRepository } from '#repositories/conversation_repository'
import { AgentRepository } from '#repositories/agent_repository'

/** Exceptions */
import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'

/** Models */
import { AgentModel } from '#models/agent_model'
import { nanoid } from 'nanoid'

@inject()
export default class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationRepository,
    private readonly agentRepository: AgentRepository
  ) {}

  async create(data: Partial<CreateConversationRequest>) {
    const validation = createConversationValidator.safeParse(data)

    if (!validation.success) {
      throw new BadRequestException(validation.error.message)
    }

    const agent = await this.getAgent(validation.data.agentId)
    const createConversation = await asyncWrap(this.conversationsRepository.create(validation.data))

    if (createConversation.error) {
      logger.error(createConversation.error)
      throw new InternalServerErrorException('Unable to create conversation')
    }

    const conversation = createConversation.result!
    const customAgentService = this.getCustomAgentService(agent)
    const answer = await customAgentService.answer(conversation.messages)

    conversation.messages.push(answer)

    const updateConversation = await asyncWrap(this.conversationsRepository.update(conversation))

    if (updateConversation.error) {
      logger.error(updateConversation.error)
      throw new InternalServerErrorException('Unable to update conversation')
    }

    return {
      conversationId: conversation.id,
      answer: answer,
    }
  }

  async sendMessage(conversationId: string, data: Partial<SendMessageConversationRequest>) {
    const validation = sendMessageConversationValidator.safeParse(data)

    if (!validation.success) {
      throw new BadRequestException(validation.error.message)
    }

    const fetchConversation = await asyncWrap(
      this.conversationsRepository.getConversation(conversationId)
    )

    if (fetchConversation.error) {
      logger.error(fetchConversation.error)
      throw new InternalServerErrorException('Unable to get conversation')
    }

    if (!fetchConversation.result) {
      throw new NotFoundException('Conversation not found')
    }

    const conversation = fetchConversation.result!
    const agent = await this.getAgent(conversation.agentId)
    const customAgentService = this.getCustomAgentService(agent)

    conversation.messages.push({
      id: nanoid(),
      role: 'user',
      content: validation.data.message,
      createdAt: new Date(),
    })

    await asyncWrap(this.conversationsRepository.update(conversation))
    const answer = await customAgentService.answer(conversation.messages)

    conversation.messages.push(answer)

    const updateConversation = await asyncWrap(this.conversationsRepository.update(conversation))

    if (updateConversation.error) {
      logger.error(updateConversation.error)
      throw new InternalServerErrorException('Unable to update conversation')
    }

    return updateConversation.result
  }

  private getCustomAgentService(agent: AgentModel) {
    switch (agent.type) {
      case 'echo':
        return new EchoCustomAgentService()
      default:
        return new EchoCustomAgentService()
    }
  }

  private async getAgent(agentId: number): Promise<AgentModel> {
    const fetchAgent = await asyncWrap(this.agentRepository.getAgent(agentId))

    if (fetchAgent.error) {
      logger.error(fetchAgent.error)
      throw new InternalServerErrorException('Unable to fetch agent')
    }

    if (!fetchAgent.result) {
      throw new NotFoundException('Agent not found')
    }

    return fetchAgent.result!
  }
}
