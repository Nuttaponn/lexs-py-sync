import { Component, OnInit } from '@angular/core';
import { TaskService } from '@app/modules/task/services/task.service';
import { ActionBar, CommonDocumentConfig, statusCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  AuctionCashierTransferOwnershipApprovalRequest,
  AuctionCashierTransferOwnershipSubmitRequest,
  CashierChequeTransferOwnershipResponse,
  LitigationCaseShortDto,
  TransferProperty,
} from '@lexs/lexs-client';
import { AuctionMenu } from '../auction.model';
import { AuctionService } from '../auction.service';
import { CollateralDocumentExtend, TransferConfig, TransferDocumentExtend } from '../auction.const';
import { RejectAuctionCashierChequeDialogComponent } from '../reject-auction-cashier-cheque-dialog/reject-auction-cashier-cheque-dialog.component';
import { ConveyanceStatus } from '@app/shared/constant';
import moment from 'moment';
import { BuddhistEraPipe } from '@spig/core';

@Component({
  selector: 'app-ownership-transfer',
  templateUrl: './ownership-transfer.component.html',
  styleUrls: ['./ownership-transfer.component.scss'],
})
export class OwnershipTransferComponent implements OnInit {
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  public title!: string;
  public taskIcon: string = 'icon-Task-List';
  public statusName: any;
  public statusCode: any;
  public taskCode!: taskCode;
  public TaskCode = taskCode;
  public conveyanceStatus!: string;
  public AuctionMenu = AuctionMenu;

