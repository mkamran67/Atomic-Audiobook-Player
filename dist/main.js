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

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\r\nvar electron_is_dev_1 = __importDefault(__webpack_require__(/*! electron-is-dev */ \"./node_modules/electron-is-dev/index.js\")); // New Import\r\nvar createWindow = function () {\r\n    var mainWindow = new electron_1.BrowserWindow({\r\n        width: 800,\r\n        height: 600,\r\n        webPreferences: {\r\n            nodeIntegration: true,\r\n            contextIsolation: false,\r\n        },\r\n    });\r\n    // console.log(\"---------------->\", isDev);\r\n    mainWindow.loadURL(electron_is_dev_1.default ? \"http://localhost:9000\" : \"file://\" + electron_1.app.getAppPath() + \"/index.html\");\r\n    // Remove Menu\r\n    // mainWindow.removeMenu();\r\n    // Open the DevTools.\r\n    // mainWindow.webContents.openDevTools();\r\n};\r\n// This method will be called when Electron has finished\r\n// initialization and is ready to create browser windows.\r\n// Some APIs can only be used after this event occurs.\r\n// This method is equivalent to 'app.on('ready', function())'\r\nelectron_1.app.whenReady().then(createWindow);\r\n// Quit when all windows are closed.\r\nelectron_1.app.on(\"window-all-closed\", function () {\r\n    // On macOS it is common for applications and their\r\n    // menu bar to stay active until the user quits\r\n    // explicitly with Cmd + Q\r\n    if (process.platform !== \"darwin\") {\r\n        electron_1.app.quit();\r\n    }\r\n});\r\nelectron_1.app.on(\"activate\", function () {\r\n    // On macOS it's common to re-create a window in the\r\n    // app when the dock icon is clicked and there are no\r\n    // other windows open.\r\n    if (electron_1.BrowserWindow.getAllWindows().length === 0) {\r\n        createWindow();\r\n    }\r\n});\r\n// In this file, you can include the rest of your\r\n// app's specific main process code. You can also\r\n// put them in separate files and require them here.\r\n\n\n//# sourceURL=webpack://atomic-audiobook-player/./src/main.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;