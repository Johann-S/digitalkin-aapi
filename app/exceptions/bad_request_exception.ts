import { Exception } from '@adonisjs/core/exceptions'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export default class BadRequestException extends Exception {
  constructor(message = getReasonPhrase(StatusCodes.BAD_REQUEST)) {
    super(message, {
      status: StatusCodes.BAD_REQUEST,
      code: 'BAD_REQUEST',
    })
  }
}
