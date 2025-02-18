import { Component, OnInit } from '@angular/core';
import { LexsUserPermissionCodes } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import { ReportService } from './report.service';
import { DownloadEWhtReconcileReportRequest } from '@lexs/lexs-client';
import { Utils } from '@app/shared/utils';

enum ReportType {
  SLA = 'SLA',
  WITH_HOLDING_TAX = 'WITH_HOLDING_TAX',
  LEGAL_EXCUTION = 'LEGAL_EXCUTION',
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  public reportType = ReportType;
  public actionBar = {
    showNavBarInformation: true,
    hasPrimaryButton: true,
    disabledPrimaryButton: false,
    primaryButtonText: 'CONFIGURATION.BTN_SAVE',
    primaryButtonIcon: 'icon-save-primary',
  };
  public showWHTReport: boolean = false;
  public showLegalExcutionReport: boolean = false;
  public minEndDate!: Date;
  public maxStartDate: Date = new Date();
  public maxEndDate: Date = new Date();
  public endDate!: string;
  public startDate!: string;

  constructor(
    private translate: TranslateService,
    private reportService: ReportService,
    private sessionService: SessionService,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  ngOnInit(): void {
    this.showWHTReport =
      this.sessionService.currentUser?.permissions?.includes(LexsUserPermissionCodes.WITHHOLDING_TAX_REPORT) || false;
    this.showLegalExcutionReport =
      this.sessionService.currentUser?.permissions?.includes(LexsUserPermissionCodes.VIEW_SLA_REPORT) || false;
  }

  download(type: ReportType) {
    let filename = '';
    switch (type) {
      case ReportType.LEGAL_EXCUTION:
        filename = this.translate.instant('REPORT.REPORTS_SLA_EXCUTION');
        this.reportService.downloadSLALegalExcutionReport(filename);
        break;
      case ReportType.WITH_HOLDING_TAX:
        const today: string = this.buddhistEraPipe.transform(new Date().toString(), 'DD-MM-YYYY') || '';
        filename = this.translate.instant('REPORT.REPORTS_WITHHOLDING_TAX_FILE_NAME', { DATE: today });
        let request: DownloadEWhtReconcileReportRequest = {
          startDate: this.startDate || '',
          endDate: this.endDate || '',
        };
        this.reportService.downloadWithholdingTax(filename, request);
        break;
      default:
        this.reportService.downloadSLA();
        break;
    }
  }
  onDateChange(type: 'startDate' | 'endDate', date: Date) {
    if (type === 'startDate') {
      this.startDate = Utils.dateFormat(date, 'YYYY-MM-DD');
      date.setDate(date.getDate() + 1);
      this.minEndDate = date;
    }
    if (type === 'endDate') {
      this.endDate = Utils.dateFormat(date, 'YYYY-MM-DD');
      date.setDate(date.getDate() - 1);
      this.maxStartDate = date;
    }
  }
}
