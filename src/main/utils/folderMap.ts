import path from 'path';
import { readdir } from 'fs/promises';
import { SETTINGS_LOCATION } from '../electron_constants';
import { readAndParseTextFile } from './diskReader';
import fs from 'fs';


function isDirectory(path: string) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err: any, stats: any) => {
      if (err) {
        reject(false);
      } else {
        // Check if it's a directory
        resolve(stats.isDirectory());
      }
    });
  });
}


async function recursiveDirectorySearch(dirPath: string, dirCount: number) {
  const directoryElements = await readdir(dirPath, { withFileTypes: true });

  if (!directoryElements || directoryElements.length === 0) {
    return dirPath;
  }

  for (let i = 0; i < directoryElements.length; i++) {
    const currentElement = directoryElements[i];
    const currentElementPath = path.join(dirPath, currentElement.name);
    const isDir = await isDirectory(currentElementPath);

    if (isDir) {
      dirCount++;
      console.log(`recursing into: ${currentElementPath}`);
      recursiveDirectorySearch(currentElementPath, dirCount);
    }
  }
}


export default async function mapFolders() {

  let dirCount = 0;
  const settings = await readAndParseTextFile(SETTINGS_LOCATION);

  // 1. Get root folder for audio books
  const settingsDir = settings.rootDirectories[0];
  // 2. Get all subfolders
  const rootDirs = await recursiveDirectorySearch(settingsDir, dirCount);
  // console.log("file: folderMap.ts:30 -> rootDirs:", rootDirs);
  // 3. Iterate through all subfolders
  console.log(`\n\n\n\n\n\n\n\nTotal directories: ${dirCount}`);
  // 4. Get all files within subfolders



}