/**
 *
 * 1. Create child process
 * 2. Listen for Directory path
 * 3. Read Directory path and create a list directories with files
 * 4. Create JSON library from the list of directories
 *
 * -> Don't need Electron in this process
 * -> This process only uses node.js
 */

const path = require("path");
const fs = require("graceful-fs");
const mm = require("music-metadata");
const uniqid = require("uniqid");
const { errorMonitor } = require("events");

// Functions for recursively searching directories
function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs
    .readdirSync(srcpath)
    .map((file) => path.join(srcpath, file))
    .filter((path) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
}

// Save books as JSON
function saveBooksAsJSON(books, appPath) {
  try {
    const bookData = JSON.stringify(books, null, 2);

    // Write to AppDate directory
    fs.writeFileSync(appPath, bookData);

    console.log(`Saved to -> ${appPath}`);
  } catch (error) {
    console.error(error);
  }
}

// Get All details of a book
async function getBookData(dirPath) {
  const dirTitle = dirPath.split("\\").pop(); // Get title of directory
  let files = fs.readdirSync(dirPath); // Get list of files within a directory

  let book = {};
  let images = []; // hold images found in directory
  let book_parts = []; // hold paths for each book part (media file)
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

// Main Listener
process.on("message", async ({ dirPath, libraryPath, settingsPath }) => {
  try {
    // 1. Get All end directories (books)
    let listOfendDirectories = await getDirectoriesRecursive(dirPath).filter(
      (directory) => {
        const innerFiles = fs.readdirSync(directory);
        // Check if the first file in the file is not a directory
        if (
          innerFiles.length > 0 &&
          !fs.lstatSync(`${directory}\\${innerFiles[0]}`).isDirectory()
        ) {
          return true;
        }
        return false;
      }
    );

    // 2. Check if library file exists
    if (fs.existsSync(libraryPath)) {
      // Delete library file
      console.log("Deleteing ->", libraryPath);
      try {
        fs.unlinkSync(libraryPath);
      } catch (err) {
        console.log(`You got an error`);
        console.error(err);
      }
    }

    let booksListObj = {};

    // 3. Iterate over every book (End Directory) get details about book
    for (let i = 0; i < listOfendDirectories.length; i++) {
      // Get list of files within folder
      let files = fs.readdirSync(listOfendDirectories[i]); // REVIEW - refactor for effecient looping
      let bookName = listOfendDirectories[i].split("\\").pop();

      let details = {
        name: bookName,
        image_paths: [],
      };

      // Fetch metadata for each file
      for (let index = 0; index < files.length; index++) {
        const extType = path.extname(files[index]);

        // Save images for cover photo
        if (extType === ".jpg" || extType === ".jpeg" || extType === ".png") {
          // Get images/covers from folder
          details.image_paths.push(
            listOfendDirectories[i] + "\\" + files[index]
          );
        }
      }
      // Create a uniqueId
      booksListObj[`${uniqid()}`] = details;
    }

    // 4. Save new root path into Settings file
    if (fs.existsSync(settingsPath)) {
      // Updating library file
      console.log("Updating ⚙ ->", settingsPath);
      try {
        let currentSettings = JSON.parse(fs.readFileSync(settingsPath));
        currentSettings.rootDirectory = dirPath;

        fs.writeFileSync(settingsPath, JSON.stringify(currentSettings));
      } catch (err) {
        console.log(`You got an error`);
        console.error(err);
      }
    } else {
      // if not file exists
      let newSettings = { rootDirectory: dirPath };
      fs.writeFileSync(settingsPath, JSON.stringify(newSettings));
    }

    // 5. Append data to library file
    fs.appendFile(libraryPath, JSON.stringify(booksListObj, null, 2) + "\n");

    console.log(`\nSending data back ->\n`);
    // 6. Reply back to Electron - Main Process
    process.send({ status: "success", data: booksListObj });
  } catch (err) {
    //❌ 6. if it fails
    process.send({ status: "fail", data: booksListObj, error: err });
    console.error(`error ->`, err);
  }
}); // process.on
