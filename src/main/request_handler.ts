import {
  ADD_BOOK_DIRECTORY,
  APPEND_BOOKS,
  ELECTRON_ERROR, GET_BOOK_COVERS,
  READ_LIBRARY_FILE,
  READ_SETTINGS_FILE,
  RESPONSE_FROM_ELECTRON,
  SAVE_BOOK_PROGRESS,
  WRITE_SETTINGS_FILE
} from '../shared/constants';
import { INFO_FOLDER_LOCATION, LIBRARY_FILE_LOCATION } from './electron_constants';
import { addbookDirectory } from './handlers/library';
import { handleSettings } from "./handlers/settings";
import { RequestFromReactType } from './types/library';
import { readAndParseTextFile } from './utils/diskReader';
import logger from './utils/logger';



async function handlerAddBookDirectory(event: any) {
  logger.info('Adding new directory.');
  await addbookDirectory(event);
}

function readLibraryFile(event: any) {
  logger.info('Reading library file.');
  const data = readAndParseTextFile(LIBRARY_FILE_LOCATION);

  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_LIBRARY_FILE,
    data: data
  });
}

function handleReadSettingsFile(event: any) {
  logger.info('Reading settings file.');
  return handleSettings('read', null);
}

async function handleWriteSettingsFile(event: any, data: any) {
  logger.info('Writing settings file.');
  // Data should ecnompass Action and Payload
  const results = await handleSettings(data.action, data.payload);
  // event.reply(RESPONSE_FROM_ELECTRON, {
  //   type: READ_SETTINGS_FILE,
  //   data: results
  // });
}

function defaultSwitch(event: any, { type, data }: RequestFromReactType) {
  logger.info(`You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`);
  event.reply(RESPONSE_FROM_ELECTRON, {
    type: ELECTRON_ERROR,
    data: `Whoa! Something went wrong! Check logs ${INFO_FOLDER_LOCATION}`
  });

}

export default async function handleRendererRequest(event: any, request: RequestFromReactType) {
  const { type, data } = request;
  console.log("👉 -> file: request_handler.ts:61 -> type:", type);

  try {
    switch (type) {
      case READ_LIBRARY_FILE: {
        readLibraryFile(event);
        break;
      }
      case READ_SETTINGS_FILE: {
        handleReadSettingsFile(event);
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
      case GET_BOOK_COVERS: {
        logger.info('Getting book covers.');
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
