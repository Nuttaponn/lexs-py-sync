import { Component, OnInit } from '@angular/core';
import { RouterService } from '@app/shared/services/router.service';
import { DashboardPermissions, DashboardService } from './dashboard.service';
import { SessionService } from '@app/shared/services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public litigationStatusData!: Array<number>;
  public litigationStatusTotal: number = 0;
  public lexsDocumentDatasets!: Array<any>;
  public litigationDocumentDatasets!: Array<any>;
  public defermentDatasets!: Array<any>;
  public defermentExecutionDatasets!: Array<any>;
  public accountStatusDatasets!: Array<any>;
  public collateralStatusDatasets!: Array<any>;
  public financeStatusData!: Array<number>;
  public financeStatusAutoData!: Array<number>;

  constructor(
    private dashboardService: DashboardService,
    private routerService: RouterService,
    private sessionService: SessionService
  ) {}
  public lexsDocumentLabels = [
    'ลูกหนี้ทั้งหมด',
    'เอกสาร\nบอกกล่าว\nไม่ครบถ้วน',
    'เอกสารยื่น\nฟ้องไม่ครบถ้วน',
    'เอกสาร\nครบถ้วน',
  ];
  public litigationDocumentLabels = [
    'ลูกหนี้ทั้งหมด',
    'เอกสาร\nบอกกล่าว\nไม่ครบถ้วน',
    'เอกสารยื่น\nฟ้องไม่ครบถ้วน',
    'เอกสารครบถ้วน\nรอสร้างเลขที่\nกฎหมาย',
  ];
  public defermentLabels = ['เลขที่กฎหมายทั้งหมด', 'อนุมัติดำเนินคดี', 'บอกกล่าว'];
  public defermentExecutionLabels = [
    'เลขที่กฎหมายทั้งหมด',
    'ก่อนออกหมายบังคับคดี',
    'อยู่ระหว่างยึดทรัพย์',
    'อยู่ระหว่างขายทอดตลาด',
    'อื่นๆ',
  ];

  // CIF
  public cifUnderDpd = ['#BEDFB3', '#52A933', '#175900', '#D3D3D3'];
  public cifOverDpd = ['#FFE85A', '#F49B00', '#B75900', '#D3D3D3'];
  public cifOverSla = ['#D0082C', '#D0082C', '#D0082C', '#D0082C'];

  /** Litigation Status */
  public litigationStatusLabels = [
    'อนุมัติดำเนินคดี',
    'บอกกล่าว',
    'อยู่ระหว่างพิจารณาคดี',
    'มีคำพิพากษา',
    'ออกหมายบังคับคดี',
    'ยึดทรัพย์',
    'ขายทอดตลาด',
    'ชะลอดำเนินคดี',
    'ชะลอบังคับคดี',
    'สืบทรัพย์',
  ];
  public litigationStatusColors = [
    '#68D6F5',
    '#00A6E6',
    '#008EC4',
    '#00446B',
    '#F1B5C0',
    '#E88496',
    '#D93956',
    '#4A4A49',
    '#BBBBBB',
    '#E3E3E3',
  ];

  /** Account Status */
  public accountStatusLabels = [
    'อยู่ระหว่างติดตามบัญชีรับ-จ่าย',
    'อยู่ระหว่างตรวจรับรองบัญชีรับ-จ่าย',
    'อยู่ระหว่างตัดหักชำระหนี้',
  ];
  public accountStatusColors = ['#00A6E6', '#003154', '#868686'];

  /* Collateral Status */
  public collateralStatusLabels = [
    'ไม่ถูกอายัด/ยึด/ขาย',
    'ยึดทรัพย์',
    'อยู่ระหว่างขายทอดตลาด',
    'รอประกาศขายทอดตลาดใหม่',
    'ขายทอดตลาดแล้ว',
  ];
  public collateralStatusColors = ['#52A933', '#175900', '#242424', '#868686', '#D3D3D3'];

  /* Finance */
  public financeStatusColors = ['#00A6E6', '#003154', '#868686'];
  public financeStatusLabels = [
    'รอตรวจสอบรายการเบิกเงินโดย KTBLAW',
    'รออนุมัติการจ่ายเงินโดย KTB',
    'รออัปโหลดใบเสร็จรับเงิน',
  ];

  public financeStatusAutoColors = ['#00A6E6', '#003154', '#868686'];
  public financeStatusAutoLabels = [
    'รอตรวจสอบรายการเบิกเงินโดย KTBLAW',
    'รออัปโหลดใบเสร็จรับเงิน',
    'รอตรวจสอบรายการโดย KTB',
  ];

  // deferment charts
  private gray = '#D3D3D3';
  private gold500 = '#D27601';
  private gold400 = '#F49B00';
  private gold300 = '#FAB900';
  private gold200 = '#FFDC00';

  public hideTooltipForDataPointsCustomer = [
    { datasetIndex: 0, dataIndex: 1 },
    { datasetIndex: 0, dataIndex: 2 },
    { datasetIndex: 1, dataIndex: 0 },
    { datasetIndex: 1, dataIndex: 3 },
    { datasetIndex: 2, dataIndex: 0 },
    { datasetIndex: 2, dataIndex: 3 },
  ];

  public dashboardStatuses: { [key: string]: { error: boolean; empty: boolean } } = {
    customerDocument: { error: false, empty: false },
    litigationStatus: { error: false, empty: false },
    deferment: { error: false, empty: false },
    defermentExecution: { error: false, empty: false },
    finance: { error: false, empty: false },
    financeAuto: { error: false, empty: false },
    accountStatus: { error: false, empty: false },
    collateralStatus: { error: false, empty: false },
  };

  public dashboardPermissions!: DashboardPermissions;

  public lexsDpd: number = 60;
  public litigationDpd: number = 90;

  async ngOnInit(): Promise<void> {
    this.dashboardPermissions = this.dashboardService.getDashboardAccessPermissions(this.sessionService.currentUser!);
    const {
      document,
      litigationStatus,
      defermentStatus,
      defermentExecutionStatus,
      finance,
      accountStatus,
      collateralStatus,
    } = this.dashboardPermissions;

    if (document) this.initCustomerDocumentDashboard();
    if (litigationStatus) this.initLitigationStatusDashboard();
    if (defermentStatus) this.initDefermentStatusDashboard();
    if (defermentExecutionStatus) this.initDefermentExecutionStatusDashboard();
    if (accountStatus) this.initAccountStatusDashboard();
    if (collateralStatus) this.initCollateralStatusDashboard();
    if (finance) this.initFinanceDashboard();
  }

  async initCustomerDocumentDashboard() {
    try {
      // customer
      const customerData = await this.dashboardService.getCustomerDocumentDashboardInfo();

      this.lexsDpd = customerData.lexsDpd || this.lexsDpd;
      this.litigationDpd = customerData.litigationDpd || this.litigationDpd;
      this.dashboardService.lexsDpd = this.lexsDpd;
      this.dashboardService.litigationDpd = this.litigationDpd;

      const emptyLexs = this.dashboardService.checkEmpty(customerData.customerLexsDocumentDashboard || {});
      const emptyLitigation = this.dashboardService.checkEmpty(customerData.customerLitigationDocumentDashboard || {});
      if (emptyLexs && emptyLitigation) {
        this.dashboardStatuses['customerDocument'].empty = true;
        return;
      }

      if (customerData) {
        const lexsData = this.dashboardService.initCustomerDashboardData(
          customerData.customerLexsDocumentDashboard || {}
        );
        const litigationData = this.dashboardService.initCustomerDashboardData(
          customerData.customerLitigationDocumentDashboard || {}
        );
        this.dashboardService.initCustomerDocumentCount();
        this.lexsDocumentDatasets = [
          {
            label: 'NORMAL',
            data: lexsData['NORMAL'],
            backgroundColor: this.cifUnderDpd,
          },
          {
            label: 'IN_SLA',
            data: lexsData['IN_SLA'],
            backgroundColor: this.cifUnderDpd,
          },
          {
            label: 'OUT_OF_SLA',
            data: lexsData['OUT_OF_SLA'],
            backgroundColor: this.cifOverSla,
          },
        ];
        this.litigationDocumentDatasets = [
          {
            label: 'NORMAL',
            data: litigationData['NORMAL'],
            backgroundColor: this.cifOverDpd,
          },
          {
            label: 'IN_SLA',
            data: litigationData['IN_SLA'],
            backgroundColor: this.cifOverDpd,
          },
          {
            label: 'OUT_OF_SLA',
            data: litigationData['OUT_OF_SLA'],
            backgroundColor: this.cifOverSla,
          },
        ];
      }
    } catch (e) {
      this.dashboardStatuses['customerDocument'].error = true;
    }
  }

  async initLitigationStatusDashboard() {
    try {
      const litigationStatusData = await this.dashboardService.getLitigationStatusDashboardInfo();
      const empty = this.dashboardService.checkEmpty(litigationStatusData);
      if (empty) {
        this.dashboardStatuses['litigationStatus'].empty = true;
        return;
      }
      if (litigationStatusData) {
        const litigationStatusDatasetValues = this.dashboardService.initLitigationStatusChartData(
          litigationStatusData || {}
        );
        this.dashboardService.initLitigationStatusCount();
        this.litigationStatusData = litigationStatusDatasetValues;
        this.litigationStatusTotal = litigationStatusData.total || 0;
      }
    } catch (e) {
      this.dashboardStatuses['litigationStatus'].error = true;
    }
  }

  async initDefermentStatusDashboard() {
    try {
      const defermentData = await this.dashboardService.getLitigationDefermentDashboardInfo();
      if (defermentData) {
        const empty = this.dashboardService.checkEmpty(defermentData);
        if (empty) {
          this.dashboardStatuses['deferment'].empty = true;
          return;
        }
        const defermentDatasetValues = this.dashboardService.initDefermentChartData(defermentData || {});
        this.dashboardService.initDefermentStatusCount();
        this.defermentDatasets = [
          {
            label: 'NONE_DEFER',
            data: defermentDatasetValues['NONE_DEFER'],
            backgroundColor: this.gray,
          },
          {
            label: 'DEFER_PROSECUTION_APPROVED',
            data: defermentDatasetValues['DEFER_PROSECUTION_APPROVED'],
            backgroundColor: Array(3).fill(this.gold500),
          },
          {
            label: 'DEFER_ALREADY_NOTICE',
            data: defermentDatasetValues['DEFER_ALREADY_NOTICE'],
            backgroundColor: Array(3).fill(this.gold400),
          },
        ];
      }
    } catch (e) {
      this.dashboardStatuses['deferment'].error = true;
    }
  }

  async initDefermentExecutionStatusDashboard() {
    try {
      const defermentExecutionData = await this.dashboardService.getLitigationDefermentExecDashboardInfo();
      if (defermentExecutionData) {
        const empty = this.dashboardService.checkEmpty(defermentExecutionData);
        if (empty) {
          this.dashboardStatuses['defermentExecution'].empty = true;
          return;
        }
        const defermentExecutionDatasetValues =
          this.dashboardService.initDefermentExecutionChartData(defermentExecutionData);
        this.dashboardService.initDefermentExecStatusCount();
        this.defermentExecutionDatasets = [
          {
            label: 'NONE_DEFER_EXEC',
            data: defermentExecutionDatasetValues['NONE_DEFER_EXEC'],
            backgroundColor: this.gray,
          },
          {
            label: 'DEFER_EXEC_WRIT_OF',
            data: defermentExecutionDatasetValues['DEFER_EXEC_WRIT_OF'],
            backgroundColor: Array(3).fill(this.gold500),
          },
          {
            label: 'DEFER_EXEC_SEIZURE',
            data: defermentExecutionDatasetValues['DEFER_EXEC_SEIZURE'],
            backgroundColor: Array(3).fill(this.gold400),
          },
          {
            label: 'DEFER_EXEC_AUCTION',
            data: defermentExecutionDatasetValues['DEFER_EXEC_AUCTION'],
            backgroundColor: Array(3).fill(this.gold300),
          },
          {
            label: 'DEFER_EXEC_OTHER',
            data: defermentExecutionDatasetValues['DEFER_EXEC_OTHER'],
            backgroundColor: Array(3).fill(this.gold200),
          },
        ];
      }
    } catch (e) {
      this.dashboardStatuses['defermentExecution'].error = true;
    }
  }

  async initAccountStatusDashboard() {
    try {
      const accountStatusData = await this.dashboardService.getAccountDocumentStatusDashboardInfo();
      if (accountStatusData) {
        const empty = this.dashboardService.checkEmpty(accountStatusData);
        if (empty) {
          this.dashboardStatuses['accountStatus'].empty = true;
          return;
        }
        const accountStatusValues = this.dashboardService.initAccountStatusDashboardData(accountStatusData);
        this.dashboardService.initAccountStatusCount();
        this.accountStatusDatasets = [
          {
            label: this.accountStatusLabels,
            data: accountStatusValues,
            backgroundColor: this.accountStatusColors,
          },
        ];
      }
    } catch (e) {
      this.dashboardStatuses['accountStatus'].error = true;
    }
  }

  async initCollateralStatusDashboard() {
    try {
      const collateralStatusData = await this.dashboardService.getCollateralLexsStatusDashboardInfo();
      if (collateralStatusData) {
        const empty = this.dashboardService.checkEmpty(collateralStatusData);
        if (empty) {
          this.dashboardStatuses['collateralStatus'].empty = true;
          return;
        }
        const collateralStatusValues = this.dashboardService.initCollateralStatusDashboardData(collateralStatusData);
        this.dashboardService.initCollateralStatusCount();
        this.collateralStatusDatasets = [
          {
            label: this.collateralStatusLabels,
            data: collateralStatusValues,
            backgroundColor: this.collateralStatusColors,
          },
        ];
      }
    } catch (e) {
      this.dashboardStatuses['collateralStatus'].error = true;
    }
  }

  async initFinanceDashboard() {
    try {
      // finance
      const financeData = await this.dashboardService.getExpenseDashboardInfo();
      if (financeData) {
        const financeChartData = this.dashboardService.initFinanceDashboardData(financeData);
        this.dashboardService.initFinanceCount();
        this.financeStatusData = financeChartData['NON_AUTO'];
        this.financeStatusAutoData = financeChartData['AUTO'];
        if (financeChartData['NON_AUTO'].every(dp => dp === 0)) this.dashboardStatuses['finance'].empty = true;
        if (financeChartData['AUTO'].every(dp => dp === 0)) this.dashboardStatuses['financeAuto'].empty = true;
      }
    } catch (e) {
      this.dashboardStatuses['finance'].error = true;
      this.dashboardStatuses['financeAuto'].error = true;
    }
  }

  goToCustomerDetail(mode?: 'LEXS' | 'LITIGATION', data?: { index: number; datasetIndex: number } | null) {
    if (data && mode) {
      const { index } = data;
      const subTabIndex = this.getDocumentSubTab(index);

      this.routerService.navigateTo('/main/dashboard/customers', {
        tabIndex: (mode === 'LEXS' ? 1 : 2).toString(),
        subTabIndex: subTabIndex?.toString(),
      });
    } else {
      this.routerService.navigateTo('/main/dashboard/customers');
    }
  }

  goToFinanceDetail(mode?: 'NORMAL' | 'AUTO', index?: number) {
    if (mode === 'AUTO' && (index || index === 0)) {
      let tabIndex = 0;
      if (index !== 0) tabIndex = index + 1;
      else tabIndex = index;
      this.routerService.navigateTo('/main/dashboard/finance', {
        tabIndex: tabIndex.toString(),
      });
    } else if (mode === 'NORMAL' && (index || index === 0)) {
      this.routerService.navigateTo('/main/dashboard/finance', {
        tabIndex: index.toString(),
      });
    } else {
      this.routerService.navigateTo('/main/dashboard/finance');
    }
  }

  goToLitigationDetail(mode: string, tabIndex?: number, data?: { index: number; datasetIndex: number } | null) {
    if (data) {
      if (mode === 'DEFER' || mode === 'DEFER_EXECUTION') {
        /* MODE = DEFER/DEFER_EXECUTION */
        this.routerService.navigateTo('/main/dashboard/litigation', {
          mode,
          tabIndex: data.datasetIndex === 0 ? null : (data.datasetIndex - 1).toString(),
        });
      } else {
        /* MODE = ACCOUNT_STATUS */
        this.routerService.navigateTo('/main/dashboard/litigation', {
          mode,
          tabIndex: data.index.toString(),
        });
      }
    } else {
      /* MODE = STATUS */
      this.routerService.navigateTo('/main/dashboard/litigation', {
        mode,
        tabIndex,
      });
    }
  }

  goToCollateralDetail(data?: { index: number; datasetIndex: number }) {
    this.routerService.navigateTo('/main/dashboard/collateral', {
      tabIndex: data ? data.index.toString() : undefined,
    });
  }

  getDocumentSubTab(index: number) {
    let subTabIndex: number | null = null;
    if (index === 0) subTabIndex = null;
    else subTabIndex = index - 1;
    return subTabIndex;
  }
}
