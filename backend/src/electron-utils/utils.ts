import { app } from "electron";
import { existsSync, readdirSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import path from "node:path";
import * as jsmediatags from "jsmediatags";
import { BOOKS_LIST_LOCATION, INFO_FOLDER_LOCATION, imgExtensions, mediaExtensions } from "./constants";
import { BookData } from "../types/library.types";

async function getTags(fullFilePath: string): Promise<{ title: string; artist: string }> {
  try {
    const res: any = await new Promise((resolve, reject) => {
      new jsmediatags.Reader(fullFilePath).read({
        onSuccess: (tag) => {
          resolve(tag);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });

    if (res) {
      return { title: res.tags.title, artist: res.tags.artist };
    }
  } catch (err) {
    if (err.type == "tagFormat") {
      return { title: "skip", artist: "skip" };
    }
    console.error(err);
  }
}

// async function getBookInformation(listOfBooks, bookDirectories: string[]) {
//   // iterate through directories
//   for (let index = 0; index < bookDirectories.length; index++) {
//     const bookPath = bookDirectories[index]; // Path to book directory

//     let bookData: BookData = {
//       title: "",
//       artist: "",
//       cover: "",
//       dirPath: bookPath,
//     };

//     // 1. Get information & build bookData
//     let bookDirectoryContents = readdirSync(bookPath);
//     let checked = false;

//     // Get cover
//     // Get other metadata -> genre/tags
//     for (let i = 0; i < bookDirectoryContents.length; i++) {
//       let theFile = bookDirectoryContents[i];
//       let fileExtension = bookDirectoryContents[i].split(".")[1];
//       let fullFilePath = path.join(bookPath, theFile);

//       // check file type
//       // if -> media get metadata
//       // if -> image set cover
//       if (!checked && mediaExtensions.includes(fileExtension)) {
//         let results = await getTags(fullFilePath);

//         if (results.title == "skip" || results.artist == "skip") {
//           let splitPath = bookPath.split(path.sep);

//           // Since no tag was found we use the directory as the name
//           bookData.title = splitPath[splitPath.length - 1];
//           bookData.artist = "DNF";
//         } else {
//           bookData.title = results.title;
//           bookData.artist = results.artist;
//         }
//         checked = true;
//       } else if (imgExtensions.includes(fileExtension)) {
//         bookData.cover = fullFilePath;
//       }

//       listOfBooks.push(bookData);
//     }
//   }
// }

// NOTE - Might use this later

async function getBookInformation(bookDirectories: string[]): Promise<BookData[]> {
  let anArrayOfBookData: BookData[] = [];

  console.log("\n\n");

  // iterate through directories
  for (let index = 0; index < bookDirectories.length; index++) {
    const bookPath = bookDirectories[index]; // Path to book directory

    let bookData: BookData = {
      title: "",
      artist: "",
      cover: "",
      dirPath: bookPath,
    };

    // 1. Get current directory content & build bookData
    let bookDirectoryContents = readdirSync(bookPath);
    let checked = false;
    let coverFound = false;

    // Get cover
    // Get other metadata -> genre/tags
    // iterate through directory contents
    for (let i = 0; i < bookDirectoryContents.length; i++) {
      let theFile = bookDirectoryContents[i]; // File name
      let fileExtension = bookDirectoryContents[i].split(".")[1]; // File extension
      let fullFilePath = path.join(bookPath, theFile); // Path to file

      // if 'audiobook' hasn't been checked && is a supported extension
      if (!checked && mediaExtensions.includes(fileExtension)) {
        // get tags
        let results = await getTags(fullFilePath);

        // if no title
        if (results.title == "skip") {
          let splitPath = bookPath.split(path.sep); // Split bookPath at \ or /
          bookData.title = splitPath[splitPath.length - 1]; // Since no tag was found we use the directory as the name
        } else {
          bookData.title = results.title;
        }

        // if no artist
        if (results.artist == "skip") {
          bookData.artist = "DNF";
        } else {
          bookData.artist = results.artist;
        }

        checked = true;
      } else if (!coverFound && imgExtensions.includes(fileExtension)) {
        bookData.cover = fullFilePath;
        coverFound = true;
      } // else if

      // if both are checked break out of the loop
      if (checked && coverFound) {
        break;
      }
    } // for 2
    anArrayOfBookData.push(bookData);
  } // for 1

  return anArrayOfBookData;
}

async function buildSimpleBookData(listOfBooks: BookData[], bookDirectories: string[]) {
  // This function will build a list containing only
  // Title - Cover Path - Directory Path

  for (let index = 0; index < bookDirectories.length; index++) {
    const book = bookDirectories[index];

    // 1. Get book title
    let results = await getTags(book);
  }
}

async function writeToDisk(anArrayOfBookData: BookData[]): Promise<boolean | string> {
  try {
    // 1. Write book information to disk
    writeFileSync(BOOKS_LIST_LOCATION, JSON.stringify(anArrayOfBookData));

    console.log(`\nDone writing all the books.\nData file path :  ${BOOKS_LIST_LOCATION}`);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// 3. Recursively call searches
function recursiveBookSearch(bookList: string[], dirPath: string): void {
  // Read the contents of the current directory
  const directoryElements = readdirSync(dirPath, { withFileTypes: true });

  // if it's empty -> return;
  if (!directoryElements || directoryElements.length === 0) {
    return;
  }

  // if the first file is not a directory -> push the current directory as an audiobook location;
  if (!directoryElements[0].isDirectory()) {
    bookList.push(dirPath);
    return; // End of recursion
  }

  // Else recall recursively
  for (let i = 0; i < directoryElements.length; i++) {
    if (directoryElements[i].isDirectory()) {
      recursiveBookSearch(bookList, path.join(dirPath, directoryElements[i].name));
    }
  }
}

// 2. Starts the search for audiobooks
function directorySearch(dirPath: string): string[] {
  let currentDirectories = null;
  let bookList: string[] = [];

  // 1. Get list of initial Directories
  try {
    currentDirectories = readdirSync(dirPath, {
      withFileTypes: true,
    });
  } catch (err) {
    console.error(err);
  }

  if (currentDirectories && currentDirectories.length > 0) {
    // 2. Loop through each directory calling recursiveBookSearch
    for (let index = 0; index < currentDirectories.length; index++) {
      if (currentDirectories[index].isDirectory()) {
        recursiveBookSearch(bookList, path.join(dirPath, currentDirectories[index].name));
      }
    }
  }

  return bookList;
}

// 1. Starts the scan and returns the list of BookData[]
export default async function scanBooks(rootDir: string): Promise<BookData[]> {
  // 1. Create a folder to store our book information
  try {
    if (!existsSync(INFO_FOLDER_LOCATION)) {
      mkdirSync(INFO_FOLDER_LOCATION);
    }
  } catch (err) {
    throw new Error("Failed to check or create a folder.");
  }

  // 2. Search directories til bottom (mp3 files)
  let listOfBookDirectories: string[] = directorySearch(rootDir);

  // 3. Get BookData ->AKA-> information
  let bookData: BookData[] = await getBookInformation(listOfBookDirectories);

  // 3. Write to disk
  await writeToDisk(bookData);

  // Send Main thread the book data path
  return bookData;
}
