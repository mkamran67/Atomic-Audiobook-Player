import fs from 'fs'
import { SETTINGS_LOCATION } from '../electron_constants'
import { readAndParseTextFile } from '../utils/diskReader'

interface SettingsStructureType {
  rootDirectories: string[]
  theme?: string
  themeMode: 'dark' | 'light' | 'system'
  fontSize?: number
  previoousBookDirectory: string
}

async function saveSettings(data: SettingsStructureType) {
  try {
    fs.writeFile(SETTINGS_LOCATION, JSON.stringify(data), () => {
      console.log('Settings saved')
    })
  } catch (err: any) {
    throw new Error(err)
  }
}

async function readSettings(): SettingsStructureType {
  try {
    const settings = readAndParseTextFile(SETTINGS_LOCATION)
  } catch (err: any) {
    throw new Error(err)
  }
}

export async function createSettingsFile(): boolean {
  try {
    fs.writeFileSync(SETTINGS_LOCATION, JSON.stringify({ rootDirectory: '' }), 'utf8')
  } catch (err: any) {
    throw new Error(err)
  }
}

export async function handleSettings(operation: string, data: any): Promise<any> {
  switch (operation) {
    case 'save': {
      await saveSettings(data)
      break
    }
    case 'update': {
      break
    }
    case 'delete': {
      break
    }
    case 'default': {
      break
    }
    case 'read': {
      await readSettings()
      break
    }

    default: {
      console.log(`You've hit default`)
      break
    }
  }
}
