import { Injectable } from '@angular/core';
import { CustomerService } from '@app/modules/customer/customer.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { SeizurePropertyService } from '@app/modules/seizure-property/seizure-property.service';
import { TaskService } from '@app/modules/task/services/task.service';
import {
  BlobType,
  CollateralTypes,
  DocumentsDto,
  FileType,
  FileTypeMapper,
  ITooltip,
  Mode,
  Persons,
  RelationTypes,
  taskCode,
} from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  DimsControllerService,
  DocumentControllerService,
  DocumentDto,
  DocumentInfoRequest,
  DocumentRequest,
  DocumentTemplateDto,
  DocumentUploadResponse,
  PageOfDocumentAuditLogDto,
  PersonDto,
  PersonInfo,
  RejectedDocumentInfo,
  RejectedReasonDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import saveAs from 'file-saver';
import { lastValueFrom } from 'rxjs';
import { DocumentAccountService } from './document-account.service';
import { ReadyStatus } from './interface/copyColumnDisplayOption';
import { Contract, DisplayDocument, LCS_DOC, initCollateral, initPerson } from './interface/document';
import { RejectOriginalCopyDialogComponent } from './reject-original-copy-dialog/reject-original-copy-dialog.component';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  RelationEnum = PersonDto.RelationEnum;
  ObjectTypeEnum = DocumentDto.ObjectTypeEnum;
  DocGroupEnum = DocumentTemplateDto.DocumentGroupEnum;
  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;

  private _docPerson!: Array<RelationTypes>;
  private _docCol!: Array<CollateralTypes>;
  private _docLitigation!: Array<DocumentDto>;
  // object _customer can be CustomerDetailDto or LitigationDetailDto depends on navigation route
  private _customer: any;
  private _uploadedFiles: any = {};
  private _hasEdit: boolean = false;
  templatePrimary = [DOC_TEMPLATE.LEXSD002_1, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD001];
  _taskReciept = ['RECEIPT_ORIGINAL_DOCUMENT', 'RECEIPT_REJECT_ORIGINAL_DOCUMENT'];
  _taskSubmit = ['SUBMIT_ORIGINAL_DOCUMENT', 'SUBMIT_REJECT_ORIGINAL_DOCUMENT'];

  _status: ReadyStatus = {
    activeNotice: 0,
    activeLitigation: 0,
    totalNotice: 0,
    totalLitigation: 0,
    activeReceived: 0,
    totalReceived: 0,
    activeSent: 0,
    totalSent: 0,
  };
  get uploadedFiles() {
    return this._uploadedFiles;
  }
  set uploadedFiles(files: any) {
    this._uploadedFiles = files;
  }

  set currentDocPerson(person) {
    this._docPerson = person;
  }

  get currentDocPerson(): Array<RelationTypes> {
    return this._docPerson;
  }
  set currentDocCol(col) {
    this._docCol = col;
  }

  get currentDocCol(): Array<CollateralTypes> {
    return this._docCol;
  }
  set currentDocLitigation(lg) {
    this._docLitigation = lg;
  }

  get currentDocLitigation(): Array<DocumentDto> {
    return this._docLitigation;
  }

  public set customer(value: any) {
    this._customer = value;
  }

  get customer(): any {
    return this._customer;
  }
  get status(): ReadyStatus {
    return this._status;
  }

  get hasEdit(): boolean {
    return this._hasEdit;
  }

  set hasEdit(value) {
    this._hasEdit = value;
  }

  get taskCode(): taskCode {
    return this.taskService.taskDetail.taskCode as taskCode;
  }

  private _pageOfDocumentAuditLog!: PageOfDocumentAuditLogDto;
  public get pageOfDocumentAuditLog(): PageOfDocumentAuditLogDto {
    return this._pageOfDocumentAuditLog;
  }
  public set pageOfDocumentAuditLog(value: PageOfDocumentAuditLogDto) {
    this._pageOfDocumentAuditLog = value;
  }

  public R2_TaskCode = [taskCode.R2E05_01_2D, taskCode.R2E05_02_3C, taskCode.R2E05_03_3D, taskCode.R2E05_06_3F];
  private _rejectedExceedDocuments!: RejectedDocumentInfo[];
  get rejectedExceedDocuments(): RejectedDocumentInfo[] {
    return this._rejectedExceedDocuments;
  }
  set rejectedExceedDocuments(value) {
    this._rejectedExceedDocuments = value;
  }

  constructor(
    private documentControllerService: DocumentControllerService,
    private errorHandlingService: ErrorHandlingService,
    private translate: TranslateService,
    private dimsControllerService: DimsControllerService,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private documentAccountService: DocumentAccountService,
    private taskService: TaskService,
    private sessionService: SessionService,
    private lawsuitService: LawsuitService,
    private seizurePropertyService: SeizurePropertyService
  ) {}

  getDocumentCollateral(isRequiredActive?: boolean) {
    let contracts: any = this._customer?.collateralInfo?.contracts;
    let docContract =
      this._customer?.documentInfo?.customerDocuments.filter((f: any) => f.objectType == 'CONTRACT') || [];
    let initObj: Array<CollateralTypes> = Utils.deepClone(initCollateral);
    let conDoc = [];

    for (let index = 0; index < docContract.length; index++) {
      let contractDoc = contracts?.find((f: any) => f.contractId == docContract[index].objectId);

      if (contractDoc) {
        docContract[index].readyForLitigation = !!(docContract![index].imageId && docContract![index].hasOriginalCopy);
        docContract[index].readyForNotice = !!docContract![index].imageId;
        docContract[index] = {
          ...contractDoc,
          ...this.documentAccountService.getTooltipMsg(docContract[index]),
          ...docContract[index],
          collToolTip: this.getToolTip(contractDoc?.collaterals || '', 'Coll no.'),
          contactTooltip: this.getToolTip(contractDoc?.contractTypes || '', 'ประเภทหลักประกัน'),
          accTooltip: this.getToolTip(contractDoc?.accounts),
        };
        let masterId = docContract[index].masterContractId;
        let subContract = contracts.some((f: any) => f.contractId === masterId);
        docContract[index].isSubContact = subContract;
        conDoc.push(docContract[index]);
      }
    }

    let contractsSort = conDoc?.sort((a: any, b: any) => {
      return (
        a.documentTemplate.documentTemplateId.localeCompare(b.documentTemplate.documentTemplateId) ||
        a.pledgeSeq - b.pledgeSeq
      );
    });
    initObj[0].contracts = isRequiredActive ? contractsSort.filter(f => f?.active) : contractsSort;
    let contractReady = this.checkReadyFor(initObj[0].contracts);
    initObj[0] = {
      ...initObj[0],
      ...contractReady,
    };
    let collaterals: any = this.uniqCollateralId(this._customer?.collateralInfo?.collaterals) || [];
    for (let index = 0; index < collaterals?.length; index++) {
      let colDoc: any = this._customer.documentInfo?.customerDocuments?.find(
        (f: any) => f.objectId == collaterals![index].collateralId && f.objectType == this.ObjectTypeEnum.Collateral
      ) as DocumentDto;

      if (colDoc) {
        let obj: any = {
          ...colDoc,
          ...collaterals![index],
          readyForLitigation: !!(colDoc.imageId && colDoc.hasOriginalCopy),
          readyForNotice: !!colDoc.imageId,
          ...this.documentAccountService.getTooltipMsg(colDoc),
        };
        obj.collToolTip = this.getToolTip(obj?.collaterals || '', 'Coll no.');
        obj.contactTooltip = this.getToolTip(obj?.contractTypes || '', 'ประเภทหลักประกัน');
        obj.accTooltip = this.getToolTip(obj?.accounts);
        initObj[1].collaterals.push(obj);
      }
    }

    if (isRequiredActive) {
      initObj[1].collaterals = initObj[1].collaterals.filter((f: any) => f?.active);
    }
    let colReady = this.checkReadyFor(initObj[1].collaterals);
    initObj[1] = {
      ...initObj[1],
      ...colReady,
    };

    let group = [
      this.DocGroupEnum.CollateralTcgSundry,
      this.DocGroupEnum.CollateralInsSundry,
      this.DocGroupEnum.CollateralInsPolicy,
      this.DocGroupEnum.CollateralOther,
    ];

    let otherDoc = this._customer?.documentInfo?.customerDocuments
      ?.filter((f: any) => {
        return group.includes(f?.documentTemplate?.documentGroup);
      })
      .map((m: any) => {
        return {
          ...m,
          readyForLitigation: !!(m.imageId && m.hasOriginalCopy),
          readyForNotice: !!m.imageId,
          ...this.documentAccountService.getTooltipMsg(m),
        };
      }) as Array<DocumentsDto>;

    initObj[2].documents = isRequiredActive ? otherDoc.filter((f: any) => f?.active) : otherDoc;
    let otherReady = this.checkReadyFor(initObj[2].documents);
    initObj[2] = {
      ...initObj[2],
      ...otherReady,
    };
    return initObj;
  }

  uniqCollateralId(a: any) {
    return (
      a &&
      a
        .sort(
          (a: any, b: any) =>
            a.collateralTypeCode - b.collateralTypeCode || a.collateralSubTypeCode - b.collateralSubTypeCode
        )
        .filter(function (item: any, pos: any, ary: any) {
          return !pos || item.collateralId != ary[pos - 1]?.collateralId;
        })
    );
  }

  getToolTip(content: any = [], title = this.translate.instant('CUSTOMER.TOOLTIP.TITLE_ACCOUNT_NO')): Array<ITooltip> {
    if (content && content.length > 0) {
      return content.map((item: any, index: any) => {
        if (index !== 0) {
          return { content: item };
        } else {
          return {
            title: title,
            content: item,
          };
        }
      });
    } else
      return [
        {
          title: title,
        },
      ];
  }

  checkReadyFor(list: Array<any>) {
    let ret: any = {
      readyForLitigation: list && list.length === 0,
      readyForNotice: list && list.length === 0,
      readyForDoc: list && list.length === 0,
      readyForAsset: list && list.length === 0,
      forLitigation: false,
      forNoticeLetter: false,
      forDoc: false,
      forAsset: false,
    };
    if (list && list.length > 0) {
      ret.readyForLitigation = list
        .filter(f => f.documentTemplate?.forLitigation && f?.active)
        .every((e: any) => (e.documentTemplate?.needHardCopy ? e.hasOriginalCopy && e.imageId : true));
      ret.readyForNotice = list
        .filter(f => f?.documentTemplate?.forNoticeLetter && f?.active)
        .every((e: any) => e.imageId);
      ret.readyForDoc = list
        .filter(f => f?.active && f?.imageId)
        .every((e: any) => {
          if (e.documents && e.documents.length > 1) {
            return e.documents.every(
              (ss: any) =>
                (ss?.documentTemplate?.needHardCopy && (ss?.sent || ss.received)) ||
                ss?.documentTemplate?.needHardCopy === false
            );
          } else {
            return (
              (e?.documentTemplate?.needHardCopy && (e?.sent || e.received)) ||
              e?.documentTemplate?.needHardCopy === false
            );
          }
        });
      ret.forLitigation = list && list.some((s: any) => s.documentTemplate?.forLitigation);
      ret.forNoticeLetter = list && list.some((s: any) => s.documentTemplate?.forNoticeLetter);
      if (this._taskSubmit.includes(this.taskCode)) {
        ret.readyForDoc =
          list && list.filter(f => f?.active).every((s: any) => s.sent || s.hardCopyState === 'SUCCESS');
      }
      if (this._taskReciept.includes(this.taskCode)) {
        ret.readyForDoc =
          list && list.filter(f => f?.active).every((s: any) => s.received || s.hardCopyState === 'SUCCESS');
      }
      if (
        this.R2_TaskCode.includes(this.taskCode) ||
        this.seizurePropertyService.mode === 'VIEW' ||
        this.seizurePropertyService.mode === 'EDIT'
      ) {
        // fix value
        ret.forAsset = true;
        ret.readyForAsset = list && list.every((s: any) => s.imageId);
      }
    }

    return ret;
  }

  clearUploadedFiles() {
    this._uploadedFiles = {};
  }

  clearData() {
    this._status = {
      activeNotice: 0,
      activeLitigation: 0,
      totalNotice: 0,
      totalLitigation: 0,
      totalReceived: 0,
      totalSent: 0,
      activeSent: 0,
      activeReceived: 0,
    };
    this._docPerson = [];
    this._docCol = [];
    this.documentAccountService.clearData();
    this._hasEdit = false;
    this._customer = {};
    this._uploadedFiles = {};
  }

  getDocmentLitigation(): Array<DocumentDto> {
    return this._customer?.documentInfo?.litigationDocuments || [];
  }

  getDocumentPerson(isRequiredActive?: boolean) {
    let initObj: Array<RelationTypes> = Utils.deepClone(initPerson);
    // object _customer can be CustomerDetailDto or LitigationDetailDto depends on navigation route
    const _personInfo: PersonInfo = this._customer.personInfo || {};

    let persons: PersonDto[] = _personInfo.persons || [];
    let additionalPersons: PersonDto[] = _personInfo.additionalPersons || [];
    let listPersons: any = persons?.concat(additionalPersons);
    let listLCS = listPersons.filter(
      (f: any) => f.relation === this.RelationEnum.CoBorrower && f.allRelations?.includes(this.RelationEnum.Guarantor)
    );
    let newPerson = [];
    for (let index = 0; index < listLCS.length; index++) {
      const li = listLCS[index];
      let object1 = {};
      if (li.allRelations?.includes(this.RelationEnum.CollateralOwner)) {
        object1 = {
          ...li,
          isDup: true,
          relation: this.RelationEnum.CollateralOwner,
        };
        newPerson.push(object1);
      }
      object1 = {
        ...li,
        isDup: true,
        relation: this.RelationEnum.Guarantor,
      };
      newPerson.push(object1);
    }
    let listOnlyCol = listPersons?.filter(
      (f: any) =>
        f.relation === this.RelationEnum.CoBorrower &&
        f.allRelations?.includes(this.RelationEnum.CollateralOwner) &&
        !f.allRelations?.includes(this.RelationEnum.Guarantor)
    );
    for (let index = 0; index < listOnlyCol.length; index++) {
      const ji = listOnlyCol[index];
      let object2 = { ...ji, isDup: true, relation: this.RelationEnum.CollateralOwner };
      newPerson.push(object2);
    }
    let listOnlyG = listPersons?.filter(
      (f: any) =>
        f.relation === this.RelationEnum.Guarantor && f.allRelations?.includes(this.RelationEnum.CollateralOwner)
    );
    for (let index = 0; index < listOnlyG.length; index++) {
      const gi = listOnlyG[index];
      let object3 = { ...gi, isDup: true, relation: this.RelationEnum.CollateralOwner };
      newPerson.push(object3);
    }
    listPersons = listPersons.concat(newPerson);
    for (let index = 0; index < initObj.length; index++) {
      const obj = initObj[index];
      let relation = '';
      if (index == 0) {
        relation = this.RelationEnum.MainBorrower;
      } else if (index == 1) {
        relation = this.RelationEnum.CoBorrower;
      } else if (index == 2) {
        relation = this.RelationEnum.Guarantor;
      } else if (index == 3) {
        relation = this.RelationEnum.CollateralOwner;
      }
      let person = this.setPerson(relation, listPersons, obj.relationDesc, isRequiredActive);
      if (index == 0) {
        initObj[0].persons.push(person[0]);
      } else {
        initObj[index].persons = person;
      }
    }

    for (let index = 0; index < initObj.length; index++) {
      const readylgP = initObj[index].persons.every((e: Persons) => e?.readyForLitigation);
      const readyntP = initObj[index].persons.every((e: Persons) => e?.readyForNotice);
      const readyDocP = initObj[index].persons.every((e: Persons) => e?.readyForDoc);
      const forlgP = initObj[index].persons.some((e: Persons) => e?.forLitigation);
      const forntP = initObj[index].persons.some((e: Persons) => e?.forNoticeLetter);
      initObj[index].readyForLitigation = readylgP;
      initObj[index].readyForNotice = readyntP;
      initObj[index].forLitigation = forlgP;
      initObj[index].forNoticeLetter = forntP;
      initObj[index].readyForDoc = readyDocP;
      if (
        this.R2_TaskCode.includes(this.taskCode) ||
        this.seizurePropertyService.mode === 'VIEW' ||
        this.seizurePropertyService.mode === 'EDIT'
      ) {
        // fix value
        initObj[index].forAsset = true;
        initObj[index].readyForAsset = initObj[index].persons.every((e: Persons) => e?.readyForAsset);
      }
    }

    return initObj;
  }

  setPerson(relationEnum?: string, lists?: any, subRelationDesc?: any, isRequiredActive?: boolean) {
    let persons: any = [];
    let guarantor = lists?.filter((f: any) => f.relation === relationEnum);

    for (let index = 0; index < guarantor.length; index++) {
      const co = guarantor![index];
      const doc = this.getDocumentList(co.personId, 'PERSON');

      const groupedDocs = this.groupBy(doc, 'documentTemplateId');
      let list = Object.keys(groupedDocs).map(key => {
        let disableCheckbox = false;
        let attribute = groupedDocs[key][0]?.documentTemplate?.attribute;
        if (groupedDocs[key][0]?.documentTemplate?.attribute?.length > 0) {
          disableCheckbox = attribute?.find((f: any) => f?.name === 'disableCheckBox')?.value === 'Y';
        }
        let readyforAsset =
          this.R2_TaskCode.includes(this.taskCode) ||
          this.seizurePropertyService.mode === 'VIEW' ||
          this.seizurePropertyService.mode === 'EDIT';
        return {
          documentTemplateId: key,
          documentName: groupedDocs[key][0].documentName,
          readyForNotice: !!groupedDocs[key][0].imageId,
          readyForDoc: groupedDocs[key][0].hardCopyState === 'SUCCESS',
          readyForAsset: readyforAsset && !!groupedDocs[key][0].imageId,
          forAsset: readyforAsset,
          documents: groupedDocs[key],
          forLitigation: !!groupedDocs[key][0].documentTemplate?.forLitigation,
          forNoticeLetter: !!groupedDocs[key][0].documentTemplate?.forNoticeLetter,
          expanded: false,
          disableCheckbox: disableCheckbox,
          ...groupedDocs[key][0],
          readyForLitigation: groupedDocs[key][0]?.documentTemplate?.needHardCopy
            ? !!groupedDocs[key][0].imageId && !!groupedDocs[key][0].hasOriginalCopy
            : true,
          ...this.documentAccountService.getTooltipMsg(groupedDocs[key][0]),
        };
      });

      if (isRequiredActive) {
        list = list.filter(f => f.active);
      }
      if (co.relation == this.RelationEnum.CoBorrower) {
        if (co.allRelations?.includes('GUARANTOR')) {
          list = list.filter(f => f?.documentTemplate?.documentGroup !== 'PERSON_LCS');
        }
        if (co.isDup) {
          list = list.filter(f => f?.documentTemplate?.documentGroup === 'PERSON_LCS');
        }
      }
      if (co.relation == this.RelationEnum.CollateralOwner) {
        if (co.isDup) list = [];
      }
      if (co.relation == this.RelationEnum.Guarantor) {
        if (co.isDup) {
          list = list.filter(f => f?.documentTemplate?.documentGroup === 'PERSON_LCS');
          if (list.length == 0) list = LCS_DOC;
          if (list.length == 1)
            list = list.concat(LCS_DOC.filter(f => list.some(s => s.documentTemplateId !== f.documentTemplateId)));
        }
      }

      if (doc?.length > 0) {
        let forLN = this.checkReadyFor(doc);
        let readyForAsset = false;
        if (
          this.R2_TaskCode.includes(this.taskCode) ||
          this.seizurePropertyService.mode === 'VIEW' ||
          this.seizurePropertyService.mode === 'EDIT'
        ) {
          // fix value
          readyForAsset = true;
        }
        persons.push({
          personId: co.personId || '',
          name: co.name,
          subRelationDesc: subRelationDesc + (index + 1),
          readyForLitigation: forLN.readyForLitigation,
          readyForNotice: forLN.readyForNotice,
          readyForDoc: forLN.readyForDoc,
          readyForAsset: forLN.readyForAsset,
          forAsset: readyForAsset,
          forLitigation: forLN.forLitigation,
          forNoticeLetter: forLN.forNoticeLetter,
          identificationNo: co.identificationNo,
          document: list,
          documentNumber: 0,
          expanded: relationEnum === this.RelationEnum.MainBorrower,
          headers: [
            {
              name: 'CIF No.',
              value: `${co?.personId} ${co?.name || ''}`,
            },
            {
              name: 'เลขประจำตัวประชาชน/เลขประจำตัวผู้เสียภาษีอากร',
              value: `${co.identificationNo || '-'}`,
            },
          ],
        });
      }
    }

    return persons;
  }

  getDocumentList(personId?: string, type?: string): any {
    return (
      this._customer?.documentInfo?.customerDocuments?.filter(
        (f: any) => f.objectId == personId && f.objectType == type
      ) || []
    );
  }

  async getDocument(imageId: string, imageSource: any) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.documentControllerService.getDocument(imageId, imageSource))
    );
  }

  async searchDocuments(customerId: any, documentTemplateId: string, objectId: string, objectType: any) {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.documentControllerService.searchDocuments(customerId, documentTemplateId, objectId, objectType)
        ),
      {
        snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CANNOT_SELECT_DOC'),
      }
    );
  }

  validateFileType(file: File) {
    const arr = file.name.split('.');
    const suffix: string = arr[arr.length - 1].toLocaleLowerCase();
    if (suffix === 'jfif' || suffix === 'jfi') {
      const blob = file.slice(0, file.size, 'image/jpg');
      const result = new File([blob], file.name.replace(suffix, 'jpg'), { type: file.type });
      return result;
    } else {
      return file;
    }
  }

  async uploadDocument(cif: string, documentTemplateId: string, file: Blob, litigationId?: string) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.documentControllerService.uploadDocument(cif, documentTemplateId, file, litigationId)),
      {
        snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CANNOT_SELECT_DOC'),
      }
    );
  }

  async getDimsDocument(imageId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.dimsControllerService.getDimsDocument(imageId))
    );
  }

  updateDocumentPerson(obj: any) {
    for (let index = 0; index < this._docPerson.length; index++) {
      const person = this._docPerson[index];
      for (let i = 0; i < person.persons.length; i++) {
        let docI = person.persons[i]?.document?.findIndex(g => g.documentId === obj.documentId);
        if (docI > -1) {
          this._docPerson[index].persons[i].document[docI] = {
            ...this._docPerson[index].persons[i].document[docI],
            ...obj,
          };
          //update sub person
          const docs = person.persons[i]?.document[docI]?.documents;
          let docsI = docs?.findIndex((k: any) => k.documentId === obj.subDocumentId);
          if (docsI > -1) {
            this._docPerson[index].persons[i].document[docI].documents[docsI] = {
              ...docs[docsI],
              ...obj,
            };
          }
        }
        let ready = this.checkReadyFor(person.persons[i].document);
        this._docPerson[index].persons[i].readyForLitigation = ready.readyForLitigation;
        this._docPerson[index].persons[i].readyForNotice = ready.readyForNotice;
      }
      const readylg = person.persons.every(e => e.readyForLitigation);
      const readynt = person.persons.every(e => e.readyForNotice);

      this._docPerson[index].readyForLitigation = readylg;
      this._docPerson[index].readyForNotice = readynt;
    }
    this.checkDocumentIsReady();
  }

  updateSubCollateral(index: number, obj: any, field: 'contracts' | 'collaterals' | 'documents') {
    const list = this._docCol[index][field] as Array<CollateralTypes>;
    let idx = list.findIndex((j: any) => j?.documentId === obj.documentId);
    if (idx > -1) {
      this._docCol[index][field][idx] = {
        ...this._docCol[index][field][idx],
        ...obj,
      };
      let rdy = this.checkReadyFor(list);
      this._docCol[index].readyForLitigation = rdy.readyForLitigation;
      this._docCol[index].readyForNotice = rdy.readyForNotice;
    }
  }

  updateDocumentCollateral(obj: any) {
    for (let index = 0; index < this._docCol.length; index++) {
      switch (index) {
        case 0:
          this.updateSubCollateral(index, obj, 'contracts');
          break;
        case 1:
          this.updateSubCollateral(index, obj, 'collaterals');
          break;
        case 2:
          this.updateSubCollateral(index, obj, 'documents');
          break;
        default:
          break;
      }
    }

    this.checkDocumentIsReady();
  }

  openPdf(data: any, imageName: string = '') {
    let type = data['type'] || '';
    if (type === BlobType.OCTET_STREAM) {
      type = BlobType.PDF;
    }
    const file = new Blob([data], { type: type });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  downloadDocument(data: any, filename?: string) {
    const type = data['type'] || '';
    const _fileType: FileType | string = FileTypeMapper.get(type) || '';
    Utils.saveAsStrToBlobFile(data, filename ? filename : 'หนังสือสั่งการ' + _fileType, _fileType);
  }

  downloadDocumentFromByteArray(response: any, filename: string, fileType: FileType) {
    // Convert the response body (byte array) into a Blob
    const byteArray = atob(response.fileContent.body);
    const byteNumbers = new Array(byteArray.length);
    for (let i = 0; i < byteArray.length; i++) {
      byteNumbers[i] = byteArray.charCodeAt(i);
    }
    const byteArrayUint8Array = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArrayUint8Array], { type: response.fileContent.headers['Content-Type'][0] });
    // Download the Blob
    saveAs(blob, filename + fileType);
  }

  updateStatusOnActiveCheck(document: DisplayDocument, active: boolean) {
    let forLitigation = document.documentTemplate?.forLitigation || false;
    let forNotice = document.documentTemplate?.forNoticeLetter || false;
    if (active) {
      if (forLitigation) {
        this._status.totalLitigation++;
        if (document.imageId && document.hasOriginalCopy === true) this._status.activeLitigation++;
      }
      if (forNotice) {
        this._status.totalNotice++;
        if (document.imageId) this._status.activeNotice++;
      }
    } else {
      if (forLitigation) {
        this._status.totalLitigation--;
        if (document.imageId && document.hasOriginalCopy === true) this._status.activeLitigation--;
      }
      if (forNotice) {
        this._status.totalNotice--;
        if (document.imageId) this._status.activeNotice--;
      }
    }
  }

  updateStatusOnActiveCheckContract(contract: Contract, value: boolean) {
    if (contract.documents.length === 0) {
      if (value) {
        this._status.totalNotice++;
        this._status.totalLitigation++;
      } else {
        this._status.totalNotice--;
        this._status.totalLitigation--;
      }
    }
  }

  updateStatusOnRadioChange(document: DisplayDocument, value: boolean, mode?: string) {
    if (mode !== Mode.VIEW_PENDING_APPROVE && mode !== Mode.VIEW_PENDING) {
      if (value === false && document.imageId && document.hasOriginalCopy) {
        this._status.activeLitigation--;
      } else if (value === true && document.imageId) {
        this._status.activeLitigation++;
      }
    } else {
      if (value === false && document?.active && document?.imageId) {
        if (this._taskSubmit.includes(this.taskCode)) {
          this._status.activeSent--;
        }
        if (this._taskReciept.includes(this.taskCode)) {
          this._status.activeReceived--;
        }
      } else if (value === true && document?.active && document?.imageId) {
        if (this._taskSubmit.includes(this.taskCode)) {
          this._status.activeSent++;
        }
        if (this._taskReciept.includes(this.taskCode)) {
          this._status.activeReceived++;
        }
      }
      document.rejectReason = value;
    }
  }

  countStatus(doc: any) {
    if (doc?.active) {
      if (doc?.documentTemplate?.forLitigation) this._status.totalLitigation++;
      if (doc?.documentTemplate?.forLitigation && doc?.readyForLitigation) this._status.activeLitigation++;
      if (doc?.documentTemplate?.forNoticeLetter) this._status.totalNotice++;
      if (doc?.documentTemplate?.forNoticeLetter && doc?.readyForNotice) this._status.activeNotice++;
      if (doc.imageId) this._status.totalSent++;
      this._status.totalReceived++;
      if (
        (doc.imageId &&
          this.taskCode === 'SUBMIT_ORIGINAL_DOCUMENT' &&
          (doc.hardCopyState === 'SUCCESS' || doc.sent)) ||
        (this.taskCode === 'SUBMIT_REJECT_ORIGINAL_DOCUMENT' && (doc.hardCopyState === 'SUCCESS' || doc.sent))
      )
        this._status.activeSent++;
      if (
        (doc.imageId &&
          this.taskCode === 'RECEIPT_ORIGINAL_DOCUMENT' &&
          (doc.hardCopyState === 'SUCCESS' || doc.received)) ||
        ((this.taskCode === 'RECEIPT_REJECT_ORIGINAL_DOCUMENT' ||
          this.taskCode === 'SUBMIT_REJECT_ORIGINAL_DOCUMENT') &&
          (doc.hardCopyState === 'SUCCESS' || doc.received))
      )
        this._status.activeReceived++;
    }
  }

  checkDocumentIsReady() {
    let colDoc = this._docCol;
    let personDoc = this._docPerson;
    this._status = {
      activeNotice: 0,
      activeLitigation: 0,
      totalNotice: 0,
      totalLitigation: 0,
      activeSent: 0,
      activeReceived: 0,
      totalSent: 0,
      totalReceived: 0,
    };

    for (let i = 0; i < colDoc?.length; i++) {
      const cc = colDoc[i];
      switch (i) {
        case 0:
          for (let j = 0; j < cc?.contracts?.length; j++) {
            const contract = cc?.contracts[j];
            this.countStatus(contract);
          }
          break;
        case 1:
          for (let k = 0; k < cc?.collaterals?.length; k++) {
            const s = cc?.collaterals[k];
            this.countStatus(s);
          }
          break;
        case 2:
          for (let index = 0; index < cc?.documents?.length; index++) {
            const dd = cc?.documents[index];
            this.countStatus(dd);
          }
          break;
        default:
          break;
      }
    }

    for (let inx = 0; inx < personDoc?.length; inx++) {
      const per = personDoc[inx];
      for (let a = 0; a < per.persons.length; a++) {
        const p = per.persons[a];
        for (let b = 0; b < p?.document.length; b++) {
          const ss = p?.document[b];
          if (ss?.documents.length === 1) {
            this.countStatus(ss);
          } else {
            for (let e = 0; e < ss?.documents.length; e++) {
              const levelLast = ss?.documents[e];
              this.countStatus(levelLast);
            }
          }
        }
      }
    }

    // account
    const accountStatusCheck = this.documentAccountService.getReadyStatus();
    this._status.totalNotice = this._status.totalNotice + accountStatusCheck.totalNotice;
    this._status.activeNotice = this._status.activeNotice + accountStatusCheck.activeNotice;
    this._status.totalLitigation = this._status.totalLitigation + accountStatusCheck.totalLitigation;
    this._status.activeLitigation = this._status.activeLitigation + accountStatusCheck.activeLitigation;
    this._status.totalReceived = this._status.totalReceived + accountStatusCheck.totalReceived;
    this._status.activeReceived = this._status.activeReceived + accountStatusCheck.activeReceived;
    this._status.totalSent = this._status.totalSent + accountStatusCheck.totalSent;
    this._status.activeSent = this._status.activeSent + accountStatusCheck.activeSent;
  }

  filterDocNoMap(docList: Array<any>) {
    return docList.filter((f: any) => f?.updateFlag || f?.active || f?.sent || f?.received || f?.receiveDate != null);
  }

  groupBy(objArray: Array<any>, property: string) {
    let readyforAsset =
      this.R2_TaskCode.includes(this.taskCode) ||
      this.seizurePropertyService.mode === 'VIEW' ||
      this.seizurePropertyService.mode === 'EDIT';
    return objArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key] && key) acc[key] = [];
      obj = {
        ...obj,
        ...this.documentAccountService.getTooltipMsg(obj),
        readyForLitigation: obj?.documentTemplate?.needHardCopy ? !!obj?.imageId && !!obj?.hasOriginalCopy : true,
        readyForNotice: !!obj.imageId,
        readyForDoc: obj.hardCopyState === 'SUCCESS',
        readyForAsset: readyforAsset && !!obj?.imageId,
      };
      acc[key]?.push(obj);
      return acc;
    }, {});
  }

  getDocumentInfoRequest(closeTaskId?: number) {
    let documentInfoRequest: any = {
      documents: [],
      closeTaskId: [],
      activeUpdateDocument: [],
      sendDocument: [],
      sendDocumentReq: [],
      receiveDocument: [],
      receiveDocumentReq: [],
      activeDocument: [],
    };
    let documents: Array<any> = [];

    let persons = this._docPerson;
    let colls = this._docCol;
    //person
    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];

      for (let j = 0; j < person.persons?.length; j++) {
        if (person && person?.persons[j]) {
          const document = person?.persons[j]?.document;
          const list = this.filterDocNoMap(document);
          documents = documents.concat(list);
          for (let index = 0; index < document?.length; index++) {
            const doc = document[index];
            if (doc?.documents && doc?.documents.length > 1) {
              const list1 = this.filterDocNoMap(doc?.documents);
              documents = documents.concat(list1);
            }
          }
        }
      }
    }

    //coll
    for (let i = 0; i < colls.length; i++) {
      const coll = colls[i];
      switch (i) {
        case 0:
          if (coll.contracts && coll.contracts.length > 0) {
            let docCon = this.filterDocNoMap(coll.contracts);
            documents = documents.concat(docCon);
          }
          break;
        case 1:
          if (coll.collaterals && coll.collaterals.length > 0) {
            let doc1 = this.filterDocNoMap(coll.collaterals);
            documents = documents.concat(doc1);
          }
          break;
        case 2:
          if (coll?.documents && coll.documents.length > 0) {
            let doc = this.filterDocNoMap(coll.documents);
            documents = documents.concat(doc);
          }
          break;
        default:
          break;
      }
    }

    // account
    documents = documents.concat(this.documentAccountService.getDocumentAccountRequest());

    let sendDoc = documents.filter((f: any) => !this.templatePrimary.includes(f.documentTemplateId) && f?.sent);
    // let receiveDoc = documents.filter((f: any) => f?.updateFlag && !this.templatePrimary.includes(f.documentTemplateId) && f?.received && f?.receiveDate != null && !!!f?.hasSave)
    let receiveDoc = documents.filter((f: any) => !this.templatePrimary.includes(f.documentTemplateId));
    // filter unique with documentId
    receiveDoc = receiveDoc.filter(
      ({ documentId }, index) => !receiveDoc.map(({ documentId }) => documentId).includes(documentId, index + 1)
    );

    documentInfoRequest = {
      documents: documents.filter((f: any) => f?.updateFlag), //for upload document req
      closeTaskId: closeTaskId, //for upload document req
      activeUpdateDocument: documents.filter(f => f?.updateFlag && f?.active),
      activeDocument: documents.filter(f => f?.active),
      receiveDocumentReq: receiveDoc.map((m: any) => {
        return {
          received: m.received,
          documentId: m.documentId,
          receiveDate: m.receiveDate,
          rejectedReasonDto: m.rejectedReasonDto,
          dimsTicketBarcode: m.dimsTicketBarcode,
        };
      }),
      receiveDocument: receiveDoc,
      sendDocument: sendDoc,
      sendDocumentReq: sendDoc.map((m: any) => {
        return { sent: m.sent, documentId: m.documentId };
      }),
    };

    return documentInfoRequest;
  }

  // Verify condition that can proceed as 'complete' the task or not (return 'true' if passed condition)
  checkCondition(request: any) {
    let msg = '';
    let hasMandatoryFile = request.activeUpdateDocument?.every(
      (f: any) => !!f?.imageId && f?.hasOriginalCopy !== undefined && f?.active == true
    );

    // verify completeness of Accounts Documents
    const isAccountDocsCompleted = this.documentAccountService.isComplete();
    if (!isAccountDocsCompleted) {
      msg = 'EXCEPTION_CONFIG.MESSAGE_D026';
    }

    if (!hasMandatoryFile) {
      // error code is D020
      msg = 'DOC_PREP.WARNING__DOC_MSG';
    }

    if (!hasMandatoryFile || !isAccountDocsCompleted) {
      // alertDialog will display after call failed
      this.notificationService.alertDialog(
        'DOC_PREP.CANT_FINISH_TASK',
        msg,
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
      return false;
    }
    return true;
  }

  checkConditionReceivesent(taskCodeTxt: string, request: any) {
    let isValid = false;
    let msg = this.translate.instant('DOC_PREP.CANT_FINISH_TASK');
    let documents = request.activeDocument?.filter((f: any) => !this.templatePrimary.includes(f.documentTemplateId));
    if (taskCodeTxt == taskCode.RECEIPT_ORIGINAL_DOCUMENT) {
      isValid = request.activeDocument == 0 ? false : documents.every((f: any) => f?.received !== null);
      msg = 'DOC_PREP.RECIEVE_WARNING_MSG';
    } else if (taskCodeTxt == taskCode.SUBMIT_ORIGINAL_DOCUMENT) {
      isValid = request.activeDocument == 0 ? false : documents.every((f: any) => f?.sent == true);
      msg = 'DOC_PREP.SENT_WARNING_MSG';
    }
    if (!isValid) {
      this.notificationService.alertDialog(
        'DOC_PREP.CANT_FINISH_TASK',
        msg,
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
      return false;
    }
    return true;
  }

  async updateDocumentsCustomer(request: DocumentInfoRequest) {
    const customerDetail = this._customer as any;
    return await this.customerService.updateDocuments(customerDetail?.customerId, request);
  }

  async updateDocumentsLitigation(request: DocumentInfoRequest) {
    const customerDetail = this._customer as any;
    return await this.lawsuitService.updateDocuments(customerDetail?.litigationId, request);
  }

  updateDataAfterSave(documents: any) {
    for (let index = 0; index < documents.length; index++) {
      const element = documents[index];
      element.hasSave = true;
      this.updateDocumentPerson(element);
      this.updateDocumentCollateral(element);
      this.documentAccountService.replaceAccountDocumentById(element);
    }
  }

  async uploadBasicDocument(
    documentTemplateId: string,
    file: Blob,
    objectId?: string
  ): Promise<DocumentUploadResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.documentControllerService.uploadBasicDocument(documentTemplateId, file, objectId)),
      {
        snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CANNOT_SELECT_DOC'),
      }
    );
  }

  async rejectReasons(element: any, titlelb: string, type?: string, btnlb?: string): Promise<RejectedReasonDto | null> {
    const myContext = {
      action: 'REJECT',
      type: type ? type : 'NORMAL',
      mode: element.mode ?? element.mode,
      taskCode: this.taskCode,
      content: {},
    };
    if (element) {
      myContext.content = {
        documentName: element.rejectedDocumentInfo?.documentName,
        pageCount: element.rejectedDocumentInfo?.pageCount,
        rejectedReasonId: element?.rejectedReasonId,
        rejectedDate: element?.rejectedDate,
        rejectedReasonName: element?.rejectedReasonName,
        rejectedRemarks: element?.rejectedRemarks,
      };
    }

    const dialogSetting: DialogOptions = {
      component: RejectOriginalCopyDialogComponent,
      title: titlelb ? titlelb : 'ปฏิเสธรับต้นฉบับเกิน',
      iconName: 'icon-Dismiss-Square',
      rightButtonLabel: btnlb ? btnlb : 'ปฏิเสธรับต้นฉบับ',
      buttonIconName: element?.rejectedRemarks || element?.isSaveButton ? 'icon-save-primary' : 'icon-Dismiss-Square',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonClass: element?.rejectedRemarks || element?.isSaveButton ? 'long-button' : 'long-button mat-warn',
      context: myContext,
    };
    const confirm = (await this.notificationService.showCustomDialog(dialogSetting)) as any;
    if (confirm) {
      let obj: RejectedReasonDto = {
        rejectedDate: new Date().toISOString(),
        rejectedUserId: this.sessionService.currentUser?.userId,
        rejectedReasonName: this.sessionService.currentUser?.name + ' ' + this.sessionService.currentUser?.surname,
        rejectedRemarks: confirm.rejectedRemarks,
        rejectedReasonId: confirm.rejectedReasonId,
        rejectedDocumentInfo: {
          documentName: confirm.documentName,
          pageCount: confirm.pageCount,
        },
      };
      return obj;
    }
    return null;
  }

  async downloadKtbLogisticDoc(litigationId: string) {
    let fileName = 'ใบนำส่งคืนเอกสาร-DIMS';
    const response: any = await this.lawsuitService.downloadKtbLogisticDoc(litigationId);
    if (!response) return;
    /*
    this.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
    */
    this.downloadDocumentFromByteArray(response, fileName, FileType.PDF);
  }
}
