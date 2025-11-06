import { ConversationMessageModel } from '#models/conversation_model'

export abstract class AbstractCustomAgent {
  abstract answer(messages: ConversationMessageModel[]): Promise<ConversationMessageModel>
}
