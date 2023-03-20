// File to contain all constants
// Paths, static variables
import path from "path";
import { app } from "electron";
const MEDIA_EXTENSIONS = ["mp3", "m4b"];
const IMG_EXTENSIONS = ["img", "jpeg", "jpg", "png"];

// Somewhat Constants -> that are system-generated <OS_TYPICAL> but will function the same.
const SETTINGS_LOCATION = path.join(app.getPath("appData"), "settings.txt");
const BOOKS_LIST_LOCATION = path.join(app.getPath("appData"), "library.txt");
const INFO_FOLDER_LOCATION = path.join(app.getPath("appData"), "Atomic Audiobook Player");

export {
  MEDIA_EXTENSIONS as mediaExtensions,
  IMG_EXTENSIONS as imgExtensions,
  SETTINGS_LOCATION,
  BOOKS_LIST_LOCATION,
  INFO_FOLDER_LOCATION,
};
