import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import InputSelector from '../InputSelector'
import { InputEnumType, RangeInputProps } from '../../types/general.types'
import { useEffect, useState } from 'react'
import { useDebounceValue } from '../../utils/customHooks'

export default function Settings() {
  // Handle saves
  // Read updates from Redux
  const {
    themeMode,
    rootDirectories,
    previousBookDirectory,
    volume,
    fontSize
  } = useSelector((state: RootState) => state.settings)

  // FIXME: This is a temporary solution to get the volume to update
  const [rangeValue, setRangeValue] = useState(volume)
  const debouncedVolume = useDebounceValue(rangeValue, 50)

  const rangeInputProps: RangeInputProps = {
    value: rangeValue,
    onChange: (e) => setRangeValue(Number(e.target.value)),
    min: '0',
    max: '100',
  }


  useEffect(() => {
    console.log('volume', debouncedVolume)

    // Debounce volume changes
  }, [debouncedVolume])

  return (
    <>
      <div className="pt-16 mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="max-w-2xl mx-auto space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <section>
              <h2 className="text-base font-semibold leading-7 text-white-900">Settings</h2>
              <ul role="list" className="mt-6 text-sm leading-6 border-t border-gray-600 divide-y divide-gray-100">
                <li key={themeMode + 0} className="flex justify-between py-6 gap-x-6">
                  {/* Title */}
                  <div className="font-medium text-white-900">Default Volume</div>
                  {/* Description */}
                  <div className="text-white-900">On launch volume will be set to this value.</div>
                  {/* Input */}
                  <InputSelector inputEnumSelector={InputEnumType.range} inputProps={rangeInputProps} />
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
