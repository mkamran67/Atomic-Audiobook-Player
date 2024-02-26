import { net } from 'electron';
import path from 'path';
import logger from '../utils/logger';

export const getFileFromDisk = async (request: any) => {
	try {
		const normURI = path.normalize(decodeURI(request.url).slice('get-file://'.length));
		const url = `file://${normURI[0]}:${normURI.slice(1, normURI.length)}`;
		return net.fetch(url);
	} catch (error: any) {
		logger.error(`Error in getFileFromDisk: ${error}`);
		return error;
	}
};
