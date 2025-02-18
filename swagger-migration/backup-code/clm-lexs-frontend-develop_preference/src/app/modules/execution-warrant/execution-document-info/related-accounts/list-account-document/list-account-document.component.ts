import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { BlobType } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils';
import { DocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-account-document',
  templateUrl: './list-account-document.component.html',
  styleUrls: ['./list-account-document.component.scss'],
})
export class ListAccountDocumentComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('uploadTable') uploadTable!: MatTable<any>;

  public acceptFile: Array<string> = [BlobType.EXCEL_SHEET];
  public columns: string[] = ['no', 'documentName', 'action'];
  public exceedFileSize: boolean = false;
  public isUploadFail: boolean = false;
  public documentObject: DocumentDto[] = []; // Defind Object for DocumentDTO
  public accountNo: string = '';
  public caseId: string = '';
  public docTemplate = DOC_TEMPLATE;
  dataContextGet: any;
  isChecked: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public context: any,
    private executionWarrantService: ExecutionWarrantService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private documentService: DocumentService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.caseId = this.taskService.taskDetail.litigationCaseId || '';
  }

  async openDoc(ele: any) {
    const _imageSource = ele.imageSource ? ele.imageSource : ele.documentTemplate.searchType;
    let res = await this.documentService.getDocument(ele.imageId, _imageSource);
    this.documentService.openPdf(res, ele.imageName);
  }

  selectDocument(_index: number = 0) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        if (Utils.validateFileSize(file.size)) {
          this.exceedFileSize = false;
        } else {
          this.exceedFileSize = true;
          this.isUploadFail = true;
          break;
        }
        this.uploadDocument(file, _index);
      }
    };
    fileInput.click();
  }

  async uploadDocument(file: any, index: number) {
    if (!this.acceptFile.includes(file.type)) {
      this.isUploadFail = true;
      return;
    } else {
      this.executionWarrantService
        .uploadDocumentTfsPaymentHistory(this.accountNo, Number(this.caseId), file)
        .then(postResult => {
          this.documentObject[index].imageId = postResult.uploadSessionId;
          this.notificationService.openSnackbarSuccess(`${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);
        })
        .catch(error => {
          this.isUploadFail = true;
          return;
        });
    }
  }

  dataContext(data: any) {
    this.documentObject = data.element.documents;
    if (!this.documentObject.some(e => e.documentTemplateId === DOC_TEMPLATE.LEXSF118)) {
      this.columns = ['no', 'documentName'];
    } else {
      this.columns = ['no', 'documentName', 'action'];
    }
    this.accountNo = data.element.accountNumber;
    this.dataContextGet = data.element;
    this.isChecked = data.isChecked;
  }
}
