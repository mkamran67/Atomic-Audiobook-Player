import { net } from 'electron'
import path from 'path'

export const getFileFromDisk = async (request) => {
  console.log('👉 -> file: index.ts:62 -> request:', request.url)

  try {
    const normURI = path.normalize(decodeURI(request.url).slice('get-file://'.length))
    const url = `file://${normURI[0]}:${normURI.slice(1, normURI.length)}`
    return net.fetch(url)
  } catch (error: any) {
    console.log('👉 -> file: index.ts:69 -> error:', error)
    return error
  }
}
