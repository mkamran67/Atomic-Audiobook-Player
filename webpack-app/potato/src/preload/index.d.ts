interface ElectronChannel {
  send: (channel: string, data: any) => void
  receive: (channel: string, func: any) => void
}

export { type ElectronChannel }
