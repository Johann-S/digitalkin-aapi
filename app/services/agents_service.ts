import logger from '@adonisjs/core/services/logger'
import { inject } from '@adonisjs/core'

import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { AgentRepository } from '#repositories/agent_repository'

@inject()
export default class AgentsService {
  constructor(private readonly agentRepository: AgentRepository) {}

  async findAll() {
    try {
      return this.agentRepository.findAll()
    } catch (error) {
      logger.error('unable to get agents', error)
      throw new InternalServerErrorException('unable to get agents')
    }
  }
}
