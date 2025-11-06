import { z } from 'zod/v4'

import {
  conversationValidator,
  conversationMessageValidator,
} from '#validators/conversation_validator'

export type ConversationModel = z.infer<typeof conversationValidator>
export type ConversationMessageModel = z.infer<typeof conversationMessageValidator>
