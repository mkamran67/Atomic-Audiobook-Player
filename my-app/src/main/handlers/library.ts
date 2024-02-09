import {
  ADD_BOOK_DIRECTORY,
  GET_BOOK_COVERS,
  READ_LIBRARY_FILE,
  READ_SETTINGS_FILE,
  RESPONSE_FROM_ELECTRON,
  SAVE_BOOK_PROGRESS,
  WRITE_SETTINGS_FILE
} from '../../shared/constants'
import { checkIfDirectoryExists, readAndParseTextFile } from '../utils/diskReader'
import { SETTINGS_LOCATION } from '../electron_constants'
import { handleSettings } from './settings'
export interface RequestFromReactType {
  type: string
  data: any
}

async function handleRendererRequest(event: any, request: RequestFromReactType) {
  const { type, data } = request

  switch (type) {
    case READ_LIBRARY_FILE: {
      break
    }
    case READ_SETTINGS_FILE: {
      break
    }
    case WRITE_SETTINGS_FILE: {
      break
    }
    case ADD_BOOK_DIRECTORY: {
      // 1. Add the new directory to settings file
      if (checkIfDirectoryExists(data)) {
        event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: 'Directory already exists.' })
      }

      const settingsFile = readAndParseTextFile(SETTINGS_LOCATION)
      // 2. Push the new directory to the settings file
      let directories = settingsFile.directories
      await handleSettings('update', directories.push(data))
      // 3. Read the new directory
      const listOfBooks = await readRootDirectory(data)
      // 4. Return the new book files

      //*. Check for duplicates
      break
    }
    case SAVE_BOOK_PROGRESS: {
      break
    }
    case GET_BOOK_COVERS: {
      break
    }
    default: {
      console.log(
        `You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`
      )
      break
    }
  }
}

export { handleRendererRequest }
