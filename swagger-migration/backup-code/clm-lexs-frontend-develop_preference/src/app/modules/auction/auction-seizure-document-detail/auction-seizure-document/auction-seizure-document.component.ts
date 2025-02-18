import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant/document-tempate';
import {
  CommonDocumentConfig,
  IUploadMultiFile,
  IUploadMultiInfo,
  acceptFile_PDF_JPG,
  maxFileSize,
  taskCode,
} from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils';
import {
  ConveyanceDeedGroupDocument,
  ConveyanceDeedGroupUploadDocument,
  ConveyanceDocumentUploadResponse,
  ConveyanceUploadDocument,
  DeedDocument,
  DocumentDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import { ConveyanceDeedGroupDocumentExtend } from '../../auction.const';
import { AuctionMenu } from '../../auction.model';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-seizure-document',
  templateUrl: './auction-seizure-document.component.html',
  styleUrls: ['./auction-seizure-document.component.scss'],
  providers: [BuddhistEraPipe],
})
export class AuctionSeizureDocumentComponent implements OnInit {
  @Input() showSeizureDoc: boolean = true;
  @Input() expanded: boolean = false;
  @Input()
  set _relatedDeedGroupIDs(val: string[]) {
    this.relatedDeedGroupIDs = val;

    this.conveyanceDeedGroupDocuments.map((m: ConveyanceDeedGroupDocumentExtend) => {
      m.hided = !this.relatedDeedGroupIDs.some(s => s === m.fsubbidnum);
      return m;
    });
  }

