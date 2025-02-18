import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditLogService } from '@app/shared/components/common-tabs/audit-log/audit-log.service';
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-finance-audit-log',
  templateUrl: './finance-audit-log.component.html',
  styleUrls: ['./finance-audit-log.component.scss'],
})
export class FinanceAuditLogComponent {
  public financeCaseId!: string;
  public statusName!: string;
  public financeMode!: string;
  public status!: string;

  constructor(
    private routerService: RouterService,
    private auditlogService: AuditLogService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(value => {
      this.financeMode = value['financeMode'];
      if (value['financeMode'] === 'EXPENSE') {
        this.auditlogService.refreshLogType.next('FINANCE_EXPENSE');
      } else if (value['financeMode'] === 'RECEIPT' || value['financeMode'] === 'RECEIPT_KCORP') {
        this.auditlogService.refreshLogType.next('FINANCE_RECEIPT');
      } else if (value['financeMode'] === 'ADVANCE') {
        this.auditlogService.refreshLogType.next('FINANCE_ADVANCE');
      }
      this.financeCaseId = value['financeId'];
      this.statusName = value['statusName'];
      this.status = value['status'];
    });
  }

  onBack() {
    this.routerService.back();
  }
}
