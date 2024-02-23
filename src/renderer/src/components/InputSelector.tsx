import RangeInput from './RangeInput';
import { InputEnumType, RangeInputProps } from '../types/general.types';

type Props = {
  inputEnumSelector: InputEnumType,
  inputProps: RangeInputProps,
}

const InputSelector = ({ inputEnumSelector, inputProps }: Props) => {

  switch (inputEnumSelector) {
    case InputEnumType.range: {
      return <RangeInput {...inputProps} />
    }
    case InputEnumType.select: {
      return null;
    }
    case InputEnumType.text: {
      return null;
    }
    default: {
      return null;
    }
  }



}

export default InputSelector