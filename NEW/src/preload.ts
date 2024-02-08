// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer (React) process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // Sends requests to Electron
  send: (channel: string, data: any) => {
    // whitelist channels
    let validChannels = ["requestToElectron"];

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // Recieves responess from Electron
  receive: (channel: string, func: any) => {
    // whitelist channels
    let validChannels = ["responseFromElectron"];

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
});

console.log(`Preload -- Loaded`);