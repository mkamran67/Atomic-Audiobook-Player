import { existsSync, readFileSync } from "original-fs";
import { BOOKS_LIST_LOCATION, INFO_FOLDER_LOCATION } from "./constants";

export default function getSimpleBookData() {
  // TODO -
  // 1. Check if directory exists
  if (existsSync(INFO_FOLDER_LOCATION)) {
    // 2. Check if the library file exists
    if (existsSync(BOOKS_LIST_LOCATION)) {
      // 3. Read the file
      console.log(readFileSync(BOOKS_LIST_LOCATION, "utf-8"));

      // event.reply("BooksFromMain", readFileSync(BOOKS_LIST_LOCATION));
    }
  }

  return 1;
}
