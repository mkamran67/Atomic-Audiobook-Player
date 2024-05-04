import { readdir } from 'fs/promises';

const getDirectories = async (source: string) =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);



async function getDirectories(source: string) {
  return await readdir(source, { withFileTypes: true }))
}
export default function mapFolders() {
  // TODO: Implement folder mapping logic here
  const folderStrucutre = {};

}