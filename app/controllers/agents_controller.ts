import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import AgentsService from '#services/agents_service'

@inject()
export default class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  index() {
    return this.agentsService.findAll()
  }

  create(ctx: HttpContext) {
    return this.agentsService.create(ctx.request.body())
  }

  getAgent(ctx: HttpContext) {
    return this.agentsService.getAgent(ctx.params.id)
  }

  update(ctx: HttpContext) {
    return this.agentsService.update(ctx.params.id, ctx.request.body())
  }
}
