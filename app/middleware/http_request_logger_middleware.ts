import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import parseDuration from 'parse-duration'

export default class HttpRequestLoggerMiddleware {
  async handle({ logger, request, response }: HttpContext, next: NextFn) {
    const start = Date.now()

    response.onFinish(() => {
      const duration = Date.now() - start
      const seconds = parseDuration(`${duration}ms`, 's')

      logger.info(`http: ${request.method()} ${request.url(true)} ${seconds}s`)
    })

    return next()
  }
}
