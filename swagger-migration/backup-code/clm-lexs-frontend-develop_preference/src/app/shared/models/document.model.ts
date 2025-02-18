export interface CommonDocumentConfig {
  title: string;
  isMain: boolean;
  showDropdown?: boolean;
  dropdownOptions?: Array<any>;
  requireMultipleRows?: boolean;
  selectAll?: boolean;
  selectText?: string;
  documentNumber?: number;
  totalDocuments?: number;
  msgNotFound: string;
  classInput?: string;
  classIcon?: string;
  customIcon?: string;
  canShowIcon?: boolean;
  forGeneral?: boolean;
  ready?: boolean;
  forAsset: boolean;
  viewImage?: boolean;
  customDateText?: string;
  classTitle?: string;
}
