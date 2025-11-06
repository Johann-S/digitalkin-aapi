import redis from '@adonisjs/redis/services/main'
import slugify from 'slugify'

import { AgentModel } from '#models/agent_model'
import { agentValidator, CreateAgentRequest } from '#validators/agent_validator'

export class AgentRepository {
  private readonly prefix = 'agent'

  async findAll() {
    const keys = await redis.keys(`${this.prefix}:*`)

    if (keys.length === 0) {
      return []
    }

    const agents = await redis.mget(keys)

    return agents.map((agent) => agentValidator.parse(JSON.parse(agent as string)))
  }

  async countByName(name: string): Promise<number> {
    const agentKeyPattern = `${this.prefix}:*-${this.slugifyAgentName(name)}`
    const keys = await redis.keys(agentKeyPattern)

    return keys.length
  }

  async create(data: CreateAgentRequest): Promise<AgentModel> {
    const id = await this.generateId()
    const agent = {
      id,
      name: data.name,
      type: data.type,
      persona: data.persona,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies AgentModel

    const agentNameSlug = this.slugifyAgentName(agent.name)
    const agentKey = `${this.prefix}:${id}-${agentNameSlug}`

    await redis.set(agentKey, JSON.stringify(agent))

    return agent
  }

  async getAgent(id: number) {
    const agentKeyPattern = `${this.prefix}:${id}-*`
    const keys = await redis.keys(agentKeyPattern)

    if (keys.length === 0) {
      return null
    }

    const agent = await redis.get(keys[0])

    return agentValidator.parse(JSON.parse(agent as string))
  }

  async update(id: number, agent: AgentModel) {
    const agentNameSlug = this.slugifyAgentName(agent.name)
    const agentKey = `${this.prefix}:${id}-${agentNameSlug}`

    await redis.set(agentKey, JSON.stringify(agent))

    return agent
  }

  async delete(agent: AgentModel) {
    const agentNameSlug = this.slugifyAgentName(agent.name)
    const agentKey = `${this.prefix}:${agent.id}-${agentNameSlug}`

    await redis.del(agentKey)
  }

  private async generateId(): Promise<number> {
    return await redis.incr('agent-id')
  }

  private slugifyAgentName(name: string): string {
    return slugify.default(name, { lower: true })
  }
}
