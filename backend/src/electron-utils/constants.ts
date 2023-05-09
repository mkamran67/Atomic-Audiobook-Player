// File to contain all constants
// Paths, static variables
import path from "path";
import { app } from "electron";
const MEDIA_EXTENSIONS = ["mp3", "m4b"];
const IMG_EXTENSIONS = ["img", "jpeg", "jpg", "png"];

// Somewhat Constants -> that are system-generated <OS_TYPICAL> but will function the same.
const INFO_FOLDER_LOCATION = path.join(app.getPath("appData"), "Atomic Audiobook Player");
const SETTINGS_LOCATION = path.join(INFO_FOLDER_LOCATION, "settings.json");
const ELECTRON_CONFIG_LOCATION = path.join(INFO_FOLDER_LOCATION, "config.json");
const BOOKS_LIST_LOCATION = path.join(INFO_FOLDER_LOCATION, "library.txt");

// The below is for response consistency
// ELECTRON_RESPONSE -> is what React is expecting
// Response constants from Electron - strings
const ELECTRON_RESPONSE_SETTINGSDATA_TYPE = "settingsData";
const ELECTRON_RESPONSE_BOOKDATA_TYPE = "bookData";
const ELECTRON_RESPONSE_BOOK_DETAILS_TYPE = "bookDetails";
const ELECTRON_ERROR = "error_type";

export {
  MEDIA_EXTENSIONS,
  IMG_EXTENSIONS,
  SETTINGS_LOCATION,
  BOOKS_LIST_LOCATION,
  INFO_FOLDER_LOCATION,
  ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
  ELECTRON_RESPONSE_BOOKDATA_TYPE,
  ELECTRON_CONFIG_LOCATION,
  ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
  ELECTRON_ERROR,
};
