import {
  ADD_BOOK_DIRECTORY,
  APPEND_BOOKS,
  ELECTRON_ERROR, GET_BOOK_COVERS,
  GET_BOOK_DETAILS,
  READ_LIBRARY_FILE,
  READ_SETTINGS_FILE,
  READ_STATS_FILE,
  RESPONSE_FROM_ELECTRON,
  SAVE_BOOK_PROGRESS,
  WRITE_SETTINGS_FILE,
  WRITE_STATS_FILE
} from '../shared/constants';
import { INFO_FOLDER_LOCATION, LIBRARY_FILE_LOCATION, STATS_FILE_LOCATION } from './electron_constants';
import { addbookDirectory } from './handlers/library';
import { handleSettings } from "./handlers/settings";
import { RequestFromReactType } from './types/library';
import { getBookDetails, readAndParseTextFile } from './utils/diskReader';
import logger from './utils/logger';



async function handlerAddBookDirectory(event: any) {
  logger.info('Adding new directory.');
  await addbookDirectory(event);
}

function readLibraryFile(event: any) {
  const data = readAndParseTextFile(LIBRARY_FILE_LOCATION);

  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_LIBRARY_FILE,
    data: data
  });
}

async function handleReadSettingsFile(event: any) {
  const results = await handleSettings('read', null);
  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_SETTINGS_FILE,
    data: results
  });
}

async function handleWriteSettingsFile(event: any, data: any) {
  logger.info('Writing settings file.');
  // Data should ecnompass Action and Payload
  const results = await handleSettings(data.action, data.payload);
  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_SETTINGS_FILE,
    data: results
  });
}

function defaultSwitch(event: any, { type, data }: RequestFromReactType) {
  logger.info(`You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`);
  event.reply(RESPONSE_FROM_ELECTRON, {
    type: ELECTRON_ERROR,
    data: `Whoa! Something went wrong! Check logs ${INFO_FOLDER_LOCATION}`
  });

}

function handleReadStatsFile(event: any) {
  const data = readAndParseTextFile(STATS_FILE_LOCATION);

  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_STATS_FILE,
    data: data
  });

}

function handleWriteStatsFile(event: any, data: ) {

}

export default async function handleRendererRequest(event: any, request: RequestFromReactType) {
  const { type, data } = request;

  try {
    switch (type) {
      case READ_STATS_FILE: {
        handleReadStatsFile(event);
        break;
      }
      case WRITE_STATS_FILE: {
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
        logger.info('Saving book progress for book:');
        break;
      }
      case GET_BOOK_DETAILS: {
        logger.info(`Getting book details. ${data.path}`);

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
