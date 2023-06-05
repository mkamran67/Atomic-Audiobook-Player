import { existsSync, readFileSync, writeFileSync } from "original-fs";
import { INFO_FOLDER_LOCATION, SETTINGS_LOCATION } from "./constants";

export default function getSettings() {
  // 1. Get settings from settings file
  if (existsSync(SETTINGS_LOCATION)) {
    const data = readFileSync(SETTINGS_LOCATION, { encoding: "utf8" });
    return JSON.parse(data);
  } else {
    // create settings file and return an empty object
    writeFileSync(SETTINGS_LOCATION, "{}", { encoding: "utf8", flag: "w" });
  }
}
