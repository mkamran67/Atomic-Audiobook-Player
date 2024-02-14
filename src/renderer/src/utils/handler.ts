import { useDispatch } from 'react-redux'

import { setError } from '@renderer/components/LayoutSlice'
import { clearLoading } from '@renderer/components/loader/loaderSlice'
import { setCurrentBook } from '@renderer/components/player/playerSlice'
import { ResponseFromElectronType } from '@renderer/types/library.types'

export function handleIncomingInformation(res: ResponseFromElectronType) {
  const { type, data } = res
  const dispatch = useDispatch()

  switch (type) {
    case 'bookData': {
      console.log('bookData #66', data)
      // dispatch(setBooks(data));
      // dispatch(clearLoading());
      break
    }
    case 'readSettingsFile': {
      console.log('👉 -> file: Layout.tsx:61 -> data:', data)
      break
    }
    case 'bookDetails': {
      dispatch(setCurrentBook(data))
      break
    }
    case 'error_type': {
      console.log('👉 -> file: Layout.tsx:70 -> data:', data)
      dispatch(clearLoading())
      dispatch(setError(data))
      break
    }
    default: {
      console.log(`You've hit default case in Layout.js ${type}`)
      break
    }
  }
}
