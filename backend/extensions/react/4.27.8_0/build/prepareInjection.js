/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 207);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CHROME_WEBSTORE_EXTENSION_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return INTERNAL_EXTENSION_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LOCAL_EXTENSION_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return __DEBUG__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return __PERFORMANCE_PROFILE__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return TREE_OPERATION_ADD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return TREE_OPERATION_REMOVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return TREE_OPERATION_REORDER_CHILDREN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return TREE_OPERATION_UPDATE_TREE_BASE_DURATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return TREE_OPERATION_REMOVE_ROOT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return TREE_OPERATION_SET_SUBTREE_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return PROFILING_FLAG_BASIC_SUPPORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return PROFILING_FLAG_TIMELINE_SUPPORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return LOCAL_STORAGE_DEFAULT_TAB_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY; });
/* unused harmony export SESSION_STORAGE_LAST_SELECTION_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return LOCAL_STORAGE_OPEN_IN_EDITOR_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return LOCAL_STORAGE_PARSE_HOOK_NAMES_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return SESSION_STORAGE_RELOAD_AND_PROFILE_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return LOCAL_STORAGE_SHOULD_BREAK_ON_CONSOLE_ERRORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return LOCAL_STORAGE_BROWSER_THEME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return LOCAL_STORAGE_SHOULD_APPEND_COMPONENT_STACK_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return LOCAL_STORAGE_SHOW_INLINE_WARNINGS_AND_ERRORS_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return LOCAL_STORAGE_TRACE_UPDATES_ENABLED_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return LOCAL_STORAGE_HIDE_CONSOLE_LOGS_IN_STRICT_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return PROFILER_EXPORT_VERSION; });
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
const CHROME_WEBSTORE_EXTENSION_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
const INTERNAL_EXTENSION_ID = 'dnjnjgbfilfphmojnmhliehogmojhclc';
const LOCAL_EXTENSION_ID = 'ikiahnapldjmdmpkmfhjdjilojjhgcbf'; // Flip this flag to true to enable verbose console debug logging.

const __DEBUG__ = false; // Flip this flag to true to enable performance.mark() and performance.measure() timings.

const __PERFORMANCE_PROFILE__ = false;
const TREE_OPERATION_ADD = 1;
const TREE_OPERATION_REMOVE = 2;
const TREE_OPERATION_REORDER_CHILDREN = 3;
const TREE_OPERATION_UPDATE_TREE_BASE_DURATION = 4;
const TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS = 5;
const TREE_OPERATION_REMOVE_ROOT = 6;
const TREE_OPERATION_SET_SUBTREE_MODE = 7;
const PROFILING_FLAG_BASIC_SUPPORT = 0b01;
const PROFILING_FLAG_TIMELINE_SUPPORT = 0b10;
const LOCAL_STORAGE_DEFAULT_TAB_KEY = 'React::DevTools::defaultTab';
const LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY = 'React::DevTools::componentFilters';
const SESSION_STORAGE_LAST_SELECTION_KEY = 'React::DevTools::lastSelection';
const LOCAL_STORAGE_OPEN_IN_EDITOR_URL = 'React::DevTools::openInEditorUrl';
const LOCAL_STORAGE_PARSE_HOOK_NAMES_KEY = 'React::DevTools::parseHookNames';
const SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY = 'React::DevTools::recordChangeDescriptions';
const SESSION_STORAGE_RELOAD_AND_PROFILE_KEY = 'React::DevTools::reloadAndProfile';
const LOCAL_STORAGE_SHOULD_BREAK_ON_CONSOLE_ERRORS = 'React::DevTools::breakOnConsoleErrors';
const LOCAL_STORAGE_BROWSER_THEME = 'React::DevTools::theme';
const LOCAL_STORAGE_SHOULD_APPEND_COMPONENT_STACK_KEY = 'React::DevTools::appendComponentStack';
const LOCAL_STORAGE_SHOW_INLINE_WARNINGS_AND_ERRORS_KEY = 'React::DevTools::showInlineWarningsAndErrors';
const LOCAL_STORAGE_TRACE_UPDATES_ENABLED_KEY = 'React::DevTools::traceUpdatesEnabled';
const LOCAL_STORAGE_HIDE_CONSOLE_LOGS_IN_STRICT_MODE = 'React::DevTools::hideConsoleLogsInStrictMode';
const PROFILER_EXPORT_VERSION = 5;

/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return IS_EDGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return IS_FIREFOX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return IS_CHROME; });
/* unused harmony export getBrowserName */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getBrowserTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COMPACT_VERSION_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EXTENSION_CONTAINED_VERSIONS; });
/* global chrome */
const IS_EDGE = navigator.userAgent.indexOf('Edg') >= 0;
const IS_FIREFOX = navigator.userAgent.indexOf('Firefox') >= 0;
const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;
function getBrowserName() {
  if (IS_EDGE) {
    return 'Edge';
  }

  if (IS_FIREFOX) {
    return 'Firefox';
  }

  if (IS_CHROME) {
    return 'Chrome';
  }

  throw new Error('Expected browser name to be one of Chrome, Edge or Firefox.');
}
function getBrowserTheme() {
  if (IS_CHROME) {
    // chrome.devtools.panels added in Chrome 18.
    // chrome.devtools.panels.themeName added in Chrome 54.
    return chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';
  } else {
    // chrome.devtools.panels.themeName added in Firefox 55.
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.panels/themeName
    if (chrome.devtools && chrome.devtools.panels) {
      switch (chrome.devtools.panels.themeName) {
        case 'dark':
          return 'dark';

        default:
          return 'light';
      }
    }
  }
}
const COMPACT_VERSION_NAME = 'compact';
const EXTENSION_CONTAINED_VERSIONS = [COMPACT_VERSION_NAME];

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nullthrows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var nullthrows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nullthrows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_devtools_shared_src_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var react_devtools_shared_src_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* global chrome */



 // We run scripts on the page via the service worker (backgroud.js) for
