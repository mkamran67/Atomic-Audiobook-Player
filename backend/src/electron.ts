// const { scanBooks } = require("./electron-utils/utils");
// const path = require("path");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const isDev = require("electron-is-dev");
import os from "os";
import scanBooks, { getBookDetails } from "./electron-utils/utils";
import path from "path";
import { app, BrowserWindow, dialog, ipcMain, protocol, session } from "electron";
import isDev from "electron-is-dev";
import {
  INFO_FOLDER_LOCATION,
  BOOKS_LIST_LOCATION,
  SETTINGS_LOCATION,
  ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
  ELECTRON_RESPONSE_BOOKDATA_TYPE,
  ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
  ELECTRON_HAD_A_BOO_BOO,
} from "./electron-utils/constants";
import { existsSync, openSync, readFileSync, writeFileSync } from "original-fs";
import getSimpleBookData from "./electron-utils/bookData";
import { ResponseFromElectronType } from "./types/response.type";
import { BookData, BookDetails } from "./types/library.types";

const reactDevToolsPath = path.join(
  os.homedir(),
  "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\3.0.19_0"
);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "electron-utils", "preload.js"),
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(isDev ? "http://localhost:5173" : `file://${path.join(__dirname, "../build/index.html")}`);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  protocol.registerFileProtocol("image-file", (request, callback) => {
    const url = request.url.replace("image-file://", "");
    try {
      return callback(url);
    } catch (err) {
      console.error(err);
      return callback("404");
    }
  });

  session.defaultSession
    .loadExtension(reactDevToolsPath)
    .then(() => {
      createWindow();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ------------------------------- Event Listeners Below -------------------------------
//
// Listeners below will be called by React.
//
// This listener will send back all the books data to React
ipcMain.on("requestToElectron", async (event, data) => {
  // Determines what actions to take
  switch (data.type) {
    // Returns the Library data to React -> Does not Scan or ReScan.
    case "getAllBooksSimplified": {
      try {
        let results: ResponseFromElectronType = {
          error: false,
          type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
          message: "Successfully scanned",
          data: null,
        };

        results.data = getSimpleBookData();
        event.reply("responseFromElectron", results);
      } catch (err) {
        console.error(err);
        let results: ResponseFromElectronType = {
          error: true,
          type: ELECTRON_HAD_A_BOO_BOO,
          message: err.message,
          data: null,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Scans a directory for audiobooks
    case "newAudioBookDirectory": {
      // Get directory path from user
      const dirPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        message: "Select the root directory containing your Audiobooks",
      });

      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        const results: ResponseFromElectronType = {
          error: true,
          type: ELECTRON_HAD_A_BOO_BOO,
          message: "Failed to get a directory",
          data: null,
        };

        event.reply("responseFromElectron", results);
      } else if (dirPath) {
        try {
          const rootPathForBooks = dirPath.filePaths[0];

          // Scan for books and build a save file
          // This will take place in a sub process
          const arrayOfBooks: BookData[] = await scanBooks(rootPathForBooks);

          const results: ResponseFromElectronType = {
            error: false,
            type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
            message: "Successfully scanned",
            data: arrayOfBooks,
          };

          if (arrayOfBooks) {
            console.log(`Replying to React`);
            event.reply("responseFromElectron", results);
          }
        } catch (err) {
          event.reply("responseFromElectron", {
            error: true,
            message: err.ELECTRON_HAD_A_BOO_BOO,
            data: null,
          });
        }
      }
      break;
    }
    // Get settings from file
    case "getSettings": {
      try {
        let settings = {};

        // 1. Get settings from settings file
        if (existsSync(SETTINGS_LOCATION)) {
          settings = readFileSync(SETTINGS_LOCATION);
        } else {
          // create settings file and return an empty object
          writeFileSync(SETTINGS_LOCATION, "w");
          const results: ResponseFromElectronType = {
            error: false,
            type: ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
            message: "Failed to get a directory",
            data: null,
          };
          event.reply("responseFromElectron", results);
        }
      } catch (err) {
        console.error(err);
        const results: ResponseFromElectronType = {
          error: true,
          type: ELECTRON_HAD_A_BOO_BOO,
          message: err.message,
          data: null,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Get a books details
    case "getBookDetails": {
      try {
        // TODO -> Send to child process to fetch the book details
        const {
          data: { path },
        } = data;

        if (existsSync(path)) {
          const results: BookDetails = await getBookDetails(path);

          if (results) {
            console.log(`Replying to React`);

            const reply: ResponseFromElectronType = {
              error: false,
              type: ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
              message: "Successfully fetched details",
              data: results,
            };

            event.reply("responseFromElectron", reply);
          }
        } else {
          throw new Error(`Did not find book at : ${path}`);
        }

        break;
      } catch (err) {
        console.error(err);
        const results: ResponseFromElectronType = {
          error: true,
          type: ELECTRON_HAD_A_BOO_BOO,
          message: err.message,
          data: null,
        };
        event.reply("responseFromElectron", results);
      }
    }
    default: {
      console.log(`You've hit default -> ${data.type}`);
      break;
    }
  }
});
