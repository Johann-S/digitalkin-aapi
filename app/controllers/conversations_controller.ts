import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import ConversationsService from '#services/conversations_service'

@inject()
export default class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  create(ctx: HttpContext) {
    return this.conversationsService.create(ctx.request.body(), ctx.response)
  }

  sendMessage(ctx: HttpContext) {
    return this.conversationsService.sendMessage(ctx.params.id, ctx.request.body(), ctx.response)
  }

  getConversation(ctx: HttpContext) {
    return this.conversationsService.getConversation(ctx.params.id)
  }
}
