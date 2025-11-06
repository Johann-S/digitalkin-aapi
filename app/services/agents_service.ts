import logger from '@adonisjs/core/services/logger'
import { inject } from '@adonisjs/core'

import { AgentRepository } from '#repositories/agent_repository'
import { CreateAgentRequest, createAgentValidator } from '#validators/agent_validator'
import { asyncWrap } from '#utilities/util'

/** Exceptions */
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'

@inject()
export default class AgentsService {
  constructor(private readonly agentRepository: AgentRepository) {}

  async findAll() {
    const findAllAgents = await asyncWrap(this.agentRepository.findAll())

    if (findAllAgents.error) {
      logger.error('unable to get agents', findAllAgents.error)
      throw new InternalServerErrorException('unable to get agents')
    }

    return findAllAgents.result
  }

  async create(data: Partial<CreateAgentRequest>) {
    const validation = createAgentValidator.safeParse(data)

    if (!validation.success) {
      throw new BadRequestException(validation.error.message)
    }

    const agentData = validation.data
    const agentAlreadyExists = await asyncWrap(this.agentRepository.countByName(agentData.name))

    if (agentAlreadyExists.error) {
      logger.error('unable to count agents by name', agentAlreadyExists.error)
      throw new InternalServerErrorException('unable to create an agent')
    }

    if (agentAlreadyExists.result && agentAlreadyExists.result > 0) {
      throw new BadRequestException(`Agent with name "${agentData.name}" already exists`)
    }

    const createAgent = await asyncWrap(this.agentRepository.create(agentData))

    if (createAgent.error) {
      logger.error('unable to create an agent', createAgent.error)
      throw new InternalServerErrorException('unable to create an agent')
    }

    return createAgent.result
  }

  async getAgent(id: number) {
    const getAgent = await asyncWrap(this.agentRepository.getAgent(id))

    if (getAgent.error) {
      logger.error('unable to get agent', getAgent.error)
      throw new InternalServerErrorException('unable to get agent')
    }

    return getAgent.result
  }
}
