import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import {
  SuspendAuctionResultDocumentsAttributes,
  SuspendAuctionResultDocumentsUploadMultiFiles,
} from '@app/modules/deferment/deferment.model';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DatePickerChange, IUploadMultiFile, IUploadMultiInfo, statusCode, taskCode } from '@app/shared/models';
import { DocumentDto, InquiryDefermentRequest } from '@lexs/lexs-client';

@Component({
  selector: 'app-deferment-statements',
  templateUrl: './deferment-statements.component.html',
  styleUrls: ['./deferment-statements.component.scss'],
})
export class DefermentStatementsComponent implements OnInit {
  @Input() mode!: InquiryDefermentRequest.ModeEnum;
  @Input() dataStatementForm!: UntypedFormGroup;
  hasUploadedFiles: boolean = false;
  uploadMultiInfo: IUploadMultiInfo = {
    cif: this.taskService.litigationDetail.customerId || '',
    litigationId: this.taskService.litigationDetail.litigationId || '',
  };
  defermentUploadedFiles: Array<SuspendAuctionResultDocumentsUploadMultiFiles> = [];
  taskCode!: taskCode;
  statusCode!: statusCode;
  isOpened: boolean = true;
  documentUploadedColumnList: string[] = [];
  isFromTask: boolean = false;

  get uploadedFileCompleted(): boolean {
    const { errors, touched } = this.getSuspendAuctionResultDocumentsControls() as AbstractControl;
    return !!errors && touched;
  }

  constructor(
    private documentService: DocumentService,
    private taskService: TaskService
  ) {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.statusCode = this.taskService.taskDetail.statusCode as statusCode;
  }

  ngOnInit(): void {
    // Initail data by mode
    if (this.mode === 'EDIT') {
      if (this.taskCode === 'R2E07-05-E' && this.statusCode === 'PENDING') {
        this.documentUploadedColumnList = [
          'documentName',
          'collateralIds',
          'ledName',
          'redCaseNo',
          'uploadDate',
          'suspendAuctionEndDate',
        ];
      }
    } else if (this.mode === 'VIEW') {
      this.documentUploadedColumnList = [
        'no',
        'documentName',
        'collateralIds',
        'ledName',
        'redCaseNo',
        'uploadDate',
        'suspendAuctionEndDate',
        'lawyerName',
      ];
    }
    this.transformSuspendAuctionResultDocuments(this.mode);
  }

  transformSuspendAuctionResultDocuments(mode: InquiryDefermentRequest.ModeEnum) {
    this.defermentUploadedFiles = JSON.parse(
      JSON.stringify(
        this.getSuspendAuctionResultDocumentsControls()?.getRawValue() as SuspendAuctionResultDocumentsUploadMultiFiles[]
      )
    );
    if (mode === 'EDIT') {
      for (let document of this.defermentUploadedFiles) {
        document.uploadRequired = true;
        document.removeDocument = true;
      }
    }
  }

  getSuspendAuctionResultDocumentsControls() {
    return this.dataStatementForm.get('suspendAuctionResultDocuments') as UntypedFormArray;
  }

  onUploadFileEvent(list: IUploadMultiFile[] | null) {
    if (this.mode === 'EDIT') {
      this.getSuspendAuctionResultDocumentsControls().markAsUntouched();
      let uploadedDocument = [];
      if (!!list && list.length > 0) {
        for (let index = 0; index < list.length; index++) {
          const { isUpload, uploadRequired, removeDocument, attributes, ...fileObject } = list[index];
          const documentFile = this.getSuspendAuctionResultDocumentsControls().at(index)
            .value as SuspendAuctionResultDocumentsUploadMultiFiles;
          uploadedDocument.push({ ...fileObject, attributes: documentFile.attributes });
        }
      }
      this.getSuspendAuctionResultDocumentsControls().patchValue(uploadedDocument);
    }
  }

  async onViewDocument(index: number) {
    const selectedElement = this.defermentUploadedFiles[index];
    const response: any = await this.documentService.getDocument(
      selectedElement?.imageId || '',
      DocumentDto.ImageSourceEnum.Lexs
    );
    if (!response) return;
    const fileName = selectedElement.documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  onSuspendAuctionEndDateChange(value: DatePickerChange) {
    const { dateValue, index } = value;
    let documentSelected!: SuspendAuctionResultDocumentsUploadMultiFiles;
    documentSelected = JSON.parse(
      JSON.stringify(
        this.getSuspendAuctionResultDocumentsControls().at(index).value as SuspendAuctionResultDocumentsUploadMultiFiles
      )
    );
    const transformDocumentAttributes: SuspendAuctionResultDocumentsAttributes = {
      ...documentSelected.attributes,
      suspendAuctionEndDate: dateValue,
    };
    documentSelected = { ...documentSelected, attributes: transformDocumentAttributes };
    this.getSuspendAuctionResultDocumentsControls().markAsDirty();
    this.getSuspendAuctionResultDocumentsControls().at(index).patchValue(documentSelected);
  }

  wrapperCollateralIds(collateralIds: string[]) {
    let collateralIdsListTemplate = '';
    if (collateralIds.length > 0) {
      for (let id of collateralIds) {
        collateralIdsListTemplate += `<div>${id}</div>`;
      }
    }
    return collateralIdsListTemplate;
  }
}
