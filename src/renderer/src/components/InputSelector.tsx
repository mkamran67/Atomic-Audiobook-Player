import RangeInput from './RangeInput';
import {
  InputEnumType,
  NumberInputProps,
  RangeInputProps
} from '../types/general.types';
import NumberInput from './NumberInput';

type Props = {
  inputEnumSelector: InputEnumType,
  inputProps: RangeInputProps | NumberInputProps,
}

const InputSelector = ({ inputEnumSelector, inputProps }: Props) => {
  if (inputProps === undefined) return null;

  switch (inputEnumSelector) {
    case InputEnumType.range: {
      const rangeInputProps = inputProps as RangeInputProps;
      return <RangeInput {...rangeInputProps} />
    }
    case InputEnumType.select: {
      return null;
    }
    case InputEnumType.text: {
      return null;
    }
    case InputEnumType.number: {
      const numberInputProps = inputProps as NumberInputProps;
      return <NumberInput {...numberInputProps} />
    }
    default: {
      window.api.send('error', `InputSelector: ${inputEnumSelector} is not a valid input type`);
      return null;
    }
  }



}

export default InputSelector