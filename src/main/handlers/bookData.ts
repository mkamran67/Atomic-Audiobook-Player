import { existsSync, readFileSync, readdirSync } from 'fs';
import * as jsmediatags from 'jsmediatags';
import path from 'path';
import { BookData } from '../../renderer/src/types/library.types';
import {
	IMG_EXTENSIONS,
	INFO_FOLDER_LOCATION,
	LIBRARY_FILE_LOCATION,
	MEDIA_EXTENSIONS,
	SETTINGS_LOCATION
} from '../electron_constants';
import { directorySearch, readAndParseTextFile } from '../utils/diskReader';
import { writeToDiskAsync } from '../utils/diskWriter';
import { forkAsync } from '../utils/childProcesses';
import logger from '../utils/logger';

export default function getSimpleBookData() {
	// 1. Check if directory exists
	if (existsSync(INFO_FOLDER_LOCATION)) {
		// 2. Check if the library file exists
		if (existsSync(LIBRARY_FILE_LOCATION)) {
			// 3. Read the file
			// event.reply("BooksFromMain", readFileSync(LIBRARY_FILE_LOCATION));
			try {
				const results = JSON.parse(readFileSync(LIBRARY_FILE_LOCATION, { encoding: 'utf-8' }));
				return results;
			} catch (err) {
				return new Error(String(err));
			}
		}
	}

	return null;
}

async function getTags(fullFilePath: string): Promise<{ title: string; artist: string } | undefined> {
	try {
		const res: any = await new Promise((resolve, reject) => {
			new jsmediatags.Reader(fullFilePath).read({
				onSuccess: (tag: any) => {
					resolve(tag);
				},
				onError: (error: any) => {
					reject(error);
				}
			});
		});

		return { title: res.tags.title, artist: res.tags.artist };
	} catch (err: any) {
		if (err.type == 'tagFormat') {
			return { title: 'skip', artist: 'skip' };
		}
		console.error(err);
		return { title: 'skip', artist: 'skip' };
	}
}

// @ts-ignore
export async function checkDuplicatesBooks() {
	const rootDirectories = readAndParseTextFile(SETTINGS_LOCATION).rootDirectories;

	if (rootDirectories.length > 0) {
		try {
			const scriptPath = path.join(__dirname, '..', 'utils', 'dupeScript.ts');
			const argvs = [LIBRARY_FILE_LOCATION];

			const results = await forkAsync(scriptPath, argvs);
			logger.info('Checking Duplicates...');

			return results;
		} catch (error) {
			logger.error('Error in checkDuplicatesBooks');
		}
	}
}

async function getBookInformation(bookDirectories: string[]): Promise<BookData[]> {
	let anArrayOfBookData: BookData[] = [];

	let fileTypeData: any = {};

	// iterate through directories
	for (let index = 0; index < bookDirectories.length; index++) {
		const bookPath = bookDirectories[index];

		let bookData: BookData = {
			title: '',
			author: '',
			cover: '',
			dirPath: bookPath,
			isDuplicate: false
		};

		// 1. Get current directory content & build bookData
		let bookDirectoryContents = readdirSync(bookPath);
		let checked = false;
		let coverFound = false;

		// Get cover
		// Get other metadata -> genre/tags
		// iterate through directory contents
		for (let i = 0; i < bookDirectoryContents.length; i++) {
			let theFile = bookDirectoryContents[i]; // File name
			let fileExtension = bookDirectoryContents[i].split('.')[1]; // File extension

			if (fileTypeData.hasOwnProperty(fileExtension)) {
				fileTypeData[`${fileExtension}`]++;
			} else {
				fileTypeData[`${fileExtension}`] = 1;
			}

			let fullFilePath = path.join(bookPath, theFile); // Path to file

			// if 'audiobook' hasn't been checked && is a supported extension
			if (!checked && MEDIA_EXTENSIONS.includes(fileExtension)) {
				// get tags
				let results = await getTags(fullFilePath);

				if (results) {
					// if no title
					if (results.title == 'skip') {
						let splitPath = bookPath.split(path.sep); // Split bookPath at \ or /
						bookData.title = splitPath[splitPath.length - 1]; // Since no tag was found we use the directory as the name
					} else {
						bookData.title = results.title;
					}

					// if no artist
					if (results.artist == 'skip') {
						bookData.author = 'DNF';
					} else {
						bookData.author = results.artist;
					}
				}

				checked = true;
			} else if (!coverFound && IMG_EXTENSIONS.includes(fileExtension)) {
				bookData.cover = fullFilePath;
				coverFound = true;
			} // else if

			// if both are checked break out of the loop
			if (checked && coverFound) {
				break;
			}
		} // for 2
		anArrayOfBookData.push(bookData);
	} // for 1

	return anArrayOfBookData;
}

export async function searchDirectoryForBooks(rootDir: string) {
	// 1. Search directories til bottom (mp3 files)
	let listOfBookDirectories: string[] = directorySearch(rootDir);

	// 2. Get BookData ->AKA-> information about the book
	let bookData: BookData[] = await getBookInformation(listOfBookDirectories);

	// 3. Write to disk
	await writeToDiskAsync(LIBRARY_FILE_LOCATION, bookData, true);

	// Send Main thread the book data path
	return bookData;
}
