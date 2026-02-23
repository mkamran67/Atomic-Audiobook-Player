import { RangeInputProps } from '../types/general.types'


const RangeInput = ({ value = 100, onChange, min = '0', max = '100' }: RangeInputProps) => {
  return (
    <input id="default-range" type="range" value={value} className="w-1/2 h-2 my-auto bg-base-300 rounded-lg appearance-none cursor-pointer" onChange={onChange} min={min} max={max} />
  )
}

export default RangeInput