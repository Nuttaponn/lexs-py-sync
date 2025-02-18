import { AfterViewChecked, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { TaskService } from '@app/modules/task/services/task.service';
import { Mode, taskCode } from '@app/shared/models';
import { DocumentDto, DocumentRequest, RejectedReasonRequest } from '@lexs/lexs-client';
import { NumberDecimalPipe, SimpleSelectOption } from '@spig/core';
import { Subscription } from 'rxjs';
import { CommitmentAccountSelectComponent } from '../commitment-account-select/commitment-account-select.component';
import { DocSelectionComponent } from '../doc-selection/doc-selection.component';
import { DocumentAccountService } from '../document-account.service';
import { DocumentService } from '../document.service';
import {
  AccountsSet,
  Bill,
  Contract,
  DisplayCommitment,
  DisplayDocument,
  DocumentGroup,
  SubAccount,
} from '../interface/document';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Component({
  selector: 'app-document-account',
  templateUrl: './document-account.component.html',
  styleUrls: ['./document-account.component.scss'],
  providers: [NumberDecimalPipe],
})
export class DocumentAccountComponent implements OnInit, AfterViewChecked, OnDestroy {
  constructor(
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}
  @ViewChildren(MatTable) table!: QueryList<any>;
  currentDate = new Date();
  ImageSourceEnum = DocumentDto.ImageSourceEnum;

  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;
  @Input()
  set _mode(val: any) {
    this.mode = val;
    this.setUpColumns();
  }
  @Input()
  set hasCancel(val: any) {
    if (val) {
      // revert data when click cancel on page prepare doc
      this.documentAccountService.currentDocAccount = this.documentAccountService.initAccountDocuments;
      this.documentAccountService.mapAccountDocumentData(this.taskCode, this.mode, this.itemsPerPage);
    }
  }
  @Input()
  set receivedAll(val: any) {
    if (val) {
      this.receiveAll();
    }
  }
  mode: string = '';
  MODE = Mode;
  taskCode: taskCode = (this.taskService.taskDetail?.taskCode as taskCode) || '';

  displayedColumnsContracts: string[] = [];
  displayedColumnsAccount: string[] = [];
  displayedColumnsOther: string[] = [];

  itemsPerPage = 10;
  accountDropdownOptions: SimpleSelectOption[] = [];
  currentDropdownValue = 0;

  showMain = false;
  showContract = false;
  showMainAccount = false;
  showAccounts: boolean[][] = [];
  showOther = false;
  expandedElements: { [key: string]: boolean } = {};

  statusCode = '';

  subscription!: Subscription;

  scroll: any = {};

  accounts: DisplayCommitment[] = [];
  accountsMap: {
    [key: string]: {
      accountName: string;
      accountTypeDesc: string;
    };
  } = {};

  accountsSet: DocumentGroup = this.documentAccountService.accountsSet;
  contracts: DocumentGroup = this.documentAccountService.contracts;
  other: DocumentGroup = this.documentAccountService.other;
  remainingCommitmentCount: number = this.documentAccountService.remainingCommitmentCount;
  taskCodeHideBannerremainingCommitment : string[] = [taskCode.SUBMIT_ORIGINAL_DOCUMENT, taskCode.RECEIPT_ORIGINAL_DOCUMENT, taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT, taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT]
  remainingCommitmentList: any[] = this.documentAccountService.remainingCommitmentList;

  sectionReadyForLitigation = this.documentAccountService.accountDocumentReadyForLitigation;
  sectionReadyForNotice = this.documentAccountService.accountDocumentReadyForNotice;
  sectionReadyForDoc = this.documentAccountService.accountDocumentReadyForDoc;
  expandedReason: boolean = false;

  updateValuesFromService() {
    this.accountsSet = this.documentAccountService.accountsSet;
    this.contracts = this.documentAccountService.contracts;
    this.other = this.documentAccountService.other;
    this.remainingCommitmentCount = this.documentAccountService.remainingCommitmentCount;
    this.remainingCommitmentList = this.documentAccountService.remainingCommitmentList;

    this.sectionReadyForLitigation = this.documentAccountService.accountDocumentReadyForLitigation;
    this.sectionReadyForNotice = this.documentAccountService.accountDocumentReadyForNotice;

    this.sectionReadyForDoc = this.documentAccountService.accountDocumentReadyForDoc;
  }

  ngOnInit(): void {
    if (this.documentAccountService.customer.documentInfo?.customerDocuments?.length === 0) {
      this.accountDropdownOptions = this.documentAccountService.initAccountDropdownOptions(1);
      this.contracts.contracts = [];
      return;
    }

    this.setUpColumns();

    if (this.taskCode === taskCode.SUBMIT_ORIGINAL_DOCUMENT || this.taskCode === taskCode.RECEIPT_ORIGINAL_DOCUMENT) {
      this.documentAccountService.filterActiveAccountDocuments();
    }
    this.documentAccountService.setUpRemainingCommitmentAccounts();
    this.documentAccountService.mapAccountDocumentData(this.taskCode, this.mode, this.itemsPerPage);
    this.updateValuesFromService();

    // set up dropdown options
    if (this.documentAccountService.accountsSet.accountsSet!.length !== 0) {
      this.accountDropdownOptions = this.documentAccountService.initAccountDropdownOptions(
        this.documentAccountService.accountsSet.accountsSet!.length
      );
      this.documentAccountService.accountsSet.accountsSet!.forEach((as: any) => {
        const array: boolean[] = [];
        as.commitments.forEach(() => {
          array.push(false);
        });
        this.showAccounts.push(array);
      });
    }

    this.documentAccountService.docAccountSubject.next(this.documentAccountService.currentDocAccount);
    this.subscription = this.documentAccountService.docAccountSubject.subscribe(value => {
      this.documentAccountService.currentDocAccount = value;
      this.documentAccountService.mapAccountDocumentData(this.taskCode, this.mode, this.itemsPerPage);
      this.updateValuesFromService();
    });

    console.log(' this.contracts', this.contracts);
    console.log('account', this.accountsSet);
    console.log('other', this.other);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setUpColumns() {
    let columnDefinitions = [
      { def: 'order', hide: false },
      { def: 'documentName', hide: false },
      { def: 'commitmentCount', hide: false },
      { def: 'storeOrganization', hide: false },
      { def: 'oweOrganization', hide: false },
      { def: 'action', hide: false },
      { def: 'hasOriginalCopy', hide: false },
      { def: 'hasNotOriginalCopy', hide: this.mode !== Mode.EDIT },
      // { def: 'receiveDate', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'sent', hide: this.mode !== Mode.VIEW_PENDING && this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'rejectOriginalReceived', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'save', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'expand', hide: false },
    ];

    this.displayedColumnsContracts = columnDefinitions.filter(c => c.def !== 'expand' && !c.hide).map(c => c.def);
    this.displayedColumnsAccount = columnDefinitions
      .filter(c => c.def !== 'commitmentCount' && !c.hide)
      .map(c => c.def);
    this.displayedColumnsOther = columnDefinitions
      .filter(c => c.def !== 'expand' && c.def !== 'commitmentCount' && !c.hide)
      .map(c => c.def);

    this.statusCode = this.taskService.taskDetail?.statusCode || '';
  }

  // Sent/Received
  checkSentReceivedAll(docGroup: DocumentGroup | DisplayCommitment) {
    this.documentService.hasEdit = true;
    // docGroup.documentNumber = 0 // always count from 0
    // check logic for click select all
    if ('documentsAndBills' in docGroup) {
      // commitments
      docGroup.documentsAndBills?.forEach(doc => {
        if ('documents' in doc) {
          // bills/linkages/sub accounts
          doc.documents?.forEach(doc2 => {
            this.documentAccountService.setDocForSendingReceiving(doc2, docGroup, true, this.mode, this.statusCode);
          });
        } else if ('documentTemplateId' in doc) {
          // regular documents
          this.documentAccountService.setDocForSendingReceiving(doc, docGroup, true, this.mode, this.statusCode);
        }
      });
    } else {
      if ('contracts' in docGroup) {
        // contracts
        docGroup.contracts?.forEach(contract => {
          contract.documents?.forEach(doc => {
            this.documentAccountService.setDocForSendingReceiving(doc, docGroup, true, this.mode, this.statusCode);
          });
        });
      } else if ('documents' in docGroup) {
        // other
        docGroup.documents?.forEach(doc => {
          this.documentAccountService.setDocForSendingReceiving(doc, docGroup, true, this.mode, this.statusCode);
        });
      }
    }
    this.documentAccountService.setAccountDocumentReady();
    this.documentService.checkDocumentIsReady();
    this.updateValuesFromService();
  }

  receivedDateInputChange(val: any, element: DisplayDocument) {
    this.documentService.hasEdit = true;
    if (!val && element.received != true) {
      element.updateFlag = undefined;
    } else {
      element.receiveDate = val;
      element.updateFlag = 'U';
    }
    const foundDoc = this.documentAccountService.currentDocAccount.findIndex(d => d.documentId === element.documentId);
    this.documentAccountService.currentDocAccount[foundDoc] = { ...element };
    this.updateValuesFromService();
  }

  isSentReceivedDisabled(document: DisplayDocument) {
    const alreadySent = this.mode === Mode.VIEW_PENDING && document.sent;
    const alreadyReceived = this.mode === Mode.VIEW_PENDING_APPROVE && document?.received;
    const hasNotBeenSent = this.mode === Mode.VIEW_PENDING_APPROVE && !document?.sent;

    if (
      !document?.hasOriginalCopy ||
      !document?.imageId ||
      hasNotBeenSent ||
      ((alreadySent || alreadyReceived) &&
        !document?.updateFlag &&
        (this.statusCode === 'IN_PROGRESS' || document.hasSave))
    )
      return true;
    return false;
  }

  isSentReceivedInactive(document: DisplayDocument) {
    const alreadySent = this.mode === Mode.VIEW_PENDING && document?.sent;
    const alreadyReceived = this.mode === Mode.VIEW_PENDING_APPROVE && document?.received;
    if (
      (alreadySent || alreadyReceived) &&
      !document?.updateFlag &&
      (this.statusCode === 'IN_PROGRESS' || document.hasSave)
    )
      return true;
    return false;
  }

  onToggleCheckSentReceived(element: DisplayDocument, docGroup: DocumentGroup | DisplayCommitment, event: any) {
    let checked: boolean =
      event?.target?.checked === false || event?.target?.checked === true ? event?.target?.checked : event?.value;
    this.documentService.updateStatusOnRadioChange(element, checked, this.mode);
    this.documentService.hasEdit = true;
    this.documentAccountService.setDocForSendingReceiving(element, docGroup, checked, this.mode, this.statusCode);
    this.documentAccountService.setAccountDocumentReady();
    this.updateValuesFromService();
  }

  // tables
  onExpansionPanelToggle(type: 'MAIN' | 'CONTRACT' | 'MAIN_ACCOUNT' | 'ACCOUNT' | 'OTHER', index?: number) {
    if (type === 'MAIN') this.showMain = !this.showMain;
    else if (type === 'CONTRACT') this.showContract = !this.showContract;
    else if (type === 'OTHER') this.showOther = !this.showOther;
    else if (type === 'MAIN_ACCOUNT') this.showMainAccount = !this.showMainAccount;
    else {
      this.showAccounts[this.currentDropdownValue][index || 0] =
        !this.showAccounts[this.currentDropdownValue][index || 0];
    }
  }
  onElementExpandToggle(element: Bill | SubAccount) {
    // @ts-ignore
    let id = '';
    if ('billNo' in element) {
      id = element.billNo + 'bill';
      if ('linkage' in element) {
        id = id + 'linkage';
      }
    } else {
      if ('accountNumber' in element) id = element.accountNumber + 'sub';
    }
    if (this.expandedElements[id]) {
      this.expandedElements[id] = false;
    } else {
      this.expandedElements[id] = true;
    }
  }

  async openDoc(element: DisplayDocument) {
    let res = await this.documentService.getDocument(element.imageId!, element.imageSource);
    this.documentService.openPdf(res, element.imageName);
  }

  // dialogs
  async selectDoc(element: DisplayDocument | Contract) {
    const allowUpload = ![
      DOC_TEMPLATE.LEXSD024,
      DOC_TEMPLATE.LEXSD026,
      DOC_TEMPLATE.LEXSD027,
      DOC_TEMPLATE.LEXSD032,
    ].includes(element.documentTemplateId!);
    const allowMultiple = [DOC_TEMPLATE.LEXSD013, DOC_TEMPLATE.LEXSD015, DOC_TEMPLATE.LEXSD016].includes(
      element.documentTemplateId!
    );

    let res = this.dialog.open(DocSelectionComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        ...element,
        allowUpload,
        allowMultiple,
        type: 'Account',
        subDocumentPrefix: 'subDocumentPrefix' in element ? element.subDocumentPrefix : undefined,
      },
    });

    res.afterClosed().subscribe(i => {
      if (!i) {
        this.documentService.hasEdit = true;
        this.documentAccountService.updateUsedCommitmentAccounts();
        this.documentAccountService.mapAccountDocumentData(this.taskCode, this.mode, this.itemsPerPage);
        this.documentService.checkDocumentIsReady();
        this.updateValuesFromService();
      }
    });
  }
  async selectCommitmentAccount(element: DisplayDocument, contract: Contract) {
    let res = this.dialog.open(CommitmentAccountSelectComponent, {
      width: '840px',
      disableClose: true,
      autoFocus: true,
      data: {
        element,
        accounts: this.documentAccountService.accounts,
        contract: {
          subDocumentPrefix: contract.subDocumentPrefix,
          documentEditText: contract.documentEditText,
        },
      },
    });
    res.afterClosed().subscribe(i => {
      if (!i) {
        this.documentService.hasEdit = true;
        this.documentAccountService.updateUsedCommitmentAccounts();
        this.updateValuesFromService();
      }
    });
  }

  // active/not active
  toggleActive(element: DisplayDocument | Contract) {
    this.documentService.hasEdit = true;
    element.active = !element.active;
    this.documentAccountService.setActiveForDocumentAccount(element);
    this.documentAccountService.setAccountDocumentReady();
    this.updateValuesFromService();

    // update global status numbers
    if ('id' in element) {
      this.documentService.updateStatusOnActiveCheck(element, element.active || false);
    }
    if ('documents' in element) {
      // contracts
      if (element.documents.length > 0) {
        element.documents.forEach(doc => {
          this.documentService.updateStatusOnActiveCheck(doc, element.active || false);
        });
      } else {
        this.documentAccountService.markContractAsActive(element);
        this.documentService.updateStatusOnActiveCheckContract(element, element.active);
      }
    }
  }

  // radios
  onRadioChange(document: DisplayDocument, value: boolean) {
    // update global status values
    this.documentService.hasEdit = true;
    this.documentService.updateStatusOnRadioChange(document, value);

    this.documentAccountService.setHasOriginalCopyForAccountDocument(document, value);
    this.documentAccountService.setAccountDocumentReady();
    this.updateValuesFromService();
  }

  // dropdown
  onDropdownSelected(event: any) {
    if (this.currentDropdownValue <= this.documentAccountService.accountsSet.accountsSet!.length) {
      this.currentDropdownValue = event;
    }
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  SUNDRY_TYPES: string[] = ['SUNDRY_LG', 'SUNDRY_AVAL', 'SUNDRY_ACCEPTANCE'];

  async rejectOriginalReceived(element: DisplayDocument, docGroup: DocumentGroup | DisplayCommitment, event: any) {
    let confirm = await this.rejectOriginalCopy(element);
    if (confirm) {
      this.onToggleCheckSentReceived(element, docGroup, event);
    }
  }

  async rejectOriginalCopy(val: any) {
    let element = val?.rejectedReasonDto
      ? val?.rejectedReasonDto
      : val.rejectedReasons && val.rejectedReasons.length > 0
        ? val.rejectedReasons[0]
        : null;
    let data = {
      rejectedDocumentInfo: {
        documentName: element?.rejectedDocumentInfo?.documentName || '',
        pageCount: element?.rejectedDocumentInfo?.pageCount || 0,
      },
      rejectedReasonId: element?.rejectedReasonCode,
      rejectedRemarks: element?.rejectedRemarks,
    };
    let res = await this.documentService.rejectReasons(data, 'ปฏิเสธรับต้นฉบับ', '', 'บันทึกปฏิเสธรับเอกสารต้นฉบับ');
    if (res) {
      let req: RejectedReasonRequest = {
        rejectedDocumentInfo: {
          documentName: res?.rejectedDocumentInfo?.documentName || '',
          pageCount: res?.rejectedDocumentInfo?.pageCount || 0,
        },
        rejectedReasonCode: res?.rejectedReasonId,
        rejectedRemarks: res?.rejectedRemarks,
      };
      val.rejectedReasonDto = req;
      this.documentAccountService.setRejectForDocumentAccount(val);
      return true;
    }
    return false;
  }

  expandReason() {
    this.expandedReason = !this.expandedReason;
  }

  receiveAll() {
    //update values From components
    this.contracts.contracts = this.contracts.contracts?.map((contract: Contract) => {
      if (contract.active) {
        if (contract.single) {
          if (contract.documents[0]?.active && contract.documents[0]?.hardCopyState === 'OPEN')
            contract.documents[0].received = true;
        } else {
          contract.documents = contract.documents.map(m => {
            if (m.active && m.hardCopyState === 'OPEN') m.received = true;
            return m;
          });
        }
      }
      return contract;
    });
    this.accountsSet.accountsSet = this.accountsSet.accountsSet?.map((ac: AccountsSet) => {
      ac.commitments = ac.commitments?.map((com: DisplayCommitment) => {
        com.documentsAndBills = com?.documentsAndBills?.map((doc: any) => {
          if ((doc.active && doc.hardCopyState === 'OPEN') || doc?.documents?.length > 0) {
            doc.received = true;
            doc.documents = doc.documents?.map((bill: any) => {
              if (bill.active && bill.hardCopyState === 'OPEN') {
                bill.received = true;
              }
              return bill;
            });
          }
          return doc;
        });
        return com;
      });
      return ac;
    });
    this.other.documents = this.other.documents?.map((ac: any) => {
      if (ac.active && ac.hardCopyState === 'OPEN') {
        ac.received = true;
      }
      return ac;
    });
    //update Values From Service
    this.documentAccountService.currentDocAccount = this.documentAccountService.currentDocAccount.map((doc: any) => {
      if (doc.active && doc.hardCopyState === 'OPEN') {
        doc.received = true;
        doc.updateFlag = doc.received == false ? null : this.UpdateFlagEnum.U;
      }
      return doc;
    });
    this.documentAccountService.setAccountDocumentReady();
    this.documentService.checkDocumentIsReady();
    this.updateValuesFromService();
  }
}
