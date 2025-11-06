import { z } from 'zod/v4'

export const conversationMessageValidator = z.object({
  id: z.nanoid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1),
  createdAt: z.coerce.date(),
})

export const conversationValidator = z.object({
  id: z.nanoid(),
  agentId: z.number(),
  messages: z.array(conversationMessageValidator),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createConversationValidator = z.object({
  agentId: z.number(),
  message: z.string().trim().min(1),
})

export const sendMessageConversationValidator = z.object({
  message: z.string().trim().min(1),
})

export type CreateConversationRequest = z.infer<typeof createConversationValidator>
export type SendMessageConversationRequest = z.infer<typeof sendMessageConversationValidator>
