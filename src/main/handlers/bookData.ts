import { readdirSync } from 'fs';
import * as jsmediatags from 'jsmediatags';
import path from 'path';
import { BookData } from '../../../src/shared/types';
import { IMG_EXTENSIONS, MEDIA_EXTENSIONS } from '../electron_constants';
import { directorySearch } from '../utils/diskReader';
import logger from '../utils/logger';

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
		logger.error(`Error reading tags for: ${fullFilePath}`);
		return { title: 'skip', artist: 'skip' };
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
			}

			// if both are checked break out of the loop
			if (checked && coverFound) {
				break;
			}
		}
		anArrayOfBookData.push(bookData);
	}

	return anArrayOfBookData;
}

export async function searchDirectoryForBooks(rootDir: string) {
	// 1. Search directories til bottom (mp3 files)
	let listOfBookDirectories: string[] = directorySearch(rootDir);

	// 2. Get BookData ->AKA-> information about the book
	let bookData: BookData[] = await getBookInformation(listOfBookDirectories);

	return bookData;
}
