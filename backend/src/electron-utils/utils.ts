import { app } from "electron";
import { existsSync, readdirSync, mkdirSync } from "fs";
import path from "node:path";

interface BookData {
  name: string;
  cover: string;
  dirPath: string;
}

function writeToDisk(appData: string, path: string, name: string, cover: string) {
  // STUB - Try the sloppy way of storage
  // STUB - Try stringified JSON
  // 1. Append to textfile
  // Data to appened
  // NAME - GENRE (TAGS) - COVER PATH - DIRECTORY PATH
  try {
  } catch (err) {}
}

function recursiveBookSearch(bookList, dirPath: string) {
  let directoryElements = readdirSync(dirPath, { withFileTypes: true });

  if (!directoryElements || directoryElements.length === 0) {
    return;
  }

  // if first file is not a directory appened it to bookList
  if (!directoryElements[0].isDirectory()) {
    bookList.push(dirPath);
    return; // End of recursion
  }

  // Else recall recursively
  for (let i = 0; i < directoryElements.length; i++) {
    recursiveBookSearch(bookList, path.join(dirPath, directoryElements[i].name));
  }
}

//
function directorySearch(dirPath: string) {
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
  console.log(`Book count : ${bookList.length} \n\n`);
  console.log(bookList);
}

export default function scanBooks(rootDir) {
  let appDataPath = app.getPath("appData");

  // 1. Create a folder to store our book information
  try {
    if (!existsSync(`${appDataPath}/bookinfo`)) {
      mkdirSync(`${appDataPath}/bookinfo`);
      appDataPath = appDataPath + "/bookinfo";
    }
  } catch (err) {
    throw new Error("Failed to check or create a folder.");
  }

  // 2. Search directories til bottom (mp3 files)
  directorySearch(rootDir);
}
