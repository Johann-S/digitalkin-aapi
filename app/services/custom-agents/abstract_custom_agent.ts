import { ConversationMessageModel } from '#models/conversation_model'

export abstract class AbstractCustomAgent {
  abstract answerStream(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): AsyncGenerator<string, ConversationMessageModel>
}