  public isOpened = false;
  public messageBanner = '';
  public errorBannerMsg = '';
  public prefixAuctionStatus = 'สถานะโอนกรรมสิทธิ์:';
  public auctionMenu!: AuctionMenu;
  public auctionStatus = '';
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public caseDetailTitle = 'TITLE_MSG.CASE_DETAIL';
  public hasSubmitPermission = false;
  public hasAdditionalTitle = false;
  public additionalTitle = '';
  public auctionDetailTitle = '';
  public ownershipTransferData: any = [{ test: '2' }];
  public displayExpense = ['id', 'listName', 'total'];
  public documentPayment = [];
  public documentDeed = [];
  public transferProperties: any = [];
  public isR2E09_12_01 = false;
  public isFromMas: boolean = false;
  public paymentConfig: CommonDocumentConfig = {
    title: 'เอกสารสำเนาและใบเสร็จ',
    isMain: true,
    canShowIcon: false,
    showDropdown: false,
    selectText: 'เลือกส่งทั้งหมด',
    forGeneral: true,
    forAsset: false,
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon icon-xmedium default-cursor icon-hide-show',
    ready: true,
    viewImage: true,
    msgNotFound: 'ไม่มีเอกสารสำเนาและใบเสร็จที่เกี่ยวข้อง',
    customDateText: 'วันที่ได้รับ',
    classTitle: 'text-gray-700',
  };
  public deedConfig: CommonDocumentConfig = {
    title: 'เอกสารสิทธิ์',
    isMain: true,
    canShowIcon: false,
    showDropdown: true,
    selectText: 'เลือกส่งทั้งหมด',
    msgNotFound: 'ไม่มีเอกสารสิทธิ์ที่เกี่ยวข้อง',
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon icon-xmedium default-cursor icon-hide-show',
    forGeneral: true,
    ready: true,
    customDateText: 'วันที่ได้รับเอกสาร',
    forAsset: false,
    viewImage: true,
    classInput: 'input-xsm input-normal',
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
    classTitle: 'text-gray-700',
  };
  public displayPayment: Array<any> = ['id', 'documentName', 'customDate'];
  public displayDeed: Array<any> = [
    'id',
    'documentName',
    'collateralNo',
    'collateralId',
    'storeOrganization',
    'customDate',
  ];
  public isViewMode: boolean = true;
  public isViewModeOwnership: boolean = true;
  public isOwnerTask: boolean = false;
  constructor(
    private routerService: RouterService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  private titleMapper = new Map<taskCode | string, string>([
    [AuctionMenu.CASHIER, 'ออกแคชเชียร์เช็ควางเงินเพิ่ม'],
    [AuctionMenu.VIEW_CASHIER, 'รายละเอียดขายทอดตลาด'],
    [AuctionMenu.UPLOAD_DOC, 'อัปโหลดเอกสารจากการซื้อทรัพย์'],
    [taskCode.R2E09_11_01, 'TASK_CODE_STATUS.TITLE_PENDING_R2E09_11_01'],
    [AuctionMenu.VIEW_OWNERSHIP_TRNASFER, 'รายละเอียดโอนกรรมสิทธิ์'],
    [AuctionMenu.OWNERSHIP_TRNASFER, 'ออกแคชเชียร์เช็ค'],
    [AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS, 'รายละเอียดโอนกรรมสิทธิ์'],
    [AuctionMenu.VIEW_OWNERSHIP_TRNASFER_DATE_TIME, 'รายละเอียดโอนกรรมสิทธิ์'],
    [taskCode.R2E09_06_04_6, 'ออกแคชเชียร์เช็คโอนกรรมสิทธิ์'],
  ]);
  private bannerMapper = new Map<taskCode, string>([
    [taskCode.R2E09_11_01, 'กรุณาระบุรายละเอียดการโอนกรรมสิทธิ์ และกดปุ่ม “เสร็จสิ้น” เพื่อดำเนินการต่อไป'],
  ]);

  private mappingPageBanner() {
    if (this.taskCode === taskCode.R2E09_06_04_6) {
      switch (this.statusCode) {
        case 'PENDING':
          this.messageBanner = 'กรุณากรอกรายละเอียดแคชเชียร์เช็คโอนกรรมสิทธิ์ และกดปุ่ม “นำเสนอ” เพื่อดำเนินการต่อไป';
          break;
        case 'CORRECT_PENDING':
          this.messageBanner =
            'กรุณาตรวจสอบเหตุผลส่งกลับแก้ไขและกรอกรายละเอียดแคชเชียร์เช็คโอนกรรมสิทธิ์ และกดปุ่ม “นำเสนอ” เพื่อดำเนินการต่อไป';
          break;
        case 'PENDING_APPROVAL':
          this.messageBanner =
            'กรุณากรอกรายละเอียดแคชเชียร์เช็คโอนกรรมสิทธิ์ และกดปุ่ม “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
          break;

        default:
          break;
      }
    } else {
      this.messageBanner = this.bannerMapper.get(this.taskCode || this.auctionService.actionCode) || '';
    }
  }
  get isDisplayTitleStatus() {
    return (
      [taskCode.R2E09_11_01, taskCode.R2E09_06_04_6].includes(this.taskCode) ||
      [
        AuctionMenu.VIEW_OWNERSHIP_TRNASFER,
        AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS,
        AuctionMenu.OWNERSHIP_TRNASFER,
        AuctionMenu.VIEW_OWNERSHIP_TRNASFER_DATE_TIME,
      ].includes(this.auctionMenu)
    );
  }

  ngOnInit(): void {
    this.auctionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.isFromMas = this.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS;
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
    this.statusName = this.taskService.taskDetail?.statusName || '';
    this.conveyanceStatus = this.auctionService.conveyanceStatus;
    this.isOwnerTask = this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );

    this.isOpened =
      this.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS ||
      this.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER;
    this.mappingPageTitle();
    this.mappingPageBanner();
    this.initTaskScreenStatus();
    this.initActionBar();

    this.isViewMode = this.isOwnerTask ? !(this.taskCode === taskCode.R2E09_11_01) : true;
    this.isViewModeOwnership =
      this.isOwnerTask && this.taskCode
        ? !(
            this.taskCode === taskCode.R2E09_06_04_6 &&
            (this.statusCode === 'PENDING' || this.statusCode === 'CORRECT_PENDING')
          )
        : !(this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER);
    this.prepareDataTransferProp();
    this.checkDateEligibility();
  }

