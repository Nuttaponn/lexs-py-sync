import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { BlobType, TMode, maxFileSize, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import { DocumentDto, DocumentTemplateDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-conclude-calculate-debt',
  templateUrl: './conclude-calculate-debt.component.html',
  styleUrls: ['./conclude-calculate-debt.component.scss'],
})
export class ConcludeCalculateDebtComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('uploadTable') uploadTable!: MatTable<any>;

  @Input() writOfExecType: string = '';
  @Input() mode!: TMode;
  @Input() litigationCaseId?: string;
  @Input() nonEditable: boolean = false;

  @Output() fileInvalid = new EventEmitter<boolean>();

  public columns: string[] = ['no', 'documentName', 'documentDate', 'action'];
  public acceptFile: Array<string> = [BlobType.EXCEL_SHEET];

  //Calculate Debt Document Set
  public documentSet: DocumentDto[] =
    this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.debtCalculationDocuments || [];
  public isDocumentUploaded: boolean = false;
  public isSelectedOptionalCheckBox: boolean = false;
  public selection = new SelectionModel<any>(true, []);
  public documentTemplateSet: DocumentTemplateDto | undefined;
  public taskCode: string = '';

  constructor(
    private executionWarrantService: ExecutionWarrantService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private documentService: DocumentService,
    private taskService: TaskService,
    private sessionService: SessionService,
    private logger: LoggerService
  ) {}

  get isOwnerTask(): boolean {
    const _owner = this.taskService.taskOwner;
    if (_owner && this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.documentTemplateSet = this.documentSet[0].documentTemplate;
    if (this.mode === 'EDIT') {
      this.taskCode = this.taskService.taskDetail.taskCode ?? '';
      if (this.nonEditable) {
        this.columns = ['no', 'documentName', 'documentDate'];
      } else {
        if (this.taskCode === taskCode.R2E04_01_2B) {
          this.columns = ['no', 'documentName', 'documentDate'];
        } else if (this.taskCode !== taskCode.R2E04_03_3A) {
          if (this.documentSet[this.documentSet.length - 1].imageId) {
            this.documentSet.push(this.getOptionalDocument());
          }

          // หากไม่มีการ upload document อันดับแรก (จาก owner task)
          // จะ disable upload btn ไม่ให้ users (klaw ฝ่ายบอกกล่าว คำนวณภาระหนี้) upload
          if (!!!this.documentSet[0].imageId) {
            this.documentSet[0].attributes = {
              disabled: !!!this.isOwnerTask,
            };
          }
        } else {
          this.columns = ['no', 'documentName', 'documentDate'];
        }
      }
    } else {
      if (this.documentSet[this.documentSet.length - 1].imageId) {
        this.documentSet.push(this.getOptionalDocument());
      }
      // หากไม่มีการ upload document อันดับแรก (จาก owner task)
      // จะ alway disable upload btn ไม่ให้ users ในหน้า view mode
      if (!!!this.documentSet[0].imageId) {
        this.documentSet[0].attributes = {
          disabled: true,
        };
      }
      if (this.nonEditable) {
        this.columns = ['no', 'documentName', 'documentDate'];
      }
    }
  }

  getOptionalDocument(): DocumentDto {
    let doc: DocumentDto = {};
    doc['documentTemplate'] = this.documentTemplateSet;
    doc['imageId'] = undefined;
    doc['documentId'] = 0;
    doc['documentTemplate'] = {
      ...this.documentTemplateSet,
      optional: true,
    };
    doc.active = false;
    return doc;
  }

  async openDoc(ele: any) {
    let res = await this.documentService.getDocument(ele.imageId, ele.imageSource);
    this.documentService.openPdf(res, ele.imageName);
  }

  masterToggle(e: any) {
    e.active = !e.active;
    this.selection.select(...this.documentSet);
  }

  selectDocument(indexDoc: any, ele: any) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        if (Utils.validateFileSize(file.size)) {
          this.fileInvalid.emit(false);
        } else {
          this.fileInvalid.emit(true);
          return this.notificationService.openSnackbarError(
            this.translate.instant('EXECUTION_WARRANT.CONCLUDE_CALCULATE_DEBT.UPLOAD_FAIL', {
              SIZE_EXCEED: maxFileSize.toString(),
            })
          );
        }
        this.uploadDocument(file, indexDoc, ele);
      }
    };
    fileInput.click();
  }

  handleExceedFileSize(event: boolean): void {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        if (Utils.validateFileSize(file.size)) {
          this.fileInvalid.emit(false);
        } else {
          this.fileInvalid.emit(true);
        }
      }
    };
  }

  async uploadDocument(file: any, index: any, ele: any) {
    if (!this.acceptFile.includes(file.type)) {
      this.fileInvalid.emit(true);
      this.notificationService.openSnackbarError(
        `${this.translate.instant('EXECUTION_WARRANT.CONCLUDE_CALCULATE_DEBT.UPLOAD_FAIL')}`
      );
      return;
    } else {
      const response = await this.executionWarrantService
        .postExecutionDocDebtCalculation(Number(this.litigationCaseId), file)
        .then(postResult => {
          return postResult;
        })
        .catch(error => {
          this.logger.catchError(error);
          return error;
        });
      if (response && response.error && response.error.errors) {
        this.fileInvalid.emit(true);
        this.notificationService.openSnackbarError(
          `${this.translate.instant('EXECUTION_WARRANT.CONCLUDE_CALCULATE_DEBT.UPLOAD_FAIL')}`
        );
      } else {
        this.fileInvalid.emit(false);
        this.documentSet[index] = {
          ...this.documentSet[index],
          imageSource: DocumentDto.ImageSourceEnum.Lexs,
          imageId: response.uploadSessionId,
          documentTemplate: {
            ...this.documentSet[index].documentTemplate,
            optional: false,
          },
          documentDate: new Date().toISOString(),
        };

        this.isSelectedOptionalCheckBox = false;
        this.isDocumentUploaded = true;
        this.notificationService.openSnackbarSuccess(`${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);

        /* Setup Document Object after uploaded mandatory */
        let doc: DocumentDto = {};
        doc['documentTemplate'] = this.documentTemplateSet;
        doc['imageId'] = undefined;
        doc['documentId'] = 0;
        doc['documentTemplate'] = {
          ...this.documentTemplateSet,
          optional: true,
        };
        doc.active = false;
        this.documentSet.push(doc);
        this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.debtCalculationDocuments
          ? (this.executionWarrantService.litigationCaseDebtCalculation.documentInfo.debtCalculationDocuments =
              this.documentSet)
          : [];
        this.logger.info('document render ', this.documentSet);
        this.uploadTable.renderRows();
      }
    }
  }
}