  @Input() from?: 'UPLOAD_DOC' | null = null;
  @Input() isViewMode: boolean = false;
  @Input() title: string = 'รายการเอกสารที่ได้รับจากการซื้อทรัพย์';
  @Input() set isSubmitted(val: boolean) {
    if (val) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
    }
  }
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @Output() uploadDoc = new EventEmitter<any>();
  public relatedDeedGroupIDs: string[] = [];
  public displayedColumns = ['no', 'documentName', 'documentId', 'collateralId', 'organization', 'date'];
  public deedConfig: CommonDocumentConfig = {
    title: 'เอกสารสิทธิ์',
    isMain: false,
    canShowIcon: false,
    showDropdown: true,
    selectText: 'เลือกส่งทั้งหมด',
    msgNotFound: 'ไม่มีเอกสารสิทธิ์ที่เกี่ยวข้อง',
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon default-cursor icon-hide-show icon-xmedium',
    forGeneral: true,
    ready: false,
    forAsset: false,
    viewImage: true,
    customDateText: 'วันที่ได้รับเอกสาร',
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
  };
  public displayDeed: Array<any> = [
    'id',
    'documentName',
    'collateralNo',
    'collateralId',
    'storeOrganization',
    'customDate',
  ];
  // public selectedFsubbidnum: string[] = [];
  public documentDeed = [{}];
  public DOC_TEMPLATE = DOC_TEMPLATE;
  public documentUpload: IUploadMultiFile[] = [];
  public isUploadReadOnly: boolean = false;
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public formUploadControl: UntypedFormControl = new UntypedFormControl(false, Validators.requiredTrue);
  public _column = ['no', 'documentName', 'set', 'uploadDate', 'command'];
  public onDownLoadForm = new EventEmitter();
  public maxFileSize: number = maxFileSize; // MB Size
  public onUploadFileEvent = new EventEmitter<any>();
  public canSeeDocument: boolean = false;
  public isUploaded: boolean = false;
  public taskCode!: taskCode;
  public actionMenu!: AuctionMenu;
  public requireDoc: UntypedFormControl = new UntypedFormControl('', Validators.requiredTrue);
  public isViewModeAsset: boolean = false;
  public list: ConveyanceDocumentUploadResponse = {};
  public mainDocuments: any[] = [];
  public conveyanceDeedGroupDocuments: ConveyanceDeedGroupDocumentExtend[] = [];
  public conveyanceUploadDocuments: ConveyanceUploadDocument[] = [];

  public acceptFile: Array<string> = acceptFile_PDF_JPG;
  public documentColumns: string[] = ['documentName', 'uploadDate'];

  public messageBanner =
    'หากมีชุดทรัพย์ที่ ธนาคารซื้อได้ จะต้องอัปโหลดใบประกาศขายทอดตลาดและรายงานการขาย ถึงจะเสร็จสิ้นงานได้';
  public subMessage = [
    'หากมีชุดทรัพย์ที่ ธนาคารซื้อได้ จะต้องอัปโหลดใบประกาศขายทอดตลาดและรายงานการขาย ถึงจะเสร็จสิ้นงานได้',
    'หากมีชุดทรัพย์ที่ บุคคลภายนอกซื้อได้ จะต้องอัปโหลดรายงานการขาย ถึงจะเสร็จสิ้นงานได้',
  ];
  formGroup!: UntypedFormGroup;
  public isErrorFiletypeOrFileSize: boolean = false;
  private ERROR_CODE_FILE_TYPE_F015 = 'F015';
  private ERROR_CODE_FILE_TYPE_D025 = 'D025';
  constructor(
    private logger: LoggerService,
    private documentService: DocumentService,
    private translate: TranslateService,
    private routerService: RouterService,
    private taskService: TaskService,
    private auctionService: AuctionService,
    private lawsuitService: LawsuitService,
    private fb: UntypedFormBuilder,
    private buddhistEraPipe: BuddhistEraPipe,
    private litigationCaseService: LitigationCaseService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.logger.info('AuctionSeizureDocumentComponent -> ngOnInit');
    this.initData();
  }

  initData() {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (this.taskCode === taskCode.R2E09_08_01_3_1) this._column = ['no', 'documentName', 'uploadDate', 'command'];
    this.uploadMultiInfo = {
      cif:
        this.taskService.taskDetail.customerId ||
        this.lawsuitService.currentLitigation.customerId ||
        this.litigationCaseService.litigationCaseShortDetail.cifNo ||
        '',
      litigationId:
        this.taskService.taskDetail.litigationId || this.lawsuitService.currentLitigation.litigationId || '',
    };
    this.actionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    let menu = [AuctionMenu.UPLOAD_DOC, AuctionMenu.VIEW_CASHIER];
    this.isViewModeAsset =
      this.actionMenu === AuctionMenu.VIEW_CASHIER ? true : menu.includes(this.actionMenu) && !this.isViewMode;
    this.canSeeDocument =
      ([taskCode.R2E09_08_01_3_1].includes(this.taskCode) || menu.includes(this.actionMenu)) && this.showSeizureDoc;
    this.isUploadReadOnly = this.from !== 'UPLOAD_DOC';
    this.prepareData();
    this.generateForm();
    this.checkReady();
  }

  prepareData() {
    const conveyanceDocumentUpload = this.auctionService?.conveyanceDocumentUploads as ConveyanceDocumentUploadResponse;
    const conveyanceUploadDocuments = conveyanceDocumentUpload?.conveyanceUploadDocuments || [];
    const conveyanceOptionalUploadDocuments = conveyanceDocumentUpload?.conveyanceOptionalUploadDocuments || [];
    const conveyanceDeedGroupDocuments = conveyanceDocumentUpload?.conveyanceDeedGroupDocuments || [];
    const assetList = conveyanceDeedGroupDocuments.map(f => ({ deedGroupId: f.deedGroupId, fsubbidnum: f.fsubbidnum }));
    // เอกสารที่เกี่ยวข้องจากการซื้อทรัพย์
    let isNotFirst = conveyanceUploadDocuments.find(
      (f: ConveyanceUploadDocument) => f?.document?.documentId && f?.document?.documentId > 0
    );
    const completed = this.auctionService.conveyanceDocumentUploads?.type === 'completed';
    if (isNotFirst && !completed && this.from !== 'UPLOAD_DOC' && this.actionMenu !== AuctionMenu.VIEW_CASHIER) {
      conveyanceUploadDocuments.push({
        ...conveyanceUploadDocuments[0],
        document: {
          ...conveyanceUploadDocuments[0].document,
          imageId: '',
          documentId: 0,
          uploadTimestamp: '',
        },
        relatedDeedGroupIDs: [],
      });
    }
    //Mandatory Document has only one
    for (let index = 0; index < conveyanceUploadDocuments?.length; index++) {
      const doc = conveyanceUploadDocuments[index] as ConveyanceUploadDocument;
      const assetsList = doc.relatedDeedGroupIDs || [];
      let assetsListMapping: any[] = [];
      assetsList.forEach((m: number) => {
        const gName = assetList.find(s => s.deedGroupId === m);
        if (gName) {
          assetsListMapping.push({
            title: '',
            content: 'ชุดทรัพย์ที่ ' + gName?.fsubbidnum,
            fsubbidnum: gName?.fsubbidnum,
          });
          if ([AuctionMenu.ACCOUNT_DOCUMENT, AuctionMenu.VIEW_CASHIER].includes(this.actionMenu)) {
            this.auctionService.relatedDeedGroupIDs.push(Number(gName?.deedGroupId));
          }
        }
      });
      this.mainDocuments.push({
        ...doc,
        ...doc.document,
        active: true,
        assetsList: assetsList,
        documentTemplate: {
          ...doc.document?.documentTemplate,
          optional: false,
        },
        assetsListMapping: assetsListMapping.sort((a: any, b: any) => {
          const result = a?.fsubbidnum?.toString()?.localeCompare(b?.fsubbidnum?.toString(), 'en', { numeric: true });
          return result;
        }),
      });
    }
    // Optional Document
    for (let index = 0; index < conveyanceOptionalUploadDocuments?.length; index++) {
      const doc = conveyanceOptionalUploadDocuments[index] as any;
      if (doc.documentTemplate) {
        doc.documentTemplate['optional'] = true;
        doc.active = !!doc.imageId;
        doc.multipleUpload = doc.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF212;
        doc.disabled = !doc.disabled && !!doc.imageId;
      }
      doc.documentTemplateId = doc.documentTemplate?.documentTemplateId;
      this.mainDocuments.push(doc);
    }
    const fromDraft = Utils.deepClone(conveyanceOptionalUploadDocuments.find(s => s.imageId) || {});
    if (fromDraft && !this.isViewMode) {
      fromDraft.imageId = '';
      this.addTemplate(fromDraft);
    }

    // เอกสารสิทธิ์
    for (let index = 0; index < conveyanceDeedGroupDocuments?.length; index++) {
      const element = conveyanceDeedGroupDocuments[index] as ConveyanceDeedGroupDocument | any;
      let ready = element.deedDocuments?.every((e: ConveyanceDeedGroupUploadDocument) => e.imageId);
      let readyForSet = element.conveyanceDeedGroupUploadDocuments?.every(
        (e: ConveyanceDeedGroupUploadDocument) => e.imageId
      );
      element.expand = this.from === 'UPLOAD_DOC';
      element.expandSub = this.from === 'UPLOAD_DOC';
      element.hided =
        this.from === 'UPLOAD_DOC' ? !this.relatedDeedGroupIDs.some(s => s === element.fsubbidnum) : false;
      element.readyForSet = ready && readyForSet;
      element.readyForContract = readyForSet;
      element.deedDocumentsMapping = [] as any[];
      element.details = [
        {
          name: 'วันขาย',
          value: this.buddhistEraPipe.transform(element.soldDate, 'DD/MM/YYYY'),
        },
      ] as any[];

      if (element?.deedDocuments) {
        for (let j = 0; j < element?.deedDocuments?.length; j++) {
          const deed = element?.deedDocuments?.[j] || ([] as DeedDocument);
          const colDoc = deed.documents?.filter((f: any) => f.documentTemplate.documentGroup === 'COLLATERAL');
          const contractDoc = deed.documents?.filter(
            (f: any) => f.documentTemplate.documentGroup === 'COLLATERAL_CONTRACT'
          ) as any;
          element.deedDocumentsMapping = element?.deedDocumentsMapping?.concat(colDoc);

          this.deedDocumentsMapping(element.deedDocumentsMapping, deed);
          element.deedConfig = this.deedConfig;
          const completed = this.routerService.activeRoute.snapshot.queryParams['status'] === 'completed';
          if (this.showSeizureDoc && !completed) {
            element.conveyanceDeedGroupUploadDocuments =
              element?.conveyanceDeedGroupUploadDocuments?.concat(contractDoc);
          }
        }
      }

      element.conveyanceDeedGroupUploadDocuments?.map((m: any) => {
        m.readyForSet = readyForSet;
        m.expand = this.expanded;
        m.active = true;
        m.uploadRequired = !m.imageId && this.taskCode === taskCode.R2E09_08_01_3_1;
        m.documentTemplateId = m?.documentTemplate?.documentTemplateId;
        m.indexOnly = true;
        m.removeDocument = true;
        m.uploadDate = m?.uploadTimestamp;
        m.fsubbidnum = element.fsubbidnum;
        m.disabled = !!m.imageId;
        m.isUpload = !!m.imageId;

        return m;
      });
      element.conveyanceDeedGroupUploadDocuments = this.removeDuplicates(element.conveyanceDeedGroupUploadDocuments);
      this.conveyanceDeedGroupDocuments.push(element);
    }
  }

  removeDuplicates(arr: any) {
    return arr.filter(
      (value: any, index: number, self: any) => index === self.findIndex((t: any) => t.documentId === value.documentId)
    );
  }

  deedDocumentsMapping(deeds: any[], deedDoc: DeedDocument) {
    deeds?.map((m: any, index) => {
      if (m) {
        m.customDate = m?.uploadTimestamp;
        m.index = m.index ? m.index : index + 1;
        m.relatedCollateral = {
          collateralId: deedDoc.collateralId,
          collateralDetails: deedDoc.collateralDetails,
        };
        m.documentNo = deedDoc.collateralDocNo;
        m.uploadUserId = m?.storeOrgCode;
        m.storeOrganizationName = m?.storeOrgName;
        m.imageSource = 'LEXS';
      }
      return m;
    });
  }

  generateForm() {
    this.formGroup = this.fb.group({
      conveyanceDeedGroupUploadDocuments: this.fb.array([]),
    });
    const formArr = this.formGroup.get('conveyanceDeedGroupUploadDocuments') as UntypedFormArray;
    for (let index = 0; index < this.conveyanceDeedGroupDocuments?.length; index++) {
      const deed = this.conveyanceDeedGroupDocuments[index];
      const required =
        (this.relatedDeedGroupIDs.some(s => s === deed?.fsubbidnum) || !!this.taskCode) &&
        !deed?.conveyanceDeedGroupUploadDocuments?.some(s => s.imageId);
      formArr.push(
        this.fb.group({
          requiredDoc: [false, required ? Validators.requiredTrue : ''],
        })
      );
    }
    this.auctionService.seizureDocForm = this.formGroup;
  }

  get conveyanceDeedGroupUploadDocumentsForm(): UntypedFormArray {
    return this.formGroup?.get('conveyanceDeedGroupUploadDocuments') as UntypedFormArray;
  }

  uploadFileEvent(data: IUploadMultiFile[] | null, j: number) {
    this.auctionService.conveyanceHasEdit = true;
    let isRequired = data && data?.length > 0 && data.filter(f => f.uploadRequired).every(r => r.imageId);
    this.conveyanceDeedGroupUploadDocumentsForm?.at(j)?.get('requiredDoc')?.setValue(isRequired);
    this.uploadDoc.emit(data);
    this.checkReady();
  }

  onUploadDocument(i: any, documentTemplateId: string = '') {
    let fileInput = this.fileUpload.nativeElement;
    this.auctionService.conveyanceHasEdit = true;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.isErrorFiletypeOrFileSize = false;
          const imageId = await this.uploadDocument(file, documentTemplateId);
          i.imageId = imageId;
          i.isUpload = i.imageId ? true : false;
          i.uploadTimestamp = i.imageId ? new Date().toDateString() : '';
          i.documentDate = i.imageId ? new Date().toISOString() : '';
          i.disabled = false;
          if (imageId) {
            this.addTemplate(i);
          }
        } else {
          i.imageId = '';
          i.isUpload = false;
          i.uploadTimestamp = '';
          i.documentDate = '';
          this.isErrorFiletypeOrFileSize = true;
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
              SIZE_EXCEED: this.maxFileSize.toString(),
            })
          );
        }
      }

      element.value = '';
    };
    fileInput.click();
    this.auctionService.conveyanceDocumentUploads.conveyanceOptionalUploadDocuments = this.mainDocuments.filter(
      f => f.documentTemplateId === DOC_TEMPLATE.LEXSF212
    );
  }

  addTemplate(element: any) {
    if (element.multipleUpload) {
      this.mainDocuments = this.mainDocuments.concat([
        {
          ...element,
          active: false,
          documentTemplateId: DOC_TEMPLATE.LEXSF212,
          documentDate: '',
          uploadTimestamp: '',
          imageId: '',
        },
      ]);
    }
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      let response;
      response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error: any) {
      const codes = error?.error?.errors?.map((it: any) => it.code);
      if (
        error?.error?.code === this.ERROR_CODE_FILE_TYPE_F015 ||
        (codes && (codes.includes(this.ERROR_CODE_FILE_TYPE_D025) || codes.includes(this.ERROR_CODE_FILE_TYPE_F015)))
      ) {
        this.isErrorFiletypeOrFileSize = true;
      }
      return null;
    }
  }

  async onViewDocument(_index: number) {
    if (this.mainDocuments[_index].imageId == undefined || this.mainDocuments[_index].imageId == '') {
      return;
    }
    const response: any =
      !!this.mainDocuments[_index].imageId &&
      (await this.documentService.getDocument(
        this.mainDocuments[_index].imageId || '',
        DocumentDto.ImageSourceEnum.Lexs
      ));
    if (!response) return;
    const fileName = this.mainDocuments[_index].documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  saveDetail() {
    this.auctionService.conveyanceDocumentUploadsTemp = Utils.deepClone(this.auctionService.conveyanceDocumentUploads);
    this.auctionService.conveyanceHasEdit = true;

    this.routerService.navigateTo('/main/lawsuit/auction/document-detail');
  }

  onRemoveDocument(i: any, no: number) {
    this.auctionService.conveyanceHasEdit = true;
    i.imageId = '';
    i.isUpload = false;
    i.uploadTimestamp = '';
    i.documentDate = '';
    this.mainDocuments = this.mainDocuments.filter((f, index) => index !== no);
  }

  masterToggle(e: any) {
    this.auctionService.conveyanceHasEdit = true;
    if ([AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT, AuctionMenu.VIEW_CASHIER].includes(this.actionMenu)) {
      let checked = e.target.checked;
      this.conveyanceDeedGroupDocuments = this.conveyanceDeedGroupDocuments.map(
        (m: ConveyanceDeedGroupDocumentExtend) => {
          if (checked && !this.auctionService.relatedDeedGroupIDs?.some((s: any) => s === m?.deedGroupId)) {
            m.hided = checked;
          } else {
            m.hided = false;
          }
          return m;
        }
      );
    }
  }

  onClickActive(element: any) {
    this.auctionService.conveyanceHasEdit = true;
    element.active = !element.active;
  }

  checkReady() {
    this.conveyanceDeedGroupDocuments.map((m: any) => {
      const conveyanceDeed = m.conveyanceDeedGroupUploadDocuments;
      let readyForContract = conveyanceDeed.filter((f: any) => f.active).every((v: DocumentDto) => v.imageId);
      let readyForDeed = m.deedDocumentsMapping.every((v: DocumentDto) => v.imageId);
      if (m.deedConfig) m.deedConfig.ready = readyForDeed;
      if (!m.deedConfig) {
        let dconf = { ...this.deedConfig };
        m = Object.assign(m, {
          deedConfig: dconf,
        });
      }
      m.deedConfig.classTitle = 'text-gray-700';
      m.deedConfig.classInput = (m.deedConfig.ready ? 'bg-l-green' : 'bg-l-gray') + ' input-xsm icon no-border pl-8';
      m.readyForContract = readyForContract;
      m.readyForSet = readyForDeed && readyForContract;
      return m;
    });
  }
}
