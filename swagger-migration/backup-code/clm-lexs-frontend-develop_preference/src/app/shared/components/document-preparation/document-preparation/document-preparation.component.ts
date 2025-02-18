import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CustomerService } from '@app/modules/customer/customer.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { CUSTOMER_ROUTES } from '@app/shared/constant';
import { BlobType, FileType, Mode, statusCode, taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import { DocumentAuditLogDto, DocumentDto, LitigationDetailDto, RejectedDocumentInfo } from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { SessionService } from '@shared/services/session.service';
import {
  DropDownConfig,
  LoaderService,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-preparation',
  templateUrl: './document-preparation.component.html',
  styleUrls: ['./document-preparation.component.scss'],
})
export class DocumentPreparationComponent implements OnInit, AfterViewChecked {
  @ViewChildren(MatTable) table!: QueryList<any>;
  // @Input() documentPerson!: Array<RelationTypes>;
  // @Input() documentCol!: Array<CollateralTypes>;
  // @Input() documentLitigation!: Array<CollateralTypes>;
  public accessPermissions = this.sessionService.accessPermissions();
  public permissionsOnScreen = {
    canPreparationDoc: false,
    canSeeDoc: false,
  };
  isDownloaded: boolean = false;
  mode = Mode.VIEW;
  MODE = Mode;
  verifyDoc: Array<DocumentAuditLogDto> = [];
  defermentDocuments: Array<DocumentDto> = [];
  cessationDocuments: Array<DocumentDto> = [];
  litigationDocuments: Array<DocumentDto> = [];
  statusOption: Array<SimpleSelectOption> = [
    {
      text: 'ทุกเอกสาร',
      value: '',
    },
  ];
  public pageResultConfig: PaginatorResultConfig = {
    fromIndex: 1,
    toIndex: 10,
    totalElements: 10,
  };
  public pageActionConfig: PaginatorActionConfig = {
    totalPages: 0,
    currentPage: 0,
    fromPage: 1,
    toPage: 1,
  };
  preparationCompleted: boolean = false;
  statusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    searchWith: 'text',
    labelPlaceHolder: 'ประเภทเอกสาร',
  };

  verifyDocColumns: string[] = [
    'index',
    'timestamp',
    'documentGroup',
    'documentName',
    'action',
    'userName',
    'screenAction',
  ];

  overDocsColumn: string[] = ['index', 'documentName', 'pageCount', 'action'];
  overDocs: Array<RejectedDocumentInfo> = [];
  expanded: boolean = true;
  taskCode: taskCode | null = (this.taskService.taskDetail?.taskCode as taskCode) || null || '';
  private statusCode!: statusCode | string;
  Task_Code = taskCode;
  hasCancel: boolean = false;
  receivedAll: boolean = false;
  public hasDocsList = false;

  constructor(
    private sessionService: SessionService,
    public documentService: DocumentService,
    private taskService: TaskService,
    private customerService: CustomerService,
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private routerService: RouterService,
    private cdf: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.fetchCustomerDocuemnt();
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
    if (!!this.documentService.customer) {
      this.overDocs = this.documentService.customer.documentInfo?.rejectedExceedDocuments;
      this.documentService.rejectedExceedDocuments = this.overDocs;
      this.preparationCompleted = this.documentService.customer.documentInfo?.preparationCompleted || false;
      await this.initData();
      this.initPermission();
      this.initMode();
      this.loaderService.state.loading && this.loaderService.exitLoad();
    }
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  fetchCustomerDocuemnt() {
    this.documentService.customer = {};
    if (this.routerService.previousUrl.includes(CUSTOMER_ROUTES.MAIN)) {
      this.documentService.customer = this.customerService.customerDetail;
    } else {
      this.documentService.customer =
        Object.keys(this.lawsuitService.currentLitigation).length > 0
          ? this.lawsuitService.currentLitigation
          : this.taskService.customerDetail;
    }
  }

  async initData() {
    this.litigationDocuments = this.documentService?.customer?.documentInfo?.litigationDocuments;
    this.cessationDocuments = this.documentService?.customer?.documentInfo?.cessationDocuments || [];
    this.defermentDocuments = this.documentService?.customer?.documentInfo?.defermentDocuments || [];
    if (!!this.documentService.customer.documentInfo?.customerDocuments?.length) {
      this.hasDocsList = true;
      this.documentService.checkDocumentIsReady();
      this.getTemplateStatus();
    } else {
      this.hasDocsList = false;
    }
    await this.inquiryDocumentAuditLog(0);
  }

  initPermission() {
    this.permissionsOnScreen.canSeeDoc = this.routerService.currentRoute.includes('/main/lawsuit');
    this.permissionsOnScreen.canPreparationDoc =
      this.sessionService.hasPermission(PCode.CUSTOMERS_VERIFY_ORIGINAL_DOCS) ||
      this.sessionService.hasPermission(PCode.LAWSUIT_VERIFY_ORIGINAL_DOCS) ||
      this.sessionService.hasPermission(PCode.LAWSUIT_UPLOAD_DOCS);
  }

  initMode() {
    const _owner = this.taskService.taskOwner; // check owner task
    this.accessPermissions = this.sessionService.accessPermissions();
    if (
      (this.statusCode === 'PENDING_APPROVAL' || this.statusCode === 'PENDING' || this.statusCode === 'IN_PROGRESS') &&
      this.accessPermissions.subRoleCode !== 'VIEWER' &&
      this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)
    ) {
      if (
        this.taskCode === taskCode.RECEIPT_ORIGINAL_DOCUMENT ||
        this.taskCode === taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT
      ) {
        this.mode = Mode.VIEW_PENDING_APPROVE;
        return;
      } else if (
        this.taskCode === taskCode.SUBMIT_ORIGINAL_DOCUMENT ||
        this.taskCode === taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT
      ) {
        this.mode = Mode.VIEW_PENDING;
        this.isDownloaded = this.statusCode === 'IN_PROGRESS';
        return;
      } else if (this.taskCode && this.taskCode !== taskCode.VERIFY_INFO_AND_DOCUMENT) {
        this.mode = Mode.VIEW;
        return;
      }
      this.mode = Mode.EDIT;
      return;
    }
    this.mode = Mode.VIEW;
  }

  async download() {
    if (!this.isDownloaded) {
      this.isDownloaded = !this.isDownloaded;
    }
    let lg = this.documentService?.customer?.litigationId || '';
    const response = await this.lawsuitService.documentExcel(lg);
    Utils.saveAsStrToBlobFile(response, 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
    if (
      this.taskCode === taskCode.SUBMIT_ORIGINAL_DOCUMENT ||
      this.taskCode === taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT
    ) {
      this.mode = Mode.VIEW_PENDING;
    }
  }

  async downloadReturnOriginalCover() {
    const reqInfoSend = this.documentService.getDocumentInfoRequest() as any;
    let docReject = reqInfoSend.receiveDocumentReq.filter((f: any) => f.received === false);
    let hasReasonNoOriginal =
      docReject.every(
        (s: any) =>
          (s.received === false && s?.rejectedReasonDto?.rejectedReasonCode === '2') ||
          s?.rejectedReasonDto?.rejectedReasonCode === '3'
      ) && this.overDocs?.length === 0;
    if (hasReasonNoOriginal) {
      await this.notificationService.alertDialog('EXCEPTION_CONFIG.TITLE_L024', 'EXCEPTION_CONFIG.MESSAGE_L024');
    } else {
      let lg = this.documentService?.customer?.litigationId || '';
      const response: any = await this.lawsuitService.downloadReturnOriginalCover(lg);
      this.documentService.downloadDocumentFromByteArray(response, 'ใบนำส่งคืนเอกสารต้นฉบับ', FileType.PDF);
    }
  }

  getTemplateStatus() {
    let res = (this.documentService.customer?.documentInfo?.customerDocuments as Array<DocumentDto>) || [];
    let array: SimpleSelectOption[] = [];
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      let templateId = element?.documentTemplateId?.split('-') || [];
      if (array.findIndex(f => f.value === templateId[0]) === -1) {
        array.push({
          text: element.documentTemplate?.documentName,
          value: templateId[0],
        } as SimpleSelectOption);
      }
    }
    this.statusOption = this.statusOption.concat(array.sort((a, b) => a.text.localeCompare(b.text)));
  }

  private filterDocumentTemplateId = '';
  async filter(value: any) {
    this.filterDocumentTemplateId = value;
    await this.inquiryDocumentAuditLog(0, this.filterDocumentTemplateId);
  }
  changeMode() {
    this.mode = Mode.EDIT;
  }
  async cancel() {
    if (this.documentService.hasEdit) {
      let res = await this.sessionService.confirmExitWithoutSave();
      if (res) {
        this.hasCancel = true;
        this.initData();
        this.mode = Mode.VIEW;
      }
      return;
    }
    this.mode = Mode.VIEW;
    return;
  }

  async inquiryDocumentAuditLog(page?: number, documentTemplateId = '') {
    documentTemplateId = documentTemplateId || this.filterDocumentTemplateId;

    let customerId;
    if (this.routerService.previousUrl.includes(CUSTOMER_ROUTES.MAIN)) {
      customerId =
        (this.documentService?.customer as LitigationDetailDto)?.customerId ||
        this.customerService.customerDetail?.customerId ||
        '';
    } else {
      customerId =
        (this.documentService?.customer as LitigationDetailDto)?.customerId ||
        this.taskService.customerDetail?.customerId ||
        '';
    }

    let res: any = await this.customerService.inquiryDocumentAuditLog(customerId, documentTemplateId, page, 10);
    this.verifyDoc = res.content || ([] as Array<DocumentAuditLogDto>);
    this.pageResultConfig = {
      fromIndex: res?.pageable?.pageSize * res?.pageable?.pageNumber + 1 || 0,
      toIndex: res?.pageable?.pageSize * res?.pageable?.pageNumber + res?.numberOfElements || 0,
      totalElements: res?.totalElements || 0,
    };
    this.pageActionConfig = {
      totalPages: res?.totalPages || 0,
      currentPage: res?.pageable.pageNumber + 1 || 1,
      fromPage: 1,
      toPage: res?.totalPages || 1,
    };
  }

  async pageEvent(event: number) {
    this.pageActionConfig.currentPage = event;
    await this.inquiryDocumentAuditLog(event - 1);
  }

  async save() {
    let requestInfo = this.documentService.getDocumentInfoRequest() as any;
    if (this.documentService.checkCondition(requestInfo)) {
      try {
        let req = {
          closeTaskId: requestInfo.closeTaskId,
          documents: requestInfo.documents,
        };
        if (!!!this.documentService.customer?.litigationId) {
          await this.documentService.updateDocumentsCustomer(req);
          this.notificationService.openSnackbarSuccess(
            ` CIF No.: ${this.documentService?.customer?.cifNo} ตรวจสอบข้อมูลและเอกสารสำเร็จแล้ว`
          );
        } else {
          await this.documentService.updateDocumentsLitigation(req);
          this.notificationService.openSnackbarSuccess(
            `เลขที่กฏหมาย: ${this.documentService?.customer?.litigationId} บันทึกตรวจสอบเอกสารแล้ว`
          );
        }

        this.mode = Mode.VIEW;
      } catch (e) {
        // Do nothing
      }
    }
  }

  async rejectOriginalCopy(element?: any, mode: string = 'ADD') {
    let data: any = !element ? { rejectedDocumentInfo: { documentName: '', pageCount: '' } } : element;
    if (element) {
      data = {
        rejectedDocumentInfo: {
          documentName: element?.documentName || '',
          pageCount: element?.pageCount || 0,
        },
        isSaveButton: true,
      };
    }
    let btnlb = element ? 'บันทึกปฏิเสธรับเอกสารต้นฉบับเกิน' : '';
    let confirm = await this.documentService.rejectReasons(data, 'ปฏิเสธรับเอกสารต้นฉบับเกิน', 'DOC_OVER', btnlb);
    if (confirm) {
      if (mode === 'ADD') {
        let arr = [
          {
            documentName: confirm.rejectedDocumentInfo?.documentName,
            pageCount: confirm.rejectedDocumentInfo?.pageCount,
          },
        ];
        this.overDocs = this.overDocs.concat(arr);
      } else if (mode === 'EDIT') {
        element.documentName = confirm.rejectedDocumentInfo?.documentName;
        element.pageCount = confirm.rejectedDocumentInfo?.pageCount;
      }

      this.documentService.rejectedExceedDocuments = this.overDocs;
      let msg = element ? 'บันทึกปฏิเสธรับเอกสารต้นฉบับเกินแล้ว' : 'ปฏิเสธรับเอกสารต้นฉบับเกินแล้ว';
      this.notificationService.openSnackbarSuccess(msg);
    }
  }

  async receiveAll() {
    const confirm = await this.notificationService.warningDialog(
      'ยืนยันรับเอกสารต้นฉบับทั้งหมด',
      `มีการปฏิเสธรับเอกสารต้นฉบับบางรายการ คุณต้องการที่จะดำเนินการ
      แก้ไขเป็นรับเอกสารต้นฉบับทั้งหมดใช่หรือไม่?`,
      'ยืนยันรับเอกสารต้นฉบับทั้งหมด',
      '',
      'long-button'
    );
    if (confirm) {
      this.receivedAll = true;
    }
  }

  expandPanel() {
    this.expanded = !this.expanded;
  }

  async remove(index: number) {
    const confirm = await this.notificationService.warningDialog(
      'ต้องการลบรายการปฏิเสธต้นฉบับเกิน',
      `ต้องการลบรายเอกสารต้นฉบับเกินหรือไม่
    หากลบรายการปฏิเสธต้นฉบับเกิน จะต้องบันทึกกดรับเอกสารต้นฉบับ`,
      'ยืนยันลบรายการ',
      'icon-Bin',
      'long-button mat-warn'
    );
    if (confirm) {
      this.overDocs = this.overDocs?.filter((v, i) => i !== index);
      this.documentService.rejectedExceedDocuments = this.overDocs;
      this.notificationService.openSnackbarSuccess('บันทึกลบปฏิเสธรับต้นฉบับเกินแล้ว');
    }
  }
}
