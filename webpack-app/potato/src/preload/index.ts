import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  // Sends requests to Electron
  send: (channel: string, data: any) => {
    // whitelist channels
    let validChannels = ['requestToElectron']

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // Recieves responess from Electron
  receive: (channel: string, func: any) => {
    console.log(`receive: ${channel}`)
    // whitelist channels
    let validChannels = ['responseFromElectron']

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (_event, ...args) => func(...args))
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
