import { net } from 'electron';
import path from 'path';
import logger from '../utils/logger';

export default function imageHandler(request: Request) {
  try {

    const trimmedPath = request.url.slice('potato://'.length);
    const decodedPath = path.normalize(decodeURIComponent(trimmedPath));
    const formattedFilePath = 'file://' + decodedPath;

    return net.fetch(formattedFilePath);
  } catch (error) {
    console.error(request.url);
    logger.error('Error in handling potato protocol' + error);
  }
}