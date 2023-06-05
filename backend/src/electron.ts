import { app, BrowserWindow, dialog, ipcMain, net, protocol, session } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import getSimpleBookData from "./electron-utils/bookData";
import {
  ELECTRON_RESPONSE_BOOKDATA_TYPE,
  ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
  INFO_FOLDER_LOCATION,
} from "./electron-utils/constants";
import getSettings from "./electron-utils/settings";
import scanBooks from "./electron-utils/utils";
import { BookData } from "./types/library.types";
import { ResponseFromElectronType } from "./types/response.type";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "original-fs";
import * as url from "url";

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

protocol.registerSchemesAsPrivileged([{ scheme: "image", privileges: { secure: true, standard: true, stream: true } }]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  protocol.handle("image", (request) => {
    const normURI = path.normalize(decodeURI(request.url).slice("image://".length));
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
          type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
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
          type: ELECTRON_RESPONSE_BOOKDATA_TYPE,
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
            message: err.message,
            data: null,
          });
        }
      }
      break;
    }
    // Get settings from file
    case "getSettings": {
      try {
        const data = getSettings();

        const results: ResponseFromElectronType = {
          error: false,
          type: ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
          message: "Settings Data Retrieved Successfully",
          data: data,
        };
        event.reply("responseFromElectron", results);
      } catch (err) {
        console.error(err);
        const results: ResponseFromElectronType = {
          error: true,
          type: ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
          message: err.message,
          data: null,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    default: {
      console.log(`You've hit default -> ${data.type}`);
      break;
    }
  }
});
