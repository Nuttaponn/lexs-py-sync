import { Injectable } from '@angular/core';
import { TaskService } from '@app/modules/task/services/task.service';
import { ITooltip, Mode, taskCode } from '@app/shared/models';
import {
  AccountDto,
  CommitmentDto,
  CustomerDetailDto,
  DocumentDto,
  DocumentRequest,
  LitigationDetailDto,
} from '@lexs/lexs-client';
import { BehaviorSubject } from 'rxjs';
import { ReadyStatus } from './interface/copyColumnDisplayOption';
import {
  AccountsSet,
  Bill,
  Contract,
  DisplayCommitment,
  DisplayDocument,
  DocumentGroup,
  SubAccount,
} from './interface/document';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Injectable({
  providedIn: 'root',
})
export class DocumentAccountService {
  constructor(private taskService: TaskService) {}

  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;

  private _docAccount!: Array<DisplayDocument>;
  private _docAccountSubject: BehaviorSubject<Array<DisplayDocument>> = new BehaviorSubject([] as DisplayDocument[]);
  private _usedCommitmentAccounts!: Array<string>;
  _taskReciept = ['RECEIPT_ORIGINAL_DOCUMENT', 'RECEIPT_REJECT_ORIGINAL_DOCUMENT'];
  _taskSubmit = ['SUBMIT_ORIGINAL_DOCUMENT', 'SUBMIT_REJECT_ORIGINAL_DOCUMENT'];
  private _baseDataContract: DocumentGroup = {
    docGroup: 'acc_contract',
    forNoticeLetter: true,
    forLitigation: true,
    readyForNotice: false,
    readyForLitigation: false,
    documentNumber: 0,
    totalDocuments: 0,
    contracts: [
      {
        documentTemplateId: DOC_TEMPLATE.LEXSD013,
        documentSetName: 'สัญญาสินเชื่อ',
        forLitigation: true,
        forNoticeLetter: true,
        optional: false,
        active: true,
        documents: [],
        initButtonText: 'เลือกสัญญาสินเชื่อ',
        editButtonText: 'แก้ไขรายการสัญญา',
        documentEditText: 'เลือกวงเงินและเอกสาร',
        subDocumentPrefix: 'สัญญากู้เงิน',
        single: false,
        disabled: false,
      },
      {
        documentTemplateId: DOC_TEMPLATE.LEXSD014,
        documentSetName: 'ระบบ Profile Direct - หน้า Account List',
        forLitigation: true,
        forNoticeLetter: true,
        optional: false,
        active: true,
        documents: [],
        initButtonText: 'เลือกเอกสาร',
        single: true,
        disabled: false,
      },
      {
        documentTemplateId: DOC_TEMPLATE.LEXSD015,
        documentSetName: 'บันทึกข้อตกลงแก้ไขเพิ่มเติมสัญญาสินเชื่อ',
        forLitigation: true,
        forNoticeLetter: true,
        optional: true,
        active: false,
        documents: [],
        initButtonText: 'เลือกบันทึกเพิ่มเติมต่อท้ายสัญญา',
        editButtonText: 'แก้ไขรายการบันทึก',
        documentEditText: 'เลือกวงเงิน',
        subDocumentPrefix: 'บันทึกต่อท้าย',
        single: false,
        disabled: false,
      },
      {
        documentTemplateId: DOC_TEMPLATE.LEXSD016,
        documentSetName: 'สัญญาปรับโครงสร้างหนี้',
        forLitigation: true,
        forNoticeLetter: true,
        optional: true,
        active: false,
        documents: [],
        initButtonText: 'เลือกสัญญาสินเชื่อ',
        editButtonText: 'แก้ไขรายการสัญญา',
        documentEditText: 'เลือกวงเงิน',
        subDocumentPrefix: 'สัญญาสินเชื่อ',
        single: false,
        disabled: false,
      },
      {
        documentTemplateId: DOC_TEMPLATE.LEXSD017,
        documentSetName: 'หนังสือแจ้งลูกหนี้และผู้ค้ำประกันกรณีผิดเงื่อนไขที่ต้องปฏิบัติ (Covenant)',
        forLitigation: true,
        forNoticeLetter: true,
        optional: true,
        active: false,
        initButtonText: 'เลือกเอกสาร',
        documents: [],
        single: true,
        disabled: false,
      },
    ],
  };

  private _baseDataAccount: DocumentGroup = {
    docGroup: 'acc_docs',
    readyForNotice: false,
    readyForLitigation: false,
    forNoticeLetter: true,
    forLitigation: true,
    accountsSet: [],
  };

  private _baseDataOther: DocumentGroup = {
    docGroup: 'acc_other',
    readyForNotice: false,
    readyForLitigation: false,
    forNoticeLetter: true,
    forLitigation: true,
    documentNumber: 0,
    totalDocuments: 0,
    documents: [],
  };
  ignoreTemplate = [
    DOC_TEMPLATE.LEXSF130,
    DOC_TEMPLATE.LEXSF130_2,
    DOC_TEMPLATE.LEXSF131,
    DOC_TEMPLATE.LEXSF131_2,
    DOC_TEMPLATE.LEXSF132,
    DOC_TEMPLATE.LEXSF132_2,
  ];

  private _customer!: CustomerDetailDto | LitigationDetailDto;

  private _initAccountDocuments: Array<DocumentDto> = [];
  private _accounts: Array<DisplayCommitment> = [];
  private _accountsMap: {
    [key: string]: {
      accountName: string;
      accountTypeDesc: string;
    };
  } = {};

  private _accountsSet: DocumentGroup = this._baseDataAccount;
  private _contracts: DocumentGroup = this._baseDataContract;
  private _other: DocumentGroup = this._baseDataOther;
  private _remainingCommitmentCount: number = 0;
  private _remainingCommitmentList: any[] = [];

  private _accountDocumentReadyForLitigation = false;
  private _accountDocumentReadyForNotice = false;
  private _accountDocumentReadyForDoc = false;

  set customer(c) {
    this._customer = c;
  }
  get customer(): CustomerDetailDto | LitigationDetailDto {
    return this._customer;
  }

  set currentDocAccount(da) {
    this._docAccount = da;
  }
  get currentDocAccount(): Array<DisplayDocument> {
    return this._docAccount;
  }

  get docAccountSubject(): BehaviorSubject<Array<DisplayDocument>> {
    return this._docAccountSubject;
  }

  get usedCommitmentAccounts(): Array<string> {
    return this._usedCommitmentAccounts;
  }

  get initAccountDocuments(): Array<DocumentDto> {
    return this._initAccountDocuments;
  }

  get accountsSet(): DocumentGroup {
    return this._accountsSet;
  }

  get accounts(): Array<DisplayCommitment> {
    return this._accounts;
  }

