import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';

@Component({
  selector: 'app-withdrawn-seizure-property-upload-document',
  templateUrl: './withdrawn-seizure-property-upload-document.component.html',
  styleUrls: ['./withdrawn-seizure-property-upload-document.component.scss'],
})
export class WithdrawnSeizurePropertyUploadDocumentComponent implements OnInit {
  @Input() documentUpload: IUploadMultiFile[] = [];
  @Input() isUploadReadOnly: boolean = false;
  @Input() uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  @Input() formUploadControl: UntypedFormControl = new UntypedFormControl(false, Validators.requiredTrue);
  // uploadFor - Possible values: EXECUTION_RELATED
  @Input() uploadFor: string = '';
  @Input() hideBanner: boolean = false;
  @Input() hideTitle: boolean = false;
  @Input() title: string = 'COMMON.LABEL_REFERENCE_DOCUMENT';
  @Input() documentList: boolean = false;
  @Input() isAsset: boolean = false;
  @Input() fromProperty: boolean = false;
  @Output() onDownLoadForm = new EventEmitter();
  @Output() onUploadFileEvent = new EventEmitter<any>();

  public documentColumns: string[] = ['documentName', 'uploadDate'];

  constructor() {}

  ngOnInit(): void {
    if (this.uploadFor === 'EXECUTION_RELATED') {
      this.documentColumns = [
        'documentName',
        'executionCollateralId',
        'executionOwnerName',
        'executionLedName',
        'executionRedCaseNo',
        'uploadDate',
      ];
    }
    if (this.documentList) {
      this.documentColumns = [
        'documentName',
        'executionCollateralId',
        'executionOwnerName',
        'executionLedName',
        'uploadDate',
      ];
    }
  }

  uploadFileEvent(e: any) {
    console.log('this.formUploadControl', this.formUploadControl);
    if (!this.fromProperty) {
      this.formUploadControl.markAllAsTouched();
    }
    if (this.uploadFor !== 'EXECUTION_RELATED') {
      this.formUploadControl.setValue(e.every((doc: IUploadMultiFile) => doc.imageId));
    }
    this.onUploadFileEvent.emit(e);
  }

  download() {
    this.onDownLoadForm.emit();
  }

  get touched() {
    return this.formUploadControl && this.formUploadControl.touched;
  }

  get errors() {
    return this.formUploadControl ? this.formUploadControl.errors || null : null;
  }
}
