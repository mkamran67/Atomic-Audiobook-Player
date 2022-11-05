// const { scanBooks } = require("./electron-utils/utils");
// const path = require("path");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const isDev = require("electron-is-dev");

import scanBooks from "./electron-utils/utils";
import path from "path";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import isDev from "electron-is-dev";

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
app.whenReady().then(createWindow);

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

// ------------------------------- Event Listeners -------------------------------

ipcMain.on("toMain", async (event, data) => {
  let dirPath = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    message: "Select the directory containing your audiobooks",
  });

  if (dirPath && dirPath.canceled) {
    // Tell React it failed/canceled
    event.reply("fromMain", { results: false });
  } else if (dirPath) {
    // Tell React it succeeded -> React runs loader til next message
    // Check for books and build
    scanBooks(dirPath.filePaths[0]);

    // Set a new directory -> Continue loading create listener for "Done"
    event.reply("fromMain", { results: true });
  }
});