// Manifest V3 extensions (Chrome & Edge).
// We need to inject this code for Firefox only because it does not support ExecutionWorld.MAIN
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/ExecutionWorld
// In this content script we have access to DOM, but don't have access to the webpage's window,
// so we inject this inline script tag into the webpage (allowed in Manifest V2).

function injectScriptSync(src) {
  let code = '';
  const request = new XMLHttpRequest();
  request.addEventListener('load', function () {
    code = this.responseText;
  });
  request.open('GET', src, false);
  request.send();
  const script = document.createElement('script');
  script.textContent = code; // This script runs before the <head> element is created,
  // so we add the script to <html> instead.

  nullthrows__WEBPACK_IMPORTED_MODULE_0___default()(document.documentElement).appendChild(script);
  nullthrows__WEBPACK_IMPORTED_MODULE_0___default()(script.parentNode).removeChild(script);
}

let lastDetectionResult; // We want to detect when a renderer attaches, and notify the "background page"
// (which is shared between tabs and can highlight the React icon).
// Currently we are in "content script" context, so we can't listen to the hook directly
// (it will be injected directly into the page).
// So instead, the hook will use postMessage() to pass message to us here.
// And when this happens, we'll send a message to the "background page".

window.addEventListener('message', function onMessage({
  data,
  source
}) {
  var _data$payload;

  if (source !== window || !data) {
    return;
  }

  switch (data.source) {
    case 'react-devtools-detector':
      lastDetectionResult = {
        hasDetectedReact: true,
        reactBuildType: data.reactBuildType
      };
      chrome.runtime.sendMessage(lastDetectionResult);
      break;

    case 'react-devtools-extension':
      if (((_data$payload = data.payload) === null || _data$payload === void 0 ? void 0 : _data$payload.type) === 'fetch-file-with-cache') {
        const url = data.payload.url;

        const reject = value => {
          chrome.runtime.sendMessage({
            source: 'react-devtools-content-script',
            payload: {
              type: 'fetch-file-with-cache-error',
              url,
              value
            }
          });
        };

        const resolve = value => {
          chrome.runtime.sendMessage({
            source: 'react-devtools-content-script',
            payload: {
              type: 'fetch-file-with-cache-complete',
              url,
              value
            }
          });
        };

        fetch(url, {
          cache: 'force-cache'
        }).then(response => {
          if (response.ok) {
            response.text().then(text => resolve(text)).catch(error => reject(null));
          } else {
            reject(null);
          }
        }, error => reject(null));
      }

      break;

    case 'react-devtools-inject-backend-manager':
      if (_utils__WEBPACK_IMPORTED_MODULE_3__[/* IS_FIREFOX */ "e"]) {
        injectScriptSync(chrome.runtime.getURL('build/backendManager.js'));
      }

      break;

    case 'react-devtools-backend-manager':
      if (_utils__WEBPACK_IMPORTED_MODULE_3__[/* IS_FIREFOX */ "e"]) {
        var _data$payload2, _data$payload2$versio;

        (_data$payload2 = data.payload) === null || _data$payload2 === void 0 ? void 0 : (_data$payload2$versio = _data$payload2.versions) === null || _data$payload2$versio === void 0 ? void 0 : _data$payload2$versio.forEach(version => {
          if (_utils__WEBPACK_IMPORTED_MODULE_3__[/* EXTENSION_CONTAINED_VERSIONS */ "b"].includes(version)) {
            injectScriptSync(chrome.runtime.getURL(`/build/react_devtools_backend_${version}.js`));
          }
        });
      }

      break;
  }
}); // NOTE: Firefox WebExtensions content scripts are still alive and not re-injected
// while navigating the history to a document that has not been destroyed yet,
// replay the last detection result if the content script is active and the
// document has been hidden and shown again.

