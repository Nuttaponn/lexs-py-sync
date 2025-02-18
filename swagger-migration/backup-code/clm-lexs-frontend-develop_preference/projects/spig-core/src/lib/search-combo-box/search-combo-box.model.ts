export interface SearchComboBoxConfig {
  icon?: string[];
  displayWith?: string | ((value: any) => string);
  listWith?: string | ((value: object) => string);
  valueField?: string;
  labelPlaceHolder?: string;
  searchPlaceHolder?: string;
}
