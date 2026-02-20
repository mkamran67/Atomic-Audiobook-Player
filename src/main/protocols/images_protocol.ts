import { net } from 'electron';
import path from 'path';
import logger from '../utils/logger';

export default function imageHandler(request: Request) {
  try {
    const trimmedPath = request.url.slice('aap-img://'.length);
    const decodedPath = path.normalize(decodeURIComponent(trimmedPath));

    let formattedFilePath: string;
    if (process.platform === 'win32') {
      // On Windows, insert colon after drive letter: C/Users -> C:/Users
      formattedFilePath = 'file://' + decodedPath[0] + ':' + decodedPath.slice(1);
    } else {
      formattedFilePath = 'file://' + decodedPath;
    }

    return net.fetch(formattedFilePath);
  } catch (error) {
    console.error(request.url);
    logger.error('Error in handling aap-img protocol: ' + error);
  }
}
