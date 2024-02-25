import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import InputSelector from '../InputSelector'
import { InputEnumType, RangeInputProps } from '../../types/general.types'
import { ReactEventHandler, useEffect, useState } from 'react'
import { useDebounceValue } from '../../utils/customHooks'
import { ADD_BOOK_DIRECTORY, REQUEST_TO_ELECTRON, WRITE_SETTINGS_FILE } from '../../../../../src/shared/constants'

export default function Settings() {
  // Handle saves
  // Read updates from Redux
  const {
    themeMode,
    rootDirectories,
    previousBookDirectory,
    volume,
    fontSize
  } = useSelector((state: RootState) => state.settings);

  // FIXME: This is a temporary solution to get the volume to update
  const [rangeValue, setRangeValue] = useState(volume)
  const debouncedVolume = useDebounceValue(rangeValue, 500)

  const rangeInputProps: RangeInputProps = {
    value: rangeValue,
    onChange: (e) => setRangeValue(Number(e.target.value)),
    min: '0',
    max: '100',
  }

  const dirChangeHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const target = event.target as HTMLInputElement;
    const eventType = target.id;

    if (eventType === 'Add Directory') {
      window.api.send(REQUEST_TO_ELECTRON, {
        type: ADD_BOOK_DIRECTORY,
        data: {
          update: false
        }
      })
    } else if (eventType === 'Update Directory') {
      window.api.send(REQUEST_TO_ELECTRON, {
        type: ADD_BOOK_DIRECTORY,
        data: {
          update: true
        }
      })
    }
  };


  useEffect(() => {
    window.api.send(REQUEST_TO_ELECTRON, {
      type: WRITE_SETTINGS_FILE,
      data:
      {
        action: 'update',
        payload: {
          volume: debouncedVolume,
          rootDirectories,
          previousBookDirectory,
          fontSize,
          themeMode,
        },
      }
    })
  }, [debouncedVolume])

  return (
    <>
      <div className="pt-16 mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="max-w-2xl mx-auto space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <section>
              <h2 className="text-base font-semibold leading-7 text-gray-300">Settings</h2>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
                <li key={"volume" + 0} className="flex justify-between py-6 gap-x-6">
                  {/* Title */}
                  <div className="font-medium text-gray-300">Default Volume</div>
                  {/* Description */}
                  <div className="text-gray-300">On launch volume will be set to this value.</div>
                  {/* Input */}
                  <InputSelector inputEnumSelector={InputEnumType.range} inputProps={rangeInputProps} />
                  <div className="text-white">{rangeValue}</div>
                </li>
              </ul>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
                {rootDirectories.length > 0 &&
                  rootDirectories.map((directory, index) => {
                    return (
                      <li key={"dirs" + index} className="flex justify-between py-6 gap-x-6">
                        {/* Title */}
                        <div className="font-medium text-gray-300">{directory}</div>
                        {/* Input */}
                        <div className='flex items-center justify-center'>
                          <button type="button" id='Update Directory' className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Update
                          </button>
                          <button type="button" id='Delete Directory' className="mx-6 font-semibold text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </li>
                    )
                  })
                }
                <div className="flex pt-6 border-gray-900">
                  <button type="button" id='Add Directory' className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500" onClick={dirChangeHandler}>
                    <span aria-hidden="true">+</span> Add Directory
                  </button>
                </div>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
