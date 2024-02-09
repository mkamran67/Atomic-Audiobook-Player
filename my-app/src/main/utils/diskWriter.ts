import fs from 'fs'
import { ErrorType } from '../types/util.types'
import logger from './logger'

export function writeToDisk(filePath: string, data: any): void | ErrorType {
  const jsonString = JSON.stringify(data)

  try {
    fs.writeFileSync(filePath, jsonString)
  } catch (error: unknown) {
    logger.error('Error writing file')

    if (error instanceof Error && error.stack) {
      logger.error(error.stack)
      return { message: 'Error writing file', data: error }
    } else {
      return { message: 'Error writing file', data: 'Unknown error' }
    }
  }
}