window.addEventListener('pageshow', function ({
  target
}) {
  if (!lastDetectionResult || target !== window.document) {
    return;
  }

  chrome.runtime.sendMessage(lastDetectionResult);
});

if (_utils__WEBPACK_IMPORTED_MODULE_3__[/* IS_FIREFOX */ "e"]) {
  // If we have just reloaded to profile, we need to inject the renderer interface before the app loads.
  if (Object(react_devtools_shared_src_storage__WEBPACK_IMPORTED_MODULE_2__[/* sessionStorageGetItem */ "d"])(react_devtools_shared_src_constants__WEBPACK_IMPORTED_MODULE_1__[/* SESSION_STORAGE_RELOAD_AND_PROFILE_KEY */ "r"]) === 'true') {
    injectScriptSync(chrome.runtime.getURL('build/renderer.js'));
  } // Inject a __REACT_DEVTOOLS_GLOBAL_HOOK__ global for React to interact with.
  // Only do this for HTML documents though, to avoid e.g. breaking syntax highlighting for XML docs.


  switch (document.contentType) {
    case 'text/html':
    case 'application/xhtml+xml':
      {
        injectScriptSync(chrome.runtime.getURL('build/installHook.js'));
        break;
      }
  }
}

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function nullthrows(x, message) {
  if (x != null) {
    return x;
  }

  var error = new Error(message !== undefined ? message : 'Got unexpected ' + x);
  error.framesToPop = 1; // Skip nullthrows's own stack frame.

  throw error;
}

module.exports = nullthrows;
module.exports.default = nullthrows;
Object.defineProperty(module.exports, '__esModule', {
  value: true
});

/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return localStorageGetItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return localStorageRemoveItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return localStorageSetItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return sessionStorageGetItem; });
/* unused harmony export sessionStorageRemoveItem */
/* unused harmony export sessionStorageSetItem */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function localStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}
function localStorageSetItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {}
}
function sessionStorageGetItem(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function sessionStorageRemoveItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {}
}
function sessionStorageSetItem(key, value) {
  try {
    return sessionStorage.setItem(key, value);
  } catch (error) {}
}

/***/ })

/******/ });