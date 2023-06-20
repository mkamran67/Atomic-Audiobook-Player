import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import * as jsmediatags from "jsmediatags";
import path from "node:path";
import { statSync } from "original-fs";
import { BookData, BookDetails, MinimumChapterDetails } from "../types/library.types";
import { BOOKS_LIST_LOCATION, IMG_EXTENSIONS, INFO_FOLDER_LOCATION, MEDIA_EXTENSIONS } from "./constants";


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
      author: "",
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
      if (!checked && MEDIA_EXTENSIONS.includes(fileExtension)) {
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
          bookData.author = "DNF";
        } else {
          bookData.author = results.artist;
        }

        checked = true;
      } else if (!coverFound && IMG_EXTENSIONS.includes(fileExtension)) {
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
    throw new Error(err);
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

// async function getAudioDuration(mediaPath: string): Promise<number> {
//   console.log("👉 -> file: utils.ts:227 -> mediaPath:", mediaPath)

//   const tempAudio = new Audic(mediaPath);
//   tempAudio.volume = 0;
//   await tempAudio.play();

//   if (tempAudio.duration == Infinity || isNaN(tempAudio.duration)) {
//     tempAudio.currentTime = 1000000000.0;
//     tempAudio.currentTime = 0;
//     console.log(tempAudio.duration);

//     tempAudio.pause();
//     tempAudio.destroy();
//     return 0;
//   } else {
//     tempAudio.pause();
//     tempAudio.destroy();
//     return tempAudio.duration;
//   }
// }

// "scripts": {
//   "start": "electron ./dist/electron.js",
//   "build": "tsc",
//   "seq": "npm run build && npm start",
//   "dev": "nodemon --watch src --exec npm run seq",
//   "clean": "rm -rf dist && rm -rf node_modules && rm -rf package-lock.json"
// },


/**
 *
 * @param mediaPath Path to media file
 * @param totalSize size in bytes
 * @param totalLength length in durations
 * @returns returns BookDetails object
 */
async function getAllDetailsOfAMediaFile(
  mediaPath: string,
  totalSize: number = 0,
  totalLength: number = 0
): Promise<[BookDetails, number, number]> {
  try {
    const bookDetails: BookDetails = await new Promise((resolve, reject) => {
      jsmediatags.read(mediaPath, {
        onSuccess: async (read_info: any) => {
          let currentChapterLength = 0;
          const totalTracks = read_info.tags.track ? read_info.tags.track.split("/")[1] : 1;

          totalSize += statSync(mediaPath).size;
          // Fix the duration of the audio file
          await getAudioDurationInSeconds(mediaPath).then((duration) => {
            currentChapterLength = duration;
            console.log("👉 -> file: utils.ts:248 -> currentChapterLength:", currentChapterLength)
          });

          // currentChapterLength = await getAudioDuration(mediaPath);


          totalLength += currentChapterLength; // Seconds 

          const bookData: BookDetails = {
            totalTracks: totalTracks,
            title: read_info.tags.title,
            author: read_info.tags.artist,
            year: read_info.tags.year,
            currentTime: 0,
            currentTrack: 1,
            currentChapter: mediaPath,
            chapterList: [
              {
                length: totalLength,
                path: mediaPath,
              },
            ],
          };

          resolve(bookData);
        },
        onError: (err) => {
          reject(err);
        },
      });
    });

    if (bookDetails) {
      return [bookDetails, totalSize, totalLength];
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getChapterDetails(
  mediaPath: string,
  totalSize: number = 0,
  totalLength: number = 0
): Promise<[MinimumChapterDetails, number, number]> {
  try {
    let currentChapterLength = 0;

    totalSize += statSync(mediaPath).size;
    await getAudioDurationInSeconds(mediaPath).then((duration) => {
      currentChapterLength = duration;
    });

    totalLength += currentChapterLength; // Seconds

    const chapterDetails: MinimumChapterDetails = {
      path: mediaPath,
      length: currentChapterLength,
    };

    if (chapterDetails) {
      return [chapterDetails, totalSize, totalLength];
    }
  } catch (err) {
    throw new Error(err);
  }
}

/**
 *
 * @param dirPath -> Path to Book directory
 * @returns A book object with book details and chapters
 */
export async function getBookDetails(dirPath: string): Promise<BookDetails> {
  try {
    const listOfFiles = readdirSync(dirPath, { withFileTypes: true });

    let chapters: string[] = [];
    let totalSize: number = 0;
    let totalLength: number = 0;
    let cover = "";
    let bookDetails: BookDetails;
    let bookDataTrigger: boolean = true; // If true means we don't have information about the book yet.

    // Get files from the book directory
    for (let index = 0; index < listOfFiles.length; index++) {
      const file = listOfFiles[index];

      if (file.isFile()) {
        let name = file.name;
        let fileSplit = name.split(".");
        let extension = fileSplit[fileSplit.length - 1];

        if (MEDIA_EXTENSIONS.includes(extension)) {
          chapters.push(name);
        } else if (IMG_EXTENSIONS.includes(extension)) {
          // Store the larger cover - hopefully better quality
          if (cover && statSync(path.join(dirPath, file.name)) > statSync(path.join(dirPath, cover))) {
            cover = file.name;
          } else if (!cover) {
            cover = file.name;
          }
        } else {
          // TODO -> Log here for testing
          console.log("File type not supported");
        }
      } else {
        console.log(`Not a file`);
      }
    }

    // Accumalte Chapter data and book information
    for (const chapter of chapters) {
      const chapterPath = path.join(dirPath, chapter);

      if (bookDataTrigger) {
        const [results, size, length] = await getAllDetailsOfAMediaFile(chapterPath);
        // bookDetails = await getAllDetailsOfAMediaFile(chapterPath, totalSize, totalLength);
        bookDetails = results;
        totalSize += size;
        totalLength += length;
        bookDataTrigger = false;
      } else {
        // bookDetails.chapterList.push(await getChapterDetails(chapterPath, totalSize, totalLength));
        const [results, size, length] = await getChapterDetails(chapterPath, totalSize, totalLength);
        bookDetails.chapterList.push(results);
        totalSize += size;
        totalLength += length;
      }
    }

    bookDetails.totalLength = totalLength;
    bookDetails.totalSize = totalSize;

    if (bookDetails) {
      return bookDetails;
    }
  } catch (err) {
    throw new Error(err);
  }
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
