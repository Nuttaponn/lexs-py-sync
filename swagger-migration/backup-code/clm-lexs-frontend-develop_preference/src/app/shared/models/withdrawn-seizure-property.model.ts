import { TMode } from './mode';

export interface WithDrawnSeizureConfig {
  propertyConfig?: PropertyConfig;
  contactConfig?: ContactConfig;
  assetConfig?: PropertyConfig;
  stepIndex?: number;
  tabCollapse?: boolean;
}

export interface PropertyConfig extends BaseWithdrawnSeizureConfig {
  hasGroupDelete?: boolean;
  hasSelect?: boolean;
  hasViewContact?: boolean;
  hasEditContact?: boolean;
  hasFilter?: boolean;
  hasUploadDocument?: boolean;
  uploadReadOnly?: boolean;
  hasTitleTotal?: boolean;
  hasTotalSelect?: boolean;
  hasSumAppraisalValue?: boolean;
}

export interface ContactConfig extends BaseWithdrawnSeizureConfig {
  layout?: 'row' | 'column';
}

export interface BaseWithdrawnSeizureConfig {
  mode?: TMode;
  hasHeaderTitle?: boolean;
  headerTitleText?: string;
  hasTitle?: boolean;
  titleText?: string;
  hasAction?: boolean;
  hasDelete?: boolean;
  hasEdit?: boolean;
  hasAdd?: boolean;
  tableColumns?: string[];
  hideTitle?: boolean;
}

export interface ICollateral {
  soldPrice: number;
  collateralName: string;
  imageId?: string;
}
