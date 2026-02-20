import logger from "./logger";

const codecs = new Map();


codecs.set("mp3", "audio/mpeg");
codecs.set("aac", "audio/aac");
codecs.set("mpeg", "audio/mpeg");
codecs.set("ogg", "audio/ogg");
codecs.set("opus", "audio/opus");
codecs.set("wav", "audio/wav");
codecs.set("flac", "audio/flac");
codecs.set("mp4", "audio/mp4");
codecs.set("webm", "audio/webm");
codecs.set("amr", "audio/amr");
codecs.set("3gpp", "audio/3gpp");
codecs.set("mp4", "audio/mp4");
codecs.set("m4b", "audio/mp4");


export function getHeadersForAudio(extType: string): string {
  try {
    const res: string = codecs.get(extType) || "";
    return res || "audio/mpeg";
  } catch (err) {
    logger.error(`Error in getHeadersForAudio: ${err}`);
    return "audio/mpeg";
  }
}
