import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { acceptFile_PDF_JPG } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { CourtVerdictDto, DocumentUploadResponse } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-extend-dialog',
  templateUrl: './extend-dialog.component.html',
  styleUrls: ['./extend-dialog.component.scss'],
})
export class ExtendDialogComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  form!: UntypedFormGroup;

  dataSource = new MatTableDataSource();
  public docColumns: string[] = ['no', 'createdDate', 'imageName'];
  uploaded: any = {
    imageName: '',
    imageId: '',
    documentTemplateId: '',
  };
  minDate = new Date();
  litigationCaseId!: number;
  courtLevel: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private courtService: CourtService,
    private documentService: DocumentService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private lawsuitService: LawsuitService
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      date: ['', Validators.minLength(3)],
      file: ['', Validators.required],
    });
    let data = await this.courtService.getExtendAppealDetail(this.litigationCaseId);
    this.dataSource.data = data;
    if (data && data[0]) {
      const extendDate = new Date(data[0]?.extendDate || '');
      extendDate.setDate(extendDate.getDate() + 1);
      this.minDate = extendDate;
    }
    if (this.courtLevel === CourtVerdictDto.CourtLevelEnum.Civil) {
      this.uploaded.documentTemplateId = DOC_TEMPLATE.LEXSF083;
    }
    if (this.courtLevel === CourtVerdictDto.CourtLevelEnum.Appeal) {
      this.uploaded.documentTemplateId = DOC_TEMPLATE.LEXSF084;
    }
  }

  getControl(name: string): any {
    return this.form.get(name);
  }

  async dataContext(data: any) {
    this.litigationCaseId = data.litigationCaseId;
    this.courtLevel = data.courtLevel;
  }

  remove() {
    this.uploaded.imageName = '';
    this.uploaded.imageId = '';
  }

  get returnData() {
    return {
      attachment: {
        active: true,
        documentDate: this.form.get('date')?.value,
        documentId: 0,
        documentTemplate: {
          documentName: 'คำร้องขอขยายระยะเวลาอุทธรณ์',
          documentTemplateId: this.uploaded.documentTemplateId,
        },
        documentTemplateId: this.uploaded.documentTemplateId,
        imageId: this.uploaded.imageId,
        imageName: this.uploaded.imageName,
      },
      extendDate: this.form.get('date')?.value,
      litigationCaseId: this.litigationCaseId,
      litigationId: this.lawsuitService.currentLitigation.litigationId,
    };
  }

  public async onClose(): Promise<boolean> {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return false;
    }

    return true;
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

  async uploadDocument(file: any) {
    if (!acceptFile_PDF_JPG.includes(file.type)) {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }
    const litigation = this.lawsuitService.currentLitigation;
    const cif = litigation?.customerId || '';
    const litigationId = litigation?.litigationId || '';
    let res = (await this.documentService.uploadDocument(
      cif,
      this.uploaded.documentTemplateId,
      file,
      litigationId
    )) as DocumentUploadResponse;

    if (res) {
      this.uploaded.imageName = file.name;
      this.uploaded.imageId = res.uploadSessionId;
      this.notificationService.openSnackbarSuccess(` ${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);
    } else {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      this.uploaded.imageName = '';
      this.uploaded.imageId = '';
    }
  }

  async onViewDocument(ele: any) {
    const fileName = this.uploaded.imageName;
    let res: any = await this.documentService.getDocument(ele.attachment?.imageId, ele.attachment?.imageSource);
    this.documentService.openPdf(res, `${fileName}.${res?.type.split('/')[1]}`);
  }
}