  get accountsMap(): {
    [key: string]: {
      accountName: string;
      accountTypeDesc: string;
    };
  } {
    return this._accountsMap;
  }

  get contracts(): DocumentGroup {
    return this._contracts;
  }

  get other(): DocumentGroup {
    return this._other;
  }

  get remainingCommitmentCount(): number {
    return this._remainingCommitmentCount;
  }

  get remainingCommitmentList(): any[] {
    return this._remainingCommitmentList;
  }

  get accountDocumentReadyForLitigation(): boolean {
    return this._accountDocumentReadyForLitigation;
  }

  get accountDocumentReadyForNotice(): boolean {
    return this._accountDocumentReadyForNotice;
  }

  get accountDocumentReadyForDoc(): boolean {
    return this._accountDocumentReadyForDoc;
  }
  get taskCode(): taskCode {
    return this.taskService.taskDetail.taskCode as taskCode;
  }

  /////////
  // FILTER DOCUMENTS //
  /////////

  filterRelevantAccountDocuments() {
    const accountDocumentGroups = [
      'ACCOUNT_CONTRACT',
      'ACCOUNT_COMMITMENT',
      'ACCOUNT_BILL',
      'ACCOUNT_OTHER',
      'ACCOUNT_TFS',
      'LINKAGE',
    ];
    const allCommitmentAccounts: Array<CommitmentDto> = this._customer?.accountInfo?.commitmentAccounts || [];
    const commitmentAccountNumbers = [...allCommitmentAccounts].map(ca => ca.accountNumber);
    const commitmentAccountNumbersWithBill = [...allCommitmentAccounts]
      .filter(ca => !this.NO_BILL_TYPES.includes(ca.accountType!))
      .map(ca => ca.accountNumber);
    const commitmentAccountLinkages = [...allCommitmentAccounts]
      .filter(ca => !this.NO_BILL_TYPES.includes(ca.accountType!))
      .map(ca => ca.accountLinkages)
      .flat();
    const accountBillNumbers: Array<string | undefined> =
      this._customer?.accountInfo?.accounts
        ?.filter((a: AccountDto) => commitmentAccountNumbersWithBill.includes(a.accountNo))
        .map((a: AccountDto) => a.billNo) || [];
    const subAccountIds: Array<string | undefined> =
      this._customer?.accountInfo?.accounts
        ?.filter((a: AccountDto) => a.subAccount && commitmentAccountNumbers.includes(a.commitmentAccountNo))
        .map((a: AccountDto) => a.accountId) || [];

    let filteredDocs =
      this._customer?.documentInfo?.customerDocuments?.filter((doc: DocumentDto) =>
        accountDocumentGroups.includes(doc.documentTemplate?.documentGroup || '')
      ) || [];

    filteredDocs = filteredDocs.filter((doc: DocumentDto) => {
      if (doc.objectType === 'ACCOUNT_NO') {
        if (!commitmentAccountNumbers.includes(doc.objectId)) return false;
      } else if (doc.objectType === 'BILL_NO') {
        if (!accountBillNumbers.includes(doc.objectId)) return false;
      } else if (doc.objectType === 'LINKAGE') {
        if (!commitmentAccountLinkages.includes(doc.objectId)) return false;
      } else if (doc.objectType === 'SUB_ACCOUNT') {
        if (!subAccountIds.includes(doc.objectId)) return false;
      }
      return true;
    });

    this._initAccountDocuments = [...filteredDocs];
    this._docAccount = [...filteredDocs];
  }

  filterActiveAccountDocuments() {
    this._docAccount = this._docAccount.filter((doc: DocumentDto) => doc.active);
  }

  setUpRemainingCommitmentAccounts() {
    const allCommitmentAccounts: Array<CommitmentDto> = this._customer?.accountInfo?.commitmentAccounts || [];
    this._usedCommitmentAccounts = [];
    allCommitmentAccounts?.forEach((ca: CommitmentDto) => {
      this.accountsMap[ca.accountNumber || ''] = {
        accountName: ca.accountName!,
        accountTypeDesc: this.ACCOUNT_TYPE_NAME_MAP[ca.accountType!],
      };
    });
    this.updateUsedCommitmentAccounts();
    // this._remainingCommitmentCount = allCommitmentAccounts?.length - this._usedCommitmentAccounts.length;
    // let remainingCommitmentList = allCommitmentAccounts.filter(
    //   (f: any) => !this._usedCommitmentAccounts.includes(f.accountNumber)
    // );
    // this._remainingCommitmentList = this.mappingTooltip(remainingCommitmentList);
  }

  /////////
  // DATA PREP //
  /////////

  mapAccountDocumentData(taskCode: taskCode, viewMode: string, itemsPerPage: number) {
    this._docAccount = this.mapId(this._docAccount);
    this._docAccount.sort((a, b) =>
      a.documentTemplateId ? a.documentTemplateId.localeCompare(b.documentTemplateId!) : 0
    );
    const contractDocuments = this.initContracts(taskCode, viewMode);
    this._contracts = {
      ...this._baseDataContract,
      contracts: contractDocuments.documents as unknown as Contract[],
      documentNumber: contractDocuments.documentNumber,
      totalDocuments: contractDocuments.totalDocuments,
    };
    this._accounts = this.initAccounts(viewMode);
    this._accountsSet = {
      ...this._baseDataAccount,
      accountsSet: this.initAccountsSet(this.accounts, itemsPerPage) || [],
    };
    const otherDocuments = this.initOtherDocuments(viewMode);
    this._other = {
      ...this._baseDataOther,
      documents: otherDocuments.documents || [],
      documentNumber: otherDocuments.documentNumber,
      totalDocuments: otherDocuments.totalDocuments,
    };
    this.setAccountDocumentReady();
  }

  mapId(data: DisplayDocument[]) {
    return data.map((d, i) => ({
      ...d,
      id: i,
    }));
  }

  initOtherDocuments(viewMode: string) {
    const docs = this.mapOrder(
      this._docAccount?.filter(
        d => d.documentTemplate?.documentGroup === 'ACCOUNT_OTHER' && d.updateFlag !== this.UpdateFlagEnum.D
      )
    );
    return {
      documents: docs,
      documentNumber: this.getDocumentNumber(docs, viewMode),
      totalDocuments: docs.length,
    };
  }

