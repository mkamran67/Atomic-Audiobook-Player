import { existsSync, readFileSync } from 'fs'
import { BOOKS_LIST_LOCATION, INFO_FOLDER_LOCATION } from './library_constants'

export default function getSimpleBookData() {
  // 1. Check if directory exists
  if (existsSync(INFO_FOLDER_LOCATION)) {
    // 2. Check if the library file exists
    if (existsSync(BOOKS_LIST_LOCATION)) {
      // 3. Read the file
      // event.reply("BooksFromMain", readFileSync(BOOKS_LIST_LOCATION));
      try {
        const results = JSON.parse(readFileSync(BOOKS_LIST_LOCATION, { encoding: 'utf-8' }))
        return results
      } catch (err) {
        return new Error(String(err))
      }
    }
  }

  return null
}
