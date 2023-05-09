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
  ELECTRON_ERROR,
} from "./electron-utils/constants";
import { existsSync, openSync, readFileSync, writeFileSync } from "original-fs";
import getSimpleBookData from "./electron-utils/bookData";
import { RequestFromReactType, ResponseFromElectronType } from "./types/response.type";
import { BookData, BookDetails } from "./types/library.types";
import { handleSettings } from "./electron-utils/settings";

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
ipcMain.on("requestToElectron", async (event, req: RequestFromReactType) => {
  const { type, data } = req;

  // Determines what actions to take
  switch (type) {
    // Returns the Library data to React -> Does not Scan or ReScan.
    case "getAllBooksSimplified": {
      try {
        const results: ResponseFromElectronType = {
          type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
          data: getSimpleBookData(),
        };

        event.reply("responseFromElectron", results);
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
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
        message: "Select the root directory containing your audiobooks",
      });

      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: {
            message: "Failed to get a directory",
          },
        };

        event.reply("responseFromElectron", results);
      } else if (dirPath) {
        try {
          const rootPathForBooks = dirPath.filePaths[0];

          // Scan for books and build a save file
          // This will take place in a sub process
          const arrayOfBooks: BookData[] = await scanBooks(rootPathForBooks);

          const results: ResponseFromElectronType = {
            type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
            data: arrayOfBooks,
          };

          if (arrayOfBooks) {
            console.log(`Updating Settings ->`);
            await handleSettings("update", arrayOfBooks);
            console.log(`Replying to React ->`);
            event.reply("responseFromElectron", results);
          }
        } catch (err) {
          const results: ResponseFromElectronType = {
            type: ELECTRON_ERROR,
            data: err,
          };

          event.reply("responseFromElectron", results);
        }
      }
      break;
    }
    // Get settings from file
    case "getSettings": {
      try {
        const res = await handleSettings("read", data);

        if (res) {
          const results: ResponseFromElectronType = {
            type: ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
            data: res,
          };
          event.reply("responseFromElectron", results);
        }
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Get a books details
    case "getBookDetails": {
      try {
        console.log(data);
        // TODO -> Send to child process to fetch the book details
        const { path } = data;

        if (existsSync(path)) {
          const results: BookDetails = await getBookDetails(path);

          if (results) {
            console.log(`Replying to React`);

            const reply: ResponseFromElectronType = {
              type: ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
              data: results,
            };

            event.reply("responseFromElectron", reply);
          }
        } else {
          throw new Error(`Did not find book at : ${path}`);
        }
      } catch (err) {
        const results: ResponseFromElectronType = {
          type: ELECTRON_ERROR,
          data: err,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Save current book progress
    case "saveBookProgress": {
      console.log(`You've hit ${type}`);
      console.log(data);
      break;
    }
    // get book history
    default: {
      console.log(`You've hit default -> ${type}`);
      break;
    }
  }
});
