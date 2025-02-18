import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IUploadInfo } from '@app/shared/models';
import { DocumentDto, DocumentRequest, LitigationNoticeDto, NoticeLetterDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-upload-noti',
  templateUrl: './upload-noti.component.html',
  styleUrls: ['./upload-noti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadNotiComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  uploadInfo: IUploadInfo = { cif: '', documentTemplateId: '', litigationId: '' };
  isSubmited = false;

  dataSource = new MatTableDataSource();
  ImageSourceEnum = DocumentDto.ImageSourceEnum;
  UpdateFlagEnum = DocumentRequest.UpdateFlagEnum;
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
      NOTI_DAY: [null, Validators.required],
    });
  }

  getControl(name: string): any {
    return this.formgroup.get(name);
  }

  public async onClose(): Promise<boolean> {
    this.isSubmited = true;
    if (this.formgroup.invalid) {
      this.formData['NOTI_DAY'].markAsTouched();
      this.formData['NOTI_DAY'].updateValueAndValidity();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    let newObj: any = {
      noticeDuration: this.formData['NOTI_DAY'].value,
      noticeDate: this.litigationNoticeDto.noticeDate,
      noticeStatus: NoticeLetterDto.NoticeStatusEnum.SuccessNotice,
      updateFlag: 'U',
      uploadSessionId: this.formData['uploadSessionId'].value,
    };
    return newObj;
  }

  setuploadSessionId(ssid: any) {
    this.formData['uploadSessionId'].setValue(ssid);
    if (ssid) this.isSubmited = false;
  }
}
