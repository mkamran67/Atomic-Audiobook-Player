// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import logger from './main/utils/logger'

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
    console.log('CODE 66 -> Error exposing Electron APIs to renderer')
    console.error(error)
  }
} else {
  window.api = api
}
