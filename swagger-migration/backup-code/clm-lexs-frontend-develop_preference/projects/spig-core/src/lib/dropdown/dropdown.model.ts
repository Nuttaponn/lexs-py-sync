export interface DropDownConfig {
  displayWith?: string;
  valueField?: string;
  searchWith?: string | ((value: object) => any);
  disableSelect?: boolean;
  enableSearch?: boolean | 'DISABLE_SEARCH';
  disableFloatLabel?: boolean;
  isMultiple?: boolean;
  iconName?: string;
  labelPlaceHolder?: string;
  searchPlaceHolder?: string;
  selectAll?: string;
  limitItems?: number;
  defaultValue?: string;
}

export interface NameIconValueOption {
  icon?: string;
  nameClasses?: string;
  name: string;
  value: string | number;
}

export interface SimpleSelectOption {
  text: string;
  value: string | number;
}

export interface NameValuePair {
  name?: string;
  value?: string;
}

export interface ExtendNameValuePair extends NameValuePair {
  condition1?: string;
}
