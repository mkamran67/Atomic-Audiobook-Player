import { dialog } from "electron";
import getSimpleBookData from "../electron-utils/bookData";
import { ELECTRON_ERROR, ELECTRON_RESPONSE_BOOKDATA_TYPE, ELECTRON_RESPONSE_BOOK_DETAILS_TYPE, ELECTRON_RESPONSE_SETTINGSDATA_TYPE } from "../electron-utils/constants";
import { RequestFromReactType, ResponseFromElectronType } from "../types/response.type";
import { BookData, BookDetails } from "../types/library.types";
import scanBooks, { getBookDetails } from "../electron-utils/utils";
import { handleSettings } from "../electron-utils/settings";
import { existsSync } from "original-fs";

export default async function handleRequestFromReact(event: any, req: RequestFromReactType): Promise<void> {
  const { type, data } = req;
  console.log("👉 -> file: recievers.ts:12 -> req:", req)

  // Possible actionable requests from frontend
  // 1. Get all books from precompiled data
  // 2. Scan a directory for audiobooks
  // 3. Get settings from settings file
  // 4. Get a single book details
  switch (type) {
    // Returns the Library data to React -> Does not Scan or ReScan.
    case "getAllBooksSimplified": {
      try {
        const results: ResponseFromElectronType = {
          type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
          data: getSimpleBookData(),
        };
        event.reply("responseFromElectron", results);
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Scans a directory for audiobooks
    case "newAudioBookDirectory": {
      // Get directory path from user
      const dirPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        message: "Select the root directory containing your audiobooks",
      });
      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: {
            message: "Failed to get a directory",
          },
        };
        event.reply("responseFromElectron", results);
      } else if (dirPath) {
        try {
          const rootPathForBooks = dirPath.filePaths[0];
          // Scan for books and build a save file
          // This will take place in a sub process
          const arrayOfBooks: BookData[] = await scanBooks(rootPathForBooks);
          const results: ResponseFromElectronType = {
            type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
            data: arrayOfBooks,
          };
          if (arrayOfBooks) {
            console.log(`Updating Settings ->`);
            await handleSettings("update", arrayOfBooks);
            console.log(`Sending to React -> length : `, arrayOfBooks);
            event.reply("responseFromElectron", results);
          }
        } catch (err) {
          const results: ResponseFromElectronType = {
            type: ELECTRON_ERROR,
            data: err,
          };
          event.reply("responseFromElectron", results);
        }
      }
      break;
    }
    // Get settings from file
    case "getSettings": {
      try {
        const res = await handleSettings("read", data);
        if (res) {
          const results: ResponseFromElectronType = {
            type: ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
            data: res,
          };
          event.reply("responseFromElectron", results);
        }
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Get a books details
    case "getBookDetails": {
      try {
        // TODO -> Send to child process to fetch the book details
        const { path } = data;
        if (existsSync(path)) {
          const results: BookDetails = await getBookDetails(path);
          if (results) {
            console.log(`Replying to React`);
            const reply: ResponseFromElectronType = {
              type: ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
              data: results,
            };
            event.reply("responseFromElectron", reply);
          }
        } else {
          throw new Error(`Did not find book at : ${path}`);
        }
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Save current book progress
    case "saveBookProgress": {
      console.log(`You've hit ${type}`);
      console.log(data);
      break;
    }
    // get book history
    default: {
      console.log(`You've hit default -> ${type}`);
      break;
    }
  }
}