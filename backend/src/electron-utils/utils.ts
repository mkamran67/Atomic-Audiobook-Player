import { readdirSync } from "fs";
import { app } from "electron";
import { existsSync, mkdirSync } from "original-fs";

// All things are syncronous

function recursiveSearchBooks() {}

function writeToDisk(path: string, name: string, cover: string) {
  // Where to store app data - books
  let appDataPath = app.getPath("appData");

  // 1. Create a folder if it doesn't exist
  try {
    if (!existsSync(`${appDataPath}/bookinfo`)) {
      mkdirSync(`${appDataPath}/bookinfo`);
      appDataPath = appDataPath + "/bookinfo";
    }
  } catch (err) {
    throw new Error("Failed to check or create a folder.");
  }

  //STUB - Try the sloppy way of storage
  // 2.
  try {
  } catch (err) {}
}

export default function scanBooks(rootDir) {
  // 1. Get

  console.log(`first ${rootDir.filePaths}`);
}
