import path from 'path';
import { BookDetails, BookStatStructure, SaveBookProgressPayload, StatsFileStructure } from "../../../src/shared/types";
import { GET_BOOK_DETAILS, READ_STATS_FILE, RESPONSE_FROM_ELECTRON } from "../../../src/shared/constants";
import { STATS_FILE_LOCATION } from "../electron_constants";
import { getBookDetails, readAndParseTextFile } from "../utils/diskReader";
import { writeToDiskAsync } from "../utils/diskWriter";
import logger from "../utils/logger";

export function handleReadStatsFile(event: any) {
  const data = readAndParseTextFile(STATS_FILE_LOCATION);

  event.reply(RESPONSE_FROM_ELECTRON, {
    type: READ_STATS_FILE,
    data: data
  });

}

export function resetBookProgress(url: string, currentTime: number) {
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

export async function markBookCompleted(url: string, currentTime: number) {
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

export async function checkIfBookStatIsDuplicate(bookStats: BookStatStructure[], bookURL: string) {
  for (let index = 0; index < bookStats.length; index++) {
    const bookStat = bookStats[index];
    if (bookStat.bookPath === bookURL) {
      logger.error('New book is a duplicate. Not adding to stats file.');
      return true;
    }
  }

  return false;
}

export async function newBookStarted(data: SaveBookProgressPayload, bookDetails: BookDetails, bookDirectory: string) {
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

export async function updateBookProgress(data: SaveBookProgressPayload) {
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

export async function progressHandler(data: SaveBookProgressPayload) {


  const { currentTime, bookURL, duration, markedForCompletion } = data;

  data.currentChapterURL = data.currentChapterURL.replace('get-audio://', '');
  const bookDirectory = path.dirname(bookURL);
  const bookDetails = await getBookDetails(bookDirectory);
  const percentageCompleted = bookDetails.totalLength ? (currentTime / bookDetails.totalLength) * 100 : (currentTime / duration) * 100;

  // check if book is new aka first 30 seconds
  if (currentTime <= 15) {
    await newBookStarted(data, bookDetails, bookDirectory);
  }
  // Check if book ended
  else if (markedForCompletion || percentageCompleted >= 0.98) {
    await markBookCompleted(bookURL, currentTime);
  } else {
    await updateBookProgress(data);
  }
}

export async function getPreviousBook(event: any) {
  const statsFileData: StatsFileStructure = readAndParseTextFile(STATS_FILE_LOCATION);
  const bookStats = statsFileData.bookStats;
  // Handle empty stats file
  if (bookStats.length === 0) {
    return;
  }

  for (let index = 0; index < bookStats.length; index++) {
    const bookDeets = bookStats[index];

    if (bookDeets.markedForPrevious) {
      const bookDetails = await getBookDetails(bookDeets.bookDirectory);
      // Update bookDetails with stats details

      bookDetails.currentTime = bookDeets.currentTime;
      bookDetails.currentChapter = bookDeets.currentChapterPath;
      bookDetails.currentTrack = bookDeets.currentTrack;

      event.reply(RESPONSE_FROM_ELECTRON, {
        type: GET_BOOK_DETAILS,
        data: bookDetails
      });
      return;
    }
  }

}
