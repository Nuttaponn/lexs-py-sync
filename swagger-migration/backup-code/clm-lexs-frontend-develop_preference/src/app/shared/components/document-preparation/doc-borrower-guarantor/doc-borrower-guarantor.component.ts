import { AfterViewChecked, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { TaskService } from '@app/modules/task/services/task.service';
import { Mode, Persons, RelationTypes } from '@app/shared/models';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto, DocumentRequest, PersonDto, RejectedReasonRequest } from '@lexs/lexs-client';
import { DocSelectionComponent } from '../doc-selection/doc-selection.component';
import { DocumentService } from '../document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Component({
  selector: 'app-doc-borrower-guarantor',
  templateUrl: './doc-borrower-guarantor.component.html',
  styleUrls: ['./doc-borrower-guarantor.component.scss'],
})
export class DocBorrowerGuarantorComponent implements OnInit, AfterViewChecked {
  RelationEnum = PersonDto.RelationEnum;
  ImageSourceEnum = DocumentDto.ImageSourceEnum;
  documentPerson: Array<RelationTypes> = [];
  @Input()
  set _mode(val: any) {
    this.mode = val;
    this.getDisplayedColumns();
    this.countDocumentNumber();
  }

  @Input()
  set hasCancel(val: any) {
    if (val) {
      this.documentPerson = Utils.deepClone(this._documentPerson);
      this.documentService.currentDocPerson = this.documentPerson;
    }
  }

  @Input()
  set receivedAll(val: any) {
    if (val) {
      this.receiveAll();
    }
  }
  @Input()
  set _isSeizureDoc(val: boolean) {
    this.isSeizureDoc = val;
  }
  MODE = Mode;
  mode: string = '';
  @ViewChildren(MatTable) table!: QueryList<any>;
  isDownloaded: boolean = false;
  expandedElement: any = null;
  _documentPerson: Array<RelationTypes> = [];
  public columns: string[] = [];

  headerDetails: any = [];
  currentDate = new Date();

  headerSubDetail: any = [];
  statusCode = '';
  templatePrimary = [DOC_TEMPLATE.LEXSD002_1, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD001];
  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;
  public expandedReason: boolean = false;
  public isSeizureDoc: boolean = false;
  public docTempalte = DOC_TEMPLATE;

