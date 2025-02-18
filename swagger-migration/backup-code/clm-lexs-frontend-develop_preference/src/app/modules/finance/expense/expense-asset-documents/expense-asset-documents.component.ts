import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IExpenseDocument } from '../expense-detail-view/expense-detail-view.component';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { Utils } from '@app/shared/utils';
import { SessionService } from '@app/shared/services/session.service';
import { ConfirmationFormDto, DocumentDto } from '@lexs/lexs-client';
import { BlobType, IUploadMultiInfo, acceptFile_PDF_JPG, maxFileSize } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expense-asset-documents',
  templateUrl: './expense-asset-documents.component.html',
  styleUrls: ['./expense-asset-documents.component.scss'],
})
export class ExpenseAssetDocumentsComponent implements OnInit {
  constructor(
    private documentService: DocumentService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  @Input() isReadDocument: boolean = false;
  @Input() uploadMultiInfo!: IUploadMultiInfo;
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;
  @Input() dataSource: IExpenseDocument[] = [];
  @Input() showErrors: boolean = false;

  @Output() documentChange: EventEmitter<IExpenseDocument[]> = new EventEmitter<IExpenseDocument[]>();

  @Input() cif: string | undefined;

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  public exceedFileSize: boolean = false;

  public maxFileSize: number = maxFileSize;
  public displayedColumns: string[] = ['no', 'documentTemplate', 'uploadUserId', 'subjectTo', 'documentDate'];

  ngOnInit(): void {
    if (!this.isReadDocument) {
      this.displayedColumns.push('delete');
      this.displayedColumns.push('active');
    }
  }

  onUploadDocument(_index: number, documentTemplateId: string = '', litigationId: string = '') {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.exceedFileSize = false;
          if (!this.isReadDocument) {
            this.dataSource[_index].imageId = (await this.uploadDocument(file, documentTemplateId, litigationId)) || '';
            this.dataSource[_index].isUpload = this.dataSource[_index].imageId ? true : false;
            this.dataSource[_index].uploadDate = this.dataSource[_index].imageId ? new Date().toDateString() : '';
            this.dataSource[_index].documentDate = this.dataSource[_index].imageId ? new Date().toISOString() : '';
            this.dataSource[_index].uploadUserId = this.dataSource[_index].imageId
              ? this.sessionService.currentUser?.userId
              : '-';
            this.dataSource[_index].subjectTo = this.dataSource[_index].imageId
              ? this.sessionService.currentUser?.factionName
              : '-';
            this.documentChange.emit(this.dataSource);
          } else {
            const resposnse = await this.readDocument(file);
            if (resposnse) {
              this.dataSource[_index].imageId = resposnse.confirmImageId;
              this.dataSource[_index].isUpload = true;
              this.dataSource[_index].uploadDate = this.dataSource[_index].imageId ? new Date().toDateString() : '';
              this.dataSource[_index].documentDate = this.dataSource[_index].imageId ? new Date().toISOString() : '';
              this.dataSource[_index].uploadUserId = this.dataSource[_index].imageId
                ? this.sessionService.currentUser?.userId
                : '-';
              this.dataSource[_index].subjectTo = this.dataSource[_index].imageId
                ? this.sessionService.currentUser?.factionName
                : '-';
              this.documentChange.emit(this.dataSource);
            } else {
              this.dataSource[_index].imageId = '';
              this.dataSource[_index].isUpload = false;
              this.dataSource[_index].uploadDate = '';
              this.dataSource[_index].documentDate = '';
              this.dataSource[_index].uploadUserId = '-';
              this.dataSource[_index].subjectTo = '-';
              this.documentChange.emit(this.dataSource);
            }
          }
        } else {
          this.exceedFileSize = true;
          this.dataSource[_index].imageId = '';
          this.dataSource[_index].isUpload = false;
          this.dataSource[_index].uploadDate = '';
          this.dataSource[_index].documentDate = '';
          this.dataSource[_index].uploadUserId = '-';
          this.dataSource[_index].subjectTo = '-';
          this.documentChange.emit(this.dataSource);
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
          );
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  async uploadDocument(_file: File, documentTemplateId: string, litigationId: string) {
    try {
      const response = await this.documentService.uploadDocument(
        this.cif || '',
        documentTemplateId,
        _file,
        litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error) {
      return null;
    }
  }

  async readDocument(_file: File): Promise<ConfirmationFormDto | null> {
    try {
      const taskIdNum = Number(this.uploadMultiInfo.taskId);
      if (Number.isNaN(taskIdNum)) {
        return null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  onRemoveDocument(_index: number, isRemoveSub: boolean = true) {
    if (!isRemoveSub) {
      this.dataSource = this.dataSource.filter((m: any, key: number) => {
        if (m?.documentTemplate?.documentTemplateId === this.dataSource[_index]?.documentTemplateId) {
          if (m.isSubContract) {
            return false;
          } else {
            m.imageId = '';
            m.isUpload = false;
            m.uploadDate = '';
            m.documentDate = '';
            m.uploadUserId = '';
            m.subjectTo = '';
            m.total = 0;
          }
        }
        return true;
      });
    } else {
      this.dataSource[_index].imageId = '';
      this.dataSource[_index].isUpload = false;
      this.dataSource[_index].uploadDate = '';
      this.dataSource[_index].documentDate = '';
      this.dataSource[_index].uploadUserId = '';
      this.dataSource[_index].subjectTo = '';
    }
    this.documentChange.emit(this.dataSource);
  }

  async onViewDocument(_index: number) {
    if (this.dataSource[_index].imageId === undefined || this.dataSource[_index].imageId === '') {
      return;
    }
    const searchType = this.dataSource[_index].documentTemplate?.searchType || 'LEXS';
    const imageSourceEnum = this.dataSource[_index].imageSource as DocumentDto.ImageSourceEnum;
    let imageSource = searchType === 'RLS' ? DocumentDto.ImageSourceEnum.Imp : DocumentDto.ImageSourceEnum.Lexs;
    if (imageSourceEnum) {
      imageSource = imageSourceEnum;
    }
    const response: any =
      !!this.dataSource[_index].imageId &&
      (await this.documentService.getDocument(this.dataSource[_index].imageId || '', imageSource));
    if (!response) {
      return;
    } else {
      let { type } = response;
      if (![BlobType.OCTET_STREAM, BlobType.PDF, BlobType.JPEG, BlobType.JPG].includes(type)) {
        await this.onDownloadDocument(response);
      } else {
        const fileName = this.dataSource[_index].documentTemplate?.documentName ?? 'doc';
        this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
      }
    }
  }

  async onDownloadDocument(data: any) {
    const response: any = await this.documentService.getDocument(data.imageId || '', DocumentDto.ImageSourceEnum.Lexs);
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, data.documentTemplate?.documentName || 'file' + type, type);
  }
}