  getCommitmentDocument(documentTemplateId: string) {
    const documentTemplateIds = [DOC_TEMPLATE.LEXSD013, DOC_TEMPLATE.LEXSD015, DOC_TEMPLATE.LEXSD016];
    if (documentTemplateIds.includes(documentTemplateId)) {
      /*
        dummyDocument only tells whether a contract is active or not
        For documents for contracts, only get documents with imageIds (if it does not
        have an imageId, it goes into the dummyDocument field). There is supposed to be only one
        dummy document for each documentTemplateId.
      */
      return this._docAccount
        ?.filter(
          d => d.documentTemplateId === documentTemplateId && d.updateFlag !== this.UpdateFlagEnum.D && d.imageId
        )
        .map(m => {
          return {
            ...m,
            tooltips: this.getContentTooltip(m),
          };
        });
    } else {
      return this._docAccount?.filter(
        d => d.documentTemplateId === documentTemplateId && d.updateFlag !== this.UpdateFlagEnum.D
      );
    }
  }

  getCommitmentDummyDocument(documentTemplateId: string) {
    const documentTemplateIds = [DOC_TEMPLATE.LEXSD013, DOC_TEMPLATE.LEXSD015, DOC_TEMPLATE.LEXSD016];
    if (documentTemplateIds.includes(documentTemplateId)) {
      return (
        this._docAccount?.filter(
          d => d.documentTemplateId === documentTemplateId && d.updateFlag !== this.UpdateFlagEnum.D && !d.imageId
        ) || []
      );
    } else return [];
  }

  initContracts(taskCodeParam: taskCode, viewMode: string) {
    let totalDocuments: DisplayDocument[] = [];
    const contracts = this.contracts.contracts!.map((c: any) => {
      const doc = this.getCommitmentDocument(c.documentTemplateId).map(m => {
        return { ...m, ...this.getTooltipMsg(m) };
      });
      const dummyDoc = this.getCommitmentDummyDocument(c.documentTemplateId);
      totalDocuments = totalDocuments.concat(doc);
      return {
        ...c,
        documents: doc || [],
        // use existing dummy document (if available)
        dummyDocument: c.dummyDocument || (dummyDoc.length > 0 ? dummyDoc[0] : undefined),
      };
    });
    contracts.forEach((c: any) => {
      c.active =
        (c.dummyDocument && c.dummyDocument.active) ||
        (c.documents?.length > 0 ? c.documents.some((doc: any) => doc.active) : c.active);
      if (c.single && c.documents.length === 0) c.disabled = true;
      if (taskCodeParam === taskCode.SUBMIT_ORIGINAL_DOCUMENT || taskCodeParam === taskCode.RECEIPT_ORIGINAL_DOCUMENT) {
        if (c.documents.length === 0 || !c.active) c.disabled = true;
      }
    });
    return {
      documents: this.mapOrder(contracts.filter((c: any) => !c.disabled)),
      documentNumber: this.getDocumentNumber(totalDocuments, viewMode),
      totalDocuments: totalDocuments.length,
    };
  }

  getTooltipMsg(document: any) {
    let tooltipMsg: string = '';
    let iconClass: string = '';
    let iconName: string[] = [];
    switch (document.hardCopyState) {
      case DocumentDto.HardCopyStateEnum.Disable:
        iconClass = 'fill-gray';
        iconName = ['icon-Document-Error', 'icon-Document-Error'];
        if (
          this.taskCode === 'SUBMIT_ORIGINAL_DOCUMENT' ||
          this.taskCode === taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT
        ) {
          tooltipMsg = 'กรุณาส่งเอกสารที่งานส่งเอกสารต้นฉบับ';
        }
        if (this.taskCode === 'RECEIPT_ORIGINAL_DOCUMENT') {
          tooltipMsg = 'กรุณารับเอกสารที่งานรับเอกสารต้นฉบับ';
        }
        break;
      case DocumentDto.HardCopyStateEnum.InProgress:
        iconClass = 'fill-yellow ';
        iconName = ['icon-Document-Sync', 'icon-Document-Sync'];
        tooltipMsg = 'เอกสารต้นฉบับอยู่ระหว่างดำเนินการ กรุณาตรวจสอบอีกครั้งภายหลัง';
        break;
      case DocumentDto.HardCopyStateEnum.Reject:
        iconClass = 'fill-krungthai-red';
        iconName = ['icon-Document-Error', 'icon-Document-Error'];
        tooltipMsg = 'ปฏิเสธรับเอกสารต้นฉบับแล้ว';
        break;
      case DocumentDto.HardCopyStateEnum.Success:
        iconClass = 'fill-krungthai-green';
        iconName = ['icon-verify-doc', 'icon-verify-doc'];
        if (
          this.taskCode === 'SUBMIT_ORIGINAL_DOCUMENT' ||
          this.taskCode === taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT
        ) {
          tooltipMsg = 'ส่งเอกสารต้นฉบับแล้ว';
        }
        if (['RECEIPT_ORIGINAL_DOCUMENT', 'RECEIPT_REJECT_ORIGINAL_DOCUMENT'].includes(this.taskCode)) {
          tooltipMsg = 'ได้รับต้นฉบับของเอกสารนี้แล้ว';
        }
        break;
      default:
        break;
    }
    return { tooltipMsg: tooltipMsg, iconClass: iconClass, iconName: iconName };
  }

  // accounts
  getDocumentObject(objectType: string) {
    const documents: { [key: string]: any[] } = {};
    this._docAccount
      ?.filter(d => d.objectType === objectType && d.updateFlag !== this.UpdateFlagEnum.D)
      .forEach(d => {
        d = { ...d, ...this.getTooltipMsg(d) };
        if (d.objectId && documents[d.objectId!]) {
          documents[d.objectId!].push(d);
        } else if (d.objectId) {
          documents[d.objectId!] = [d];
        }
      });
    return documents;
  }

