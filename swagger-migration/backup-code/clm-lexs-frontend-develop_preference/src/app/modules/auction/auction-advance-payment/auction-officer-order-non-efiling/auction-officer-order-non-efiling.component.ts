import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MODE } from '@app/modules/user/user-form.constant';
import { IUploadMultiFile, IUploadMultiInfo, TMode } from '@app/shared/models';
import {
  DEFAULT_DOCUMENT_ORDER_UPLOAD,
  DEFAULT_UPLOAD_MULTI_ORDER_INFO,
  TABLE_COL_DISPLAY,
  VIEW_TYPE,
} from '../interface/auction-efiling.model';
import { MatTableDataSource } from '@angular/material/table';
import { DropDownConfig, NameValuePair } from '@spig/core';
import { AuctionService } from '../../auction.service';
import { AuctionPaymentService } from '../service/auction-payment.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { TaskService } from '@app/modules/task/services/task.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { UserService } from '@app/modules/user/user.service';
import { AuctionExpenseInfo, LexsUserOption } from '@lexs/lexs-client';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-auction-officer-order-non-efiling',
  templateUrl: './auction-officer-order-non-efiling.component.html',
  styleUrls: ['./auction-officer-order-non-efiling.component.scss'],
})
export class AuctionOfficerOrderNonEfilingComponent implements OnInit {
  auctionOrderFormGroup!: UntypedFormGroup;
  lawyerCashierChequeOptions: NameValuePair[] = this.auctionService.mapLawyer();
  public lawyerConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
  };
  listCashierChequeOptions: any = this.auctionService.branchList.ktbOrg;
  public branchConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
  };
  mode!: TMode;
  MODE = MODE;
  viewType: string = '';
  VIEW_TYPE = VIEW_TYPE;

  documentUpload: IUploadMultiFile[] = [];
  uploadMultiInfo: IUploadMultiInfo = DEFAULT_UPLOAD_MULTI_ORDER_INFO;
  documentColumns: string[] = ['documentName', 'uploadDate'];

  cashierChequeDataSource: MatTableDataSource<AuctionExpenseInfo> = new MatTableDataSource<AuctionExpenseInfo>();
  tableEfilingDisplays: string[] = TABLE_COL_DISPLAY;

  currentDate: Date | null = new Date();
  minDate: Date | null = new Date();

  isDocumentViewMode: boolean = false;
  dataViewMode: AuctionExpenseInfo | any | undefined;

  auctionExpenseId: number = 0;

  constructor(
    private auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private userService: UserService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.initialFormGroup();
    this.currentDate = new Date();
    this.minDate = new Date(0);
    this.initialDocumentTemplate();
    this.onSetDocumentTemplate();
    this.onSetLawyerData();
    this.initialViewMode();
  }

  receiveLawyerFullName: string = '';
  initialViewMode(): void {
    this.dataViewMode = this.auctionService.auctionExpenseInfo;
    this.viewType = this.dataViewMode?.status;
    this.auctionExpenseId = this.dataViewMode?.id;
    this.auctionOrderFormGroup?.get('auctionExpenseId')?.setValue(this.dataViewMode?.id);
    this.mode = this.auctionService.mode as TMode;
    this.cashierChequeDataSource.data = [
      {
        totalAmountPaid: this.dataViewMode?.totalAmountPaid,
        createdTimestamp: this.dataViewMode?.createdTimestamp,
      },
    ];

    const lawyerId = this.dataViewMode?.receivedByLawyerId;
    const findLawyerFullName = this.userService.kLawyerUserOptions.find(item => item.userId === lawyerId);

    if (lawyerId) {
      this.receiveLawyerFullName = findLawyerFullName
        ? `${findLawyerFullName.userId} - ${findLawyerFullName.name} ${findLawyerFullName.surname}`
        : '';
    }

    const uploadReceiptAccessStatuses = [
      VIEW_TYPE.UPLOAD_RECEIPT_VIEW_ACCESS,
      VIEW_TYPE.VIEW_ACCESS,
      VIEW_TYPE.EDIT_ACCESS,
      VIEW_TYPE.REJECT_ACCESS,
      VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS,
      VIEW_TYPE.APPROVAL_ACCESS,
      VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS,
    ];
    switch (this.mode) {
      case MODE.VIEW:
        const viewState = [
          VIEW_TYPE.VIEW_ACCESS,
          VIEW_TYPE.EDIT_ACCESS,
          VIEW_TYPE.REJECT_ACCESS,
          VIEW_TYPE.APPROVAL_ACCESS,
          VIEW_TYPE.UPLOAD_RECEIPT_VIEW_ACCESS,
          VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS,
          VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS,
          VIEW_TYPE.COMPLETE,
        ];
        this.onSetDocumentViewMode();
        this.isDocumentViewMode = viewState.includes(this.dataViewMode?.status);
        break;
      case MODE.EDIT:
        const pendingStatuses = [VIEW_TYPE.VIEW_ACCESS, VIEW_TYPE.REJECT_ACCESS];
        if (uploadReceiptAccessStatuses.includes(this.dataViewMode.status)) {
          this.onSetDocumentViewMode();
          this.isDocumentViewMode = !pendingStatuses.includes(this.dataViewMode?.status);
        }
        break;
      default:
        // Handle any other unexpected modes
        break;
    }
  }

  onUploadFileContent(event: any): void {
    this.documentUpload = event as IUploadMultiFile[];
    this.documentUpload.map(imageId => {
      if (imageId.imageId) {
        this.auctionOrderFormGroup?.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(imageId.imageId);
      } else {
        this.auctionOrderFormGroup?.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(null);
      }
    });
  }

  initialFormGroup(): void {
    this.auctionOrderFormGroup = this.auctionPaymentService.paymentNonEFilingFormGroup;

    this.auctionPaymentService?.formGroupUpdated?.subscribe((updatedFormGroup: UntypedFormGroup | null) => {
      if (updatedFormGroup) {
        this.auctionPaymentService.paymentNonEFilingFormGroup = updatedFormGroup;
        this.auctionOrderFormGroup = this.auctionPaymentService.paymentNonEFilingFormGroup;
        const auctionExpenseId = this.auctionOrderFormGroup.get('auctionExpenseId')?.value;
        this.auctionExpenseId = auctionExpenseId;
      }
    });
  }

  initialDocumentTemplate(): void {
    this.documentUpload = [...DEFAULT_DOCUMENT_ORDER_UPLOAD];
  }

  findMobileNumber(lawyerCode: string) {
    return this.userService.kLawyerUserOptions.find((data: any) => lawyerCode === data.userId)?.mobileNumber || '';
  }

  changeLawyer(value: string, formControl: any) {
    if (value === this.auctionService.editCashierCheque?.receivedByLawyerId) {
      formControl.setValue(this.auctionService.editCashierCheque?.receivedByLawyerMobileNo);
    } else {
      formControl.setValue(this.findMobileNumber(value));
    }
    formControl.updateValueAndValidity();
  }

  get isRequireUploadDocument() {
    return (
      !this.auctionOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.value &&
      this.auctionOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.touched
    );
  }

  getControl(name: string): AbstractControl | null {
    return this.auctionOrderFormGroup.get(name);
  }

  onSetDocumentTemplate(): void {
    this.documentUpload = [
      {
        documentTemplate: {
          documentName: 'คำสั่งเจ้าพนักงานบังคับคดี',
        },
        uploadRequired: true,
        documentTemplateId: DOC_TEMPLATE.LEXSF134,
        viewOnly: true,
        removeDocument: true,
      } as IUploadMultiFile,
    ];
    this.uploadMultiInfo.cif =
      this.taskService.taskDetail.customerId || this.litigationCaseService.litigationCaseShortDetail.cifNo || '';
    this.uploadMultiInfo.litigationId = this.auctionService.litigationId.toString();
  }

  lawyerName = '';
  ledName = '';
  onSetLawyerData(): void {
    let foundLawyer: LexsUserOption | undefined = {};
    let mobileLayerName: string = '';
    let lawyerNameId: string | undefined = '';
    if (this.litigationCaseService?.litigationCaseShortDetail?.auctionLawyerIdNonPledgeAssets) {
      foundLawyer = this.userService.kLawyerUserOptions.find(
        item => item.userId === this.litigationCaseService?.litigationCaseShortDetail?.auctionLawyerIdNonPledgeAssets
      );
      mobileLayerName =
        this.userService.kLawyerUserOptions.find(
          item => item.userId === this.litigationCaseService.litigationCaseShortDetail.auctionLawyerIdNonPledgeAssets
        )?.mobileNumber || '';
      lawyerNameId = this.userService.kLawyerUserOptions.find(
        item => item.userId === this.litigationCaseService.litigationCaseShortDetail.auctionLawyerIdNonPledgeAssets
      )?.userId;
    } else {
      foundLawyer = this.userService.kLawyerUserOptions.find(
        item => item.userId === this.litigationCaseService?.litigationCaseShortDetail?.publicAuctionLawyerId
      );
      mobileLayerName =
        this.userService.kLawyerUserOptions.find(
          item => item.userId === this.litigationCaseService.litigationCaseShortDetail.publicAuctionLawyerId
        )?.mobileNumber || '';
      lawyerNameId = this.userService.kLawyerUserOptions.find(
        item => item.userId === this.litigationCaseService.litigationCaseShortDetail.publicAuctionLawyerId
      )?.userId;
    }
    this.lawyerName = foundLawyer ? `${foundLawyer.userId} - ${foundLawyer.name} ${foundLawyer.surname}` : '';
    this.ledName = this.auctionService.currentLed?.ledName || '';
    const setValueForField = (field: string, value: any) => {
      this.auctionOrderFormGroup.get(field)?.setValue(value);
    };
    if (foundLawyer) {
      setValueForField('receivedByLawyerId', foundLawyer.userId);
      setValueForField('receivedByLawyerMobileNo', foundLawyer.mobileNumber);
    } else {
      setValueForField('receivedByLawyerId', null);
      setValueForField('receivedByLawyerMobileNo', null);
    }
    this.auctionOrderFormGroup?.get('assignedLawyerMobileNo')?.setValue(mobileLayerName);
    this.auctionOrderFormGroup?.get('assignedLawyerId')?.setValue(lawyerNameId);
    this.auctionOrderFormGroup?.get('payeeName')?.setValue(this.ledName);
  }

  onSetDocumentViewMode(): void {
    const validStatuses = [VIEW_TYPE.REJECT_ACCESS, VIEW_TYPE.VIEW_ACCESS];
    const canRemoveDocument = validStatuses.includes(this.dataViewMode?.status);

    this.documentUpload = this.documentUpload.map((document, _index) => {
      if (document.documentTemplateId === DOC_TEMPLATE.LEXSF134) {
        const apiDocument = this.dataViewMode.documents.find(
          (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF134
        );
        if (apiDocument) {
          return {
            ...apiDocument,
            documentTemplateId: DOC_TEMPLATE.LEXSF134,
            uploadDate: apiDocument.uploadTimestamp,
            indexOnly: true,
            uploadRequired: true,
            active: true,
            viewOnly: true,
            removeDocument: canRemoveDocument,
          };
        }
      }
      return document;
    });
  }

  isViewMode(): boolean {
    const validViewTypes = [
      VIEW_TYPE.EDIT_ACCESS,
      VIEW_TYPE.APPROVAL_ACCESS,
      VIEW_TYPE.UPLOAD_RECEIPT_VIEW_ACCESS,
      VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS,
      VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS,
      VIEW_TYPE.COMPLETE,
      // Add more view types if needed
    ];
    return this.mode === TMode.VIEW || validViewTypes.includes(this.viewType);
  }

  isEditMode(): boolean {
    return (
      this.mode === MODE.ADD ||
      (this.mode === MODE.EDIT &&
        this.viewType !== VIEW_TYPE.EDIT_ACCESS &&
        this.viewType !== VIEW_TYPE.APPROVAL_ACCESS &&
        this.viewType !== VIEW_TYPE.UPLOAD_RECEIPT_VIEW_ACCESS &&
        this.viewType !== VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS &&
        this.viewType !== VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS)
    );
  }

  get totalAmountPaidValue() {
    const value = this.auctionOrderFormGroup?.get('totalAmountPaid')?.value;
    if (value === null) {
      return '-';
    }
    const numValue = parseFloat(value.toString().replace(/,/g, ''));

    if (Number.isInteger(numValue)) {
      return this.decimalPipe.transform(numValue, '1.0-0');
    } else {
      const formattedValue = numValue.toFixed(2);
      return this.decimalPipe.transform(formattedValue, '1.2-2');
    }
  }

  get dateTimeStampValue(): string {
    return this.auctionOrderFormGroup?.get('receiveCashierDate')?.value;
  }
}
