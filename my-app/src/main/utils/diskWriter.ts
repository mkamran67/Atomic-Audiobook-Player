import fs from 'fs'
import { writeFile } from 'fs/promises'
import { ErrorType } from '../types/util.types'
import logger from './logger'

/**
 * Write to disk synchronously
 * @param filePath string
 * @param data any
 * @returns void | ErrorType
 */
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

/**
 * Write to disk asynchronously
 * @param filePath string
 * @param data any
 * @returns void | ErrorType
 */
export async function writeToDiskAsync(filePath: string, data: any): Promise<void | ErrorType> {
  const jsonString = JSON.stringify(data)

  try {
    await writeFile(filePath, jsonString)
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
