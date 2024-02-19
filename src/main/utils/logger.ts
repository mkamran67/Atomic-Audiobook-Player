import winston, { createLogger, format, transports } from 'winston'
import {
  ERROR_LOG_LOCATION,
  EXCEPTION_LOG_LOCATION,
  INFO_LOG_LOCATION
} from '../electron_constants'

class Logger {
  private logger: winston.Logger

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.json(),
      transports: [
        new transports.Console(),
        new transports.File({ filename: ERROR_LOG_LOCATION, level: 'error' }),
        new transports.File({ filename: INFO_LOG_LOCATION, level: 'info' })
      ],
      exceptionHandlers: [
        new transports.File({ filename: EXCEPTION_LOG_LOCATION, level: 'exceptions' })
      ]
    })
  }

  public info(message: string): void {
    this.logger.info(message)
  }

  public error(message: string): void {
    this.logger.error(message)
  }

  public warn(message: string): void {
    this.logger.warn(message)
  }
}

const logger = new Logger()

export default logger
