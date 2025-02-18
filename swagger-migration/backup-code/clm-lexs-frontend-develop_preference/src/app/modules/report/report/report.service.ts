import { Injectable } from '@angular/core';
import { BlobType, FileType } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Utils } from '@app/shared/utils/util';
import {
  ExReportControllerService,
  FinancialControllerService,
  TaskControllerService,
  DownloadEWhtReconcileReportRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private downloadMessageFail = this.translate.instant('REPORT.DOWNLOAD_MESSAGE_FAIL');

  constructor(
    private taskControllerService: TaskControllerService,
    private financialControllerService: FinancialControllerService,
    private errorHandlingService: ErrorHandlingService,
    private translate: TranslateService,
    private exReportControllerService: ExReportControllerService
  ) {}

  async downloadSLA(): Promise<any> {
    let response = await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.downloadSLAReport()),
      { snackBarMessage: this.downloadMessageFail }
    );
    Utils.saveAsStrToBlobFile(response, 'SLA Report' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadWithholdingTax(filename: string, request: DownloadEWhtReconcileReportRequest): Promise<any> {
    let _filename = filename || this.translate.instant('REPORT.REPORTS_WITHHOLDING_TAX');
    let response = await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.financialControllerService.downloadEWhtReconcileReport(request)),
      { snackBarMessage: this.downloadMessageFail }
    );
    Utils.saveAsStrToBlobFile(response, _filename + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadSLALegalExcutionReport(filename: string): Promise<any> {
    let _filename = filename || 'excel';
    let response = await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.exReportControllerService.downloadSLAReport()),
      { snackBarMessage: this.downloadMessageFail }
    );
    Utils.saveAsStrToBlobFile(response, _filename + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }
}
