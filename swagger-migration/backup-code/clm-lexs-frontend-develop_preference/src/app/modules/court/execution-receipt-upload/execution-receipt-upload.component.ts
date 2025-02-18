import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { UploadFileAmountOutput } from '@app/shared/components/upload-file-amount-table/upload-file-amount-table.component';
import { ActionBar, IUploadMultiInfo } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CourtDecreeDto, DefendantDto, DocumentDto, ExecutionReceiptDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CourtService } from '../court.service';

interface IDocument extends DocumentDto {
  updateFlag?: 'A' | 'D' | 'U';
}

@Component({
  selector: 'app-execution-receipt-upload',
  templateUrl: './execution-receipt-upload.component.html',
  styleUrls: ['./execution-receipt-upload.component.scss'],
})
export class ExecutionReceiptUploadComponent implements OnInit {
  constructor(
    private routerService: RouterService,
    private route: ActivatedRoute,
    private courtService: CourtService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder
  ) {}

  actionBar: ActionBar = {
    hasCancel: true,
    hasSave: false,
    hasReject: false,
    hasPrimary: true,
    primaryIcon: 'icon-save-primary',
  };
  currentDecree: CourtDecreeDto = {
    headerFlag: 'DRAFT',
  };
  receiptInfo: ExecutionReceiptDto | undefined;
  defendants: DefendantDto[] = [];
  courtLevel: string = '';
  courtLevelText: string = '';

  uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };

  // Receipt Uploads
  uploadForm = this.fb.group({
    documents: this.fb.array([
      this.fb.group({
        amount: [null, [Validators.required]],
        file: [null, [Validators.required]],
      }),
    ]),
  });
  receipts: UploadFileAmountOutput[] = [];
  documents: IDocument[] = [];

  documentError: boolean = false;

  taskId!: number;

  ngOnInit() {
    this.currentDecree = this.courtService.currentDecree;
    this.uploadMultiInfo.cif = this.lawsuitService.currentLitigation.customerId || '';
    this.uploadMultiInfo.litigationId = this.taskService.taskDetail.litigationId || '';
    this.courtLevel = this.route.snapshot.queryParams['courtLevel'];
    this.courtLevelText = this.getCourtText();

    this.receiptInfo = this.courtService.currentExecutionReceipt;
    this.defendants = this.receiptInfo.persons?.filter(d => d.checked) || [];
    // @ts-ignore
    this.documents =
      this.receiptInfo.declarationDocuments?.sort(
        (a: any, b: any) => (a.attributes?.['set'] || 0) - (b.attributes?.['set'] || 0)
      ) || [];

    this.taskId = this.taskService.taskDetail.id || 0;
  }

  // Decree Request Documents
  onDocumentChange(event: any) {
    this.documents = event;
    if (this.documents[0].imageId) this.documentError = false;
  }
  onReceiptsChange(event: UploadFileAmountOutput[]) {
    this.receipts = event;
  }

  getCourtText() {
    switch (this.courtLevel) {
      case 'CIVIL':
        return this.translate.instant('COURT.CIVIL_COURT');
      case 'APPEAL':
        return this.translate.instant('COURT.APPEALS_COURT');
      case 'SUPREME':
        return this.translate.instant('COURT.SUPREME_COURT');
      default:
        return this.translate.instant('COURT.CIVIL_COURT');
    }
  }

  // Action bar actions
  async onBack() {
    const res = await this.sessionService.confirmExitWithoutSave();
    if (res) {
      this.routerService.back();
    }
  }

  onCancel() {
    this.onBack();
  }

  async onSubmit() {
    if (this.uploadForm.valid && this.documents[0].imageId) {
      this.documentError = false;
      try {
        const res = await this.courtService.saveUploadExecutionReceipt(this.taskService.taskDetail.id || 0, {
          blackCaseNo: this.receiptInfo?.blackCaseNo,
          declarationDocuments: this.documents.filter(d => d.updateFlag !== 'D' && d.active),
          executionFeeDate: new Date().toISOString(),
          executionReceiptRecords: this.receipts.map(r => ({
            amount: parseFloat(r.amount || '0'),
            attachment: r.file,
          })),
          litigationCaseId: this.receiptInfo?.litigationCaseId,
          persons: this.receiptInfo?.persons,
          redCaseNo: this.receiptInfo?.redCaseNo,
        });
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('COURT.DIALOG_RECEIPT_UPLOAD_SUCCESS', {
            LG_ID: this.taskService.taskDetail.litigationId,
          })
        );
        this.routerService.back();
        this.routerService.back();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    } else {
      this.uploadForm.markAllAsTouched();
      if (!this.documents[0].imageId) this.documentError = true;
    }
  }
}
