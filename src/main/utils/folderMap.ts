import { readdir } from 'fs/promises';

async function getDirectories(source: string) {
  const tempdirs = await readdir(source, { withFileTypes: true }));
}
export default function mapFolders() {

  // 1. Get root folder for audio books
  // 2. Get all subfolders
  // 3. Iterate through all subfolders
  // 4. Get all files within subfolders

}