  initAccounts(viewMode: string) {
    const documentAcc = this.getDocumentObject('ACCOUNT_NO');
    const billDoc = this.getDocumentObject('BILL_NO');
    const linkageDoc = this.getDocumentObject('LINKAGE');
    const subAccDoc = this.getDocumentObject('SUB_ACCOUNT');

    const bills: { [key: string]: any[] } = {};
    const subAccounts: { [key: string]: any[] } = {};
    const totalDocumentForAccount: { [key: string]: DisplayDocument[] } = {};
    this._customer?.accountInfo?.accounts?.forEach((a: any) => {


      if (a.subAccount) {
        if (subAccounts[a.commitmentAccountNo]) {
          subAccounts[a.commitmentAccountNo].push({
            active: true,
            accountNumber: a.billNo,
            forLitigation: true,
            forNoticeLetter: true,
            optional: false,
            commitmentAccountNo: a.commitmentAccountNo,
            documents: subAccDoc[a.accountId!],
          });
          totalDocumentForAccount[a.accountNo!] = totalDocumentForAccount[a.accountNo!]?.concat(
            subAccDoc[a.accountId!]
          );
        } else {
          subAccounts[a.commitmentAccountNo] = [
            {
              active: true,
              accountNumber: a.billNo,
              forLitigation: true,
              forNoticeLetter: true,
              optional: false,
              commitmentAccountNo: a.commitmentAccountNo,
              documents: subAccDoc[a.accountId!],
            },
          ];
          totalDocumentForAccount[a.accountNo!] = subAccDoc[a.accountId!];
        }
      }else{
        if (bills[a.accountNo!]) {
          bills[a.accountNo!].push({
            active: true,
            billNo: a.billNo,
            dpd: a.dpd,
            forLitigation: true,
            forNoticeLetter: true,
            optional: false,
            documents: billDoc[a.billNo!] || [],
          });
          totalDocumentForAccount[a.accountNo!] = totalDocumentForAccount[a.accountNo!]?.concat(billDoc[a.billNo!]);
        } else {
          bills[a.accountNo!] = [
            {
              active: true,
              billNo: a.billNo,
              dpd: a.dpd,
              forLitigation: true,
              forNoticeLetter: true,
              optional: false,
              documents: billDoc[a.billNo!] || [],
            },
          ];
          totalDocumentForAccount[a.accountNo!] = billDoc[a.billNo!];
        }
      }
    });

    const commitments: DisplayCommitment[] =
      this._customer?.accountInfo?.commitmentAccounts?.map((ca: CommitmentDto) => {
        const documents = documentAcc[ca.accountNumber!] || [];
        const billsArray: Array<Bill> = bills[ca.accountNumber!] || [];
        const linkageBillsArray: Array<Bill> =
          ca.accountLinkages?.map(linkageBillNo => {
            if (totalDocumentForAccount[ca.accountNumber!]) {
              totalDocumentForAccount[ca.accountNumber!] = totalDocumentForAccount[ca.accountNumber!].concat(
                linkageDoc[linkageBillNo]
              );
            } else {
              totalDocumentForAccount[ca.accountNumber!] = linkageDoc[linkageBillNo];
            }
            return {
              active: true,
              billNo: linkageBillNo,
              linkage: true,
              forLitigation: true,
              forNoticeLetter: true,
              optional: false,
              documents: linkageDoc[linkageBillNo] || [],
            };
          }) || [];
        const subAccountArray: Array<SubAccount> = subAccounts[ca.accountNumber!] || [];

        const documentsAndBills = this.NO_BILL_TYPES.includes(ca.accountType!)
          ? [...documents, ...subAccountArray]
          : [...documents, ...billsArray, ...linkageBillsArray, ...subAccountArray];
        if (totalDocumentForAccount[ca.accountNumber!]) {
          totalDocumentForAccount[ca.accountNumber!] = totalDocumentForAccount[ca.accountNumber!].concat(documents);
        } else {
          totalDocumentForAccount[ca.accountNumber!] = documents;
        }
        let accountTypeDesc = ca.accountType ? this.ACCOUNT_TYPE_NAME_MAP[ca.accountType] : '';
        let documentNumber = documentsAndBills.reduce((acc, cur) => {
          return acc + (cur?.documents?.length >= 0 ? cur?.documents?.length : 1);
        }, 0);

        let blendDocument = documentsAndBills.reduce((acc, cur) => {
          if (cur?.documents?.length >= 0) {
            acc = acc.concat(cur?.documents);
          } else {
            acc.push(cur);
          }
          return acc;
        }, []);

        return {
          ...ca,
          accountTypeDesc: accountTypeDesc,
          documentsAndBills: this.mapOrder(documentsAndBills),
          details: this.getAccountHeaderDetails(ca, accountTypeDesc),
          // documentNumber: this.getDocumentNumber(totalDocumentForAccount[ca.accountNumber!], viewMode),
          documentNumber: this.getDocumentNumber(blendDocument, viewMode),
          totalDocuments: documentNumber,
        };
      }) || [];

    commitments.sort((a, b) => {
      const sortAccountType =
        (this.ACCOUNT_TYPE_ORDER[a.accountType!] || 13) - (this.ACCOUNT_TYPE_ORDER[b.accountType!] || 13);
      if (sortAccountType !== 0) return sortAccountType;
      else return a.accountNumber!.localeCompare(b.accountNumber!);
    });
    return commitments;
  }

  getAccountHeaderDetails(account: DisplayCommitment, accountTypeDesc: string) {
    return [
      {
        name: 'เลขที่บัญชี',
        value: account.accountNumber,
      },
      {
        name: 'ประเภทสินเชื่อ',
        value: accountTypeDesc || account.accountType,
      },
      {
        name: 'ภาระหนี้ทั้งหมด (บาท)',
        value: account.totalDebt,
        hasDecimal: true,
      },
    ];
  }

  initAccountsSet(accounts: DisplayCommitment[], itemsPerPage: number) {
    const accountsSet: AccountsSet[] = [];
    let i = 0;
    while (i < accounts.length) {
      if (accounts[i + itemsPerPage]) {
        accountsSet.push({
          readyForNotice: false,
          readyForLitigation: false,
          commitments: accounts.slice(i, i + itemsPerPage),
        });
      } else {
        accountsSet.push({
          readyForNotice: false,
          readyForLitigation: false,
          commitments: accounts.slice(i),
        });
      }
      i = i + 10;
    }
    return accountsSet;
  }

  getDocumentNumber(documents: DisplayDocument[], viewMode: string) {
    if (viewMode === Mode.VIEW_PENDING || viewMode === Mode.VIEW) {
      return documents
        ?.filter(d => d !== undefined)
        ?.filter(d => d?.sent === true || (d?.active && d?.imageId && d.documentTemplate?.needHardCopy === false))
        ?.length;
    } else if (viewMode === Mode.VIEW_PENDING_APPROVE) {
      return documents
        ?.filter(d => d !== undefined)
        ?.filter(d => d?.received === true || (d?.active && d?.imageId && d.documentTemplate?.needHardCopy === false))
        ?.length;
    }
    return 0;
  }

  mapOrder(data: Array<Bill | DisplayDocument>) {
    let i = 0;
    const mappedData = data.map(d => {
      if (
        d.optional === false ||
        ('documentTemplate' in d && d.documentTemplate && d.documentTemplate.optional === false)
      ) {
        i++;
      }
      return {
        ...d,
        ...this.getTooltipMsg(d),
        order: i,
      };
    });
    return mappedData;
  }

  /////////
  // SET READY/NOT READY //
  /////////

  setAccountDocumentReady() {
    this.setContractReady();
    this.setOtherAccountReady();
    this.setCommitmentAccountReady();
    this._accountDocumentReadyForLitigation =
      this.accountsSet.readyForLitigation &&
      this.contracts.readyForLitigation &&
      (this.other.readyForLitigation || !this.other.forLitigation);
    this._accountDocumentReadyForNotice =
      this.accountsSet.readyForNotice &&
      this.contracts.readyForNotice &&
      (this.other.readyForNotice || !this.other.forNoticeLetter);
    this._accountDocumentReadyForDoc =
      (this.accountsSet.readyForDoc && this.contracts.readyForDoc && this.other.readyForDoc) || false;
  }

