import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { BlobType, FileType, ICollateral, IUploadMultiFile, IUploadMultiInfo, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  DebtSettlementAccountDeedGroupDto,
  DebtSettlementAccountResponse,
  DocumentDto,
  NameValuePair,
} from '@lexs/lexs-client';
import { AuctionStatus, DEFAULT_DROPDOWN_CONFIG, DOC_TEMPLATE } from '@shared/constant';
import { DropDownConfig } from '@spig/core';
import { AuctionService } from '../auction.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { Utils } from '@app/shared/utils';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { AuctionMenu } from '../auction.model';

@Component({
  selector: 'app-debt-settlement-accounts',
  templateUrl: './debt-settlement-accounts.component.html',
  styleUrls: ['./debt-settlement-accounts.component.scss'],
})
export class DebtSettlementAccountsComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @Input() data: DebtSettlementAccountResponse | undefined;
  @Input() dataForm!: UntypedFormGroup;
  @Output() updateDebtSettlement = new EventEmitter<boolean>();
  public taskCode!: taskCode;
  public creditNoteOrganizationBranch: string = '';
  public debitPercentage: number = 100;
  public isOpened: boolean = true;
  public isViewMode: boolean = true;
  public displayedColumns = ['no', 'set', 'summary'];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public hasCredit: boolean = false;
  public hasAmount: boolean = false;
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public documentProperty: IUploadMultiFile[] = [];
  public documentCreditNote: IUploadMultiFile[] = [];
  public totalSoldPrice: number = 0;
  public summarySet: Array<ICollateral> | undefined;
  public dropdownCreditNoteOrganization: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    searchWith: 'name',
    displayWith: 'name',
    labelPlaceHolder: 'หน่วยงานที่รับ Credit Note',
  };

  public branchOptions: NameValuePair[] = [];
  downloadAccount: boolean = false;
  downloadCreditNote: boolean = false;

  get displayReasonConsideration() {
    return (
      [taskCode.R2E09_10_03].includes(this.taskCode) ||
      this.auctionService.debtSettlement.status === 'R2E09-10-03_CREATE'
    );
  }

  get displayChequeAmount() {
    return this.debitPercentage === 100 || this.debitPercentage === 15;
  }

  get displayCreditNoteRefNo() {
    return this.debitPercentage === 100 || this.debitPercentage === 15;
  }

  get displayDocumentCreditNote() {
    return this.debitPercentage === 100 || this.debitPercentage === 15;
  }
  public defultDebitBalance: number = 0;
  public auctionMenu!: AuctionMenu;
  public auctionStatusCode: AuctionStatus = '' as AuctionStatus;

  constructor(
    private routerService: RouterService,
    private sessionService: SessionService,
    private auctionService: AuctionService,
    private taskService: TaskService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.isViewMode = !(
      (this.taskCode === taskCode.R2E09_10_01 || this.taskCode === taskCode.R2E09_10_03) &&
      this.auctionService.isOwnerTask
    );
    this.auctionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    const debtSettlement = this.auctionService.debtSettlement;
    this.auctionStatusCode = (debtSettlement?.status as AuctionStatus) || AuctionStatus.AUCTION;

    // GET Branch name
    this.branchOptions = this.auctionService.branchList.ktbOrg as NameValuePair[];
    const chequeAmount = this.dataForm.get('chequeAmount')?.value;
    this.hasCredit = this.dataForm.get('creditNoteRefNo')?.value;
    this.hasAmount = chequeAmount !== '0.00' && chequeAmount !== '0' && chequeAmount !== undefined;
    this.prepareData();
    // LEX2-25779 waiting for permission code
    if (this.sessionService.currentUser?.roleCode && this.sessionService.currentUser?.subRoleCode) {
      this.downloadAccount =
        this.sessionService.currentUser?.roleCode === 'AMD_RESTRUCTURE' &&
        ['MAKER', 'APPROVER'].includes(this.sessionService.currentUser?.subRoleCode) &&
        this.auctionMenu === AuctionMenu.VIEW_ACCOUNT &&
        this.auctionStatusCode === AuctionStatus.R2E09_10_02_COMPLETE;
    }
    this.canDownloadCreditNote();
  }

  canDownloadCreditNote() {
    //LEX2-27651
    const debtSettlementTransactions = this.auctionService.debtSettlement.debtSettlementTransactions;
    const isSourceTFS = debtSettlementTransactions?.some(el =>
      el.debtSettlementAccounts?.some(el => {
        let debtSettlementAmount =
          (typeof el.debtSettlementAmount === 'string'
            ? Utils.convertStringToNumber(el.debtSettlementAmount)
            : el.debtSettlementAmount) || 0;

        return el.sourceSystem === 'TFS' && debtSettlementAmount > 0;
      })
    ); // change billNo to sourceSystem when api is enhanced
    let ownerId = this.sessionService.currentUser?.userId;
    if (
      (this.dataForm.get('makerId')?.value === ownerId || this.dataForm.get('approverId')?.value === ownerId) &&
      isSourceTFS &&
      this.auctionStatusCode === AuctionStatus.R2E09_10_02_COMPLETE
    ) {
      this.downloadCreditNote = true;
    }
  }

  prepareData() {
    this.totalSoldPrice = this.data?.totalSoldPrice || 0;
    this.debitPercentage = Number(this.data?.debitPercentage) || 100;
    this.defultDebitBalance = this.dataForm?.value?.chequeAmount || 0;

    this.documentProperty =
      this.data?.auctionDebtSettlementAccountDocuments
        ?.filter(item => {
          return (
            item?.documentTemplate?.documentTemplateId &&
            item.documentTemplate.documentTemplateId !== DOC_TEMPLATE.LEXSF176 &&
            item.documentTemplate.documentTemplateId !== DOC_TEMPLATE.LEXSD225
          );
        })
        .map(item => {
          return {
            isUpload: true,
            documentId: item.documentId?.toString(),
            documentTemplate: item.documentTemplate,
            uploadDate: item.uploadTimestamp,
            imageId: item.imageId,
          };
        }) || [];

    this.documentCreditNote =
      this.data?.auctionDebtSettlementAccountDocuments
        ?.filter(item => {
          return (
            item?.documentTemplate?.documentTemplateId &&
            item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF176
          );
        })
        .map(item => {
          return {
            isUpload: true,
            documentId: item.documentId?.toString(),
            documentTemplate: item.documentTemplate,
            uploadDate: item.uploadTimestamp,
            imageId: item.imageId,
          };
        }) || [];

    this.summarySet =
      this.data?.collateralGroups?.map(item => {
        return {
          imageId: item.deedGroupId?.toString(),
          soldPrice: item.soldPrice || 0,
          collateralName: item.fsubbidnum || '',
          fsubbidnum: item?.fsubbidnum,
          uploadDate: item.updatedTimestamp || '',
        };
      }) || [];

    if (this.isViewMode && this.dataForm.enabled) {
      this.dataForm.disable();
    } else {
      this.dataForm.enable();
    }
  }

  async onClickProperty(data: DebtSettlementAccountDeedGroupDto) {
    this.auctionService.debtForm.markAsPristine();
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, {
      fsubbidnum: data?.fsubbidnum,
      aucRef: this.data?.aucRef,
      // npaStatus: data?.npaStatus,
      mode: 'EDIT',
    });
    this.auctionService.debtSettlement = {};
  }

  async onChequeAmountChange(event: any) {
    let amount = Utils.convertStringToNumber(event.target.value) || 0;
    if (amount === 0) {
      this.dataForm.get('chequeAmount')?.setValue('');
    }
    if (amount > this.defultDebitBalance) {
      this.auctionService.debitBalance = amount - this.defultDebitBalance;
    }
    if (amount <= this.defultDebitBalance) {
      this.auctionService.debitBalance = 0;
    }
    this.auctionService.debtSettlement = await this.auctionService.reCalculateAuctionDebtSettlementAccountChequeAmount({
      auctionDebtSettlementAccountId: this.dataForm?.get('auctionDebtSettlementAccountId')?.value,
      chequeAmount: amount,
    });
    this.auctionService.chequeAmount = amount;
    this.auctionService.debtForm = await this.auctionService.getDebtForm(this.auctionService.debtSettlement);
    this.updateDebtSettlement.emit(true);
  }

  onCreditNoteRefNoChange(event: FocusEvent) {
    let refNo = (event.target as HTMLInputElement).value;
    this.auctionService?.debtForm?.get('creditNoteRefNo')?.setValue(refNo);
  }

  async downloadDirective() {
    const img = this.data?.auctionDebtSettlementAccountDocuments?.find(item => {
      return (
        item?.documentTemplate?.documentTemplateId && item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSD225
      );
    });
    if (img) {
      const response: any = await this.documentService.getDocument(
        img?.imageId || '',
        img?.imageSource || DocumentDto.ImageSourceEnum.Lexs
      );
      Utils.saveAsStrToBlobFile(
        response,
        img?.documentTemplate?.documentName + FileType.DOCX_SHEET,
        BlobType.DOCX_SHEET
      );
    }
  }

  async downloadCredit() {
    const objectType = 'DEBT_SETTLEMENT_ACCOUNT';
    let creditNote = (await this.auctionService.downloadCreditNote(
      this.dataForm?.get('auctionDebtSettlementAccountId')?.value,
      objectType
    )) as DocumentDto;
    const response: any = await this.documentService.getDocument(creditNote?.imageId || '', creditNote?.imageSource);
    if (!response) return;
    Utils.saveAsStrToBlobFile(response, 'Credit Note ตัดหักชำระหนี้' + FileType.PDF, BlobType.PDF);
  }
}
