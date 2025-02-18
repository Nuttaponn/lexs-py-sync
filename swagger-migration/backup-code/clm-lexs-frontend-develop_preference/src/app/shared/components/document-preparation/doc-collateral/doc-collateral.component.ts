import { AfterViewChecked, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CollateralTypes, Mode } from '@app/shared/models';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto, DocumentRequest, RejectedReasonRequest } from '@lexs/lexs-client';
import { DocSelectionComponent } from '../doc-selection/doc-selection.component';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-doc-collateral',
  templateUrl: './doc-collateral.component.html',
  styleUrls: ['./doc-collateral.component.scss'],
})
export class DocCollateralComponent implements OnInit, AfterViewChecked {
  @Input()
  set _mode(val: any) {
    this.mode = val;
    this.getDisplayedColumns();
    this.countDocumentNumber();
  }
  @Input()
  set hasCancel(val: any) {
    if (val) {
      this.documentCol = Utils.deepClone(this._documentCol);
      this.documentService.currentDocCol = this.documentCol;
      console.log('this.documentCol', this.documentCol);
      this.checkStatusMain();
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
  documentCol: Array<CollateralTypes> = [];
  _documentCol: Array<CollateralTypes> = [];
  ImageSourceEnum = DocumentDto.ImageSourceEnum;
  @ViewChildren(MatTable) table!: QueryList<any>;
  public expandedReason: boolean = false;

  isShow = true;
  public contactColumns: string[] = [];
  dataContact = [];
  public docOfRightColumns: string[] = [];
  dataDocOfRight = [];
  public ortherColumns: string[] = [];
  dataOther = [];
  statusCode: string = '';
  currentDate = new Date();
  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;

  constructor(
    private dialog: MatDialog,
    private documentService: DocumentService
  ) {}

  showMain = {
    expanded: false,
    readyForLitigation: false,
    readyForNotice: false,
    readyForDoc: false,
    forNoticeLetter: true,
    forLitigation: true,
    forDoc: true,
  };

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (this.documentService?.currentDocCol?.length > 0) {
      this.documentCol = this.documentService.currentDocCol;
      this._documentCol = Utils.deepClone(this.documentCol);
    }
    console.log(' this.documentCol', this.documentCol);
    this.checkStatusMain();
    this.countDocumentNumber();
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  getDisplayedColumns() {
    let columnContract = [
      { def: 'index', hide: false },
      { def: 'documentName', hide: false },
      { def: 'contractDate', hide: false },
      { def: 'contractId', hide: false },
      { def: 'collaterals', hide: false },
      { def: 'accounts', hide: false },
      { def: 'storeOrganization', hide: false },
      { def: 'ownOrganization', hide: false },
      { def: 'imageName', hide: false },
      { def: 'hasOriginalCopy', hide: false },
      { def: 'hasNotOriginalCopy', hide: this.mode !== Mode.EDIT },
      { def: 'sent', hide: this.mode !== Mode.VIEW_PENDING },
      { def: 'received', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'rejectOriginalReceived', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'save', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
    ];

    let columnCollateral = [
      { def: 'index', hide: false },
      { def: 'documentName', hide: false },
      { def: 'collNo', hide: false },
      { def: 'accounts', hide: false },
      { def: 'storeOrganization', hide: false },
      { def: 'ownOrganization', hide: false },
      { def: 'imageName', hide: false },
      { def: 'hasOriginalCopy', hide: false },
      { def: 'hasNotOriginalCopy', hide: this.mode !== Mode.EDIT },
      { def: 'sent', hide: this.mode !== Mode.VIEW_PENDING },
      { def: 'received', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'rejectOriginalReceived', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'save', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
    ];

    let columnOrther = [
      { def: 'index', hide: false },
      { def: 'documentName', hide: false },
      { def: 'storeOrganization', hide: false },
      { def: 'ownOrganization', hide: false },
      { def: 'imageName', hide: false },
      { def: 'hasOriginalCopy', hide: false },
      { def: 'hasNotOriginalCopy', hide: this.mode !== Mode.EDIT },
      { def: 'sent', hide: this.mode !== Mode.VIEW_PENDING },
      { def: 'received', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'rejectOriginalReceived', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
      { def: 'save', hide: this.mode !== Mode.VIEW_PENDING_APPROVE },
    ];

    this.contactColumns = this.setColumn(columnContract);
    this.docOfRightColumns = this.setColumn(columnCollateral);
    this.ortherColumns = this.setColumn(columnOrther);
    this.statusCode = 'IN_PROGRESS';

    console.log(' this.contactColumns', this.contactColumns);
    console.log(' this.docOfRightColumns', this.docOfRightColumns);
    console.log(' this.ortherColumns', this.ortherColumns);
  }

  setColumn(col: any) {
    return col.filter((cd: any) => !cd.hide).map((cd: any) => cd.def);
  }

  onCheck(element: any, docGroup: string, obj: any) {
    element.active = !element.active;
    element.updateFlag = this.UpdateFlagEnum.U;
    this.documentService.currentDocCol = this.documentCol;

    this.checkMainIsReady(docGroup, obj);
  }

  expandPanel(item?: any) {
    item.expanded = !item.expanded;
    this.documentService.currentDocCol = this.documentCol;
  }

  async openDoc(ele: any) {
    let res = await this.documentService.getDocument(ele.imageId, ele.imageSource);
    this.documentService.openPdf(res, ele.imageName);
  }

  inputChange(val: any, element: any) {
    if (!val && element.received != true) {
      element.updateFlag = null;
    } else {
      element.receiveDate = val;
      element.updateFlag = this.UpdateFlagEnum.U;
    }
    this.documentService.hasEdit = true;
    this.documentService.currentDocCol = this.documentCol;
  }

  updateFlag(element: any, docGroup: string) {
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
      if (!element.receiveDate) {
        element.receiveDate = new Date();
      }
    }
  }

  checkAll(doc: any, docGroup: string) {
    this.documentService.hasEdit = true;
    if (docGroup === 'col_contract') {
      for (let index = 0; index < doc.contracts?.length; index++) {
        const element = doc.contracts[index];
        this.updateFlag(element, docGroup);
      }
      doc.documentNumber = this.filterDoc(doc.contracts)?.length;
    }
    if (docGroup === 'col_ownership') {
      for (let index = 0; index < doc.collaterals?.length; index++) {
        const element = doc.collaterals[index];
        this.updateFlag(element, docGroup);
      }
      doc.documentNumber = this.filterDoc(doc.collaterals)?.length;
    }
    if (docGroup === 'col_other') {
      for (let index = 0; index < doc.documents?.length; index++) {
        const element = doc.documents[index];
        this.updateFlag(element, docGroup);
      }
      doc.documentNumber = this.filterDoc(doc.documents)?.length;
    }
    this.checkMainIsReady(docGroup, doc);
    this.documentService.currentDocCol = this.documentCol;
  }
  countDocumentNumber() {
    if ((this.mode == Mode.VIEW_PENDING || this.mode === Mode.VIEW_PENDING_APPROVE) && this.documentCol[0]) {
      let contracts = this.filterDoc(this.documentCol[0]?.contracts);
      this.documentCol[0].documentNumber = contracts?.length;
      let coll = this.filterDoc(this.documentCol[1]?.collaterals);
      this.documentCol[1].documentNumber = coll?.length;
      let other = this.filterDoc(this.documentCol[2]?.documents);
      this.documentCol[2].documentNumber = other?.length;
    }
  }

  filterDoc(documents: any) {
    return documents.filter((element: any) => {
      return (
        (this.mode == Mode.VIEW_PENDING && element?.sent) ||
        (this.mode === Mode.VIEW_PENDING_APPROVE && element?.received)
      );
    });
  }

  checkAlreadysent(element: any, doc: any, value: boolean, docGroup: string, obj?: any) {
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
        doc.documentNumber++;
        if (!element.receiveDate) {
          element.receiveDate = new Date();
        }
      } else {
        doc.documentNumber--;
      }
      element.rejectReason = value;
    }

    this.checkMainIsReady(docGroup, obj);
    this.documentService.currentDocCol = this.documentCol;
  }

  selectDoc(ele: any, person: any) {
    let res = this.dialog.open(DocSelectionComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        ...ele,
        personId: person?.personId,
        type: 'Collateral',
        allowUpload: true,
      },
    });

    res.afterClosed().subscribe(i => {
      if (!i) {
        this.documentCol = Utils.deepClone(this.documentService.currentDocCol);
        this.checkStatusMain();
      }
    });
  }

