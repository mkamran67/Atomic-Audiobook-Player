// import { BookData } from '../../renderer/src/types/library.types';
import { LIBRARY_FILE_LOCATION } from '../electron_constants';
import { readAndParseTextFile } from './diskReader';

// type DuplicateBooksType = {
// 	title: {
// 		index: number[];
// 		dirPaths: string[];
// 	};
// };

async function checkDuplicatesScript() {
	const bookList = await readAndParseTextFile(LIBRARY_FILE_LOCATION);
	let duplicateBooks: any = {}; // Initialize duplicateBooks as an empty object
	// const bookList: BookData[] = await readAndParseTextFile(LIBRARY_FILE_LOCATION);
	// let duplicateBooks: DuplicateBooksType | {} = {}; // Initialize duplicateBooks as an empty object

	for (let index = 0; index < bookList.length; index++) {
		// Check if object has the book
		if (duplicateBooks.hasOwnProperty(bookList[index].title)) {
			duplicateBooks[bookList[index].title] = {
				index: duplicateBooks[bookList[index].title].index + 1,
				dirPaths: [...duplicateBooks[bookList[index].title].dirPaths, bookList[index].dirPath]
			};
		} else {
			duplicateBooks[bookList[index].title] = {
				index: 1,
				dirPaths: [bookList[index].dirPath]
			};
		}
	}
}

async function main() {
	console.log('\n\n\n👉 -> file: dupeScript.ts:34 -> argv:', process.argv);

	process.parentPort.once('message', (e) => {
		const [port] = e.ports;

		port.postMessage({ message: 'hello -bing bing' });
	});

	return 0;
}

main();
