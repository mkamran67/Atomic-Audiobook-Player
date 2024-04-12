import InputSelector from '../InputSelector';
import { InputEnumType, RangeInputProps } from '../../types/general.types';

type Props = {
  liKey: string,
  title: string,
  description: string | null,
  inputEnum: InputEnumType,
  inputProps: RangeInputProps | null,
};

function SettingListItem(props: Props) {
  const { inputEnum, liKey, title, description, inputProps } = props;

  return (
    <>
      <li key={liKey} className="flex justify-between py-6 gap-x-6">
        {/* Title */}
        <div className="font-medium text-white-900">{title}</div>
        {/* Description */}
        {description && (<div className="text-white-900">{description}</div>)}
        {/* Input */}
        {inputProps && <InputSelector inputEnumSelector={inputEnum} inputProps={inputProps} />}
      </li>
    </>
  );
}

export default SettingListItem;