import React from 'react'
import { NumberInputProps } from '../types/general.types'

function NumberInput({ id, labelText, name, placeholder, }: NumberInputProps) {
  return (
    <div>
      <label htmlFor="search" className="block text-sm font-medium leading-6 text-base-content">
        {placeholder}
      </label>
      <div className="relative flex items-center mt-2">
        <input
          type="text"
          name={name}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 pr-14 text-base-content shadow-sm ring-1 ring-inset ring-base-300 placeholder:text-base-content/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center px-1 font-sans text-xs text-base-content/60 border border-base-300 rounded">
            {labelText}
          </kbd>
        </div>
      </div>
    </div>
  )

}

export default NumberInput
