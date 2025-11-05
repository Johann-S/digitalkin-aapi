import redis from '@adonisjs/redis/services/main'

export class AgentRepository {
  private readonly prefix = 'agent:'

  async findAll() {
    const keys = await redis.keys(`${this.prefix}*`)

    if (keys.length === 0) {
      return []
    }

    const agents = await redis.mget(keys)
    return agents.map((agent) => JSON.parse(agent as string))
  }
}