  get isAuctionPendingStatusGroup() {
    return (
      [statusCode.PENDING, statusCode.CORRECT_PENDING].includes(this.statusCode) ||
      [
        ConveyanceStatus.APPRAISAL,
        ConveyanceStatus.XFER_FAIL,
        ConveyanceStatus.XFER_ARR,
        ConveyanceStatus.AMEND_XFER_CHQ,
        ConveyanceStatus.ISSUE_XFER_CHQ,
      ].includes(this.auctionService.conveyanceStatus)
    );
  }
  get isAuctionNormalStatusGroup() {
    return (
      [ConveyanceStatus.SUBMIT_XFER_CHQ].includes(this.auctionService.conveyanceStatus) ||
      [statusCode.PENDING_APPROVAL].includes(this.statusCode)
    );
  }

  get isAuctionSuccessStatusGroup() {
    return [ConveyanceStatus.XFER_COMPLETE, ConveyanceStatus.COMPLETE].includes(this.auctionService.conveyanceStatus);
  }

  prepareDataTransferProp() {
    const transferPropertyList = this.auctionService?.transferPropertyList;
    const sort = this.auctionService?.transferPropertyList?.sort(
      (a: TransferProperty, b: TransferProperty) => (a?.appointmentRound || 0) - (b?.appointmentRound || 0)
    );
    const lastestRound = sort[transferPropertyList?.length - 1]
      ? sort[transferPropertyList?.length - 1]?.appointmentRound
      : 0;
    for (let index = 0; index < transferPropertyList?.length; index++) {
      const i = transferPropertyList[index] as TransferProperty;
      if (i.transferDocuments) {
        i?.transferDocuments.map((m: TransferDocumentExtend) => {
          m.documentTemplate = {
            documentName: m?.documentName || '',
          };
          m.customDate = m?.receivedDocumentDate;
          m.imageId = m.chronicleId;
          return m;
        });
      }
      if (i.collateralDocuments) {
        i?.collateralDocuments.map((m: CollateralDocumentExtend) => {
          m.documentTemplate = {
            documentName: m?.documentName,
          };
          m.customDate = m?.receivedDocumentDate;
          m.imageId = m?.chronicleId;
          m.documentNo = m.collateralDocumentNo;
          m.relatedCollateral = {
            collateralDetails: m.collateralDetails,
            collateralId: m.collateralId,
          };
          m.storeOrganization = m.documentStorageCode;
          m.storeOrganizationName = m.documentStorageName;
          return m;
        });
      }

      let transferProp: TransferConfig = {
        ...i,
        result: i?.conveyancingStatus === 'SUCCESS' || i?.conveyancingStatus === 'APPOINTED' ? 'สำเร็จ' : '',
        expand: this.isOpened && lastestRound === i.appointmentRound,
        ready: i?.conveyancingStatus === 'SUCCESS' || i?.conveyancingStatus === 'APPOINTED',
        expenseList: [],
        details: [
          {
            name: 'วันที่โอนกรรมสิทธิ์',
            value: i?.appointDate || '',
          },
          {
            name: 'สถานะ',
            value:
              i?.conveyancingStatus === 'SUCCESS' || i?.conveyancingStatus === 'APPOINTED'
                ? 'โอนกรรมสิทธิ์สำเร็จ '
                : 'เลื่อนการนัดหมาย',
          },
        ],
      };
      const expenseList = [
        {
          name: 'ภาษีการโอน',
          expense: i.feeTax,
        },
        {
          name: 'ภาษีหัก ณ ที่จ่าย',
          expense: i.withdrawnTax,
        },
        {
          name: 'ค่าธรรมเนียมการโอน',
          expense: i.fee,
        },
      ];
      if (i.witnessFee) {
        expenseList.push({
          name: 'ค่าพยาน',
          expense: i.witnessFee,
        });
      }
      transferProp.expenseList = expenseList;

      this.transferProperties.push(transferProp);
    }
  }
  get conveyanceStatusName() {
    switch (this.conveyanceStatus) {
      case ConveyanceStatus.APPRAISAL:
      case ConveyanceStatus.XFER_FAIL:
        return 'รอนัดโอนกรรมสิทธิ์';
      case ConveyanceStatus.XFER_ARR:
        return 'รอออกแคชเชียร์เช็ค โอนกรรมสิทธิ์';
      case ConveyanceStatus.SUBMIT_XFER_CHQ:
        return 'รออนุมัติออกแคชเชียร์ เช็คโอนกรรมสิทธิ์';
      case ConveyanceStatus.AMEND_XFER_CHQ:
        return 'รอแก้ไข';
      case ConveyanceStatus.ISSUE_XFER_CHQ:
        return 'รอผลการโอนกรรมสิทธิ์';
      case ConveyanceStatus.XFER_COMPLETE:
      case ConveyanceStatus.COMPLETE:
        return 'โอนกรรมสิทธิ์สำเร็จ';
      default:
        return '';
    }
  }

