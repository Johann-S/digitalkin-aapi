import { z } from 'zod/v4'

export const agentValidator = z.object({
  id: z.number(),
  name: z.string().trim().min(1).max(150),
  persona: z.string().trim().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createAgentValidator = z.object({
  name: z.string().trim().min(1).max(150),
  persona: z.string().trim().min(1),
})

export type CreateAgentRequest = z.infer<typeof createAgentValidator>
