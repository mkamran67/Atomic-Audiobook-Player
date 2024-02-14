import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';
import * as jsmediatags from 'jsmediatags';
import path from 'node:path';

import { IMG_EXTENSIONS, MEDIA_EXTENSIONS } from '../electron_constants';

import { access, constants } from 'fs/promises';
import { BookDetails, MinimumChapterDetails } from '../../renderer/src/types/book.types';

export function readAndParseTextFile(filePath: string) {
	return JSON.parse(readFileSync(filePath, 'utf-8'));
}

export function checkIfFileExists(filePath: string) {
	return existsSync(filePath);
}

export function checkIfDirectoryExists(dirPath: string) {
	return existsSync(dirPath);
}

export async function checkIfFileExistsAsync(filePath: string) {
	return await access(filePath, constants.F_OK);
}

function recursiveBookSearch(bookList: string[], dirPath: string): void {
	// Read the contents of the current directory
	const directoryElements = readdirSync(dirPath, { withFileTypes: true });

	// if it's empty -> return;
	if (!directoryElements || directoryElements.length === 0) {
		return;
	}

	// if the first file is not a directory -> push the current directory as an audiobook location;
	if (!directoryElements[0].isDirectory()) {
		bookList.push(dirPath);
		return; // End of recursion
	}

	// Else recall recursively
	for (let i = 0; i < directoryElements.length; i++) {
		if (directoryElements[i].isDirectory()) {
			recursiveBookSearch(bookList, path.join(dirPath, directoryElements[i].name));
		}
	}
}

export function directorySearch(dirPath: string): string[] {
	let currentDirectories;
	let bookList: string[] = [];

	// 1. Get list of initial Directories
	try {
		currentDirectories = readdirSync(dirPath, {
			withFileTypes: true
		});
	} catch (err: any) {
		throw new Error(err);
	}

	if (currentDirectories && currentDirectories.length > 0) {
		// 2. Loop through each directory calling recursiveBookSearch
		for (let index = 0; index < currentDirectories.length; index++) {
			if (currentDirectories[index].isDirectory()) {
				recursiveBookSearch(bookList, path.join(dirPath, currentDirectories[index].name));
			}
		}
	}

	return bookList;
}

async function getAllDetailsOfAMediaFile(
	mediaPath: string,
	totalSize: number = 0,
	totalLength: number = 0
): Promise<[BookDetails, number, number]> {
	try {
		const bookDetails: BookDetails = await new Promise((resolve, reject) => {
			jsmediatags.read(mediaPath, {
				onSuccess: async (read_info: any) => {
					let currentChapterLength = 0;
					const totalTracks = read_info.tags.track ? read_info.tags.track.split('/')[1] : 1;

					totalSize += statSync(mediaPath).size;
					// REVIEW - Fix the duration of the audio file
					await getAudioDurationInSeconds(mediaPath).then((duration) => {
						currentChapterLength = duration;
						console.log('👉 -> file: utils.ts:248 -> currentChapterLength:', currentChapterLength);
					});

					// currentChapterLength = await getAudioDuration(mediaPath);

					totalLength += currentChapterLength; // Seconds

					const bookData: BookDetails = {
						totalTracks: totalTracks,
						title: read_info.tags.title,
						author: read_info.tags.artist,
						year: read_info.tags.year,
						currentTime: 0,
						currentTrack: 1,
						currentChapter: mediaPath,
						chapterList: [
							{
								length: totalLength,
								path: mediaPath
							}
						]
					};

					resolve(bookData);
				},
				onError: (err) => {
					reject(err);
				}
			});
		});

		// if (bookDetails) {
		return [bookDetails, totalSize, totalLength];
		// }
	} catch (err: any) {
		throw new Error(err);
	}
}

async function getChapterDetails(
	mediaPath: string,
	totalSize: number = 0,
	totalLength: number = 0
): Promise<[MinimumChapterDetails, number, number]> {
	try {
		let currentChapterLength = 0;

		totalSize += statSync(mediaPath).size;
		await getAudioDurationInSeconds(mediaPath).then((duration) => {
			currentChapterLength = duration;
		});

		totalLength += currentChapterLength; // Seconds

		const chapterDetails: MinimumChapterDetails = {
			path: mediaPath,
			length: currentChapterLength
		};

		// if (chapterDetails) {
		return [chapterDetails, totalSize, totalLength];
		// }
	} catch (err: any) {
		throw new Error(err);
	}
}

/**
 *
 * @param dirPath -> Path to Book directory
 * @returns A book object with book details and chapters
 */