  checkDateEligibility() {
    if (
      this.taskCode === taskCode.R2E09_06_04_6 &&
      ['PENDING_REVIEW', 'PENDING_APPROVAL'].includes(this.statusCode) &&
      this.isOwnerTask
    ) {
      let date;
      switch (this.taskCode) {
        case taskCode.R2E09_06_04_6:
          let lastestOrder = this.auctionService.transferOwershipList?.length - 1;
          date = this.auctionService.transferOwershipList[lastestOrder]?.receiveCashierDate;
          break;
      }

      if (moment(date).startOf('day').isBefore(moment().startOf('day'))) {
        this.messageBanner = '';
        this.errorBannerMsg =
          'เนื่องจากเกินกำหนดวัน “วันที่ไปรับแคชเชียร์เช็ค/วันที่สั่งจ่าย” กรุณากดปุ่ม “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
        this.actionBar.hasPrimary = false;
      }
    }
  }

  initTaskScreenStatus() {
    switch (this.auctionMenu) {
      case AuctionMenu.OWNERSHIP_TRNASFER:
        const transfer = this.auctionService?.transferOwershipList[0] as CashierChequeTransferOwnershipResponse;
        this.auctionDetailTitle = `${transfer?.ledName || ''}`;
        this.hasAdditionalTitle = true;
        this.additionalTitle = 'ชุดทรัพย์ที่ ' + (transfer?.fsubbidnum || '');
        this.auctionStatus = this.conveyanceStatusName;
        this.taskIcon = 'icon-Cheque';

        break;
      case AuctionMenu.VIEW_OWNERSHIP_TRNASFER:
      case AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS:
      case AuctionMenu.VIEW_OWNERSHIP_TRNASFER_DATE_TIME:
        const appointment =
          this.auctionService?.appointmentInfo?.length > 0 ? (this.auctionService?.appointmentInfo[0] as any) : {};
        this.auctionDetailTitle = `${appointment?.ledName || ''}`;
        this.hasAdditionalTitle = true;
        this.additionalTitle = 'ชุดทรัพย์ที่ ' + (appointment?.fsubbidnum || '');
        this.auctionStatus = this.conveyanceStatusName;
        this.taskIcon = 'icon-List-Multiple';
        break;
      default:
        break;
    }
    switch (this.taskCode) {
      case taskCode.R2E09_11_01:
        const appointment =
          this.auctionService?.appointmentInfo?.length > 0 ? (this.auctionService?.appointmentInfo[0] as any) : {};
        this.auctionDetailTitle = `${appointment?.ledName || ''}`;
        this.hasAdditionalTitle = true;
        this.additionalTitle = 'ชุดทรัพย์ที่ ' + (appointment?.fsubbidnum || '');
        this.auctionStatus = this.statusCode === 'PENDING' ? 'รอนัดโอนกรรมสิทธิ์' : 'โอนกรรมสิทธิ์สำเร็จ';
        break;
      case taskCode.R2E09_06_04_6:
        let lastestOrder = this.auctionService.transferOwershipList?.length - 1;
        const transfer = this.auctionService.transferOwershipList[lastestOrder];
        this.auctionDetailTitle = `${transfer?.ledName || ''}`;
        this.hasAdditionalTitle = true;
        this.additionalTitle = 'ชุดทรัพย์ที่ ' + (transfer?.fsubbidnum || '');
        this.auctionStatus = this.auctionStatusByStatusCode;
        this.taskIcon = 'icon-Task-List';
        break;
      default:
        break;
    }
  }

