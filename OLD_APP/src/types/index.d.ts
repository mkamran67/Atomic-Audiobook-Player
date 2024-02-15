export {}

declare global {
  interface Window {
    api: {
      send: (channel: string, data?: any) => void
      receive: (channel: string, func?: any) => void
    }
  }
}

window.api = window.api || {}
