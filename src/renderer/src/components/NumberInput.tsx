import React from 'react'
import { NumberInputProps } from '../types/general.types'

function NumberInput({ id, labelText, name, placeholder, }: NumberInputProps) {
  return (
    <div>
      <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
        {placeholder}
      </label>
      <div className="relative flex items-center mt-2">
        <input
          type="text"
          name={name}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center px-1 font-sans text-xs text-gray-400 border border-gray-200 rounded">
            {labelText}
          </kbd>
        </div>
      </div>
    </div>
  )

}

export default NumberInput