  get auctionStatusByStatusCode() {
    switch (this.statusCode) {
      case 'PENDING':
        return 'รอออกแคชเชียร์เช็คโอนกรรมสิทธิ์';
      case 'CORRECT_PENDING':
        return 'รอแก้ไข';
      case 'PENDING_APPROVAL':
        return 'รออนุมัติแคชเชียร์เช็คโอนกรรมสิทธิ์';
      default:
        return '';
    }
  }

  private mappingPageTitle() {
    if (this.auctionMenu === AuctionMenu.VIEW_PAYMENT) {
      this.title = 'ค่าใช้จ่ายประกาศขายทอดตลาด';
    } else if (this.auctionService.auctionMenu === AuctionMenu.REVOKE) {
      this.title = 'เพิกถอนการขาย';
    } else {
      this.title = this.titleMapper.get(this.taskCode || this.auctionService.actionCode || this.auctionMenu) || '';
    }
  }

  async onBack() {
    if (this.taskCode === taskCode.R2E09_11_01) {
      this.routerService.navigateTo('/main/task/');
    } else {
      this.routerService.back();
    }
  }

  onReject() {}
  onSave() {}
  async onSubmit() {
    switch (this.taskCode) {
      case taskCode.R2E09_06_04_6:
        let lastestOrder = this.auctionService.transferOwershipList?.length - 1;
        const transfer = this.auctionService.transferOwershipList[lastestOrder];
        if (this.statusCode === 'PENDING_APPROVAL') {
          const req: AuctionCashierTransferOwnershipApprovalRequest = {
            headerFlag: 'APPROVE',
            id: Number(this.taskService.taskDetail.objectId),
            taskId: this.taskService.taskDetail.id,
          };
          await this.auctionService.auctionCashierChequeTransferOwnershipApproval(req);
          this.auctionService?.transferOwershipForm?.markAsPristine();
          this.notificationService.openSnackbarSuccess(
            `อนุมัติแคชเชียร์เช็คโอนกรรมสิทธิ์ชุด ทรัพย์ที่ ${transfer?.fsubbidnum || ''} แล้ว`
          );
          this.routerService.back();
        } else {
          await this.submitChequeTransferOwnership();
        }
        break;
    }

    if (this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER) {
      await this.submitChequeTransferOwnership();
    }
  }

