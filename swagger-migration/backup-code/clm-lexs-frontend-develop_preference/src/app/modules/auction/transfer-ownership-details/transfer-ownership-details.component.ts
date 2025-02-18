import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuctionService } from '@app/modules/auction/auction.service';
import { UserService } from '@app/modules/user/user.service';
import { IUploadMultiFile, IUploadMultiInfo, maxFileSize, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CashierChequeTransferOwnershipResponse, LexsUserOption, PhoneBookDto } from '@lexs/lexs-client';
import { BuddhistEraPipe, DropDownConfig } from '@spig/core';
import { CashierChequeTransferOwnershipResponseExend } from '../ownership-transfer/onwership-transfer.const';
import { TaskService } from '@app/modules/task/services/task.service';
import { AuctionMenu } from '../auction.model';
import { DEFAULT_UPLOAD_MULTI_INFO } from '../auction-advance-payment/interface/auction-efiling.model';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';

@Component({
  selector: 'app-transfer-ownership-details',
  templateUrl: './transfer-ownership-details.component.html',
  styleUrls: ['./transfer-ownership-details.component.scss'],
  providers: [BuddhistEraPipe],
})
export class TransferOwnershipDetailsComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @Input() isViewMode: boolean = false;

  public isOpened = false;
  public cashDetail: Array<CashierChequeTransferOwnershipResponseExend> = [];
  public branchConfig: DropDownConfig = {
    disableSelect: false,
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'สาขาที่ออกแคชเชียร์เช็ค',
  };
  public branchOptions: any = [];
  public checkConfig: DropDownConfig = {
    disableSelect: false,
    iconName: '',
    displayWith: 'name',
    valueField: 'receivedByLawyerId',
    labelPlaceHolder: 'ผู้ไปรับแคชเชียร์เช็ค',
  };
  public checkOptions: LexsUserOption[] = [];
  public isUploadReadOnly: boolean = false;
  public uploadMultiInfo: IUploadMultiInfo = DEFAULT_UPLOAD_MULTI_INFO;
  public documentUpload: IUploadMultiFile[] = [];

  public _column = ['no', 'documentName', 'set', 'uploadDate', 'command'];
  public onDownLoadForm = new EventEmitter();
  public maxFileSize: number = maxFileSize; // MB Size
  public onUploadFileEvent = new EventEmitter<any>();
  public readonly = false;
  public isSubmitted: boolean = false;
  public placetext = '';
  public tableColumnssale: Array<string> = ['order', 'saleday', 'salesresults', 'date'];
  public datatable: any = [];
  public arraytable: any = [];
  public form!: UntypedFormGroup;
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public lastestOrder = 0;
  public taskCode!: taskCode;
  public auctionMenu!: AuctionMenu;
  public statusCode: string = '';
  constructor(
    private routerService: RouterService,
    private sessionService: SessionService,
    public auctionService: AuctionService,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private buddhistEraPipe: BuddhistEraPipe,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  async ngOnInit(): Promise<void> {
    this.cashDetail = this.auctionService.transferOwershipList as CashierChequeTransferOwnershipResponseExend[];
    this.lastestOrder = this.cashDetail.length - 1;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.statusCode = this.taskService.taskDetail?.statusCode as string;
    this.auctionMenu = this.auctionService.auctionMenu as AuctionMenu;
    this.isOpened = this.taskCode === taskCode.R2E09_06_04_6 || this.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER;
    await this.genForm();
    this.initData();
    await this.initOption();
  }

  initData() {
    this.cashDetail.map((m: CashierChequeTransferOwnershipResponseExend, index: number) => {
      m.expand = this.isOpened && this.cashDetail.length === index + 1;
      m.details = [
        {
          name: 'วันที่สั่งจ่าย',
          value: this.buddhistEraPipe.transform(m?.receiveCashierDate, 'DD/MM/YYYY') || '',
        },
        {
          name: 'สถานะ',
          value: this.getStatusName(m.statusName || ''),
        },
      ];
      m.dataSource = [
        {
          amount: m?.amount,
          orderNo: 'ชุดทรัพย์ที่ ' + m?.fsubbidnum,
          date: m?.receiveCashierDate,
        },
      ];
      m.documentUpload = m.documents?.map(doc => {
        return {
          ...doc,
          isUpload: false,
          uploadRequired: false,
          removeDocument: true,
          paramsMsg: [
            {
              content: 'เอกสารเพื่อส่งให้หน่วยงานดูแลทรัพย์สินพร้อมขาย เมื่อโอนกรรมสิทธิ์แล้วเสร็จ',
            },
          ],
          active: !!doc.imageId,
          multipleUpload: doc.documentTemplate?.multipleUpload,
        };
      }) as Array<IUploadMultiFile>;

      if (m?.documentUpload?.some(s => s.imageId) && m.documentUpload?.length > 0 && !this.isUploadReadOnly) {
        let newDoc = {
          ...m.documentUpload[0],
          imageId: '',
          documentDate: '',
          active: false,
          isUpload: false,
        };
        m.documentUpload.push(newDoc);
      }
      return m;
    });
    this.uploadMultiInfo.cif = this.litigationCaseService.litigationCaseShortDetail.cifNo || '';
    this.uploadMultiInfo.litigationId = this.litigationCaseService.litigationCaseShortDetail.litigationId || '';
  }

  getStatusName(status: string) {
    switch (status) {
      case 'PENDING':
      case 'CORRECT_PENDING':
      case 'PENDING_APPROVAL':
        return 'กำลังดำเนินการ';
      case 'FINISHED':
        return 'สำเร็จแล้ว';
      case 'CANCELLED':
        return '-';
      default:
        return '';
    }
  }

  async initOption() {
    if (!this.isViewMode) {
      let userOption: PhoneBookDto[] = await this.userService.getPhonebookOptions(
        this.form.get('assignedLawyerResponseUnitCode')?.value || ''
      );
      this.checkOptions = userOption.map((m: any) => {
        m.receivedByLawyerId = m.userId;
        m.name = m.userId + ' - ' + m.name + ' ' + m.surname;
        return m;
      });
      const data = await this.auctionService.getCashierChequeBranchList();
      this.branchOptions = data.ktbOrg;
    }
  }

  async genForm() {
    let lastIndexOf =
      this.auctionService.transferOwershipList.length > 0
        ? this.auctionService.transferOwershipList[this.lastestOrder]
        : ({} as CashierChequeTransferOwnershipResponse);
    this.form = this.fb.group({
      amount: [lastIndexOf?.amount || '', Validators.required],
      assignedLawyerId: [lastIndexOf?.assignedLawyerId || ''],
      departmentOfLandName: [lastIndexOf?.departmentOfLandName || ''],
      assignedLawyerMobileNo: [lastIndexOf?.assignedLawyerMobileNo || ''],
      assignedLawyerName: lastIndexOf?.assignedLawyerName || '',
      aucRef: [lastIndexOf?.aucRef || ''],
      cashierTransferOwnershipId: [lastIndexOf?.cashierTransferOwnershipId || ''],
      deedGroupId: [lastIndexOf?.deedGroupId || ''],
      initBy: [lastIndexOf?.initBy || ''],
      ledId: [lastIndexOf?.ledId || ''],
      ledName: [lastIndexOf?.ledName || ''],
      litigationCaseId: [lastIndexOf?.litigationCaseId || ''],
      litigationId: [lastIndexOf?.litigationId || ''],
      orderNo: [lastIndexOf?.orderNo || ''],
      receiveCashierDate: [lastIndexOf?.receiveCashierDate || ''],
      receivedByLawyerId: [lastIndexOf?.assignedLawyerId || '', Validators.required],
      receivedByLawyerMobileNo: [lastIndexOf?.receivedByLawyerMobileNo || ''],
      receivedByLawyerName: [lastIndexOf?.receivedByLawyerName || ''],
      receivedByLawyerResponseUnit: [lastIndexOf?.receivedByLawyerResponseUnit || ''],
      assignedLawyerResponseUnitCode: [lastIndexOf?.assignedLawyerResponseUnitCode || ''],
      rejectReason: lastIndexOf?.rejectReason || '',
      reviewResultDateTime: lastIndexOf?.reviewResultDateTime || '',
      reviewedByApproverId: lastIndexOf?.reviewedByApproverId || '',
      branchCode: [lastIndexOf?.branchCode || '', Validators.required],
      documents: lastIndexOf?.documents || '',
    });
    this.auctionService.transferOwershipForm = this.form;
  }

  async onClickProperty() {
    let lastIndexOf = this.auctionService.transferOwershipList[this.lastestOrder] as any;
    if (this.isViewMode) {
      const destination = this.auctionService.routeCorrection('property-detail');
      this.routerService.navigateTo(destination, {
        fsubbidnum: lastIndexOf?.fsubbidnum,
        aucRef: lastIndexOf?.aucRef,
        npaStatus: '',
      });
    } else if (await this.sessionService.confirmExitWithoutSave()) {
      const destination = this.auctionService.routeCorrection('property-detail');
      this.routerService.navigateTo(destination, {
        fsubbidnum: lastIndexOf?.fsubbidnum,
        aucRef: lastIndexOf?.aucRef,
        npaStatus: '',
      });
    }
  }

  selectedOption(userId: any) {
    let user = this.checkOptions.find(f => f.userId === userId) as PhoneBookDto;
    this.form.get('receivedByLawyerId')?.setValue(userId);
    this.form.get('receivedByLawyerResponseUnit')?.setValue(user?.originalOrganizationName);
    this.form.get('receivedByLawyerMobileNo')?.setValue(user?.officePhoneNumber);
  }

  onUploadFileContent(event: any): void {
    console.log(event, '===event');
    this.form.get('documents')?.setValue(event);
  }
}
