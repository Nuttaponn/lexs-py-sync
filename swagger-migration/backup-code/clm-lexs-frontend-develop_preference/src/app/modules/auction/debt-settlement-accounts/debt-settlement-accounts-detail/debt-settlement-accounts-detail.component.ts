import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ITooltip, IUploadMultiFile, IUploadMultiInfo, taskCode } from '@app/shared/models';
import { DebtSettlementAccountResponse, DebtSettlementTransaction } from '@lexs/lexs-client';
import {
  AuctionDebtSettlementAccountTransactionExtend,
  DebitData,
  DebtSettlementAccountExtend,
  DetailsHeader,
  MainBorrower,
} from '../../auction.const';
import { AuctionService } from '../../auction.service';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { Utils } from '@app/shared/utils';
import { Decimal } from 'decimal.js';
import { AuctionMenu } from '../../auction.model';
import { SessionService } from '@app/shared/services/session.service';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
@Component({
  selector: 'app-debt-settlement-accounts-detail',
  templateUrl: './debt-settlement-accounts-detail.component.html',
  styleUrls: ['./debt-settlement-accounts-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DebtSettlementAccountsDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('bannerElement', { static: false }) bannerElement!: ElementRef;
  @ViewChild('summaryElement', { static: false }) summaryElement!: ElementRef;
  @Input() dataForm!: UntypedFormGroup;
  @Input() set updated(val: number) {
    if (val) {
      this.clearData();
      this.prepareData();
      this.generateForm();
    }
  }

  public ACCOUNT_TYPE_NAME_MAP!: { [key: string]: string };
  public taskCode!: taskCode;
  public debitData: DebitData[] = [];
  public isSticky = false;
  public offset: number = 0;
  public isViewMode: boolean = true;
  public showBanner: boolean = true;
  ignorePaymentTypeSubList: string[] = ['2', '3', '6', '7'];
  mainBorrowerColumns: string[] = ['no', 'mainBorrowerPersonName', 'courtName', 'responseUnit', 'branch'];
  public mainBorrowers: MainBorrower[] = [];
  public isOpened = true;
  public isOpened1 = false;
  public isOpened2 = true;
  public paymentCutOffColumns = ['no', 'summary', 'debit'];
  public paymentCutOffListColumns = ['no', 'list', 'expand', 'debt', 'cutOff'];
  public summaryAccColumns = ['no', 'list', 'debt', 'cutOff'];
  public accountsListListColumns = ['no', 'accountNo', 'billNo', 'accountTypeDesc', 'debtAmount', 'writeOffAmount'];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public documentUpload: IUploadMultiFile[] = [];
  public msg1A: Array<ITooltip> = [
    { title: '', content: 'ค่าฤชาธรรมเนียมศาล (ค่าส่งคำคู่ความ ค่านำหมาย ค่าปิดหมาย ค่าประกาศหนังสือพิมพ์ ฯลฯ)' },
  ];
  private paymentEnum: { [key: number]: string[] } = {
    3: ['3'],
    4: ['4A', '4B'],
    5: ['5A', '5B'],
    6: ['6'],
  };
  public expandGroup = ['1', '4', '5'];

  public debtSettlement!: DebtSettlementAccountResponse;
  public litigationsList: AuctionDebtSettlementAccountTransactionExtend[] = [];

  public paymentList: any = [];
  public paymentColumn = ['no', 'name', 'payment'];
  public form!: UntypedFormGroup;
  public summaryDebtList: DebtSettlementAccountExtend[] = [];
  public _debitBalance: number = 0;
  private isExceed: boolean = false;
  public auctionStatus!: string;
  public isPendingTask: boolean = false;
  constructor(
    private auctionService: AuctionService,
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private documentAccountService: DocumentAccountService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.prepareData();
    this.generateForm();
    this.checkReady();
  }

  clearData() {
    this.litigationsList = [];
    this.getLgListForm.clear();
    this.debitData = [];
    this.paymentList = [];
    this.summaryDebtList = [];
  }

  generateForm() {
    this.form = this.auctionService.debtForm;
    for (let i = 0; i < this.litigationsList?.length; i++) {
      const element = this.litigationsList[i];
      let debtForm = this.fb.group({
        litigationId: element.litigationId,
        originalLitigationCaseId: element.originalLitigationCaseId,
        litigationCaseId: element.litigationCaseId,
        isMainCase: element.isMainCase,
        debtSettlementAccounts: this.fb.array([]),
      });
      const debtSettlementAccounts = element.debtSettlementAccounts || [];
      for (let j = 0; j < debtSettlementAccounts?.length; j++) {
        const dt = debtSettlementAccounts[j];
        let accForm = this.fb.group({
          struturedDebtList: this.fb.array([]),
          paymentGroupType: dt.paymentGroupType,
          debtAmountTotal: dt.debtAmountTotal,
          forDetail: dt.forDetail,
          name: dt?.name,
        });
        let debtFormArr = debtForm.get('debtSettlementAccounts') as UntypedFormArray;
        debtFormArr.push(accForm);
        const struturedDebtLt = dt?.struturedDebtList || [];
        for (let k = 0; k < struturedDebtLt?.length; k++) {
          const acc = struturedDebtLt[k];
          let subAccForm = accForm.get('struturedDebtList') as UntypedFormArray;
          let acForm = this.fb.group({
            accountsList: this.fb.array([]),
            accList: [acc.accList],
            paymentType: acc.paymentType,
            accountNo: acc.accountNo || '',
            accountType: acc.accountType || '',
            debtAmountTotal: acc.debtAmountTotal,
            debtSettlementAmountTotal: acc?.debtSettlementAmountTotal || '',
            isLastest: acc.isLastest,
          });
          subAccForm.push(acForm);
          for (let l = 0; l < acc.accountsList?.length; l++) {
            let dList = acc.accountsList[l];
            let lForm = acForm.get('accountsList') as UntypedFormArray;
            lForm.push(
              this.fb.group({
                auctionDebtSettlementAccountAccountId: dList?.auctionDebtSettlementAccountAccountId,
                paymentGroupType: dList?.paymentGroupType,
                paymentType: dList?.paymentType,
                accountNo: dList?.accountNo,
                billNo: dList?.billNo,
                accountType: dList?.accountType,
                debtAmount: dList?.debtAmount,
                sourceSystem: dList?.sourceSystem,
                debtSettlementAmount: [
                  {
                    value: Utils.numberWithCommas(dList?.debtSettlementAmount || ''),
                    disabled: dList.paymentGroupType === 7,
                  },
                ],
              })
            );
          }
        }
      }
      this.getLgListForm.push(debtForm);
    }
  }

  get getLgListForm() {
    return this.form.get('litigationsList') as UntypedFormArray;
  }

  debtSettlementAccounts(i: number) {
    return this.getLgListForm.at(i).get('debtSettlementAccounts') as UntypedFormArray;
  }
  getDebtSettlementAmount(i: number, j: number, k: number) {
    return (
      (this.getLgListForm.at(i)?.get('debtSettlementAccounts') as UntypedFormArray)
        ?.at(j)
        ?.get('struturedDebtList') as UntypedFormArray
    )
      ?.at(k)
      ?.get('accountsList') as UntypedFormArray;
  }

  groupBy(objArray: Array<any>, property: string, ignore: number[] = [], property2: string | null = null) {
    return objArray.reduce((acc, obj) => {
      let key = obj[property];
      if (property2 && obj[property2]) {
        key = key + '_' + obj[property2];
      }
      if (!acc[key] && key && key !== 'undefined') acc[key] = [];
      obj = {
        ...obj,
      };
      if (!obj?.forDetail && obj?.forDetail !== false) {
        obj.forDetail =
          (property == 'accountNo' && !ignore.includes(obj.paymentGroupType)) ||
          (property === 'paymentGroupType' && !ignore.includes(key));
      }
      // if (!obj?.forSummaryTable && obj?.forSummaryTable !== false) {
      obj.forSummaryTable = property === 'paymentGroupType' && !ignore.includes(key);
      // }
      if (!obj?.isAccNo && obj?.isAccNo !== false) {
        obj.isAccNo = property == 'accountNo' && !ignore.includes(obj.paymentGroupType);
      }
      if (property == 'accountNo') {
        if (obj.isAccNo) {
          acc[key]?.push(obj);
        }
      } else {
        acc[key]?.push(obj);
      }

      return acc;
    }, {});
  }

  groupName(paymentGroupType: number): string {
    switch (paymentGroupType) {
      case 1:
        return 'ค่าฤชาธรรมเนียม, ค่าทนายความตามคำพิพากษา และค่าใช้จ่ายในการบังคับคดี';
      case 2:
        return 'เงินทดรองจ่าย';
      case 3:
        return 'ค่าธรรมเนียมต่างๆ';
      case 4:
        return 'เงินต้นทางบัญชี';
      case 5:
        return 'ดอกเบี้ย';
      case 6:
        return 'เบี้ยปรับผิดนัด';
      case 7:
        return 'ยอดเงินคงเหลือตัดชำระหนี้ (คืนหน่วยงาน)';
    }
    return '';
  }
  paymentType(paymentType: string): string {
    switch (paymentType) {
      case '1A':
        return 'ค่าฤชาธรรมเนียมศาล (E11)/ ค่าใช้จ่ายในชั้นดำเนินคดี (E31)';
      case '1B':
        return 'ค่าทนายความตามคำพิพากษา';
      case '1C':
        return 'ค่าใช้จ่ายในการบังคับคดี(E32)/ ค่าใช้จ่ายในการขายทรัพย์(E43)';
      case '2':
        return 'เงินทดรองจ่าย';
      case '3':
        return 'ค่าธรรมเนียมต่างๆ';
      case '4A':
        return 'เงินต้นทางบัญชี (BV)';
      case '4B':
        return 'เงินต้น Write Off';
      case '5A':
        return 'ดอกเบี้ยค้างรับ';
      case '5B':
        return 'ดอกเบี้ยพัก/ แขวน';
      case '6':
        return 'เบี้ยปรับผิดนัด';
      case '7':
        return 'ยอดเงินคงเหลือตัดชำระหนี้ (คืนหน่วยงาน)';
    }
    return '';
  }

  listName(type: string) {
    switch (type) {
      case '15':
        return 'จำนวนเงินประมาณการค่าใช้จ่าย ไม่น้อยกว่า 15% ของราคาทรัพย์ที่ธนาคารซื้อได้';
      case '85':
        return 'จำนวนเงินตัดบัญชีชำระหนี้ 85%';
      case '100':
        return 'จำนวนเงินตัดบัญชีชำระหนี้ 100%';
      case 'CASHIER_CHEQUE':
        return 'จำนวนเงินที่ได้รับตามแคชเชียร์เช็ค';
    }
    return '';
  }

  prepareData() {
    this.debtSettlement = this.auctionService?.debtSettlement;
    this.auctionStatus = this.debtSettlement.status as AuctionMenu;
    let originalAmount =
      typeof this.debtSettlement.originalDebtSettlementAmount === 'string'
        ? Utils.convertStringToNumber(this.debtSettlement.originalDebtSettlementAmount) || 0
        : this.debtSettlement.originalDebtSettlementAmount || 0;
    this._debitBalance = new Decimal(originalAmount).toFixed(2) as any;
    this.auctionService.debitBalance = new Decimal(this.debtSettlement.availableDebtSettlementAmount || 0).toFixed(
      2
    ) as any;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.isViewMode = !(
      (this.taskCode === taskCode.R2E09_10_01 || this.taskCode === taskCode.R2E09_10_03) &&
      this.auctionService.isOwnerTask &&
      this.sessionService.hasPermission(PCode.SUBMIT_DEBT_PAYMENT_REDUCTION)
    );

    this.isPendingTask = this.taskCode == taskCode.R2E09_10_03 && this.taskService.taskDetail.statusCode === 'PENDING';

    this.debitData =
      this.auctionService.debtSettlement?.debitTransactions?.map((m: any) => {
        m.name = this.listName(m.type);
        if (m.type === 'CASHIER_CHEQUE') {
          m.collateralGroupsMsg = [
            { title: '', content: '“จำนวนเงินตามหน้าเช็ค“ หักกับ “ยอดรวมทรัพย์ที่ขายได้ของบุคคลภายนอก“' },
          ];
        } else if (m.type === '85') {
          m.collateralGroupsMsg = [];
        } else {
          m.collateralGroupsMsg = m?.collateralGroups?.map((coll: string) => {
            return { title: '', content: 'ชุดทรัพย์ที่ ' + coll };
          });
        }
        return m;
      }) || [];

    this.showBanner = !this.isViewMode;
    this.ACCOUNT_TYPE_NAME_MAP = this.documentAccountService.ACCOUNT_TYPE_NAME_MAP;
    let data = this.auctionService.debtSettlement.debtSettlementTransactions || [];
    this.paymentList.push({
      debtAmount15: this.debtSettlement?.debtAmount15,
    });

    for (let index = 0; index < data.length; index++) {
      const debt: DebtSettlementTransaction = data[index];
      let newDt: AuctionDebtSettlementAccountTransactionExtend = {
        expanded: false,
        litigationId: debt?.litigationId,
        litigationCaseId: debt?.litigationCaseId,
        originalLitigationCaseId: debt?.originalLitigationCaseId,
        blackCaseNo: debt?.blackCaseNo,
        redCaseNo: debt?.redCaseNo,
        legalStatusName: debt?.legalStatusName,
        legalStatus: debt?.legalStatus,
        isMainCase: debt?.isMainCase,
        debtSettlementAccounts: [],
        ready: false,
        index: index,
        mainBorrowers: [
          {
            mainBorrowerName: debt.mainBorrowerName || '',
            courtName: debt.courtName || '',
            responseUnitCode: debt.responseUnitCode || '',
            responseUnitName: debt.responseUnitName || '',
            bookingCode: debt.bookingCode || '',
            bookingName: debt.bookingName || '',
          },
        ],
      };

      let dtGroup = this.groupBy(debt?.debtSettlementAccounts || [], 'paymentGroupType', [3, 4, 5, 6]);
      let accNoGroup = this.groupBy(debt?.debtSettlementAccounts || [], 'accountNo', [1, 2], 'billNo');
      let combindGroup = { ...dtGroup, ...accNoGroup };

      let count = 0;
      let group7;

      for (const key in combindGroup) {
        if (Object.prototype.hasOwnProperty.call(combindGroup, key)) {
          const dt = combindGroup[key];
          let dtAcc = this.groupBy(dt || [], 'paymentType');
          let isAccNo: DebtSettlementAccountExtend = dt.find((f: DebtSettlementAccountExtend) => f.isAccNo);
          let paymentGroupType = isAccNo ? '' : key;
          let billDetails: DetailsHeader[] = isAccNo
            ? [
                {
                  name: 'เลขที่ BIll',
                  value: isAccNo?.billNo ? isAccNo?.billNo : isAccNo?.accountNo,
                },
                {
                  name: 'ประเภทบัญชี',
                  value: this.ACCOUNT_TYPE_NAME_MAP[isAccNo?.accountType || ''] || '-',
                },
              ]
            : [];
          let debtAcc: any = {
            expanded: false,
            name: isAccNo ? isAccNo?.paymentGroupType?.toString() : key,
            paymentGroupType: paymentGroupType,
            paymentGroupTypes: isAccNo ? this.delDuplicates(dt.map((m: any) => m.paymentGroupType.toString())) : [key],
            paymentGroupName: isAccNo ? 'เลขที่บัญชี ' + isAccNo?.accountNo : this.groupName(Number(paymentGroupType)),
            billDetails: billDetails,
            struturedDebtList: [],
            index: count,
            ready: false,
            isAccNo: dt?.some((f: DebtSettlementAccountExtend) => f?.isAccNo),
            forDetail: dt?.some((f: DebtSettlementAccountExtend) => f?.forDetail),
            forSummaryTable: dt?.some((f: DebtSettlementAccountExtend) => f?.forSummaryTable),
          };
          let count1 = 0;

          for (const acc in dtAcc) {
            if (Object.prototype.hasOwnProperty.call(dtAcc, acc)) {
              let accElement: DebtSettlementAccountExtend[] = dtAcc[acc];
              accElement = this.mappingAcc(accElement, acc);
              let accItem: DebtSettlementAccountExtend = {
                expanded: false,
                paymentName: this.paymentType(acc),
                debtSettlementAmountTotal: this.sumTotalAmount(
                  accElement?.map((f: DebtSettlementAccountExtend) => f?.debtSettlementAmount || 0)
                ),
                debtAmountTotal: this.sumTotalAmount(accElement?.map((f: DebtSettlementAccountExtend) => f.debtAmount)),
                accountsList: accElement, // for display
                accList: accElement.length === 0 ? [{ ...dt }] : accElement, //for calculate and sent request
                paymentType: acc,
                paymentGroupType: dtAcc[acc][0]?.paymentGroupType,
                paymentGroupName: this.groupName(Number(dtAcc[acc][0].paymentGroupType)),
                hasHeaderSuffix: acc === '7',
                index: count1,
                ready: accElement?.every((e: any) => e.debtSettlementAmount >= 0),
                isEmpty: false,
                isAccNo: debtAcc?.isAccNo,
                forDetail: debtAcc?.forDetail,
                forSummaryTable: debtAcc?.forSummaryTable,
                isFirstTime: !this.isPendingTask,
              };

              count1++;
              if (accItem.debtAmountTotal === 0 && ['1A', '1B', '1C', '2'].includes(acc)) {
                accItem.isEmpty = true;
                accItem.accountsList = [];
              }
              accItem.ready = accItem.ready || accItem?.accountsList?.length === 0;
              debtAcc.struturedDebtList.push(accItem);
            }
          }
          this.fillMissingDebtType(debtAcc, debt?.isMainCase);
          debtAcc.debtSettlementAmountTotal = this.sumTotalAmount(
            debtAcc.struturedDebtList.map((f: AuctionDebtSettlementAccountTransactionExtend) =>
              Number(f.debtSettlementAmountTotal)
            )
          );
          debtAcc.debtAmountTotal = this.sumTotalAmount(
            debtAcc.struturedDebtList.map((f: AuctionDebtSettlementAccountTransactionExtend) =>
              Number(f.debtAmountTotal)
            )
          );
          this.addRowDetailForAccount(debtAcc);
          debtAcc.hidden =
            (debtAcc.debtAmountTotal && debtAcc.debtAmountTotal === 0) || debtAcc.struturedDebtList.length === 0;

          debtAcc.ready = debtAcc.struturedDebtList.every((e: DebtSettlementAccountExtend) => e.ready);
          if (debtAcc.paymentGroupType === '7') {
            group7 = debtAcc;
          } else {
            newDt?.debtSettlementAccounts?.push(debtAcc);
            count++;
          }
        }
      }
      if (debt?.isMainCase) {
        group7.index = count;
        newDt?.debtSettlementAccounts?.push(group7);
        //initial table summary
        let tableGroup = ['1', '2', '3', '4', '5', '6'];
        let newSummary = Utils.deepClone(newDt.debtSettlementAccounts) || [];

        this.summaryDebtList =
          newSummary?.filter((f: any) => tableGroup.includes(f.paymentGroupType) && f.struturedDebtList.length > 0) ||
          [];
      }
      newDt.ready = newDt?.debtSettlementAccounts?.every((e: any) => e.ready) || false;
      newDt.debtAmountTotal = this.sumTotalAmount(
        newDt?.debtSettlementAccounts?.map((f: any) => Number(f.debtAmountTotal)) || []
      );
      newDt.debtSettlementAmountTotal = this.sumTotalAmount(
        newDt?.debtSettlementAccounts
          ?.filter((f: any) => f.paymentGroupType !== '7')
          .map((f: any) => Number(f.debtSettlementAmountTotal)) || []
      );
      this.litigationsList.push(newDt);
    }
    this.calculateSummaryTable(true);
    this.sumDebt(this.litigationsList);
    console.log(this.litigationsList, 'litigationsList');
  }

  sort(struturedDebtLis: any) {
    const newData = struturedDebtLis.sort((a: any, b: any) => {
      return (a.paymentType as string).localeCompare(b.paymentType);
    });
    struturedDebtLis = newData;
  }

  fillMissingDebtType(debtAcc: any, isMainCase?: boolean) {
    let reCheckGType = isMainCase ? ['3', '4', '5', '6'] : ['4', '5', '6'];
    if (debtAcc.forDetail && debtAcc.isAccNo) {
      for (let index = 0; index < reCheckGType.length; index++) {
        const type = reCheckGType[index];
        let subG = this.paymentEnum[Number(type)] || [];

        if (!subG.every((sg: any) => debtAcc.struturedDebtList.some((ic: any) => ic.paymentType === sg))) {
          for (let j = 0; j < subG?.length; j++) {
            const subType = subG[j];
            let sub = {
              ...debtAcc,
              paymentGroupTypes: debtAcc.paymentGroupTypes.push(type),
              debtAmount: 0,
              debtAmountTotal: 0,
              debtSettlementAmount: 0,
              debtSettlementAmountTotal: 0,
              paymentGroupType: Number(type),
              paymentGroupName: this.groupName(Number(type)),
              paymentName: this.paymentType(subType),
              paymentType: subType,
              accountsList: [],
              accList: [],
              isFirstTime: !this.isPendingTask,
            };
            delete sub.struturedDebtList;
            if (!debtAcc.struturedDebtList.some((ic: any) => ic.paymentType === subType)) {
              debtAcc.struturedDebtList.push(sub);
            }
          }
        }
      }
      this.sort(debtAcc.struturedDebtList);
    }
  }

  addRowDetailForAccount(debtAcc: DebtSettlementAccountExtend) {
    if (debtAcc.isAccNo && debtAcc.struturedDebtList) {
      let blank = {
        isLastest: true,
        expanded: false,
        paymentName: '',
        debtSettlementAmountTotal: Utils.numberWithCommas(debtAcc.debtSettlementAmountTotal || ''),
        debtSettlementAmount: 0,
        debtAmount: 0,
        debtAmountTotal: 0,
        accountsList: [], // for display
        accList: [], //for calculate and sent request
        paymentType: '',
        paymentGroupType: 0,
        paymentGroupName: '',
        hasHeaderSuffix: false,
      };
      let ignoreGroupType = [4, 5];
      let struturedDeb: any = [];
      let list = debtAcc.struturedDebtList;
      let count = 0;
      for (let index = 0; index < list?.length; index++) {
        const element: any = list[index];
        if (!struturedDeb.some((s: any) => s?.isHeader && s.paymentGroupType === element.paymentGroupType)) {
          let obj = {
            ...blank,
            isLastest: false,
            isHeader: true,
            isAccNo: true,
            debtSettlementAmountTotal: !ignoreGroupType.includes(element.paymentGroupType)
              ? element.debtSettlementAmountTotal
              : 0,
            debtAmountTotal: !ignoreGroupType.includes(element.paymentGroupType) ? element.debtAmountTotal : 0,
            paymentGroupType: element.paymentGroupType,
            paymentType: element.paymentType,
            paymentGroupName: this.groupName(element.paymentGroupType),
            accountsList: element.accountsList,
            forDetail: true,
            isFirstTime: !this.isPendingTask,
            index: count,
            showTotal: !ignoreGroupType.includes(element.paymentGroupType),
          };
          count++;
          struturedDeb.push(obj);
        }
        if (ignoreGroupType.includes(element.paymentGroupType)) {
          element.showTotal = true;
          struturedDeb.push({
            ...element,
            index: count,
          });
        }
      }
      debtAcc.struturedDebtList = struturedDeb || [];
      debtAcc.struturedDebtList?.push({ ...blank, index: count });
    }
  }

  delDuplicates(data: string[]) {
    return data.filter((val, idx) => data.indexOf(val) === idx);
  }

  mappingAcc(accList: DebtSettlementAccountExtend[], accType: string): DebtSettlementAccountExtend[] {
    return accList?.map((m: any) => {
      if (
        typeof m?.debtSettlementAmount === 'string' &&
        (m.debtSettlementAmount === '0.00' || m.debtSettlementAmount === '0')
      ) {
        m.debtSettlementAmount = undefined;
      }
      if (
        (accType == '7' && !!!m.debtSettlementAmount) ||
        (typeof m?.debtSettlementAmount === 'string' && m.debtSettlementAmount === '0')
      ) {
        m.debtSettlementAmount = '0.00';
      }

      if (accType == '7') {
        m.isViewOnly = true;
      }

      if (typeof m.debtAmount === 'string') {
        m.debtAmount = Utils.convertStringToNumber(m.debtAmount) || 0;
      }
      if (typeof m.debtSettlementAmount === 'string') {
        m.debtSettlementAmount = Utils.convertStringToNumber(m.debtSettlementAmount) || 0;
      }

      m.paymentGroupName = this.groupName(Number(m.paymentGroupType));
      m.paymentName = this.paymentType(m.paymentType);

      return m;
    });
  }

  get debitBalance(): number {
    return this.auctionService.debitBalance;
  }

  sumByPaymentType(paymentGroupType?: number | null, paymentType?: string | null) {
    let total = {
      debtAmountTotal: 0,
      debtSettlementAmountTotal: 0,
    };
    for (let index = 0; index < this.litigationsList?.length; index++) {
      const element = this.litigationsList[index];
      const debtSettlementAccounts =
        (paymentGroupType
          ? element.debtSettlementAccounts?.filter((f: DebtSettlementAccountExtend) =>
              f?.paymentGroupTypes?.includes(paymentGroupType?.toString())
            )
          : element.debtSettlementAccounts) || [];
      for (let j = 0; j < debtSettlementAccounts?.length; j++) {
        const dt = debtSettlementAccounts[j];
        let struturedDebtList =
          (paymentType
            ? dt.struturedDebtList?.filter(
                (f: any) => (f.isAccNo ? f?.showTotal : true) && f.paymentType === paymentType
              )
            : dt.struturedDebtList) || [];
        dt.ready = dt?.struturedDebtList?.every((e: DebtSettlementAccountExtend) => e.ready) || false;

        if (dt.forDetail) {
          for (let k = 0; k < struturedDebtList.length; k++) {
            const el = struturedDebtList[k];
            total.debtAmountTotal += this.sumTotalAmount(el.accountsList?.map(d => Number(d.debtAmount)) || []);
            total.debtSettlementAmountTotal += this.sumTotalAmount(
              el.accountsList?.map(d =>
                typeof d.debtSettlementAmount === 'string'
                  ? Utils.convertStringToNumber(d.debtSettlementAmount) || 0
                  : d.debtSettlementAmount || ''
              ) || []
            );
          }
        }
      }
    }

    return total;
  }

  sumDebt(list: any[]) {
    this.auctionService.debtTotal.debtAmount = this.sumTotalAmount(list?.map(m => m?.debtAmountTotal));
    this.auctionService.debtTotal.settlementAmount = this.sumTotalAmount(list?.map(m => m?.debtSettlementAmountTotal));
    console.log('this.auctionService.debtTotal.debtAmoun', this.auctionService.debtTotal.debtAmount);
    console.log('this.auctionService.debtTotal.settlementAmount ', this.auctionService.debtTotal.settlementAmount);
  }

  calculateSummaryTable(isFirstTime: boolean = false) {
    this.summaryDebtList.map(m => {
      let debtSettlementAmountTotal = 0;
      let debtAmountTotal = 0;
      m.struturedDebtList?.map(st => {
        let sumPayment = this.sumByPaymentType(m?.paymentGroupType || null, st?.paymentType || null);
        st.debtSettlementAmountTotal = sumPayment.debtSettlementAmountTotal;
        st.debtAmountTotal = sumPayment.debtAmountTotal;
        debtSettlementAmountTotal += st.debtSettlementAmountTotal;
        debtAmountTotal += st.debtAmountTotal;
        return st;
      });
      if (isFirstTime) {
        let newList = m.struturedDebtList?.filter((li: DebtSettlementAccountExtend) => {
          return li.debtAmountTotal && li.debtAmountTotal > 0;
        });
        m.struturedDebtList = newList;
      }

      m.debtSettlementAmountTotal = debtSettlementAmountTotal;
      m.debtAmountTotal = debtAmountTotal;
      return m;
    });
    if (isFirstTime) {
      this.summaryDebtList = this.summaryDebtList.filter(f => f?.debtAmountTotal && f?.debtAmountTotal > 0);
    }
  }

  async onPaymentChange(event: any, element: DebtSettlementAccountExtend, i: number, j: number, k: number, l: number) {
    this.isExceed = false;
    const debtSettlementAmount = event.target.value === '' ? 0 : Utils.convertStringToNumber(event.target.value) || 0;
    element.debtSettlementAmount = event.target.value === '' ? undefined : debtSettlementAmount;
    const debtAmount =
      (typeof element?.debtAmount === 'string'
        ? Utils.convertStringToNumber(element.debtAmount) || 0
        : element.debtAmount) || 0;
    this.calculateSummaryTable();
    this.sumDebt(this.summaryDebtList);
    if (this._debitBalance >= this.auctionService.debtTotal.settlementAmount) {
      this.auctionService.debitBalance = this._debitBalance - this.auctionService.debtTotal.settlementAmount;
    } else {
      this.isExceed = true;
      this.auctionService.debitBalance = 0;
    }
    if (debtSettlementAmount > debtAmount) {
      this.getDebtSettlementAmount(i, j, k).at(l).get('debtSettlementAmount')?.setErrors({ incorrect: true });
    } else if (this.isExceed) {
      this.getDebtSettlementAmount(i, j, k).at(l).get('debtSettlementAmount')?.setErrors({ exceed: true });
    }
    this.checkReady();
    await this.updatePaymentType7(i, '7');
  }

  async onDebtAccChange(event: any, element: DebtSettlementAccountExtend, item: any, data: any) {
    this.isExceed = false;
    const debtSettlementAmount = event.target.value === '' ? 0 : Utils.convertStringToNumber(event.target.value) || 0;
    element.debtSettlementAmount = event.target.value === '' ? undefined : debtSettlementAmount;
    let originalDebt = debtSettlementAmount;
    let stForm = (this.getLgListForm.at(item?.index).get('debtSettlementAccounts') as UntypedFormArray)
      .at(data?.index)
      .get('struturedDebtList') as UntypedFormArray;
    data.struturedDebtList = data.struturedDebtList.map((m: any, idx: number) => {
      if (!m.isLastest && m?.forDetail && m?.showTotal) {
        m.accountsList.map((a: any, index: number) => {
          let sum = this.distributeAmount(a.debtAmount, originalDebt);
          a.debtSettlementAmount =
            element?.debtSettlementAmount && element?.debtSettlementAmount >= 0 ? sum : undefined;

          originalDebt -= sum;
          (stForm.at(idx)?.get('accountsList') as UntypedFormArray)
            .at(index)
            ?.get('debtSettlementAmount')
            ?.setValue(sum);

          return a;
        });
        m.isFirstTime = false;
        m.debtSettlementAmountTotal = this.sumTotalAmount(
          m.accountsList?.map((f: DebtSettlementAccountExtend) => f.debtSettlementAmount)
        );
      }
      return m;
    });

    const debtSettlementAmountTotal = this.sumTotalAmount(
      data.struturedDebtList?.map((f: DebtSettlementAccountExtend) =>
        typeof f.debtSettlementAmountTotal === 'string'
          ? Utils.convertStringToNumber(f.debtSettlementAmountTotal)
          : f.debtSettlementAmountTotal
      )
    );

    this.calculateSummaryTable();
    this.sumDebt(this.summaryDebtList);
    if (this._debitBalance >= this.auctionService.debtTotal.settlementAmount) {
      this.auctionService.debitBalance = this._debitBalance - this.auctionService.debtTotal.settlementAmount;
    } else {
      this.isExceed = true;
      this.auctionService.debitBalance = 0;
    }
    let lastestIndex = data.struturedDebtList?.findIndex((s: any) => s.isLastest);

    if (lastestIndex > -1) {
      if (debtSettlementAmount > debtSettlementAmountTotal) {
        this.getDebtAccountControl(item?.index, data?.index, lastestIndex)?.setErrors({ morethandebt: true });
      } else if (this.isExceed) {
        this.getDebtAccountControl(item?.index, data?.index, lastestIndex)?.setErrors({ exceed: true });
      }
    }
    this.checkReady();
    await this.updatePaymentType7(0, '7');
  }

  distributeAmount(debtAmount: number, debtSettlementAmount: number) {
    return debtSettlementAmount - debtAmount >= 0 ? debtAmount : debtSettlementAmount;
  }

  getDebtAccountControl(i: number, j: number, k: number) {
    return (
      (this.getLgListForm.at(i)?.get('debtSettlementAccounts') as UntypedFormArray)
        ?.at(j)
        ?.get('struturedDebtList') as UntypedFormArray
    )
      .at(k)
      .get('debtSettlementAmountTotal');
  }

  async updatePaymentType7(i: number, paymentType: string) {
    let strIndex = 0;
    let debtAccIndex = 0;
    this.litigationsList[i]?.debtSettlementAccounts?.map((debtAcc, j) => {
      if (
        typeof debtAcc?.paymentGroupType === 'string'
          ? debtAcc?.paymentGroupType === paymentType
          : debtAcc?.paymentGroupType === 7
      ) {
        debtAccIndex = j;
        debtAcc.struturedDebtList?.map((st, k) => {
          strIndex = k;
          if (st?.paymentType === paymentType && st?.accountsList?.length > 0) {
            st.accountsList[0].debtSettlementAmount = this.auctionService.debitBalance;
          }
          return st;
        });
      }
    });
    this.getDebtSettlementAmount(i, debtAccIndex, strIndex)
      ?.at(0)
      ?.get('debtSettlementAmount')
      ?.setValue(Utils.numberWithCommas(this.auctionService.debitBalance));
  }

  sumTotalAmount(list: any[]) {
    return list?.reduce((prev, curr) => {
      let current = curr ? curr : 0;
      let currentDigit = new Decimal(current);
      let prevDigi = new Decimal(prev);
      let sumDigit = currentDigit.plus(prevDigi);
      let twoDigit = sumDigit.toFixed(2);
      return new Decimal(twoDigit).toNumber();
    }, 0);
  }

  ngAfterViewInit() {
    this.handleScroll(); // Initial call to handleScroll
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    if (this.bannerElement && this.bannerElement.nativeElement) {
      const bodyRect = document.body.getBoundingClientRect();
      const banner = this.bannerElement.nativeElement.getBoundingClientRect();
      this.offset = this.offset || Math.floor(banner.top - bodyRect.top - banner.height * 2);
      this.isSticky = window.scrollY + banner.top >= this.offset && window.scrollY > this.offset;
    }
  }
  actionButtonHandler() {
    if (this.summaryElement && this.summaryElement.nativeElement) {
      const banner = this.summaryElement.nativeElement.getBoundingClientRect();
      document.documentElement.scrollTop = window.scrollY + banner.top - 120;
    }
  }

  onExpand(element: any) {
    element.expanded = !!!element.expanded;
  }

  checkReady() {
    this.litigationsList.map(debt => {
      debt.debtSettlementAccounts?.map(debtAcc => {
        debtAcc.struturedDebtList?.map(st => {
          st.ready = st?.accountsList?.every((e: any) => {
            let debtSettlementAmount =
              typeof e.debtSettlementAmount === 'string'
                ? Utils.convertStringToNumber(e.debtSettlementAmount) || 0
                : e.debtSettlementAmount;
            return (e.debtSettlementAmount || e.debtSettlementAmount == 0) && debtSettlementAmount >= 0;
          });
          return st;
        });
        debtAcc.ready =
          debtAcc.struturedDebtList?.every(r => r.ready) ||
          ((this.isPendingTask || this.isViewMode) && debtAcc?.debtAmountTotal && debtAcc?.debtAmountTotal >= 0) ||
          false;
        return debtAcc;
      });
      return debt;
    });
  }
}
