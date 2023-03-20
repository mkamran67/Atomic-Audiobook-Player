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
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

console.log(`Preload -- Loaded`);
