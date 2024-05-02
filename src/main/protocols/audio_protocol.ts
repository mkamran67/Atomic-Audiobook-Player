import path from 'path';
import fs from 'fs/promises';
import { getHeadersForAudio } from '../utils/headersForAudio';


export default async function audioProtocolHandler(req: Request) {
  const filePath = path.normalize(decodeURI(req.url.replace('get-audio://', '')));
  const formattedFile = filePath[0] + ':' + filePath.slice(1);
  const file = await fs.readFile(formattedFile);
  const fileExt = path.extname(filePath).slice(1);

  const headers = {
    'Content-Type': getHeadersForAudio(fileExt),
    'Content-Length': file.length.toString() // Convert to string
  };
  return new Response(file, { headers });

}