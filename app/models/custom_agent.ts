import { ConversationMessageModel } from '#models/conversation_model'

export interface CustomAgent {
  answerStream(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): AsyncGenerator<string, ConversationMessageModel>
}
