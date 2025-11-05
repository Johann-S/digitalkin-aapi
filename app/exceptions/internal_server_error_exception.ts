import { Exception } from '@adonisjs/core/exceptions'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export default class InternalServerErrorException extends Exception {
  constructor(message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)) {
    super(message, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
    })
  }
}
