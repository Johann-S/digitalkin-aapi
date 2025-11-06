import { ConversationMessageModel } from '#models/conversation_model'

export abstract class AbstractCustomAgent {
  abstract answer(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): Promise<ConversationMessageModel>
}
