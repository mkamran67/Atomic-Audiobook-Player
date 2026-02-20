import path from 'path';
import fs from 'fs/promises';
import { getHeadersForAudio } from '../utils/headersForAudio';


export default async function audioProtocolHandler(req: Request) {
  const rawPath = decodeURI(req.url.replace('get-audio://', ''));
  let filePath: string;

  if (process.platform === 'win32') {
    const normalized = path.normalize(rawPath);
    filePath = normalized[0] + ':' + normalized.slice(1);
  } else {
    filePath = path.normalize('/' + rawPath);
  }

  const file = await fs.readFile(filePath);
  const fileExt = path.extname(filePath).slice(1);

  const headers = {
    'Content-Type': getHeadersForAudio(fileExt),
    'Content-Length': file.length.toString()
  };
  return new Response(file, { headers });
}
