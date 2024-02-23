export type RangeInputProps = {
  value: number,
  min: string,
  max: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export enum InputEnumType {
  range,
  text,
  select
}
