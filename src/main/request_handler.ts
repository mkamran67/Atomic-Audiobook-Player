import path from 'path';
import { BookStatStructure, SaveBookProgressPayload, StatsFileStructure } from '../../src/shared/types';
import {
  ADD_BOOK_DIRECTORY,
  APPEND_BOOKS,
  ELECTRON_ERROR,
  GET_BOOK_COVERS,
  GET_BOOK_DETAILS,
  GET_PREVIOUS_BOOK,
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

async function markBookCompleted(url: string, currentTime: number) {
  // 1. Read stats file
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;

  // 2. Update stats file
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];
    if (bookStat.bookPath === url) {
      bookStat.currentTime = currentTime;
      bookStat.endedDateAndTime = new Date();
      return;
    }
  }
}

async function newBookStarted(data: SaveBookProgressPayload) {

  const { bookURL, currentChapterURL, currentTime, currentTrack, duration } = data;
  const bookDirectory = path.dirname(bookURL);
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;
  const bookDetails = await getBookDetails(bookDirectory);

  const newBookObject: BookStatStructure = {
    bookPath: bookURL,
    bookTitle: bookDetails.title,
    bookAuthor: bookDetails.author,
    currentTime: currentTime,
    startDateAndTime: new Date(),
    endedDateAndTime: 'TBD',
    currentChapterPath: currentChapterURL,
    currentTrack: 1,
    totalLength: duration,
    chapterCount: bookDetails.chapterList.length + 1,
    coverPath: bookDetails.coverPath
  };


  // 2. Update stats file
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];

  }

}

async function saveBookProgress(data: SaveBookProgressPayload) {

  // Have to figure out chapters
  const { currentTime, duration, bookURL } = data;
  const percentageCompleted = (currentTime / duration) * 100;

  // check if book is new aka first 30 seconds
  if (currentTime <= 31) {
    await newBookStarted(data);
  }
  // Check if book ended
  else if (percentageCompleted >= 0.98) {
    await markBookCompleted(bookURL, currentTime);
  } else {

    console.log(`hit the else statement`);
    // 1. Read stats file
    // const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
    // const bookStats = statsFileData.bookStats;
    // // 2. Update stats file
    // for (let index = 0; index < bookStats.length; index++) {
    //   const bookStat = bookStats[index];
    //   if (bookStat.bookPath === data.url) {
    //     bookStat.currentTime = data.currentTime;
    //     break;
    //   }
    // }
  }

  // 3. Write stats file
  // file: request_handler.ts:129 -> bookURL: D:\Books\Audio Books\Computer, Net\Darknet A Beginner's Guide to Staying Anonymous Online\01 - Darknet A Beginner's Guide to Staying Anonymous Online.mp3
  // file: request_handler.ts:130 -> percentageCompleted: 89.23367989612487
  // file: request_handler.ts:133 -> bookDirectory: D:\Books\Audio Books\Computer, Net\Darknet A Beginner's Guide to Staying Anonymous Online

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
        await saveBookProgress(data);
        break;
      }
      case GET_PREVIOUS_BOOK: {
        logger.info('Getting previous book details:');
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
