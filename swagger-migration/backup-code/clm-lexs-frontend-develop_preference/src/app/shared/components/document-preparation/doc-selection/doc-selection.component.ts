import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '@app/modules/customer/customer.service';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { acceptFile_PDF_JPG } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  DimsDocumentResponse,
  DocumentDto,
  DocumentRequest,
  DocumentSearchResponse,
  DocumentUploadResponse,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { BuddhistEraPipe } from '@spig/core';
import { DocumentAccountService } from '../document-account.service';
import { DocumentService } from '../document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Component({
  selector: 'app-doc-selection',
  templateUrl: './doc-selection.component.html',
  styleUrls: ['./doc-selection.component.scss'],
  providers: [BuddhistEraPipe],
})
export class DocSelectionComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  public docColumns: string[] = ['checkbox', 'imageName', 'createdDate'];
  ImageSourceEnum = DocumentDto.ImageSourceEnum;
  RelationType = DocumentDto.ObjectTypeEnum;
  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;
  form!: UntypedFormGroup;
  today = new Date();
  bannerOption: any = {
    type: 'fail',
    icon: 'icon-Error',
  };
  isShowBanner: boolean = false;
  docSelected: any = {};
  error = {
    hasSelect: false,
  };
  public permissionsOnScreen = {
    canUploadDoc: false,
  };
  isNotFoundDoc = false;
  dataSource = new MatTableDataSource();
  uploadFiles: Array<any> = []; //for check logic when cancal
  key = `${this.data.objectType || ''}${this.data.documentId || this.data.documentTemplateId}`;
  templatePrimary = [
    DOC_TEMPLATE.LEXSD002_1,
    DOC_TEMPLATE.LEXSD002_2,
    DOC_TEMPLATE.LEXSD001,
    DOC_TEMPLATE.LEXSF130,
    DOC_TEMPLATE.LEXSF130_2,
    DOC_TEMPLATE.LEXSF131,
    DOC_TEMPLATE.LEXSF131_2,
    DOC_TEMPLATE.LEXSF132,
    DOC_TEMPLATE.LEXSF132_2,
  ];
  maxFileSize = 30;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private sessionService: SessionService,
    private fb: UntypedFormBuilder,
    private buddhistEraPipe: BuddhistEraPipe,
    private defermentService: DefermentService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      searchText: ['', Validators.minLength(3)],
    });
    if (this.data?.documentTemplate?.requiredDocumentDate) {
      this.form.addControl('date', new UntypedFormControl('', Validators.required));
    }
    if (!this.data.allowUpload && this.data?.documentTemplate.documentGroup === 'PERSON_LCS') {
      this.dataSource.data = [];
    } else {
      this.searchDocuments(this.data);
    }
    if (this.data?.maxFileSize) {
      this.maxFileSize = this.data?.maxFileSize;
    }
    this.initPermission();
    this.checkBanner();
  }

  checkBanner() {
    if (this.data.documentTemplateId == DOC_TEMPLATE.LEXSD001) {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: 'กรุณาตรวจสอบสำเนาเอกสารต่อไปนี้(ถ้ามี) ในสำเนาก่อนดำเนินการต่อ',
        icon: 'icon-Error',
        subMessage: [
          'หนังสือรับรองการจดทะเบียนเป็นนิติบุคคล',
          'สำเนาบัตรประชาชน/passport ของผู้มีอำนาจลงนาม \n (ในกรณีเป็นนิติบุคคลประเภทห้างหุ้นส่วนจำกัด)',
        ],
      };
    }

    if (
      this.data.documentTemplateId == DOC_TEMPLATE.LEXSD002_1 ||
      this.data.documentTemplateId == DOC_TEMPLATE.LEXSD002_2
    ) {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: 'กรุณาตรวจสอบสำเนาเอกสารต่อไปนี้ก่อนดำเนินการต่อไป',
        icon: 'icon-Error',
        subMessage: ['สำเนาบัตรประชาชน/passport', 'สำเนาทะเบียนบ้าน', 'สำเนาใบทะเบียนสมรส'],
      };
    }

    if (this.data.documentTemplateId == DOC_TEMPLATE.LEXSD013) {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: 'กรุณาตรวจสอบสำเนาเอกสารต่อไปนี้(ถ้ามี) ก่อนดำเนินการต่อไป',
        icon: 'icon-Error',
        subMessage: [
          'คำขอกู้ฯ',
          'สัญญากู้เงิน หรือสัญญารับชำระหนี้',
          'แบบคำขอเสียอากรแสตมป์เป็นตัวเงินและใบเสร็จรับเงิน (อส.4ข)',
          'หนังสือให้ความยินยอมหักเงินฝากจากบัญชีเงินฝาก',
          'ใบสมัครสมาชิกบัตรฟลีทการ์ด ข้อตกลงและเงื่อนไขการใช้บัตรฟลีทการ์ด',
          'บันทึกเพิ่มเติมต่อท้ายของใบสมัครสมาชิกบัตรฟลีทการ์ด',
          'หนังสือให้ความยินยอมในการทำสัญญาประกันภัย/ต่ออายุกรมธรรม์ประกันภัย',
        ],
      };
    }

    if (this.data.documentTemplateId == DOC_TEMPLATE.LEXSD015) {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: 'กรุณาตรวจสอบสำเนาเอกสารต่อไปนี้(ถ้ามี) ก่อนดำเนินการต่อไป',
        icon: 'icon-Error',
        subMessage: ['บันทึกเพิ่มเติ่มต่อท้ายสัญญากู้ฯ', 'แบบคำขอเสียอากรแสตมป์เป็นตัวเงินและใบเสร็จรับเงิน (อส.4ข)'],
      };
    }

    if (this.data.documentTemplateId == DOC_TEMPLATE.LEXSD016) {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: 'กรุณาตรวจสอบสำเนาเอกสารต่อไปนี้(ถ้ามี) ก่อนดำเนินการต่อไป',
        icon: 'icon-Error',
        subMessage: [
          'สัญญาปรับปรุงโครงสร้างหนี้',
          'หนังสือรับสภาพหนี้/หนังสือรับชำระหนี้แทน',
          'แบบคำขอเสียอากรแสตมป์เป็นตัวเงินและใบเสร็จรับเงิน (อส.4ข)',
        ],
      };
    }
    if (this.data.documentTemplateId == DOC_TEMPLATE.LEXSD016 && this.data.type === 'Deferment') {
      this.isShowBanner = true;
      this.bannerOption = {
        type: 'fail',
        message: `กรณีมี หนังสือรับสภาพหนี้/หนังสือรับชำระหนี้แทน หรือ แบบคำขอเสียภาษีอากรแสตมป์เป็นตัวเงิน
        และใบเสร็จรับเงิน (อส.4ข) กรุณาอัปโหลดในไฟล์เดียวกับสัญญาปรับปรุงโครงสร้างหนี้`,
        icon: 'icon-Error',
        subMessage: [],
      };
    }
  }

  selectDocument() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        this.uploadDocument(file);
      }
    };
    fileInput.click();
  }

  selection = new SelectionModel<any>(this.data.allowMultiple);

  selectFile(e: any) {
    let needHardCopy = this.data?.documentTemplate?.needHardCopy == false;
    this.error.hasSelect = false;
    this.docSelected = {
      readyForLitigation: false,
      readyForNotice: false,
      active: true,
      personId: this.data.personId,
      subDocumentId: this.data?.subDocumentId,
      documentId: this.data.documentId,
      documentTemplate: this.data.documentTemplate,
      documentTemplateId: this.data.documentTemplateId,
      objectType: this.data.objectType,
      objectId: this.data.objectId,
      hasOriginalCopy: needHardCopy ? true : this.data.hasOriginalCopy,
      ...e,
      updateFlag: this.UpdateFlagEnum.U,
    };

    if (e.imageId) {
      this.docSelected.readyForNotice = true;
    }
    if (this.data.hasOriginalCopy || needHardCopy) {
      this.docSelected.readyForLitigation = true;
    }
  }
  selectMultipleFiles(e: any) {
    this.selection.toggle(e);
  }
  initPermission() {
    this.permissionsOnScreen.canUploadDoc = this.sessionService.hasPermission(PCode.CUSTOMERS_UPLOAD_DOCS);
  }

  async uploadDocument(file: any) {
    if (!Utils.validateFileSize(file.size, this.maxFileSize)) {
      this.notificationService.openSnackbarError(
        this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
          SIZE_EXCEED: this.maxFileSize.toString(),
        })
      );
      return;
    }
    if (!acceptFile_PDF_JPG.includes(file.type)) {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }
    console.log('uploadDocument');
    console.log(this.documentService?.customer?.customerId);
    let cif: any =
      this.data.objectType == this.RelationType.Person
        ? this.data.personId
        : this.documentService?.customer?.customerId || this.customerService?.customerDetail?.customerId;

    let litigationId = this.documentService?.customer?.litigationId || '';

    let res = (await this.documentService.uploadDocument(
      cif,
      this.data.documentTemplate?.documentTemplateId || this.data.documentTemplateId,
      file,
      litigationId
    )) as DocumentUploadResponse;

    if (res) {
      let date = Utils.getCurrentDate();
      if (this.data.documentTemplate?.requiredDocumentDate) {
        if (this.docSelected.createdDate) {
          date = this.docSelected.createdDate;
        } else {
          this.form.get('date')?.setValue(date);
        }
      }
      let user = this.sessionService.currentUser;
      let newObj: any = {
        active: true,
        imageName: file.name,
        createdDate: new Date(date),
        imageSource: DocumentDto.ImageSourceEnum.Lexs,
        imageId: res.uploadSessionId,
        docRefId: null,
        storeOrganizationName: user?.originalOrganizationName,
        storeOrganization: user?.originalOrganizationCode,
        documentId: this.data.documentId,
        uploadUserId: user?.userId,
        updateFlag: this.UpdateFlagEnum.U,
        objectType: this.data.objectType,
        objectId: this.data.objectId,
        documentTemplateId: this.data.documentTemplateId,
        documentTemplate: this.data.documentTemplate,
        uploadedFromDeferment: this.data.type === 'Deferment',
      };

      if (!this.documentService.uploadedFiles[this.key]) {
        this.documentService.uploadedFiles[this.key] = [];
      }
      this.documentService.uploadedFiles[this.key] = this.documentService.uploadedFiles[this.key].concat(newObj);
      this.uploadFiles.push(newObj);
      this.dataSource.data = this.documentService.uploadedFiles[this.key];
      this.notificationService.openSnackbarSuccess(` ${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);

      if (this.data.allowMultiple) {
        this.selection.select(newObj);
      } else {
        this.selectFile(newObj);
      }
    } else {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
    }
  }

  async searchDocuments(ele: any) {
    let id: string = this.documentService?.customer?.customerId;
    let uploadedFilesAtKey = this.documentService.uploadedFiles[this.key]
      ? [...this.documentService.uploadedFiles[this.key]]
      : [];
    if (this.data.type === 'Deferment' && uploadedFilesAtKey.length > 0) {
      // no need to look for original files again as they have been found
      this.dataSource.data = uploadedFilesAtKey;
      return;
    }
    this.dataSource.data = uploadedFilesAtKey;

    if (ele?.documentTemplate?.searchType !== this.ImageSourceEnum.Lexs) {
      let res = (await this.documentService.searchDocuments(
        id,
        ele.documentTemplate?.documentTemplateId || ele.documentTemplateId,
        ele.objectId,
        ele.objectType
      )) as Array<DocumentSearchResponse>;
      if (res) {
        if (res.length > 0) {
          //check duplicate dim upload
          if (!uploadedFilesAtKey?.some((f: any) => f.imageId == res[0]?.imageId)) {
            uploadedFilesAtKey = uploadedFilesAtKey.concat(res);
          }
          if (this.data.type === 'Deferment') {
            uploadedFilesAtKey = this.disableUsedImage(uploadedFilesAtKey);
            this.dataSource.data = uploadedFilesAtKey;
          } else {
            this.dataSource.data = uploadedFilesAtKey;
          }
        } else {
          if (this.data.type === 'Deferment') {
            uploadedFilesAtKey = this.disableUsedImage(uploadedFilesAtKey);
            this.dataSource.data = uploadedFilesAtKey;
          } else {
            this.dataSource.data = uploadedFilesAtKey;
          }
          if (res.length == 0 && ele?.documentTemplate?.searchType == this.ImageSourceEnum.Dims) {
            this.isNotFoundDoc = true;
          }
        }
        // put data source back to the service
        this.documentService.uploadedFiles[this.key] = uploadedFilesAtKey;
      }
    }
  }

  disableUsedImage(uploadedFilesAtKey: any[]) {
    let usedImageIds = this.defermentService.deferment?.usedImageIds || [];
    return uploadedFilesAtKey?.map((f: any) => {
      let index = usedImageIds?.findIndex((s: string) => s === f?.imageId) || 0;
      if (index > -1) {
        f.disabled = true;
      }
      return f;
    });
  }

  onSearchText() {
    this.form.get('searchText')?.markAllAsTouched();
    this.form.get('searchText')?.updateValueAndValidity();
    if (this.form.get('searchText')?.valid) {
      this.dataSource.filter = this.form.get('searchText')?.value;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAllMultiple(event: any) {
    let hasDisable = this.selection.selected.findIndex(f => f?.disabled);
    if (hasDisable === -1 && this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.dataSource?.data?.forEach((e: any) => {
      if (this.isAllSelected()) {
        if (!e?.disabled) {
          this.selection.deselect(e);
        } else {
          this.selection.select(e);
        }
      } else {
        this.selection.select(e);
      }
    });
  }

  updateDocument() {
    if (this.data.type === 'BorrowerGuarantor') {
      this.documentService.updateDocumentPerson(this.docSelected);
    }
    if (this.data.type === 'Collateral') {
      this.documentService.updateDocumentCollateral(this.docSelected);
    }
    if (this.data.type === 'Account') {
      this.documentAccountService.updateDocumentAccount(this.docSelected);
    }
  }
  async save() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    let isValid: any = this.data?.documentTemplate?.requiredDocumentDate ? this.form.get('date')?.valid : true;
    if (Object.values(this.docSelected).length <= 0 && this.selection.selected.length === 0) {
      this.error.hasSelect = true;
      return;
    } else {
      this.documentService.hasEdit = true;
    }
    if (isValid) {
      if (!this.data.allowMultiple) {
        if (this.docSelected.imageSource == this.ImageSourceEnum.Dims) {
          let res = (await this.documentService.getDimsDocument(this.docSelected.imageId)) as DimsDocumentResponse;
          if (res) {
            this.docSelected = {
              ...this.docSelected,
              readyForLitigation: true,
              hasOriginalCopy: true,
              ownerOrganization: res.ownerOrganization,
              storeOrganization: res.storeOrganization,
              storeOrganizationName: res.storeOrganizationName,
              handlingOrganization: res.handlingOrganization,
              documentId: this.data.documentId,
            };
          } else {
            this.docSelected = {
              ...this.docSelected,
              readyForLitigation: false,
              hasOriginalCopy: false,
            };
          }
          this.updateDocument();
        } else {
          this.updateDocument();
        }

        this.uploadFiles = [];
        this.matDialog.closeAll();
      } else {
        // multiple selection
        const selectedDocuments = [...this.selection.selected];
        const mappedDocs = selectedDocuments.map(sd => ({
          ...sd,
          objectType: this.data.objectType,
          objectId: this.data.objectId,
          documentTemplateId: this.data.documentTemplateId,
          commitmentAccounts: this.data.type === 'Deferment' ? sd.commitmentAccounts : [],
          active: true,
          documentDate: sd.createdDate,
          updateFlag: this.UpdateFlagEnum.A,
          documentTemplate: {
            ...this.data.documentTemplate,
            forLitigation: true,
            forNoticeLetter: true,
            needHardCopy: true,
            documentName:
              this.data.type === 'Deferment'
                ? this.data.documentTemplate.documentName
                : this.data.subDocumentPrefix + ' ' + this.buddhistEraPipe.transform(sd.createdDate, 'DD/MM/YYYY'),
          },
          readyForNotice: sd.imageId ? true : false,
        }));
        await Promise.all(
          mappedDocs.map(async selectedDocument => {
            if (selectedDocument.imageSource == this.ImageSourceEnum.Dims) {
              let res = (await this.documentService.getDimsDocument(selectedDocument.imageId)) as DimsDocumentResponse;
              if (res) {
                return {
                  ...selectedDocument,
                  readyForLitigation: true,
                  hasOriginalCopy: true,
                  ownerOrganization: res.ownerOrganization,
                  storeOrganization: res.storeOrganization,
                  storeOrganizationName: res.storeOrganizationName,
                  handlingOrganization: res.handlingOrganization,
                };
              } else {
                return {
                  ...selectedDocument,
                  readyForLitigation: false,
                  hasOriginalCopy: false,
                };
              }
            } else {
              return selectedDocument;
            }
          })
        ).then(resDocs => {
          if (this.data.type === 'Account') {
            this.documentAccountService.updateDocumentAccountMultiple(resDocs, this.data);
          }
          if (this.data.type === 'Deferment') {
            // let correctDoc = resDocs.filter(f => !f?.disabled);
            this.defermentService.updateDocumentDeferment(resDocs);
          }
          this.matDialog.closeAll();
        });
      }
    }
  }

  getControl(name: string): any {
    return this.form.get(name);
  }

  clearFiles(uploadFiles: any) {
    return this.documentService.uploadedFiles[this.key].filter(
      (f: any) => !uploadFiles.some((s: any) => s.imageId == f.imageId)
    );
  }

  cancel() {
    if (this.uploadFiles.length > 0) {
      this.documentService.uploadedFiles[this.key] = this.clearFiles(this.uploadFiles);
    }
    this.dataSource.data = this.documentService.uploadedFiles;
    this.uploadFiles = [];
  }

  selectData(e: any) {
    this.docSelected.createdDate = e;
  }

  onClickPdf(element: any) {
    this.onViewDocument(element?.imageId, element?.imageName, element?.imageSource);
  }

  async onViewDocument(imageId: string, fileName: string, imageSource: string = DocumentDto.ImageSourceEnum.Lexs) {
    const response: any = await this.documentService.getDocument(imageId, imageSource);
    if (!response) return;
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }
}
