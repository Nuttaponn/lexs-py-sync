import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IUploadInfo } from '@app/shared/models';
import { DocumentDto, LitigationNoticeDto, NoticeLetterDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-upload-newspaper',
  templateUrl: './upload-newspaper.component.html',
  styleUrls: ['./upload-newspaper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadNewspaperComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  uploadInfo: IUploadInfo = { cif: '', documentTemplateId: '', litigationId: '' };
  isSubmited = false;

  dataSource = new MatTableDataSource();
  ImageSourceEnum = DocumentDto.ImageSourceEnum;
  UpdateFlagEnum = NoticeLetterDto.UpdateFlagEnum;
  isupload = false;

  litigationNoticeDto!: LitigationNoticeDto;

  public formgroup: UntypedFormGroup = this.initForm();
  get formData() {
    return this.formgroup.controls;
  }
  constructor(public fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  async dataContext(data: any) {
    this.litigationNoticeDto = data.litigationNoticeDto;
    this.uploadInfo = {
      cif: this.litigationNoticeDto?.primaryCif ?? '',
      documentTemplateId: this.litigationNoticeDto?.documentTemplateId ?? '',
      litigationId: this.litigationNoticeDto.litigationId,
    };
  }

  initForm() {
    return this.fb.group({
      uploadSessionId: ['', Validators.required],
      NEWS_DATE: [null, Validators.required],
      NEWS_FRIST_DATE: [null, Validators.required],
      NEWS_LAST_DATE: [null, Validators.required],
      NEWS_DUE_DATE: [null, Validators.required],
    });
  }

  getControl(name: string): any {
    return this.formgroup.get(name);
  }

  public async onClose(): Promise<boolean> {
    if (this.formgroup.invalid) {
      this.formData['NEWS_DATE'].markAsTouched();
      this.formData['NEWS_DATE'].updateValueAndValidity();
      this.formData['NEWS_FRIST_DATE'].markAsTouched();
      this.formData['NEWS_FRIST_DATE'].updateValueAndValidity();
      this.formData['NEWS_LAST_DATE'].markAsTouched();
      this.formData['NEWS_LAST_DATE'].updateValueAndValidity();
      this.formData['NEWS_DUE_DATE'].markAsTouched();
      this.formData['NEWS_DUE_DATE'].updateValueAndValidity();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    let newObj: any = {
      noticeDate: this.formData['NEWS_DATE'].value,
      firstNoticeDate: this.formData['NEWS_FRIST_DATE'].value,
      lastNoticeDate: this.formData['NEWS_LAST_DATE'].value,
      noticeDueDate: this.formData['NEWS_DUE_DATE'].value,
      noticeStatus: NoticeLetterDto.NoticeStatusEnum.SuccessNotice,
      updateFlag: NoticeLetterDto.UpdateFlagEnum.U,
      uploadSessionId: this.formData['uploadSessionId'].value,
    };
    return newObj;
  }

  setuploadSessionId(ssid: any) {
    this.formData['uploadSessionId'].setValue(ssid);
    if (ssid) this.isSubmited = false;
  }
}
