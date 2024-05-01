import path from 'path';
import { BookDetails, BookStatStructure, SaveBookProgressPayload, StatsFileStructure } from '../../src/shared/types';
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
import { writeToDiskAsync } from './utils/diskWriter';


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

function resetBookProgress(url: string, currentTime: number) {
  // 1. Read stats file
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;

  // 2. Update stats file
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];
    if (bookStat.bookPath === url) {
      bookStat.currentTime = currentTime;
      bookStat.startDateAndTime = new Date();
      bookStat.endedDateAndTime = 'TBD';
      return;
    }
  }
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

async function checkIfBookStatIsDuplicate(bookStats: BookStatStructure[], bookURL: string) {
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];
    if (bookStat.bookPath === bookURL) {
      logger.error('New book is a duplicate. Not adding to stats file.');
      return true;
    }
  }

  return false;
}

async function newBookStarted(data: SaveBookProgressPayload, bookDetails: BookDetails, bookDirectory: string) {
  const { bookURL, currentChapterURL, currentTime, currentTrack, duration } = data;
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;

  // 2. Make sure it's not a duplicate
  const isDuplicate = await checkIfBookStatIsDuplicate(bookStats, bookURL);

  if (isDuplicate) {
    return;
  }


  const newBookObject: BookStatStructure = {
    bookTitle: bookDetails.title,
    bookAuthor: bookDetails.author,
    bookPath: bookURL,
    currentTime: currentTime,
    startDateAndTime: new Date(),
    endedDateAndTime: 'TBD',
    currentChapterPath: currentChapterURL,
    currentTrack: 1,
    chapterCount: bookDetails.chapterList.length + 1,
    coverPath: bookDetails.coverPath,
    bookDirectory: bookDirectory,
    totalLength: bookDetails.totalLength ? bookDetails.totalLength : -1,
    markedForPrevious: true
  };

  // 3. Add to stats file
  bookStats.push(newBookObject);

  // 4. Write stats file
  await writeToDiskAsync(STATS_FILE_LOCATION, statsFileData);
}

async function updateBookProgress(data: SaveBookProgressPayload) {
  // 1. Read stats file
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;
  // 2. Update stats file
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];
    if (bookStat.bookPath === data.bookURL) {
      bookStat.currentTime = data.currentTime;
      bookStat.currentChapterPath = data.currentChapterURL;
      bookStat.currentTrack = data.currentTrack;
      bookStat.markedForPrevious = true;

      // Check if it's the first book in the list
      if (index !== 0) {
        // Swap with the last book
        const temp = bookStats[index];
        bookStats[index] = bookStats[0];
        bookStats[0] = temp;
      }
    } else {
      bookStat.markedForPrevious = false;
    }
  }

  // 3. Write stats file
  await writeToDiskAsync(STATS_FILE_LOCATION, statsFileData);
}

async function saveBookProgress(data: SaveBookProgressPayload) {


  const { currentTime, bookURL, duration, markedForCompletion } = data;
  const bookDirectory = path.dirname(bookURL);
  const bookDetails = await getBookDetails(bookDirectory);
  const percentageCompleted = bookDetails.totalLength ? (currentTime / bookDetails.totalLength) * 100 : (currentTime / duration) * 100;

  // check if book is new aka first 30 seconds
  if (currentTime <= 31) {
    await newBookStarted(data, bookDetails, bookDirectory);
  }
  // Check if book ended
  else if (markedForCompletion || percentageCompleted >= 0.98) {
    await markBookCompleted(bookURL, currentTime);
  } else {
    await updateBookProgress(data);
  }
}

async function getPreviousBook(event: any) {
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;
  const bookDetails = await getBookDetails(bookStats[0].bookDirectory);
  // REVIEW -> Test to make it sure it works.


  for (let index = 0; index < bookStats.length; index++) {
    const element = bookStats[index];

    if (element.markedForPrevious) {
      event.reply(RESPONSE_FROM_ELECTRON, {
        type: GET_BOOK_DETAILS,
        data: element
      });
      return;
    }
  }

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
        await getPreviousBook(event);
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
