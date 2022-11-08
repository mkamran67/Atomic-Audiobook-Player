import { app } from "electron";
import { existsSync, readdirSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import path from "node:path";
import * as jsmediatags from "jsmediatags";
import { imgExtensions, mediaExtensions } from "./constants";

interface BookData {
  title: string;
  artist: string;
  cover?: string;
  dirPath: string;
}

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

async function writeToDisk(appData: string, bookDirectories: string[]): Promise<boolean | string> {
  let listOfBooks = [];
  const dataFilePath = path.join(appData, "data.txt");

  // STUB - Try the sloppy way of storage
  // STUB - Try stringified JSON
  // Append to textfile
  // Data to appened
  // TITLE - COVER PATH - DIRECTORY PATH

  try {
    // for (let index = 0; index < bookDirectories.length; index++) {
    for (let index = 0; index < bookDirectories.length; index++) {
      const bookPath = bookDirectories[index];
      let bookData: BookData = {
        title: "",
        artist: "",
        cover: "",
        dirPath: bookPath,
      };

      // 1. Get information & build bookData
      let bookDirectoryContents = readdirSync(bookPath);
      let checked = false;

      // Get cover
      // Get other metadata -> genre/tags
      for (let i = 0; i < bookDirectoryContents.length; i++) {
        let theFile = bookDirectoryContents[i];
        let fileExtension = bookDirectoryContents[i].split(".")[1];
        let fullFilePath = path.join(bookPath, theFile);

        // check file type
        // if -> media get metadata
        // if -> image set cover
        if (!checked && mediaExtensions.includes(fileExtension)) {
          let results = await getTags(fullFilePath);

          if (results.title == "skip" || results.artist == "skip") {
            let splitPath = bookPath.split(path.sep);

            // Since no tag was found we use the directory as the name
            bookData.title = splitPath[splitPath.length - 1];
            bookData.artist = "DNF";
          } else {
            bookData.title = results.title;
            bookData.artist = results.artist;
          }
          checked = true;
        } else if (imgExtensions.includes(fileExtension)) {
          bookData.cover = fullFilePath;
        }

        listOfBooks.push(bookData);
      }
    }

    // 2. Write to disk
    writeFileSync(dataFilePath, JSON.stringify(listOfBooks));

    console.log(`Done writing all the books.\nData file path :  ${dataFilePath}`);

    return dataFilePath;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function recursiveBookSearch(bookList, dirPath: string) {
  let directoryElements = readdirSync(dirPath, { withFileTypes: true });

  if (!directoryElements || directoryElements.length === 0) {
    return;
  }

  // if first file is not a directory appened the directory to bookList
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

//
function directorySearch(dirPath: string): string[] {
  let currentDirectories = null;
  let bookList = [];

  // 1. Get list of initial Directories
  try {
    currentDirectories = readdirSync(dirPath, {
      withFileTypes: true,
    });
  } catch (err) {
    console.error(err);
  }

  if (currentDirectories && currentDirectories.length > 0) {
    for (let index = 0; index < currentDirectories.length; index++) {
      if (currentDirectories[index].isDirectory()) {
        recursiveBookSearch(bookList, path.join(dirPath, currentDirectories[index].name));
      }
    }
  }

  return bookList;
}

export default function scanBooks(rootDir) {
  let appDataPath = app.getPath("appData");

  // 1. Create a folder to store our book information
  try {
    if (!existsSync(`${appDataPath}/bookinfo`)) {
      mkdirSync(`${appDataPath}/bookinfo`);
    }
  } catch (err) {
    throw new Error("Failed to check or create a folder.");
  }

  appDataPath = path.join(appDataPath, "bookinfo");

  // 2. Search directories til bottom (mp3 files)
  let bookDirectories = directorySearch(rootDir);

  const filePath = writeToDisk(appDataPath, bookDirectories);

  if (filePath) {
    return filePath;
  }
  // Send Main thread the book data path
}
