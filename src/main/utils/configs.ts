import { INFO_FOLDER_LOCATION } from "../electron_constants";
import { createLibraryFile, createStatsFile } from "../handlers/library";
import { createSettingsFile } from "../handlers/settings";
import { checkIfDirectoryExists } from "./diskReader";
import logger from "./logger";
import fs from 'fs';

export function setupConfigFiles() {
  logger.info('Setting up config files');

  // 1. Check if INFO folder exists
  if (!checkIfDirectoryExists(INFO_FOLDER_LOCATION)) {
    // Create INFO folder
    fs.mkdirSync(INFO_FOLDER_LOCATION);
  }

  // Create settings file
  const settingsResults = createSettingsFile();
  if (settingsResults) {
    logger.info('Settings file created');
  }
  // Create library file
  const libraryResults = createLibraryFile();
  if (libraryResults) {
    logger.info('Library file created');
  }
  // Create stats file
  const statsResults = createStatsFile();
  if (statsResults) {
    logger.info('Stats file created');
  }
}