  setContractReady() {
    this.contracts.contracts!.forEach((c: Contract) => {
      if (!c.single) {
        c.readyForLitigation =
          c.documents.length !== 0 &&
          c.documents
            .filter(doc => doc.active && doc.documentTemplate?.needHardCopy)
            .every(doc => doc.imageId && doc.hasOriginalCopy);
        c.readyForNotice = c.documents.length !== 0 && c.documents.filter(doc => doc.active).every(doc => doc.imageId);
        // red
        c.needsCopyForLitigation = c.documents
          .filter(doc => doc.active)
          .some(doc => doc.hasOriginalCopy === false && doc.imageId);
        c.readyForDoc =
          c.documents.length !== 0 &&
          c.documents
            .filter((doc: any) => doc.active && doc.imageId)
            .every(
              doc =>
                (doc?.sent && this._taskSubmit.includes(this.taskCode)) ||
                (doc?.received && this._taskReciept.includes(this.taskCode))
            );
      } else {
        if (c.documents.length > 0) {
          c.readyForLitigation = c.documents[0].imageId && c.documents[0].hasOriginalCopy ? true : false;
          c.readyForNotice = c.documents[0].imageId ? true : false;
          c.readyForDoc =
            c.documents[0].imageId &&
            ((c.documents[0]?.sent && this._taskSubmit.includes(this.taskCode)) ||
              (c.documents[0]?.received && this._taskReciept.includes(this.taskCode)))
              ? true
              : false;
        } else {
          c.readyForLitigation = false;
          c.readyForNotice = false;
          c.readyForDoc = false;
        }
      }
    });
    this.contracts.readyForLitigation = this.contracts
      .contracts!.filter((c: Contract) => c.active)
      .every((c: Contract) => c.readyForLitigation);
    this.contracts.readyForNotice = this.contracts
      .contracts!.filter((c: Contract) => c.active)
      .every((c: Contract) => c.readyForNotice);
    this.contracts.readyForDoc = this.contracts
      .contracts!.filter((c: Contract) => c.active)
      .every((c: Contract) => c.readyForDoc);
  }

  setOtherAccountReady() {
    const activeLitigateOtherDocuments = this.other.documents!.filter(
      (d: DisplayDocument) => d.active && d.documentTemplate?.forLitigation
    );
    const activeNoticeOtherDocuments = this.other.documents!.filter(
      (d: DisplayDocument) => d.active && d.documentTemplate?.forNoticeLetter
    );
    const activeDocOtherDocuments = this.other.documents!.filter(
      (document: DisplayDocument) =>
        (document.imageId && document.documentTemplate?.needHardCopy === false) ||
        (document.imageId && document.documentTemplate?.needHardCopy === true)
    );
    if (activeLitigateOtherDocuments.length !== 0) {
      activeLitigateOtherDocuments.forEach((d: DisplayDocument) => {
        if (d.documentTemplate?.forLitigation) {
          d.readyForLitigation = (d.imageId && d.hasOriginalCopy) || !d.documentTemplate?.needHardCopy;
          d.needsCopyForLitigation = d.documentTemplate?.needHardCopy && d.imageId && !d.hasOriginalCopy ? true : false;
        }
      });
      this.other.forLitigation = true;
      this.other.readyForLitigation = activeLitigateOtherDocuments.every((d: DisplayDocument) => d.readyForLitigation);
    } else {
      this.other.forLitigation = false;
      this.other.readyForLitigation = false;
    }
    if (activeNoticeOtherDocuments.length !== 0) {
      activeNoticeOtherDocuments.forEach((d: DisplayDocument) => {
        if (d.documentTemplate?.forNoticeLetter) d.readyForNotice = d.imageId ? true : false;
      });
      this.other.forNoticeLetter = true;
      this.other.readyForNotice = activeNoticeOtherDocuments.every((d: DisplayDocument) => d.readyForNotice);
    } else {
      this.other.forNoticeLetter = false;
      this.other.readyForNotice = false;
    }

    this.other.readyForDoc = activeDocOtherDocuments.every(
      (document: DisplayDocument) =>
        (document?.sent && this._taskSubmit.includes(this.taskCode)) ||
        (document?.received && this._taskReciept.includes(this.taskCode))
    );
  }

  setCommitmentAccountReady() {
    this.accountsSet.accountsSet!.forEach((as: AccountsSet) => {
      as.commitments?.forEach(c => {
        let accountReadyForLitigation = true;
        let accountReadyForNoticeLetter = true;
        let accountReadyForDoc = true;
        c.documentsAndBills!.filter(item1 => item1.active).forEach((item: any) => {
          if (item.hasOwnProperty('documents') && item?.documents) {
            // bills, linkages, and sub accounts
            const litigationDocs = item?.documents?.filter(
              (doc: DisplayDocument) => doc.documentTemplate?.forLitigation
            );
            const noticeDocs = item.documents?.filter((doc: DisplayDocument) => doc.documentTemplate?.forNoticeLetter);
            const docs = item.documents?.filter((doc: DisplayDocument) => doc.active && doc.imageId);

            if (litigationDocs?.length !== 0) {
              item.readyForLitigation = litigationDocs
                ?.filter(
                  (doc: DisplayDocument) =>
                    doc.documentTemplate?.needHardCopy ||
                    this.ignoreTemplate.includes(doc?.documentTemplate?.documentTemplateId || '')
                )
                .every(
                  (doc: DisplayDocument) =>
                    doc.imageId &&
                    (doc.hasOriginalCopy ||
                      this.ignoreTemplate.includes(doc?.documentTemplate?.documentTemplateId || ''))
                );
            } else item.forLitigation = false;

            if (noticeDocs?.length !== 0) {
              item.readyForNotice = noticeDocs?.every((doc: DisplayDocument) => doc.imageId);
            } else item.forNoticeLetter = false;
            if (docs?.length !== 0) {
              item.readyForDoc = docs?.every(
                (doc: any) =>
                  (doc.sent && this._taskSubmit.includes(this.taskCode)) ||
                  (doc.received && this._taskReciept.includes(this.taskCode))
              );
            } else item.readyForDoc = false;

            // red
            item.needsCopyForLitigation = litigationDocs?.some(
              (doc: DisplayDocument) => doc.hasOriginalCopy === false && doc.imageId
            );
            if (!item.readyForLitigation && item.forLitigation) accountReadyForLitigation = false;
            if (!item.readyForNotice && item.forNoticeLetter) accountReadyForNoticeLetter = false;
            if (!item.readyForDoc) accountReadyForDoc = false;

            // when bills not have document
            if (item.billNo && item?.documents.length === 0) {
              accountReadyForDoc = true;
            }
          } else if ('documentTemplate' in item) {
            // regular documents
            item.readyForLitigation =
              (item.imageId && item.hasOriginalCopy) || (!item.documentTemplate?.needHardCopy && item.imageId);
            item.readyForNotice = item.imageId ? true : false;
            item.readyForDoc =
              (item.imageId && item.active && item.sent && this._taskSubmit.includes(this.taskCode)) ||
              (item.received && this._taskReciept.includes(this.taskCode))
                ? true
                : false;
            item.needsCopyForLitigation =
              item.documentTemplate?.needHardCopy && item.imageId && !item.hasOriginalCopy ? true : false;
            if (!item.readyForLitigation && item.documentTemplate?.forLitigation) accountReadyForLitigation = false;
            if (!item.readyForNotice && item.documentTemplate?.forNoticeLetter) accountReadyForNoticeLetter = false;
            if (!item.readyForDoc) accountReadyForDoc = false;
          }
        });
        c.readyForLitigation = accountReadyForLitigation;
        c.readyForNotice = accountReadyForNoticeLetter;
        c.readyForDoc = accountReadyForDoc;

        as.readyForNotice = as.commitments?.every(c => c.readyForNotice);
        as.readyForLitigation = as.commitments?.every(c => c.readyForLitigation);
        as.readyForDoc = as.commitments?.every(c => c.readyForDoc);
      });
      this.accountsSet.readyForNotice =
        this.accountsSet.accountsSet?.every((as: AccountsSet) => as.readyForNotice) || false;
      this.accountsSet.readyForLitigation =
        this.accountsSet.accountsSet?.every((as: AccountsSet) => as.readyForLitigation) || false;
      this.accountsSet.readyForDoc = this.accountsSet.accountsSet?.every((as: AccountsSet) => as.readyForDoc) || false;
    });
  }

