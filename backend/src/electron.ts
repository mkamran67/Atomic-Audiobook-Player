// const { scanBooks } = require("./electron-utils/utils");
// const path = require("path");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const isDev = require("electron-is-dev");
import { app, BrowserWindow, dialog, ipcMain, net, protocol, session } from "electron";
import isDev from "electron-is-dev";
import { existsSync, mkdirSync } from "original-fs";
import path from "path";
import getSimpleBookData from "./electron-utils/bookData";
import {
  ELECTRON_ERROR,
  ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
  ELECTRON_RESPONSE_BOOKDATA_TYPE,
  ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
  INFO_FOLDER_LOCATION,
} from "./electron-utils/constants";
import { handleSettings } from "./electron-utils/settings";
import scanBooks, { getBookDetails } from "./electron-utils/utils";
import { BookData, BookDetails } from "./types/library.types";
import { RequestFromReactType, ResponseFromElectronType } from "./types/response.type";

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

protocol.registerSchemesAsPrivileged([{ scheme: "get-file", privileges: { secure: true, standard: true, stream: true } }]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  protocol.handle("get-file", (request) => {
    const normURI = path.normalize(decodeURI(request.url).slice("get-file://".length));
    const url = `file://${normURI[0]}:${normURI.slice(1, normURI.length)}`;
    return net.fetch(url);
  });

  if (isDev) {
    // const reactDT = path.join(__dirname, "..", "extensions", "react", "4.27.8_0");
    const reduxDT = path.join(__dirname, "..", "extensions", "redux", "3.0.19_0");

    // REVIEW -> This Extension is not working
    // await session.defaultSession.loadExtension(reactDT);
    await session.defaultSession.loadExtension(reduxDT);
    createWindow();
  } else {
    createWindow();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Create appData folder if it does not exist

if (!existsSync(INFO_FOLDER_LOCATION)) {
  mkdirSync(INFO_FOLDER_LOCATION);
}

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
