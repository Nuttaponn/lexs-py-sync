import { CashierChequeTransferOwnershipResponse } from '@lexs/lexs-client';
import { DetailsHeader } from '../auction.const';
import { IUploadMultiFile } from '@app/shared/models';

export interface CashierChequeTransferOwnershipResponseExend extends CashierChequeTransferOwnershipResponse {
  details: DetailsHeader[];
  expand: boolean;
  dataSource: any[];
  departmentOfLandName: any;
  documentUpload: Array<IUploadMultiFile>;
}
