export type RangeInputProps = {
  value: number,
  min: string,
  max: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export type NumberInputProps = {
  labelText: string,
  id: string,
  name: string,
  placeholder: string,
}

export enum InputEnumType {
  range,
  text,
  select,
  number,
}