  checkStatusMain() {
    const readyLg = this.documentCol.every((e: any) => e.readyForLitigation);
    const readyNt = this.documentCol.every((e: any) => e.readyForNotice);
    const readyDoc = this.documentCol.every((e: any) => e.readyForDoc);
    const forLitigation = this.documentCol.some((e: any) => e.forLitigation);
    const forNoticeLetter = this.documentCol.some((e: any) => e.forNoticeLetter);
    this.showMain.readyForLitigation = readyLg;
    this.showMain.readyForNotice = readyNt;
    this.showMain.readyForDoc = readyDoc;
    this.showMain.forLitigation = forLitigation;
    this.showMain.forNoticeLetter = forNoticeLetter;
  }

  hasOriginalCopyChange(element: any, hasOriginalCopy: boolean, docGroup: string, obj: any) {
    element.updateFlag = this.UpdateFlagEnum.U;
    element.hasOriginalCopy = hasOriginalCopy;
    if (element.imageId) {
      element.readyForLitigation = hasOriginalCopy;
    }

    this.checkMainIsReady(docGroup, obj);
  }

  checkMainIsReady(docGroup: string, obj: any) {
    if (obj) {
      let list: Array<any> = [];
      switch (docGroup) {
        case 'col_contract':
          list = this.documentCol[0]?.contracts;
          break;
        case 'col_ownership':
          list = this.documentCol[1]?.collaterals;
          break;
        case 'col_other':
          list = this.documentCol[2]?.documents;
          break;
      }

      let ready = this.documentService.checkReadyFor(list);
      obj.readyForLitigation = ready.readyForLitigation;
      obj.readyForNotice = ready.readyForNotice;
      obj.readyForDoc = ready.readyForDoc;
    }
    this.documentService.hasEdit = true;
    this.documentService.currentDocCol = this.documentCol;
    this.documentService.checkDocumentIsReady();
    let isMainReadyL = this.documentCol.filter(f => f.forLitigation).every(e => e.readyForLitigation);
    let isMainReadyN = this.documentCol.filter(f => f.forNoticeLetter).every(e => e.readyForNotice);
    let isMainReadyD = this.documentCol.every(e => e.readyForDoc);
    this.showMain.readyForLitigation = isMainReadyL;
    this.showMain.readyForNotice = isMainReadyN;
    this.showMain.readyForDoc = isMainReadyD;
  }

  async rejectOriginalReceived(element: any, doc: any, value: boolean, docGroup: string, obj?: any) {
    let confirm = await this.rejectOriginalCopy(element);
    if (confirm) {
      this.checkAlreadysent(element, doc, value, docGroup, obj);
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

  expandReason() {
    this.expandedReason = !this.expandedReason;
  }

  receiveAll() {
    this.documentCol = this.documentCol.map((m: CollateralTypes) => {
      m.contracts.map((p: any) => {
        if (p.active) {
          p.received = true;
          p.updateFlag = p.received == false ? null : this.UpdateFlagEnum.U;
        }
        return p;
      });
      m.collaterals.map((p: any) => {
        if (p.active) {
          p.received = true;
          p.updateFlag = p.received == false ? null : this.UpdateFlagEnum.U;
        }
        return p;
      });
      m.documents.map((p: any) => {
        if (p.active) {
          p.received = true;
          p.updateFlag = p.received == false ? null : this.UpdateFlagEnum.U;
        }
        return p;
      });
      this.checkMainIsReady(m.docGroup, m);
      return m;
    });
    this.documentService.currentDocCol = this.documentCol;
    this.documentService.checkDocumentIsReady();
  }
}
