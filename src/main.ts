import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import isDev from "electron-is-dev"; // New Import

// Function that creates the main window
const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Removed preload JS since latest Electron - React supports ipchandler as a module
      // preload: __dirname + "/preload.js",
    },
  });

  // React Loaded
  mainWindow.loadURL(
    isDev ? "http://localhost:9000" : `file://${app.getAppPath()}/index.html`
  );

  // Worker Window
  // const workerWindow = new BrowserWindow({
  //   show: false,
  //   webPreferences: { nodeIntegration: true },
  // });

  // workerWindow.loadFile("worker.html");

  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their
  // menu bar to stay active until the user quits
  // explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the
  // app when the dock icon is clicked and there are no
  // other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file, you can include the rest of your
// app's specific main process code. You can also
// put them in separate files and require them here.

function flatten(lists: string[][]) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath: string) {
  return fs
    .readdirSync(srcpath)
    .map((file) => path.join(srcpath, file))
    .filter((path) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath: string): string[] {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
}
// Interface -> Get root directory for Audiobooks
ipcMain.on("asynchronous-message", (event, arg) => {
  try {
    dialog
      .showOpenDialog({
        filters: [{ name: "Audio", extensions: ["mp3", "ogg", "wav"] }],
        title: "Select a root directory",
        buttonLabel: "Select directory",
        properties: ["openDirectory"],
      })
      .then((result) => {
        console.log(result);
        if (!result.canceled) {
          let list = getDirectoriesRecursive(result.filePaths[0]);

          let filteredList = list.filter((src) => {
            let hasAudio = false;

            let files = fs.readdirSync(src);

            for (let index = 0; index < files.length; index++) {
              if (
                path.extname(files[index]) == ".mp3" ||
                path.extname(files[index]) == ".m4b"
              ) {
                hasAudio = true;
                break;
              }
            }

            console.log(hasAudio);
            return hasAudio;
          });

          console.log({ filteredList });

          event.reply("asynchronous-reply", [result.canceled, filteredList]);
        } else {
          event.reply("asynchronous-reply", [
            result.canceled,
            result.filePaths,
          ]);
        }
      });
  } catch (err) {
    console.error(err);
  }
});

/* -------------------------------------------------------------------------- */
/*                                 this is app                                */
/* -------------------------------------------------------------------------- */

console.log(`\n🚀 Electron App is running\n`);
