/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/electron-is-dev/index.js":
/*!***********************************************!*\
  !*** ./node_modules/electron-is-dev/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst electron = __webpack_require__(/*! electron */ \"electron\");\n\nif (typeof electron === 'string') {\n\tthrow new TypeError('Not running in an Electron environment!');\n}\n\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\nconst getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\n\nmodule.exports = isEnvSet ? getFromEnv : !electron.app.isPackaged;\n\n\n//# sourceURL=webpack://atomic-audiobook-player/./node_modules/electron-is-dev/index.js?");

/***/ }),

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\r\nvar electron_is_dev_1 = __importDefault(__webpack_require__(/*! electron-is-dev */ \"./node_modules/electron-is-dev/index.js\")); // New Import\r\nvar libraryPath = electron_1.app.getPath(\"userData\") + \"\\\\myLibrary.json\";\r\nvar settingsPath = electron_1.app.getPath(\"userData\") + \"\\\\mySettings.json\";\r\n// Child Process\r\nvar child_process_1 = __webpack_require__(/*! child_process */ \"child_process\");\r\nvar childProcess = child_process_1.fork(\"src/main/child_processes/createLibrary.js\"); // Forking child code\r\n// Function that creates the main window\r\nvar createWindow = function () {\r\n    var mainWindow = new electron_1.BrowserWindow({\r\n        width: 800,\r\n        height: 600,\r\n        webPreferences: {\r\n            nodeIntegration: true,\r\n            contextIsolation: false,\r\n            // Removed preload JS since latest Electron - React supports ipchandler as a module\r\n            // preload: __dirname + \"/preload.js\",\r\n        },\r\n    });\r\n    // React Loaded\r\n    mainWindow.loadURL(electron_is_dev_1.default ? \"http://localhost:9000\" : \"file://\" + electron_1.app.getAppPath() + \"/index.html\");\r\n    // Worker Window\r\n    // const workerWindow = new BrowserWindow({\r\n    //   show: false,\r\n    //   webPreferences: { nodeIntegration: true },\r\n    // });\r\n    // workerWindow.loadFile(\"worker.html\");\r\n    mainWindow.webContents.openDevTools();\r\n};\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\n// This method is equivalent to 'app.on('ready', function())'\r\nelectron_1.app.whenReady().then(createWindow);\r\n// Quit when all windows are closed.\r\nelectron_1.app.on(\"window-all-closed\", function () {\r\n    // On macOS it is common for applications and their\r\n    // menu bar to stay active until the user quits\r\n    // explicitly with Cmd + Q\r\n    if (process.platform !== \"darwin\") {\r\n        electron_1.app.quit();\r\n    }\r\n});\r\nelectron_1.app.on(\"activate\", function () {\r\n    // On macOS it's common to re-create a window in the\r\n    // app when the dock icon is clicked and there are no\r\n    // other windows open\r\n    if (electron_1.BrowserWindow.getAllWindows().length === 0) {\r\n        createWindow();\r\n    }\r\n});\r\n/* -------------------------------------------------------------------------- */\r\n/*                       Functions and Listeneres below                       */\r\n/* -------------------------------------------------------------------------- */\r\n// Interface -> Get List of Audiobooks\r\nelectron_1.ipcMain.on(\"asynchronous-open\", function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {\r\n    var booksList, result, openedDirectory, err_1;\r\n    return __generator(this, function (_a) {\r\n        switch (_a.label) {\r\n            case 0:\r\n                console.log(\"\\nOpened folder\");\r\n                _a.label = 1;\r\n            case 1:\r\n                _a.trys.push([1, 3, , 4]);\r\n                booksList = [];\r\n                return [4 /*yield*/, electron_1.dialog.showOpenDialog({\r\n                        filters: [{ name: \"Audio\", extensions: [\"mp3\", \"ogg\", \"wav\"] }],\r\n                        title: \"Select a root directory\",\r\n                        buttonLabel: \"Select directory\",\r\n                        properties: [\"openDirectory\"],\r\n                    })];\r\n            case 2:\r\n                result = _a.sent();\r\n                openedDirectory = null;\r\n                // If user selected a directory\r\n                if (!result.canceled) {\r\n                    openedDirectory = result.filePaths[0];\r\n                    childProcess.send({\r\n                        dirPath: openedDirectory,\r\n                        libraryPath: libraryPath,\r\n                        settingsPath: settingsPath,\r\n                    });\r\n                    childProcess.on(\"message\", function (data) {\r\n                        console.log(data.status);\r\n                        // if (fs.existsSync(settingsPath)) {\r\n                        //   //file exists - Append to file\r\n                        //   // 1. Parse previous data\r\n                        //   fs.readFile(settingsPath, \"json\", (err, data) => {\r\n                        //     if (err) throw err;\r\n                        //     let settings = JSON.parse(data);\r\n                        //     settings.rootDirectory = data.openedDirectory; // Save to local too?\r\n                        //     fs.writeFile(settingsPath, JSON.stringify(settings), (err) => {\r\n                        //       if (err) throw err;\r\n                        //     });\r\n                        //   });\r\n                        //   // 2. Append new data removing old data\r\n                        // } else {\r\n                        //   // Write to new file\r\n                        //   fs.writeFileSync(settingsPath, JSON.stringify(openedDirectory));\r\n                        // }\r\n                        // 3. Send Library location\r\n                        // Reply to React with the path to library.json and settings.json\r\n                        event.reply(\"asynchronous-reply\", data);\r\n                        // Remove\r\n                    });\r\n                }\r\n                else {\r\n                    event.reply(\"asynchronous-reply\", [result.canceled, result.filePaths]);\r\n                }\r\n                return [3 /*break*/, 4];\r\n            case 3:\r\n                err_1 = _a.sent();\r\n                console.error(err_1);\r\n                return [3 /*break*/, 4];\r\n            case 4: return [2 /*return*/];\r\n        }\r\n    });\r\n}); });\r\n// Startup -> Check if library exists\r\n// ipcMain.on(\"start-up-checks\", (event, arg) => {\r\n//   try {\r\n//     if (fs.existsSync(app.getPath(\"appData\"))) {\r\n//       event.reply(\"start-up-checks-reply\", true);\r\n//     } else {\r\n//       event.reply(\"start-up-checks-reply\", false);\r\n//     }\r\n//   } catch (err) {\r\n//     console.error(err);\r\n//   }\r\n// });\r\n/* -------------------------------------------------------------------------- */\r\n/*                                 this is app                                */\r\n/* -------------------------------------------------------------------------- */\r\nconsole.log(\"\\n\\uD83D\\uDE80 Electron App is running\\n\");\r\n\n\n//# sourceURL=webpack://atomic-audiobook-player/./src/main/main.ts?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");;

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/main.ts");
/******/ 	
/******/ })()
;