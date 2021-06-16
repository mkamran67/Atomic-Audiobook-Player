interface Window {
  ipcRenderer: any;
}

window.ipcRenderer = require("electron").ipcRenderer;
