import { existsSync, readFileSync } from 'fs';
import { LIBRARY_FILE_LOCATION, INFO_FOLDER_LOCATION } from '../electron_constants';

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
