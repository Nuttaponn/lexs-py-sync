import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TitleDeedDocumentExtend } from '@app/modules/seizure-property/seizure-document-info/seizure-document-info.constant';
import { CommonDocumentConfig, ITooltip, Mode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { DocumentDto, RejectedReasonDto } from '@lexs/lexs-client';
import { BuddhistEraPipe } from '@spig/core';
import { SimpleSelectOption } from 'projects/spig-core/src/lib/dropdown/dropdown.model';
import { DocumentAccountService } from '../document-account.service';
import { DocumentService } from '../document.service';
import { AccountsSet, ReadyFor } from '../interface/document';

@Component({
  selector: 'app-common-document-table',
  templateUrl: './common-document-table.component.html',
  styleUrls: ['./common-document-table.component.scss'],
})
export class CommonDocumentTableComponent implements OnInit {
  @Input() isViewOnly: boolean = false;
  @Input() mode = 'mode';
  @Input() displayedColumns: Array<any> = [];
  @Input() config!: CommonDocumentConfig;
  @Input()
  set _documents(val: any) {
    this.documents = val;
    this.prepareData();
  }
  documents: any = [];
  @Input() details: any = [];
  @Input() readyFor: ReadyFor = {};
  @Output() onEvent = new EventEmitter<any>();
  public templatePrimary = [];
  public MODE = Mode;
  public scroll: any;
  public statusCode: any;
  public currentDate: any;
  @Input() showMainAccount: boolean = false;
  public selectedNo = 0;
  public appraisalTooltip: ITooltip[] = [
    {
      title: 'ขั้นตอนการตรวจสภาพและประเมินราคา',
      content: `หลักประกัน อยู่ระหว่างการประเมินตรวจสภาพและประเมินราคา
      กรุณาตรวจสอบใหม่ในภายหลัง`,
    },
  ];

  public documentSet: AccountsSet[] = [];
  public currentValue: number = 0;
  public accountDropdownOptions: SimpleSelectOption[] = [];
  public dataSource: Array<any> = [];
  public isSelectAll: boolean = false;

  constructor(
    private documentAccountService: DocumentAccountService,
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  ngOnInit(): void {
    this.config.totalDocuments = this.documents?.length || 0;
  }

  prepareData() {
    if (this.config && this.config.showDropdown) {
      this.documentSet = this.documentAccountService.initAccountsSet(this.documents, 10);
      this.accountDropdownOptions = this.documentAccountService.initAccountDropdownOptions(this.documentSet.length);
    }
    if (this.config && this.config.showDropdown) {
      this.dataSource = this.documentSet[this.currentValue]?.commitments || [];
    } else {
      this.dataSource = this.documents;
    }
  }

  expandPanelMain() {
    this.showMainAccount = !this.showMainAccount;
  }
  expandPanel(element: any) {
    element.expanded = !element.expanded;
  }

  onSent(element: any) {
    element.sent = !element.sent;
    element.readyForAsset = element.sent;
    if ((element.sent && this.config.documentNumber) || this.config.documentNumber === 0) {
      this.config.documentNumber++;
    } else {
      if (this.config.documentNumber || this.config.documentNumber === 0) this.config.documentNumber--;
    }
    this.onEvent.emit(this.documents);
  }

  async onSelectAll() {
    let noData = this.documents.every(
      (r: TitleDeedDocumentExtend) => r?.sendMethod === 'TRIGGER_DIMS' || r?.sendMethod === 'AT_KLAW'
    );
    if (noData) {
      await this.notificationService.alertDialog(
        'ไม่สามารถเลือกส่งทั้งหมดได้',
        'เนื่องจากไม่มีรายการเอกสารที่ต้องเลือกแล้ว'
      );
    } else {
      this.isSelectAll = !this.isSelectAll;
      if (this.documents.length > 0) {
        this.documents = this.documents.map((m: any) => {
          m.sent = this.isSelectAll;
          m.readyForAsset = this.isSelectAll;
          return m;
        });
        this.readyFor.readyForAsset = this.isSelectAll;
        this.config.documentNumber = this.isSelectAll ? this.documents.length : 0;
        this.onEvent.emit(this.documents);
      }
    }
  }

  expandReason(element: any) {
    element.expandedReason = !element.expandedReason;
  }

  onDropdownSelected(event: any) {
    this.currentValue = event;
    this.dataSource = this.documentSet[this.currentValue]?.commitments || [];
  }

  onReceived(element: any, received: boolean) {
    element.approve = received;
    element.rejectReason = received;
    element.readyForAsset = received;
    this.onEvent.emit(this.documents);
  }
  async rejectOriginalReceived(element: any, received: boolean) {
    element.approve = received;
    element.readyForAsset = received;
    await this.rejectOriginalCopy(element, 'ปฏิเสธรับต้นฉบับ');
    this.onEvent.emit(this.documents);
  }

  async rejectOriginalCopy(element: any, btnText: string = 'บันทึกปฏิเสธรับต้นฉบับ') {
    let data: RejectedReasonDto = {
      rejectedDocumentInfo: {
        documentName: element?.name || '',
        pageCount: element?.docCount || '',
      },
      rejectedReasonId: element?.rejectedReasonId || '',
      rejectedReasonName: element?.rejectedReasonName || '',
      rejectedRemarks: element?.rejectedRemarks || '',
    };

    let res = (await this.documentService.rejectReasons(data, 'ปฏิเสธรับต้นฉบับ', '', btnText)) as RejectedReasonDto;
    if (res) {
      element.rejectReason = false;
      element.name = res.rejectedDocumentInfo?.documentName;
      element.docCount = res.rejectedDocumentInfo?.pageCount;
      element.rejectedReasonId = res.rejectedReasonId;
      element.rejectedRemarks = res.rejectedRemarks;
      this.notificationService.openSnackbarSuccess(btnText + 'แล้ว');
    } else {
      if (!element.rejectedReasonId) {
        // case cancel rejectOriginalCopy popup -> reset approve
        element.approve = null;
      }
    }
  }

  async onViewDocument(element: any) {
    if (!!!element?.imageId) return;
    let imageId = element?.imageId || '';
    let imageSource = element?.imageSource || DocumentDto.ImageSourceEnum.Lexs;
    const response: any = await this.documentService.getDocument(imageId, imageSource);
    if (!response) return;
    const fileName = element.attachment?.documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  getApproveDate(value: string) {
    return this.buddhistEraPipe.transform(value, 'DD/MM/YYYY') || '-';
  }
}
