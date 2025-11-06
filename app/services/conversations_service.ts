import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { nanoid } from 'nanoid'
import type { Response } from '@adonisjs/core/http'

import {
  CreateConversationRequest,
  createConversationValidator,
  SendMessageConversationRequest,
  sendMessageConversationValidator,
} from '#validators/conversation_validator'
import { asyncWrap } from '#utilities/util'

/** Custom Agents */
import { EchoCustomAgentService } from '#services/custom-agents/echo_custom_agent_service'
import { RPSCustomAgentService } from '#services/custom-agents/rps_custom_agent_service'
import { OpenAICustomAgentService } from '#services/custom-agents/openai_custom_agent_service'

/** Repositories */
import { ConversationRepository } from '#repositories/conversation_repository'
import { AgentRepository } from '#repositories/agent_repository'

/** Exceptions */
import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'

/** Models */
import { AgentModel } from '#models/agent_model'

@inject()
export default class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationRepository,
    private readonly agentRepository: AgentRepository
  ) {}

  async create(data: Partial<CreateConversationRequest>, ctxResponse: Response) {
    ctxResponse.relayHeaders()
    ctxResponse.response.setHeader('Content-Type', 'application/x-ndjson')
    ctxResponse.response.setHeader('Transfer-Encoding', 'chunked')
    ctxResponse.response.setHeader('Cache-Control', 'no-cache')
    ctxResponse.response.setHeader('Connection', 'keep-alive')
    ctxResponse.response.write('')

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
    const stream = customAgentService.answerStream({
      persona: agent.persona,
      messages: conversation.messages,
    })

    try {
      let result = await stream.next()

      while (!result.done) {
        const chunk = result.value
        const payload = JSON.stringify({ type: 'chunk', content: chunk })
        ctxResponse.response.write(`${payload}\n`)
        result = await stream.next()
      }

      if (result.value) {
        conversation.messages.push(result.value)

        const completionPayload = JSON.stringify({
          type: 'complete',
          conversationId: conversation.id,
          message: result.value,
        })
        ctxResponse.response.write(`${completionPayload}\n`)
      }
    } catch (error) {
      logger.error(error)
      const errorPayload = JSON.stringify({
        type: 'error',
        error: 'Streaming failed',
      })
      ctxResponse.response.write(`${errorPayload}\n`)
      throw new InternalServerErrorException('Streaming failed')
    } finally {
      ctxResponse.response.end()
    }

    const updateConversation = await asyncWrap(this.conversationsRepository.update(conversation))

    if (updateConversation.error) {
      logger.error(updateConversation.error)
      throw new InternalServerErrorException('Unable to update conversation')
    }

    return {
      conversationId: conversation.id,
      answer: conversation.messages[conversation.messages.length - 1],
    }
  }

  async sendMessage(
    conversationId: string,
    data: Partial<SendMessageConversationRequest>,
    ctxResponse: Response
  ) {
    ctxResponse.relayHeaders()
    ctxResponse.response.setHeader('Content-Type', 'application/x-ndjson')
    ctxResponse.response.setHeader('Transfer-Encoding', 'chunked')
    ctxResponse.response.setHeader('Cache-Control', 'no-cache')
    ctxResponse.response.setHeader('Connection', 'keep-alive')
    ctxResponse.response.write('')

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
    const stream = customAgentService.answerStream({
      persona: agent.persona,
      messages: conversation.messages,
    })

    try {
      let result = await stream.next()

      while (!result.done) {
        const chunk = result.value
        const payload = JSON.stringify({ type: 'chunk', content: chunk })
        ctxResponse.response.write(`${payload}\n`)
        result = await stream.next()
      }

      if (result.value) {
        conversation.messages.push(result.value)

        const completionPayload = JSON.stringify({
          type: 'complete',
          message: result.value,
        })
        ctxResponse.response.write(`${completionPayload}\n`)
      }
    } catch (error) {
      logger.error(error)
      const errorPayload = JSON.stringify({
        type: 'error',
        error: 'Streaming failed',
      })
      ctxResponse.response.write(`${errorPayload}\n`)
      throw new InternalServerErrorException('Streaming failed')
    } finally {
      ctxResponse.response.end()
    }

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
      case 'rps':
        return new RPSCustomAgentService()
      case 'openai':
        return new OpenAICustomAgentService()
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
