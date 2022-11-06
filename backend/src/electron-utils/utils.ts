import { app } from "electron";
import { existsSync, readdirSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import path from "node:path";
import * as jsmediatags from "jsmediatags";

interface BookData {
  title: string;
  artist: string;
  cover?: string;
  dirPath: string;
}

async function getTags(fullFilePath: string) {
  let title = "";
  let artist = "";

  await new jsmediatags.Reader(fullFilePath).setTagsToRead(["title", "artist"]).read({
    onSuccess: function (tag) {
      if (tag.tags.title) {
        title = tag.tags.title;
      }
      if (tag.tags.artist) {
        artist = tag.tags.artist;
      }
    },
    onError: function (error) {
      console.log(`Error occured reading media tags`);
      console.error(error);
    },
  });

  return { title, artist };
}

async function writeToDisk(appData: string, bookDirectories: string[]): Promise<boolean> {
  const mediaExtensions = ["mp3", "m4b"];
  const imgExtensions = ["img", "jpeg", "jpg", "png"];
  const dataFilePath = path.join(appData, "data.txt");
  let listOfBooks = [];

  // STUB - Try the sloppy way of storage
  // STUB - Try stringified JSON
  // Append to textfile
  // Data to appened
  // TITLE - GENRE (TAGS) - COVER PATH - DIRECTORY PATH

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

      // Get cover
      // Get other metadata -> genre/tags
      for (let i = 0; i < bookDirectoryContents.length; i++) {
        let theFile = bookDirectoryContents[i];
        let fileExtension = bookDirectoryContents[i].split(".")[1];
        let fullFilePath = path.join(bookPath, theFile);

        // check file type
        // if -> media get metadata
        // if -> image set cover
        if (mediaExtensions.includes(fileExtension)) {
          const { title, artist } = await getTags(fullFilePath);

          bookData.title = title;
          bookData.artist = artist;
        } else if (imgExtensions.includes(fileExtension)) {
          bookData.cover = fullFilePath;
        }

        listOfBooks.push(bookData);
      }
    }

    // 2. Write to disk
    writeFileSync(dataFilePath, JSON.stringify(listOfBooks));

    console.log(`Done writing all the books.`);

    // read all the books
    let booksList = readFileSync(dataFilePath, {
      encoding: "utf8",
    });

    console.log(JSON.parse(booksList));

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }

  return false;
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

  appDataPath = appDataPath + "/bookinfo";

  // 2. Search directories til bottom (mp3 files)
  let bookDirectories = directorySearch(rootDir);

  writeToDisk(appDataPath, bookDirectories);

  // Send Main thread the book data path
}