  /////////
  // UPDATING DOCUMENTS //
  /////////

  updateDocumentAccountMultiple(documents: DisplayDocument[], element: Contract) {
    // LEXSD013, LEXSD015, LEXSD016
    const addDocs = [...documents];

    const newDocs: DisplayDocument[] = [];
    // setup former documents
    this._docAccount.forEach(d => {
      if (d.documentTemplateId === element.documentTemplateId) {
        if (d.documentId) {
          d.updateFlag = this.UpdateFlagEnum.D;
          newDocs.push(d);
        }
      } else {
        newDocs.push(d);
      }
    });
    if (element.dummyDocument) {
      element.dummyDocument = undefined;
    }

    this._docAccount = [...addDocs, ...newDocs];
  }

  updateDocumentAccount(doc: DisplayDocument) {
    // not LEXSD013, LEXSD015, LEXSD016
    const indexOfFormerDocument = this._docAccount.findIndex(d => {
      if (d.documentId) return d.documentId === doc.documentId;
      if (d.objectId) {
        return (
          d.objectId === doc.objectId &&
          d.objectType === doc.objectType &&
          d.documentTemplateId === doc.documentTemplateId
        );
      } else {
        return d.documentTemplateId === doc.documentTemplateId;
      }
    });
    if (indexOfFormerDocument >= 0) {
      const newDoc = {
        ...doc,
        documentDate: doc.createdDate,
      };
      this._docAccount[indexOfFormerDocument] = newDoc;
    }
  }

  getContentTooltip(element: DisplayDocument) {
    const content: ITooltip[] = [];
    element.commitmentAccounts?.forEach(accountNumber => {
      content.push({
        content: `${accountNumber} - ${this.accountsMap[accountNumber]?.accountName || ''}`,
      });
    });
    if (content?.length > 0) {
      content[0].header = 'วงเงิน';
    }
    return content;
  }

  // commitment accounts
  updateDocumentCommitmentAccount(accounts: string[], element: DisplayDocument) {
    const foundIndex = this._docAccount.findIndex(doc => doc.id === element.id);
    if (foundIndex >= 0) {
      this._docAccount[foundIndex].commitmentAccounts = accounts;
      this._docAccount[foundIndex].updateFlag =
        element.updateFlag == this.UpdateFlagEnum.A ? this.UpdateFlagEnum.A : this.UpdateFlagEnum.U;
    }

    element.commitmentAccounts = accounts;
    element.tooltips = this.getContentTooltip(element);
    element.updateFlag = element.updateFlag == this.UpdateFlagEnum.A ? this.UpdateFlagEnum.A : this.UpdateFlagEnum.U;
  }

  updateUsedCommitmentAccounts() {
    const contractDocuments = this._docAccount.filter(
      doc => doc.commitmentAccounts?.length !== 0 && doc.active && doc.updateFlag !== this.UpdateFlagEnum.D
    );
    const commitmentAccounts = contractDocuments.map(doc => doc.commitmentAccounts).flat();
    const commitmentAccountsObject: { [key: string]: boolean } = {};
    commitmentAccounts.forEach(accountNo => {
      if (accountNo) commitmentAccountsObject[accountNo] = true;
    });
    const noDuplicateCommitmentAccounts = Object.keys(commitmentAccountsObject);

    this._usedCommitmentAccounts = noDuplicateCommitmentAccounts;
    const allCommitmentAccounts: Array<CommitmentDto> = this._customer?.accountInfo?.commitmentAccounts || [];
    const LEXSD013accountsNoDuplicate = this.getLEXSD013();
    const LEXSD013UsedAllAccounts =
      allCommitmentAccounts?.filter((s: any) => !LEXSD013accountsNoDuplicate?.includes(s.accountNumber)) || false;
    this._remainingCommitmentCount = LEXSD013UsedAllAccounts?.length || 0;
    this._remainingCommitmentList = this.mappingTooltip(LEXSD013UsedAllAccounts);
  }

  mappingTooltip(data: any[]) {
    return data.map((m, idx) => {
      return { title: idx === 0 ? 'เลขที่บัญชี' : '', content: m.accountNumber };
    });
  }

  setRejectForDocumentAccount(element: any) {
    if ('id' in element) {
      const index = this._docAccount.findIndex(da => da.id === element.id);
      const foundDoc = this._docAccount[index] as any;
      foundDoc.rejectedReasonDto = element.rejectedReasonDto;
    }
  }
  /////////
  // SET ACTIVE //
  /////////

