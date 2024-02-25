import fs from 'fs';
import { writeFile } from 'fs/promises';
import { ErrorType } from '../types/util.types';
import logger from './logger';
import { readAndParseTextFile } from './diskReader';

/**
 * Write to disk synchronously
 * @param filePath string
 * @param data any
 * @returns void | ErrorType
 */
export function writeToDisk(filePath: string, data: any, shouldAppend: boolean = false): void | ErrorType {
	let convergedData;

	if (shouldAppend) {
		let previousData = readAndParseTextFile(filePath);

		if (previousData.length > 0) {
			convergedData = [...previousData, ...data];
		} else {
			convergedData = data;
		}
	} else {
		convergedData = data;
	}

	const jsonString = JSON.stringify(convergedData);

	try {
		fs.writeFileSync(filePath, jsonString);
	} catch (error: unknown) {
		logger.error('Error writing file in writeToDisk ${shouldAppend}');

		if (error instanceof Error && error.stack) {
			logger.error(error.stack);
			return { message: 'Error writing file in writeToDisk', data: error };
		} else {
			return { message: 'Error writing file in writeToDisk', data: 'Unknown error' };
		}
	}
}

/**
 * Write to disk asynchronously
 * @param filePath string
 * @param data any
 * @returns void | ErrorType
 */
export async function writeToDiskAsync(
	filePath: string,
	data: any,
	shouldAppend: boolean = false
): Promise<void | ErrorType> {
	let convergedData: unknown;

	if (shouldAppend) {
		let previousData = readAndParseTextFile(filePath);

		if (previousData.length > 0) {
			convergedData = [...previousData, ...data];
		} else {
			convergedData = data;
		}
	} else {
		convergedData = data;
	}
	const jsonString = JSON.stringify(convergedData);

	try {
		await writeFile(filePath, jsonString);
	} catch (error: unknown) {
		logger.error(`Error writing file in writeToDiskAsync ${shouldAppend}`);

		if (error instanceof Error && error.stack) {
			logger.error(error.stack);
			return { message: 'Error writing file in writeToDiskAsync', data: error };
		} else {
			return { message: 'Error writing file in writeToDiskAsync', data: 'Unknown error' };
		}
	}
}
