// const { scanBooks } = require("./electron-utils/utils");
// const path = require("path");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const isDev = require("electron-is-dev");
import os from "os";
import scanBooks from "./electron-utils/utils";
import path from "path";
import { app, BrowserWindow, dialog, ipcMain, session } from "electron";
import isDev from "electron-is-dev";
import { INFO_FOLDER_LOCATION, BOOKS_LIST_LOCATION } from "./electron-utils/constants";
import { existsSync, readFileSync } from "original-fs";
import getSimpleBookData from "./electron-utils/bookData";

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
  await session.defaultSession.loadExtension(reactDevToolsPath);

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ------------------------------- Event Listeners Below -------------------------------
//
//
// Listeners below will be called by React.
//
//
//
//
// This listener will send back all the books data to React
ipcMain.on("requestToElectron", async (event, data) => {
  switch (data.type) {
    case "getAllBooksSimplified": {
      const results = getSimpleBookData();
      console.log("👉 -> file: electron.ts:82 -> results:", results);
      event.reply("responseFromElectron", results);
      break;
    }
    case "firstTimeScanForBooks": {
      let dirPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        message: "Select the root directory containing your Audiobooks",
      });

      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        event.reply("fromMain", { results: false });
      } else if (dirPath) {
        const rootPathForBooks = dirPath.filePaths[0];

        // Tell React it succeeded -> React runs loader til next message
        // Check for books and build
        const dataFilePath = await scanBooks(rootPathForBooks); // This will take place in a sub process

        // Set a new directory -> Continue loading create listener for "Done"
        if (dataFilePath) {
          event.reply("fromMain", { results: true, filePath: dataFilePath });
        }
      }
      break;
    }
    case "scanForBooks": {
      let dirPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        message: "Select the root directory containing your Audiobooks",
      });

      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        event.reply("fromMain", { results: false });
      } else if (dirPath) {
        const rootPathForBooks = dirPath.filePaths[0];

        // Tell React it succeeded -> React runs loader til next message
        // Check for books and build
        const dataFilePath = await scanBooks(rootPathForBooks); // This will take place in a sub process

        // Set a new directory -> Continue loading create listener for "Done"
        if (dataFilePath) {
          event.reply("fromMain", { results: true, filePath: dataFilePath });
        }
      }
      break;
    }

    default:
      console.log(`You've hit default -> ${data.type}`);
      break;
  }
});

ipcMain.on("toMain", async (event, data) => {
  console.log("👉 -> file: electron.ts:57 -> data:", data);
  // Channel data determines what to do and return

  // let dirPath = await dialog.showOpenDialog({
  //   properties: ["openDirectory"],
  //   message: "Select the root directory containing your audiobooks",
  // });

  // if (dirPath && dirPath.canceled) {
  //   // Tell React it failed/canceled
  //   event.reply("fromMain", { results: false });
  // } else if (dirPath) {
  //   const rootPathForBooks = dirPath.filePaths[0];

  //   // Tell React it succeeded -> React runs loader til next message
  //   // Check for books and build
  //   const dataFilePath = await scanBooks(rootPathForBooks); // This will take place in a sub process

  //   // Set a new directory -> Continue loading create listener for "Done"
  //   if (dataFilePath) {
  //     event.reply("fromMain", { results: true, filePath: dataFilePath });
  //   }
  // }
});
