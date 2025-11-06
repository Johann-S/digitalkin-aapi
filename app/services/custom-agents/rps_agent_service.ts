import { nanoid } from 'nanoid'

import { AbstractCustomAgent } from '#services/custom-agents/abstract_custom_agent'
import { ConversationMessageModel } from '#models/conversation_model'
import { delay } from '#utilities/util'

// Rocker Paper Scissors custom agent
export class RPSCustomAgentService extends AbstractCustomAgent {
  private readonly emojiMap: Record<string, string> = {
    '🪨': 'rock',
    '📄': 'paper',
    '✂️': 'scissors',
  }

  private readonly textToEmoji: Record<string, string> = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
  }

  private readonly winningMoveMap: Record<string, string> = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock',
  }

  async answer(data: {
    persona: string
    messages: ConversationMessageModel[]
  }): Promise<ConversationMessageModel> {
    await delay(300) // Simulate a delay

    const lasUserMessage = data.messages[data.messages.length - 1]
    const normalizedMove = this.normalizeMove(lasUserMessage.content)

    if (!normalizedMove) {
      return {
        id: nanoid(),
        role: 'assistant',
        content: "I don't understand your move. Please use rock, paper, or scissors or 🪨, 📄, ✂️",
        createdAt: new Date(),
      }
    }

    // Use only previous messages (history) to predict, not the current user move
    // In RPS, both players choose simultaneously
    const historyMessages = data.messages.slice(0, -1)
    const move = this.determineMove(historyMessages)

    return {
      id: nanoid(),
      role: 'assistant',
      content: this.textToEmoji[move] || move,
      createdAt: new Date(),
    }
  }

  private normalizeMove(content: string) {
    const normalized = content.toLowerCase()

    if (['rock', 'paper', 'scissors'].includes(normalized)) {
      return normalized
    }

    if (this.emojiMap[content]) {
      return this.emojiMap[content]
    }

    return null
  }

  private determineMove(messages: ConversationMessageModel[]): string {
    const userMoves = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => this.normalizeMove(msg.content))
      .filter((move): move is string => !!move)

    // Rule 1: first round always play paper (french people play with well which doesn't exist in the original game)
    if (userMoves.length === 0) {
      return 'paper'
    }

    const lastUserMove = userMoves[userMoves.length - 1]

    // Rule 2: Check if user played the same symbol 2 times in a row
    // They won't play it a 3rd time, so we can counter the next expected move
    if (userMoves.length >= 2) {
      const secondLastMove = userMoves[userMoves.length - 2]

      if (lastUserMove === secondLastMove) {
        return this.getWinningMove(lastUserMove)
      }
    }

    // Get assistant moves to determine win/loss
    const assistantMoves = messages
      .filter((msg) => msg.role === 'assistant')
      .map((msg) => this.normalizeMove(msg.content))
      .filter((move): move is string => move !== null)

    if (assistantMoves.length > 0) {
      const lastAssistantMove = assistantMoves[assistantMoves.length - 1]
      const lastRoundResult = this.determineRoundResult(lastUserMove, lastAssistantMove)

      // Rule 3: When user wins, play the symbol that would have won the previous round
      if (lastRoundResult === 'user_won') {
        return this.getWinningMove(lastUserMove)
      }

      // Rule 4: If user lost, they'll play the next symbol in sequence (rock -> paper -> scissors -> rock)
      if (lastRoundResult === 'assistant_won') {
        const nextUserMove = this.getNextSymbol(lastUserMove)

        return this.getWinningMove(nextUserMove)
      }
    }

    // Default: play something that beats their last move
    return this.getWinningMove(lastUserMove)
  }

  private getWinningMove(opponentMove: string): string {
    return this.winningMoveMap[opponentMove] || 'paper'
  }

  private getNextSymbol(currentSymbol: string): string {
    return this.winningMoveMap[currentSymbol] || 'rock'
  }

  private determineRoundResult(userMove: string, assistantMove: string): string {
    if (userMove === assistantMove) {
      return 'draw'
    }

    const userWins =
      (userMove === 'rock' && assistantMove === 'scissors') ||
      (userMove === 'paper' && assistantMove === 'rock') ||
      (userMove === 'scissors' && assistantMove === 'paper')

    return userWins ? 'user_won' : 'assistant_won'
  }
}
