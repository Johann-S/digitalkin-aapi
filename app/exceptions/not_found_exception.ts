import { Exception } from '@adonisjs/core/exceptions'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export default class NotFoundException extends Exception {
  constructor(message = getReasonPhrase(StatusCodes.NOT_FOUND)) {
    super(message, {
      status: StatusCodes.NOT_FOUND,
      code: 'NOT_FOUND',
    })
  }
}
