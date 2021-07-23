import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "graceful-fs";
import isDev from "electron-is-dev"; // New Import
import Book from "./electron_Interfaces/Book";
import * as mm from "music-metadata";
import uniqid from "uniqid";

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

/* -------------------------------------------------------------------------- */
/*                       Functions and Listeneres below                       */
/* -------------------------------------------------------------------------- */

// Functions for recursively searching directories
function flatten(lists: string[][]) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath: string) {
  return fs
    .readdirSync(srcpath)
    .map((file: any) => path.join(srcpath, file))
    .filter((path: any) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath: string): string[] {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
}

// Save books as JSON
function saveBooksAsJSON(books: {}[]) {
  try {
    const bookData = JSON.stringify(books, null, 2);

    // Write to AppDate directory
    fs.writeFileSync(`${app.getPath("userData")}\\myLibrary.json`, bookData);

    console.log(`Saved to -> ${app.getPath("userData")}\\myLibrary.json`);
  } catch (error) {
    console.error(error);
  }
}

// Get All details of a book
async function getBookData(dirPath: string): Promise<Book | null> {
  const dirTitle = dirPath.split("\\").pop(); // Get title of directory
  let files = fs.readdirSync(dirPath); // Get list of files within a directory

  let book = {} as Book;
  let images = [] as string[]; // hold images found in directory
  let book_parts = [] as string[]; // hold paths for each book part (media file)
  let book_duration = 0; // Accumulate total length/duration of the book
  try {
    // For accumulating data from all parts of the book (all files, inside given directory)
    files.forEach(async (element) => {
      let extType = path.extname(element); // Get extension
      const filePath = dirPath + "\\" + element;

      if (
        extType == ".mp3" ||
        extType == ".m4a" ||
        extType == ".m4b" ||
        extType == ".ogg" ||
        extType == ".wav" ||
        extType == ".aax" ||
        extType == ".aac" ||
        extType == ".m4p" ||
        extType == ".wma" ||
        extType == ".flac" ||
        extType == ".alac"
      ) {
        // 1. Get current audio files path, use this as part for the book
        book_parts.push(filePath);

        // 2. Get metadata for current audio file
        const book_metadata = await mm.parseFile(filePath); // parse audio file

        // 3. Accumulate all duration of audio files
        if (book_metadata.format && book_metadata.format.duration) {
          book_duration += book_metadata.format.duration;
        }
        book_duration += Number(book_metadata.format.duration);
      } else if (extType == ".jpg" || extType == ".jpeg" || extType == ".png") {
        // Get images/covers from folder
        images.push(element);
      }
    });

    const filePath = book_parts[0];
    const book_metadata = await mm.parseFile(filePath); // parse audio file

    // Create book object with gathered data
    book = {
      id: uniqid(),
      title: book_metadata.common.title ? book_metadata.common.title : dirTitle,
      author: book_metadata.common.artist ? book_metadata.common.artist : "",
      description: book_metadata.common.description
        ? book_metadata.common.description
        : "",
      comments: book_metadata.common.comment
        ? book_metadata.common.comment
        : "",
      total_length: book_duration,
      composers: book_metadata.common.composer
        ? [...book_metadata.common.composer]
        : [],
      genre: book_metadata.common.genre ? [...book_metadata.common.genre] : [],
      folder_path: dirPath,
      parts_paths: book_parts,
      image_paths: images,
      year: book_metadata.common.year
        ? Number(book_metadata.common.year)
        : book_metadata.common.date
        ? Number(book_metadata.common.date)
        : 0,
      series_name: book_metadata.common.album ? book_metadata.common.album : "",
      copyright:
        book_metadata.common.copyright &&
        book_metadata.common.copyright.length > 0
          ? book_metadata.common.copyright[0]
          : "",
    };

    // console.log(`\n\nBook -> `, book);

    return book;
  } catch (error) {
    console.error(error.message);

    return null;
  }
}

// Interface -> Get List of Audiobooks
ipcMain.on("asynchronous-open-folder", async (event, arg) => {
  try {
    let booksList = [] as Book[];

    let result = await dialog.showOpenDialog({
      filters: [{ name: "Audio", extensions: ["mp3", "ogg", "wav"] }],
      title: "Select a root directory",
      buttonLabel: "Select directory",
      properties: ["openDirectory"],
    });

    let openedDirectory = null;

    if (!result.canceled) {
      openedDirectory = result.filePaths[0];

      let list = getDirectoriesRecursive(openedDirectory);

      // Build a JSON array of all the books
      // const booksList = list.flatMap(async (src) =>

      for (let i = 0; i < list.length; i++) {
        const src = list[i];
        // Get list of files within folder
        let files = fs.readdirSync(src);

        // Fetch metadata for each file
        for (let index = 0; index < files.length; index++) {
          let extType = path.extname(files[index]);

          if (
            extType == ".mp3" ||
            extType == ".m4a" ||
            extType == ".m4b" ||
            extType == ".ogg" ||
            extType == ".wav" ||
            extType == ".aax" ||
            extType == ".aac" ||
            extType == ".m4p" ||
            extType == ".wma" ||
            extType == ".flac" ||
            extType == ".alac"
          ) {
            // Read metaData of files
            const res = await getBookData(src);

            if (res) {
              booksList.push(res);
            }
          }
        }
      }

      console.log(
        `\n\nhi---------------------------------------------------------------------------`
      );

      // Save the list of books
      saveBooksAsJSON(booksList);
      console.log("👉 -> booksList", booksList);

      // reply to renderer process
      event.reply("asynchronous-reply", [
        result.canceled,
        openedDirectory,
        booksList,
      ]);
    } else {
      event.reply("asynchronous-reply", [result.canceled, result.filePaths]);
    }
  } catch (err) {
    console.error(err);
  }
});

// Startup -> Check if library exists
// ipcMain.on("start-up-checks", (event, arg) => {
//   try {
//     if (fs.existsSync(app.getPath("appData"))) {
//       event.reply("start-up-checks-reply", true);
//     } else {
//       event.reply("start-up-checks-reply", false);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });

/* -------------------------------------------------------------------------- */
/*                                 this is app                                */
/* -------------------------------------------------------------------------- */

console.log(`\n🚀 Electron App is running\n`);
