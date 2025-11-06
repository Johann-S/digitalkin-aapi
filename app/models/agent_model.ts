import { z } from 'zod/v4'

import { agentValidator } from '#validators/agent_validator'

export type AgentModel = z.infer<typeof agentValidator>