export async function getBookDetails(dirPath: string): Promise<BookDetails> {
	try {
		const listOfFiles = readdirSync(dirPath, { withFileTypes: true });

		let chapters: string[] = [];
		let totalSize: number = 0;
		let totalLength: number = 0;
		let cover = '';

		// REVIEW -> Skeleton needed?
		let bookDetails: BookDetails = {
			chapterList: [],
			currentChapter: '',
			currentTrack: 0,
			currentTime: 0,
			totalTracks: 0,
			title: ''
		};
		let bookDataTrigger: boolean = true; // If true means we don't have information about the book yet.

		// Get files from the book directory
		for (let index = 0; index < listOfFiles.length; index++) {
			const file = listOfFiles[index];

			if (file.isFile()) {
				let name = file.name;
				let fileSplit = name.split('.');
				let extension = fileSplit[fileSplit.length - 1];

				if (MEDIA_EXTENSIONS.includes(extension)) {
					chapters.push(name);
				} else if (IMG_EXTENSIONS.includes(extension)) {
					// Store the larger cover - hopefully better quality
					if (cover && statSync(path.join(dirPath, file.name)) > statSync(path.join(dirPath, cover))) {
						cover = file.name;
					} else if (!cover) {
						cover = file.name;
					}
				} else {
					// TODO -> Log here for testing
					console.log('File type not supported');
				}
			} else {
				console.log(`Not a file`);
			}
		}

		// Accumalte Chapter data and book information
		for (const chapter of chapters) {
			const chapterPath = path.join(dirPath, chapter);

			if (bookDataTrigger) {
				const [results, size, length] = await getAllDetailsOfAMediaFile(chapterPath);
				// bookDetails = await getAllDetailsOfAMediaFile(chapterPath, totalSize, totalLength);
				bookDetails = results;
				totalSize += size;
				totalLength += length;
				bookDataTrigger = false;
			} else {
				// bookDetails.chapterList.push(await getChapterDetails(chapterPath, totalSize, totalLength));
				const [results, size, length] = await getChapterDetails(chapterPath, totalSize, totalLength);
				bookDetails.chapterList.push(results);
				totalSize += size;
				totalLength += length;
			}
		}

		bookDetails.totalLength = totalLength;
		bookDetails.totalSize = totalSize;

		// if (bookDetails) {
		return bookDetails;
		// }
	} catch (err: any) {
		throw new Error(err);
	}
}

// async function getBookInformation(listOfBooks, bookDirectories: string[]) {
//   // iterate through directories
//   for (let index = 0; index < bookDirectories.length; index++) {
//     const bookPath = bookDirectories[index]; // Path to book directory

//     let bookData: BookData = {
//       title: "",
//       artist: "",
//       cover: "",
//       dirPath: bookPath,
//     };

//     // 1. Get information & build bookData
//     let bookDirectoryContents = readdirSync(bookPath);
//     let checked = false;

//     // Get cover
//     // Get other metadata -> genre/tags
//     for (let i = 0; i < bookDirectoryContents.length; i++) {
//       let theFile = bookDirectoryContents[i];
//       let fileExtension = bookDirectoryContents[i].split(".")[1];
//       let fullFilePath = path.join(bookPath, theFile);

//       // check file type
//       // if -> media get metadata
//       // if -> image set cover
//       if (!checked && mediaExtensions.includes(fileExtension)) {
//         let results = await getTags(fullFilePath);

//         if (results.title == "skip" || results.artist == "skip") {
//           let splitPath = bookPath.split(path.sep);

//           // Since no tag was found we use the directory as the name
//           bookData.title = splitPath[splitPath.length - 1];
//           bookData.artist = "DNF";
//         } else {
//           bookData.title = results.title;
//           bookData.artist = results.artist;
//         }
//         checked = true;
//       } else if (imgExtensions.includes(fileExtension)) {
//         bookData.cover = fullFilePath;
//       }

//       listOfBooks.push(bookData);
//     }
//   }
// }

// NOTE - Might use this later

// async function getAudioDuration(mediaPath: string): Promise<number> {
//   console.log("👉 -> file: utils.ts:227 -> mediaPath:", mediaPath)

//   const tempAudio = new Audic(mediaPath);
//   tempAudio.volume = 0;
//   await tempAudio.play();

//   if (tempAudio.duration == Infinity || isNaN(tempAudio.duration)) {
//     tempAudio.currentTime = 1000000000.0;
//     tempAudio.currentTime = 0;
//     console.log(tempAudio.duration);

//     tempAudio.pause();
//     tempAudio.destroy();
//     return 0;
//   } else {
//     tempAudio.pause();
//     tempAudio.destroy();
//     return tempAudio.duration;
//   }
// }

// "scripts": {
//   "start": "electron ./dist/electron.js",
//   "build": "tsc",
//   "seq": "npm run build && npm start",
//   "dev": "nodemon --watch src --exec npm run seq",
//   "clean": "rm -rf dist && rm -rf node_modules && rm -rf package-lock.json"
// },

// async function buildSimpleBookData(listOfBooks: BookData[], bookDirectories: string[]) {
//   // This function will build a list containing only
//   // Title - Cover Path - Directory Path

//   for (let index = 0; index < bookDirectories.length; index++) {
//     const book = bookDirectories[index];

//     // 1. Get book title
//     let results = await getTags(book);
//   }
// }