  async submitChequeTransferOwnership() {
    const transfer = this.auctionService?.transferOwershipList[0] as any;
    this.auctionService.transferOwershipForm?.markAllAsTouched();
    this.auctionService.transferOwershipForm?.updateValueAndValidity();
    if (this.auctionService.transferOwershipForm?.valid) {
      let value = this.auctionService.transferOwershipForm?.value;
      const req: AuctionCashierTransferOwnershipSubmitRequest = {
        amount: value.amount,
        branchCode: value.branchCode,
        cashierTransferOwnershipId:
          this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER ? undefined : value.cashierTransferOwnershipId,
        deedGroupId: this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER ? value.deedGroupId : undefined,
        headerFlag: AuctionCashierTransferOwnershipSubmitRequest.HeaderFlagEnum.Submit,
        receivedByLawyerId: value.receivedByLawyerId,
        receivedByLawyerMobileNo: value.receivedByLawyerMobileNo,
        documents: !!value.documents ? (Array.isArray(value.documents) ? value.documents : [value.documents]) : [],
      };
      await this.auctionService.submitAuctionCashierChequeTransferOwnership(req);
      this.auctionService.transferOwershipForm.markAsPristine();
      if (this.statusCode === 'PENDING' || this.statusCode === 'CORRECT_PENDING') {
        this.notificationService.openSnackbarSuccess(
          `นำเสนอแคชเชียร์เช็คโอนกรรมสิทธิ์ชุด ทรัพย์ที่ ${transfer?.fsubbidnum} แล้ว`
        );
        this.routerService.back();
      } else if (this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER) {
        this.notificationService.openSnackbarSuccess(
          `นำเสนอแคชเชียร์เช็คโอนกรรมสิทธิ์ชุด ทรัพย์ที่ ${transfer?.fsubbidnum} แล้ว`
        );
        this.routerService.back();
      }
    }
  }
  initActionBar() {
    if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.VIEW_OWNERSHIP_TRNASFER:
          this.actionBar = {
            hasSave: false,
            hasPrimary: false,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
        case AuctionMenu.OWNERSHIP_TRNASFER:
          this.actionBar = {
            hasSave: false,
            primaryText: 'นำเสนอ',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
      }
    } else {
      if (this.isOwnerTask) {
        switch (this.taskCode) {
          case taskCode.R2E09_11_01:
            this.actionBar = {
              hasSave: false,
              primaryText: 'เสร็จสิ้น',
              primaryIcon: 'icon-Selected',
              hasPrimary: true,
              hasCancel: false,
              hasReject: false,
              hasEdit: false,
            };
            break;
          case taskCode.R2E09_06_04_6:
            switch (this.statusCode) {
              case 'PENDING':
              case 'CORRECT_PENDING':
                this.actionBar = {
                  hasSave: false,
                  primaryText: 'นำเสนอ',
                  primaryIcon: 'icon-Selected',
                  hasPrimary: true,
                  hasCancel: false,
                  hasReject: false,
                  hasEdit: false,
                };
                break;
              case 'PENDING_APPROVAL':
                this.actionBar = {
                  hasSave: false,
                  primaryText: 'อนุมัติ',
                  primaryIcon: 'icon-Selected',
                  hasPrimary: true,
                  hasCancel: false,
                  hasReject: false,
                  hasEdit: true,
                  editIcon: 'icon-Arrow-Revert',
                  editText: 'ส่งกลับแก้ไข',
                };
                break;

              default:
                break;
            }
            break;

          default:
            this.actionBar = {
              hasSave: false,
              hasPrimary: false,
              hasCancel: false,
              hasReject: false,
              hasEdit: false,
            };
            break;
        }
      } else {
        this.actionBar = {
          hasSave: false,
          hasPrimary: false,
          hasCancel: false,
          hasReject: false,
          hasEdit: false,
        };
      }
    }
  }
  async onEdit() {
    let context = {};
    switch (this.taskCode) {
      case taskCode.R2E09_06_04_6:
        let lastestOrder = this.auctionService.transferOwershipList?.length - 1;
        const transfer = this.auctionService.transferOwershipList[lastestOrder];
        context = {
          lawyer: transfer.reviewedByMakerDisplayName,
          auctionCollateralId: transfer.aucRef,
        };
        break;
    }
    const dialog = await this.notificationService.showCustomDialog({
      component: RejectAuctionCashierChequeDialogComponent,
      title: 'COMMON.LABEL_SEND_BACK_EDIT',
      iconName: 'icon-Arrow-Revert',
      rightButtonClass: 'long-button mat-warn',
      buttonIconName: 'icon-Arrow-Revert',
      rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      cancelEvent: true,
      context: context,
    });
    if (dialog && dialog.isSuccess) {
      this.routerService.back();
    }
  }
  async canDeactivate() {
    if (this.auctionService?.cashCourtForm?.dirty || this.auctionService?.transferOwershipForm?.dirty) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        if (this.routerService.nextUrl.indexOf('/property-detail') > -1) {
          this.clearAppointment();
        } else {
          this.auctionService.clearData();
        }
        return true;
      }
      return false;
    } else {
      if (this.routerService.nextUrl.indexOf('/property-detail') > -1) {
        this.clearAppointment();
      } else if (this.routerService.nextUrl.indexOf('/appointment') === -1) {
        this.auctionService.clearData();
      }
      return true;
    }
  }
  clearAppointment() {
    this.auctionService.transferOwershipList = [];
  }
}
