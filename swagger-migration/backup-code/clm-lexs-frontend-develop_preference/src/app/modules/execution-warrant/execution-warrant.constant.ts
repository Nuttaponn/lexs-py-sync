import { ReadyFor } from '@app/shared/components/document-preparation/interface/document';
import { CommonDocumentConfig, ITabNav } from '@app/shared/models';
import { AccountDocumentDto, NameValuePair } from '@lexs/lexs-client';

// EXECUTION_WARRANT TABS Config
export const EXECUTION_WARRANT_TABS: ITabNav[] = [
  {
    index: 0,
    label: 'รายละเอียดคดีความ',
    prefix: '',
    path: 'nav-tab-case-info-tab',
    fullPath: '',
  },
  {
    index: 1,
    label: 'รายการเอกสารดำเนินงาน',
    prefix: '',
    path: 'nav-tab-document-info-tab',
    fullPath: '',
  },
];

export interface AccountDocuments extends AccountDocumentDto {
  details: NameValuePair[];
  config: CommonDocumentConfig;
  readyFor?: ReadyFor;
  readyForAsset?: boolean;
  forAsset: boolean;
}