  constructor(
    private dialog: MatDialog,
    private documentService: DocumentService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (this.documentService?.currentDocPerson?.length > 0) {
      this.documentPerson = Utils.deepClone(this.documentService.currentDocPerson);
      this._documentPerson = Utils.deepClone(this.documentPerson);
      this.setDocHeader();
    }
    console.log(' this.documentPerson', this.documentPerson);
    this.countDocumentNumber();
  }
  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }
  countDocumentNumber() {
    if (this.mode == Mode.VIEW_PENDING || this.mode === Mode.VIEW_PENDING_APPROVE) {
      for (let index = 0; index < this.documentPerson?.length; index++) {
        let person = this.documentPerson[index]?.persons;
        for (let j = 0; j < person?.length; j++) {
          let docs = this.filterDoc(person[j]?.document);
          if (person[j] && person[j]?.documentNumber > -1) {
            person[j].documentNumber = docs.documentNumber;
            person[j].totalDocuments = docs.totalDocuments;
          }
        }
      }
    }
  }

  getDisplayedColumns() {
    let columnDefinitions = [
      { def: 'id', hide: false },
      { def: 'documentName', hide: false },
      { def: 'storeOrganization', hide: false },
      { def: 'ownOrganization', hide: false },
      { def: 'imageName', hide: false },
      { def: 'hasOriginalCopy', hide: this.mode === Mode.VIEW_PENDING_APPROVE || this.isSeizureDoc },
      { def: 'hasNotOriginalCopy', hide: this.mode !== Mode.EDIT },
      { def: 'sent', hide: this.mode !== Mode.VIEW_PENDING },
      { def: 'received', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'rejectOriginalReceived', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'save', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
    ];

    this.columns = columnDefinitions.filter((cd: any) => !cd.hide).map((cd: any) => cd.def);
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
  }

  setDocHeader() {
    let person = this.documentPerson[0]?.persons[0];
    this.headerDetails = [
      {
        name: 'CIF No.',
        value: !(person?.personId && person?.name) ? '-' : `${person?.personId || ''} ${person?.name || ''}`,
      },
      {
        name: 'เลขประจำตัวประชาชน/เลขประจำตัวผู้เสียภาษีอากร',
        value: `${person?.identificationNo || '-'}`,
      },
    ];
  }

  inputChange(val: any, element: any) {
    if (!val && element.received != true) {
      element.updateFlag = null;
    } else {
      element.receiveDate = val;
      element.updateFlag = this.UpdateFlagEnum.U;
    }
    this.documentService.hasEdit = true;
    this.documentService.currentDocPerson = this.documentPerson;
  }

  expandPanel(item?: any) {
    item.expanded = !item.expanded;
    this.documentService.currentDocPerson = this.documentPerson;
  }
  onCheck(element: any) {
    element.active = !element.active;
    element.updateFlag = this.UpdateFlagEnum.U;
    this.documentService.currentDocPerson = this.documentPerson;
    this.documentService.hasEdit = true;
    this.documentService.checkDocumentIsReady();
  }

  setFlagSent(element: any) {
    if (this.mode === Mode.VIEW_PENDING && element.sent !== true && element.hasOriginalCopy) {
      element.sent = true;
      element.updateFlag = element.sent == false ? null : this.UpdateFlagEnum.U;
    }
    if (
      this.mode === Mode.VIEW_PENDING_APPROVE &&
      element.received !== true &&
      element.hasOriginalCopy &&
      element.sent === true
    ) {
      element.received = true;
      element.updateFlag = element.received == false ? null : this.UpdateFlagEnum.U;
      if (!element.receiveDate && !this.templatePrimary.includes(element?.documentTemplate?.documentTemplateId)) {
        element.receiveDate = new Date();
      }
    }
  }
  checkAll(doc: any, obj: any, index: number) {
    this.documentService.hasEdit = true;
    for (let index = 0; index < doc.document.length; index++) {
      let element = doc.document[index];
      this.setFlagSent(element);
      for (let j = 0; j < element.documents.length; j++) {
        const subE = element.documents[j];
        this.setFlagSent(subE);
      }
    }
    let fDoc = this.filterDoc(doc.document);
    doc.documentNumber = fDoc.documentNumber;
    doc.totalDocuments = fDoc.totalDocuments;
    this.checkMain(index, obj);
    this.documentService.checkDocumentIsReady();
  }

  filterDoc(documents: any) {
    let numberDoc = 0;
    let totalDoc = 0;
    for (let index = 0; index < documents?.length; index++) {
      const docs = documents[index];
      let activeDoc = docs.documents.filter(
        (f: any) =>
          f.active &&
          f.imageId &&
          ((this.mode == Mode.VIEW_PENDING && f.sent) ||
            (this.mode === Mode.VIEW_PENDING_APPROVE && f.received) ||
            f.documentTemplate?.needHardCopy === false)
      );
      numberDoc = numberDoc + activeDoc?.length;
      if (docs.documents?.length > 1) {
        totalDoc = totalDoc + docs.documents?.length - 1;
      }
    }

    totalDoc = totalDoc + documents?.length;
    return { documentNumber: numberDoc, totalDocuments: totalDoc };
  }

  checkAlreadysent(element: any, doc: any, value?: boolean, obj?: any, index?: any) {
    this.documentService.hasEdit = true;
    if (this.mode === Mode.VIEW_PENDING) {
      element.sent = !element.sent;
      element.updateFlag = element.sent == false ? null : this.UpdateFlagEnum.U;
      if (element.sent) {
        doc.documentNumber++;
      } else {
        doc.documentNumber--;
      }
    }
    if (this.mode === Mode.VIEW_PENDING_APPROVE) {
      element.received = value;
      element.updateFlag = this.UpdateFlagEnum.U;
      if (element.received) {
        if (!element.receiveDate) {
          element.receiveDate = new Date();
        }
      }
      element.rejectReason = value;
    }

    this.checkMain(index, obj);
    this.documentService.currentDocPerson = this.documentPerson;
    this.documentService.checkDocumentIsReady();
  }

  async rejectOriginalReceived(element: any, doc: any, value?: boolean, obj?: any, index?: any) {
    let confirm = await this.rejectOriginalCopy(element);
    if (confirm) {
      this.checkAlreadysent(element, doc, value, obj, index);
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
      return true;
    }
    return false;
  }

  selectDoc(ele: any, person: any, mainEle?: any) {
    let element = mainEle ? mainEle : ele;
    let canUpload = element.imageSource !== 'LCS';
    let res = this.dialog.open(DocSelectionComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        ...element,
        personId: person.personId,
        documentId: element?.documentId,
        subDocumentId: ele?.documentId,
        type: 'BorrowerGuarantor',
        allowUpload: canUpload,
        documentTemplate: {
          ...element.documentTemplate,
          requiredDocumentDate: canUpload,
        },
      },
    });

    res.afterClosed().subscribe(i => {
      if (!i) {
        this.documentPerson = Utils.deepClone(this.documentService.currentDocPerson);
      }
    });
  }

  async openDoc(ele: any) {
    let res = await this.documentService.getDocument(ele.imageId, ele.imageSource);
    this.documentService.openPdf(res, ele.imageName);
  }

  hasOriginalCopyChange(element: any, hasOriginalCopy: boolean, obj: any, index: any) {
    element.hasOriginalCopy = hasOriginalCopy;
    element.updateFlag = this.UpdateFlagEnum.U;
    if (element.imageId) {
      element.readyForLitigation = hasOriginalCopy;
    }
    this.checkMain(index, obj);
    this.documentService.hasEdit = true;
    this.documentService.currentDocPerson = this.documentPerson;
    this.documentService.checkDocumentIsReady();
  }

  checkMain(index: number, obj?: any) {
    for (let i = 0; i < this.documentPerson[index].persons.length; i++) {
      const element = this.documentPerson[index].persons[i];
      let ready = this.documentService.checkReadyFor(element.document);
      element.readyForLitigation = ready.readyForLitigation;
      element.readyForNotice = ready.readyForNotice;
      element.readyForDoc = ready.readyForDoc;
      if (obj) {
        obj.readyForLitigation = ready.readyForLitigation;
        obj.readyForNotice = ready.readyForNotice;
        obj.readyForDoc = ready.readyForDoc;
      }
    }
  }

  expandReason() {
    this.expandedReason = !this.expandedReason;
  }

  receiveAll() {
    this.documentPerson = this.documentPerson.map((m: RelationTypes) => {
      m.persons.map((p: Persons) => {
        p.document = p.document.map((d: any) => {
          if (d.active && d.hardCopyState === 'OPEN') {
            d.received = true;
            d.readyForDoc = true;
            d.updateFlag = d.received == false ? null : this.UpdateFlagEnum.U;
            d.documents = d.documents.map((dd: any) => {
              if (dd.active && d.hardCopyState === 'OPEN') {
                dd.received = true;
                dd.readyForDoc = true;
                dd.updateFlag = d.received == false ? null : this.UpdateFlagEnum.U;
              }
              return dd;
            });
          }
          return d;
        });
        return p;
      });
      return m;
    });
    this.checkReadyAll();
    this.documentService.currentDocPerson = this.documentPerson;
  }

  checkReadyAll() {
    for (let i = 0; i < this.documentPerson.length; i++) {
      let element = this.documentPerson[i];
      this.checkMain(i, element);
    }
  }
}
