import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { IUploadMultiInfo, acceptFile_PDF_JPG, maxFileSize } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../document-preparation/document.service';

interface IDocument extends DocumentDto {
  uploadRequired: boolean;
  updateFlag?: 'A' | 'D' | 'U';
  hide?: boolean; // hide from table; once hidden cannot be shown again
  sequence?: number;
}

@Component({
  selector: 'app-upload-file-table-auto-increment',
  templateUrl: './upload-file-table-auto-increment.component.html',
  styleUrls: ['./upload-file-table-auto-increment.component.scss'],
})
export class UploadFileTableAutoIncrementComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('uploadTable') uploadTable!: MatTable<any>;

  @Input() initialDocuments: DocumentDto[] | undefined;
  @Input() uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  @Input() documentTemplateId: string | undefined;
  @Input() documentName: string | undefined;

  @Output() documentChange = new EventEmitter<IDocument[] | null>();

  public acceptFile: Array<string> = acceptFile_PDF_JPG;
  public columns: string[] = ['order', 'documentName', 'documentDate', 'action'];
  public documents: IDocument[] = [];
  public exceedFileSize: boolean = false;

  private _baseDocumentName: string = '';
  private _documentTemplateId: string = '';
  private maxFileSize: number = maxFileSize; // MB Size

  constructor(
    private documentService: DocumentService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.initialDocuments) {
      this._baseDocumentName = this.initialDocuments[0].documentTemplate?.documentName || '';
      this._documentTemplateId = this.initialDocuments[0].documentTemplateId || '';
      // load existing documents
      this.documents = this.initialDocuments
        ? this.initialDocuments
            .filter(doc => doc.active)
            .map((doc, i) => ({
              ...doc,
              sequence: i,
              uploadRequired: i === 0,
            }))
        : [];
      // also push new empty row
      this.documents.push({
        active: false,
        documentTemplateId: this._documentTemplateId,
        documentTemplate: {
          documentName: this._baseDocumentName,
          documentTemplateId: this._documentTemplateId,
          forLitigation: false,
          forNoticeLetter: false,
          needHardCopy: false,
          optional: true,
          requiredDocumentDate: true,
        },
        imageId: undefined,
        uploadRequired: false,
        documentDate: undefined,
        sequence: this.documents.length,
      });
    } else {
      // if empty, push 2 rows (one required, one not required)
      this._baseDocumentName = this.documentName || '';
      this._documentTemplateId = this.documentTemplateId || '';
      this.documents = [
        {
          active: true,
          documentTemplateId: this._documentTemplateId,
          documentTemplate: {
            documentName: this._baseDocumentName,
            documentTemplateId: this._documentTemplateId,
            forLitigation: false,
            forNoticeLetter: false,
            needHardCopy: false,
            optional: true,
            requiredDocumentDate: true,
          },
          imageId: undefined,
          uploadRequired: true,
          documentDate: undefined,
          sequence: 0,
        },
        {
          active: false,
          documentTemplateId: this._documentTemplateId,
          documentTemplate: {
            documentName: this._baseDocumentName,
            documentTemplateId: this._documentTemplateId,
            forLitigation: false,
            forNoticeLetter: false,
            needHardCopy: false,
            optional: true,
            requiredDocumentDate: true,
          },
          imageId: undefined,
          uploadRequired: false,
          documentDate: undefined,
          sequence: 1,
        },
      ];
    }
  }

  onUploadClick(fileIndex: number) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = fileInput.files[index];
        this.onUpload(file, fileIndex);
      }
    };
    fileInput.click();
  }

  async onUpload(file: any, index: number) {
    const _file = this.documentService.validateFileType(file);

    if (Utils.validateFileSize(_file.size, this.maxFileSize)) {
      this.exceedFileSize = false;
      this.documents[index] = {
        ...this.documents[index],
        updateFlag: this.documents[index].documentId ? 'U' : 'A',
        imageId: await this.uploadDocument(_file, this._documentTemplateId || ''),
      };
      if (this.documents[index].imageId) this.documents[index].documentDate = new Date().toISOString();

      this.uploadTable.renderRows();
      this.emitDocumentEvent();
    } else {
      this.exceedFileSize = true;
      this.uploadTable.renderRows();
      this.emitDocumentEvent();
      this.notificationService.openSnackbarError(
        this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
      );
    }
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      const response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async onRemoveDocument(index: number) {
    // if that row is not active, hide the row
    if (!this.documents[index].active) {
      this.documents[index].hide = true;
    }
    this.documents[index].imageId = undefined;
    this.documents[index].documentDate = undefined;
    this.documents[index].updateFlag = this.documents[index].documentId ? 'D' : undefined;

    this.emitDocumentEvent();
    this.uploadTable.renderRows();
  }

  async onCheckboxCheck(event: any, index: number) {
    if (event.target.checked === true) {
      if (index === this.documents.length - 1) {
        // if last, add one more row
        this.documents.push({
          active: false,
          documentTemplateId: this._documentTemplateId,
          documentTemplate: {
            documentName: this._baseDocumentName,
            documentTemplateId: this._documentTemplateId,
            forLitigation: false,
            forNoticeLetter: false,
            needHardCopy: false,
            optional: true,
            requiredDocumentDate: true,
          },
          imageId: undefined,
          uploadRequired: false,
          documentDate: undefined,
          sequence: this.documents.length,
        });
      }
      this.documents[index].active = true;
      this.documents[index].updateFlag = this.documents[index].documentId ? 'U' : 'A';
    } else {
      this.documents[index].hide = true;
      this.documents[index].active = false;
      this.documents[index].updateFlag = this.documents[index].documentId ? 'D' : undefined;
    }

    this.updateSequence();
    this.emitDocumentEvent();
    this.uploadTable.renderRows();
  }

  updateSequence() {
    let sequence = 0;
    this.documents.forEach(doc => {
      if (!doc.hide) {
        doc.sequence = sequence;
        sequence++;
      } else {
        doc.sequence = undefined;
      }
    });
  }

  async onViewDocument(index: number) {
    const response: any =
      !!this.documents[index].imageId &&
      (await this.documentService.getDocument(this.documents[index].imageId || '', DocumentDto.ImageSourceEnum.Lexs));
    if (!response) return;
    const fileName = this.documents[index].documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  emitDocumentEvent() {
    this.documentChange.emit(this.documents.filter(doc => !doc.hide || doc.updateFlag));
  }
}
