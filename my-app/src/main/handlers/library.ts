export interface RequestFromReactType {
  type: string
  data: any
}

async function handleRendererRequest(event: any, request: RequestFromReactType) {
  const { type, data } = request

  switch (type) {
    case 'readLibraryFile': {
      break
    }
    case 'readSettingsFile': {
      break
    }
    case 'writeSettingsFile': {
      break
    }
    case 'addBookDirectory': {
      break
    }
    case 'saveBookProgress': {
      break
    }
    default: {
      console.log(
        `You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`
      )
      break
    }
  }
}

export { handleRendererRequest }