  setActiveForDocumentAccount(element: DisplayDocument | Contract) {
    if ('id' in element) {
      const index = this._docAccount.findIndex(da => da.id === element.id);
      const foundDoc = this._docAccount[index];
      foundDoc.active = element.active;
      foundDoc.updateFlag = this.UpdateFlagEnum.U;
      // this.updateStatus(element, element.active || false)
    }
    if ('documents' in element && element.documents) {
      element.documents.forEach(d => {
        d.active = element.active;
        const index = this._docAccount.findIndex(da => da.id === d.id);
        // update data in document service
        if (index >= 0) {
          const doc = this.currentDocAccount[index];
          doc.active = element.active;
          if (element.single) {
            doc.updateFlag = this.UpdateFlagEnum.U;
          } else {
            this.updateUsedCommitmentAccounts();
            // this._remainingCommitmentCount = this.accounts.length - this._usedCommitmentAccounts.length;
            // let remainingCommitmentList = this.accounts.filter(
            //   (f: any) => !this._usedCommitmentAccounts.includes(f.accountNumber)
            // );
            // this._remainingCommitmentList = this.mappingTooltip(remainingCommitmentList);
            if (element.active) {
              if (doc.documentId) doc.updateFlag = undefined;
              else doc.updateFlag = this.UpdateFlagEnum.A;
            } else {
              if (doc.documentId) doc.updateFlag = this.UpdateFlagEnum.D;
              else doc.updateFlag = undefined;
            }
          }
          // this.updateStatus(doc, element.active || false)
        }
      });
    }
  }

  markContractAsActive(contract: Contract) {
    if (contract.documents.length === 0) {
      if (contract.active) {
        if (contract.dummyDocument) {
          contract.dummyDocument = {
            ...contract.dummyDocument,
            active: contract.active,
            updateFlag: contract.dummyDocument.documentId ? 'U' : 'A',
            documentTemplateId: contract.documentTemplateId,
          };
        } else if (contract.documents.length === 0) {
          contract.dummyDocument = {
            active: true,
            imageId: undefined,
            updateFlag: 'A',
            documentTemplateId: contract.documentTemplateId,
          };
        }
      } else {
        if (contract.dummyDocument) {
          if (contract.dummyDocument.documentId) {
            contract.dummyDocument.updateFlag = 'D';
            contract.dummyDocument.active = contract.active;
          } else contract.dummyDocument = undefined;
        }
      }
      // find contract and update in service
      const foundContractIndex =
        this.contracts.contracts?.findIndex(c => c.documentTemplateId === contract.documentTemplateId) || 0;
      if (this.contracts?.contracts?.[foundContractIndex]) this.contracts.contracts[foundContractIndex] = contract;
    }
  }

  /////////
  // SET ORIGINAL COPY //
  /////////

  setHasOriginalCopyForAccountDocument(element: DisplayDocument, value: boolean) {
    element.hasOriginalCopy = value;
    // update data in document service
    const index = this._docAccount.findIndex(da => da.id === element.id);
    const foundDoc = this._docAccount[index];
    if (index >= 0) foundDoc.hasOriginalCopy = value;

    foundDoc.updateFlag = element.updateFlag == this.UpdateFlagEnum.A ? this.UpdateFlagEnum.A : this.UpdateFlagEnum.U;
  }

  /////////
  // UPDATE READY STATUS //
  /////////

  getReadyStatus() {
    let taskCode = this.taskService.taskDetail.taskCode as taskCode;
    const status: ReadyStatus = {
      totalNotice: 0,
      totalLitigation: 0,
      activeNotice: 0,
      activeLitigation: 0,
      activeReceived: 0,
      totalReceived: 0,
      totalSent: 0,
      activeSent: 0,
    };

    this._docAccount?.forEach(doc => {
      if (doc.active && doc.updateFlag !== this.UpdateFlagEnum.D) {
        if (doc.documentTemplate?.forNoticeLetter) status.totalNotice++;
        if (doc.documentTemplate?.forLitigation) status.totalLitigation++;

        if (doc.documentTemplate?.forNoticeLetter && doc.imageId) status.activeNotice++;
        if (
          doc.documentTemplate?.forLitigation &&
          doc.imageId &&
          (doc.hasOriginalCopy || this.ignoreTemplate.includes(doc?.documentTemplate?.documentTemplateId || ''))
        )
          status.activeLitigation++;
        if (doc.imageId) status.totalSent++;
        status.totalReceived++;
        if (
          (doc.imageId && taskCode === 'SUBMIT_ORIGINAL_DOCUMENT' && doc?.sent) ||
          (this.taskCode === 'SUBMIT_REJECT_ORIGINAL_DOCUMENT' && doc.hardCopyState === 'SUCCESS' && doc.sent)
        )
          status.activeSent++;
        if (
          (doc.imageId && taskCode === 'RECEIPT_ORIGINAL_DOCUMENT' && doc?.received) ||
          (this.taskCode === 'RECEIPT_REJECT_ORIGINAL_DOCUMENT' && doc.hardCopyState === 'SUCCESS' && doc.received)
        )
          status.activeReceived++;
      }
    });
    if (this._docAccount?.filter(doc => doc.documentTemplateId === DOC_TEMPLATE.LEXSD013).length === 0) {
      status.totalNotice++;
      status.totalLitigation++;
    }
    return status;
  }

  /////////
  // SENDING AND RECEIVING DOCUMENTS //
  /////////

  setDocForSendingReceiving(
    element: DisplayDocument,
    docGroup: DocumentGroup | DisplayCommitment,
    value: any,
    mode: string,
    statusCode: string
  ) {
    const alreadySent = mode === Mode.VIEW_PENDING && element.sent;
    const alreadyReceived = mode === Mode.VIEW_PENDING_APPROVE && element.received;
    const hasNotBeenSent = mode === Mode.VIEW_PENDING_APPROVE && !element.sent;
    // select only the ones that haven't been selected
    if (
      !element.hasOriginalCopy ||
      !element.imageId ||
      hasNotBeenSent ||
      ((alreadySent || alreadyReceived) && !element.updateFlag && (statusCode === 'IN_PROGRESS' || element.hasSave))
    )
      return;

    if (mode === Mode.VIEW_PENDING) {
      element.sent = value ? true : false;
      element.updateFlag = 'U';
    }
    if (mode === Mode.VIEW_PENDING_APPROVE) {
      element.received = value ? true : false;
      element.updateFlag = 'U';
      element.rejectReason = element.received;
    }
    if (element.sent || element.received) {
      if (!element.receiveDate) {
        // @ts-ignore should be string | Date
        element.receiveDate = new Date();
      }
    }

    if ((mode === Mode.VIEW_PENDING && element.sent) || (mode === Mode.VIEW_PENDING_APPROVE && element.received)) {
      if (docGroup.documentNumber! < docGroup.totalDocuments!) {
        docGroup.documentNumber!++;
      }
    } else {
      docGroup.documentNumber!--;
    }

    const foundDoc = this._docAccount.findIndex(d => d.documentId === element.documentId);
    this._docAccount[foundDoc] = { ...element };
  }

  /////////
  // SAVING //
  /////////

