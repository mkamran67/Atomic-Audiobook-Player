import {
  ADD_BOOK_DIRECTORY, ELECTRON_ERROR, GET_BOOK_DETAILS,
  GET_CHAPTER,
  GET_PREVIOUS_BOOK,
  READ_LIBRARY_FILE,
  READ_SETTINGS_FILE,
  READ_STATS_FILE,
  RESPONSE_FROM_ELECTRON,
  SAVE_BOOK_PROGRESS,
  WRITE_SETTINGS_FILE,
  WRITE_STATS_FILE
} from '../shared/constants';
import { INFO_FOLDER_LOCATION } from './electron_constants';
import { handlerAddBookDirectory, readLibraryFile } from './handlers/library_handler';
import { handleReadSettingsFile, handleWriteSettingsFile } from "./handlers/settings_handler";
import { getPreviousBook, handleReadStatsFile, progressHandler } from './handlers/stats_handler';
import { RequestFromReactType } from './types/library';
import { getBookDetails } from './utils/diskReader';
import logger from './utils/logger';



function defaultSwitch(event: any, { type, data }: RequestFromReactType) {
  logger.info(`You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`);
  event.reply(RESPONSE_FROM_ELECTRON, {
    type: ELECTRON_ERROR,
    data: `Whoa! Something went wrong! Check logs ${INFO_FOLDER_LOCATION}`
  });

}

export default async function handleRendererRequest(event: any, request: RequestFromReactType) {
  const { type, data } = request;

  try {
    switch (type) {
      case READ_STATS_FILE: {
        console.log(`read stats file`);
        handleReadStatsFile(event);
        break;
      }
      case WRITE_STATS_FILE: {
        console.log(request);
        // handleWriteStatsFile(event, data);
        break;
      }
      case READ_LIBRARY_FILE: {
        readLibraryFile(event);
        break;
      }
      case READ_SETTINGS_FILE: {
        await handleReadSettingsFile(event);
        break;
      }
      case WRITE_SETTINGS_FILE: {
        const newSettings = await handleWriteSettingsFile(event, data);
        event.reply(RESPONSE_FROM_ELECTRON, {
          type: READ_SETTINGS_FILE,
          data: newSettings
        });
        break;
      }
      case ADD_BOOK_DIRECTORY: {
        await handlerAddBookDirectory(event);
        break;
      }
      case SAVE_BOOK_PROGRESS: {
        await progressHandler(data);
        break;
      }
      case GET_PREVIOUS_BOOK: {
        await getPreviousBook(event);
        break;
      }
      case GET_CHAPTER: {
        // await getChapter(event, data);
        break;
      }
      case GET_BOOK_DETAILS: {
        const bookDeets = await getBookDetails(data.path);
        event.reply(RESPONSE_FROM_ELECTRON, {
          type: GET_BOOK_DETAILS,
          data: bookDeets
        });
        break;
      }
      default: {
        defaultSwitch(event, request);
        break;
      }
    }
  } catch (error: any) {
    logger.error('Error in handleRendererRequest');
    logger.error(error.stack);
    event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: error });
  }
}
