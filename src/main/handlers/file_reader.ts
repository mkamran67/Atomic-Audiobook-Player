import { net } from 'electron';
import path from 'path';
import logger from '../utils/logger';

export const getFileFromDisk = async (url: string) => {
	try {
		return net.fetch(url);
	} catch (error: any) {
		logger.error(`Error in getFileFromDisk: ${error}`);
		logger.error(error.stack);
		return error;
	}
};