  remapDocsOnSaveDraft(response: DocumentDto[]) {
    response.forEach(resDoc => {
      const foundIndex = this._docAccount.findIndex(
        doc => doc.documentId === resDoc.documentId || (doc.imageId && doc.imageId === resDoc.imageId)
      );
      if (foundIndex >= 0) {
        const foundDoc = this._docAccount[foundIndex];
        foundDoc.documentId = resDoc.documentId;
        foundDoc.updateFlag = undefined;
      } else {
        // for dummy documents
        this._docAccount.push(resDoc);
      }
    });
  }

  replaceAccountDocumentById(element: DisplayDocument) {
    const indexOfFormerDocument = this._docAccount.findIndex(d => d.documentId === element.documentId);
    if (indexOfFormerDocument >= 0) {
      this._docAccount[indexOfFormerDocument] = element;
    }
  }

  triggerOnSaveDraftEvent() {
    this._docAccountSubject.next(this._docAccount);
  }

  getLEXSD013() {
    const LEXSD013 = this._docAccount.filter(d => d.documentTemplateId === DOC_TEMPLATE.LEXSD013);
    const LEXSD013accounts = LEXSD013.map(d => d.commitmentAccounts).flat();
    const accountsObject: { [key: string]: boolean } = {};
    LEXSD013accounts.forEach(a => {
      if (a) accountsObject[a] = true;
    });
    const LEXSD013accountsNoDuplicate = Object.keys(accountsObject);
    return LEXSD013accountsNoDuplicate;
  }

  getDocumentAccountRequest(): DisplayDocument[] {
    let documents: DisplayDocument[] = [];
    const multiDocTemplateIds = [DOC_TEMPLATE.LEXSD013, DOC_TEMPLATE.LEXSD015, DOC_TEMPLATE.LEXSD016];
    const accDocument = this._docAccount
      .map(doc => ({
        ...doc,
      }))
      .filter(
        doc =>
          // for multi documents, only include the ones with imageIds, so they do not duplicate with the dummies
          (this._taskReciept.includes(this.taskCode) || this._taskSubmit.includes(this.taskCode)
            ? true
            : doc.updateFlag) && (multiDocTemplateIds.includes(doc.documentTemplateId!) ? doc.imageId : true)
      );
    documents = [...accDocument];
    this.contracts.contracts!.forEach(c => {
      // there shouldn't be any imageId in dummyDocument no matter what case
      if (
        c.dummyDocument &&
        !c.dummyDocument.imageId &&
        c.dummyDocument.imageId !== undefined &&
        c.dummyDocument.updateFlag
      ) {
        documents.push(c.dummyDocument);
      }
    });
    return documents;
  }

  isComplete(): boolean {
    const commitmentAccounts = this._customer?.accountInfo?.commitmentAccounts?.map(m => m?.accountNumber || '');
    const usedAllAccounts =
      commitmentAccounts?.every((s: string) => this?.usedCommitmentAccounts?.includes(s)) || false;
    const LEXSD013accountsNoDuplicate = this.getLEXSD013();
    const LEXSD013UsedAllAccounts =
      commitmentAccounts?.every((s: string) => LEXSD013accountsNoDuplicate?.includes(s)) || false;
    return usedAllAccounts && LEXSD013UsedAllAccounts;
  }

  removeUpdateFlagsAndDeletedDocuments() {
    this._docAccount = this._docAccount
      .filter(d => d.updateFlag !== this.UpdateFlagEnum.D)
      .map(d => ({
        ...d,
        updateFlag: undefined,
      }));
    // clear dummies
    this.contracts.contracts?.forEach(c => {
      c.dummyDocument = undefined;
    });
  }

  /////////
  // UTILS //
  /////////

  getAccountWithoutDocForNotice() {
    let commitmentAccounts = this._customer.accountInfo?.commitmentAccounts || [];
    const accounts: any[] = [];
    for (let index = 0; index < commitmentAccounts.length; index++) {
      const acc = commitmentAccounts[index];
      if (!this.usedCommitmentAccounts.includes(acc.accountNumber!))
        accounts.push({
          accountNumber: acc.accountNumber,
          product: this.getAccountTypeName(acc.accountType),
          accountName: acc.accountName,
        });
    }

    return accounts;
  }

  getAccountTypeName(accountType: any): string {
    return this.ACCOUNT_TYPE_NAME_MAP[accountType];
  }

  clearData() {
    this._docAccount = [];
    this._usedCommitmentAccounts = [];
    this._initAccountDocuments = [];
    this._accounts = [];
    this._accountsMap = {};
    this._accountsSet = this._baseDataAccount;
    this._contracts = this._baseDataContract;
    this._other = this._baseDataOther;
    this._remainingCommitmentCount = 0;
    this._remainingCommitmentList = [];
    this._accountDocumentReadyForLitigation = false;
    this._accountDocumentReadyForNotice = false;
  }

  /////////
  // CONSTANTS //
  /////////

  ACCOUNT_TYPE_NAME_MAP: { [key: string]: string } = {
    OD: 'O/D',
    PN: 'P/N',
    FCS: 'Factoring',
    TL: 'T/L',
    HOME_FOR_CASH: 'Home for Cash',
    HOME_LOAN: 'Home Loan',
    PERSONAL_LOAN: 'Personal Loan',
    SUNDRY_LG: 'Sundry L/G',
    SUNDRY_AVAL: 'Sundry Aval',
    SUNDRY_ACCEPTANCE: 'Sundry Acceptance',
    SUNDRY_FOREIGN_EXCHANGE: 'Sundry Foreign Exchange',
    SUNDRY_INSURANCE: 'Sundry Insurance',
    SUNDRY_OTHER: 'Sundry Other',
    SUNDRY_TCG: 'Sundry TCG',
    LBD: 'LBD',
    FLEET_CARD: 'Fleet Card',
    TFS: 'TFS',
    THANAWAT: 'Thanawat',
    OTHER: 'Other',
  };

  NO_BILL_TYPES: string[] = ['OD', 'HOME_LOAN', 'HOME_FOR_CASH', 'PERSONAL_LOAN', 'FLEET_CARD', 'TL'];

  ACCOUNT_TYPE_ORDER: { [key: string]: number } = {
    OD: 0,
    PN: 1,
    FCS: 2,
    TL: 3,
    HOME_LOAN: 4,
    PERSONAL_LOAN: 5,
    SUNDRY_LG: 6,
    SUNDRY_AVAL: 7,
    SUNDRY_ACCEPTANCE: 8,
    LBD: 9,
    FLEET_CARD: 10,
    TFS: 11,
    THANAWAT: 12,
    OTHER: 13,
  };

  // Data preparation
  initAccountDropdownOptions(quantity: number) {
    const options = [];
    for (let i = 0; i < quantity; i++) {
      options.push({
        text: 'รายการ ' + (i + 1),
        value: i,
      });
    }
    return options;
  }
}
