import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe } from '@angular/common';
import { AfterViewChecked, Component, OnInit, Pipe, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { IUploadMultiFile, IUploadMultiInfo, TMode, WithDrawnSeizureConfig, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  Assets,
  Collaterals,
  Contacts,
  ResultRecordingTaskSubmitRequest,
  WithdrawSeizureLedAllResponse,
  WithdrawSeizureLedDocumentDto,
  WithdrawSeizureLedGroupDocumentDto,
} from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import memo from 'memo-decorator';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
  WithdrawnPersonColumns,
} from '../withdrawn-seizure-property-select/withdrawn-seizure-property-select.model';
import { WithdrawnSeizureViewModel } from '../withdrawn-seizure-property.model';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';
import { LegalExecutionOfficeWithdrawUnsuccessComponent } from './dialog/legal-execution-office-withdraw-unsuccess/legal-execution-office-withdraw-unsuccess.component';
import { LegalExecutionWithdrawConfirmationDialogComponent } from './dialog/legal-execution-withdraw-confirmation-dialog/legal-execution-withdraw-confirmation-dialog.component';
import { CollateralCaseLexsStatus } from '@app/shared/constant';
import { AucCollateralColType } from '@app/modules/auction/auction.model';
enum SeizureReason {
  '01' = 'เจ้าหนี้นอกสวมสิทธิ์แทน',
  '02' = 'ผู้ติดต่อไม่สามารถจ่ายค่าธรรมเนียมการถอนการยึดทรัพย์',
  '03' = 'จำเลยเป็นบุคคลล้มละลาย หรือ ถูกพิทักษ์ทรัพย์',
}
@Pipe({
  name: 'seizureReason',
})
export class SeizureReasonPipe implements PipeTransform {
  @memo()
  transform(value: Collaterals): string {
    if (value.withdrawSeizureReason) {
      if (value.withdrawSeizureReason === '04') {
        return value.remark || '';
      } else {
        return SeizureReason[value.withdrawSeizureReason as keyof typeof SeizureReason] || value.withdrawSeizureReason;
      }
    }
    return '';
  }
}

@Component({
  selector: 'app-legal-execution-office-info',
  templateUrl: './legal-execution-office-info.component.html',
  styleUrls: ['./legal-execution-office-info.component.scss'],
})
export class LegalExecutionOfficeInfoComponent implements OnInit, AfterViewChecked {
  @ViewChildren(MatTable) table!: QueryList<any>;

  public isReadOnly = false;
  public taskCode!: taskCode;
  public mode!: TMode;
  public withdrawDateCtrl: UntypedFormControl = new UntypedFormControl(null);
  public withdrawFeeCtrl: UntypedFormControl[] = [];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public uploadContactMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  public uploadListDocumentContactMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public isOpened: boolean = true;
  public isOpened1: boolean = true;
  public isTableOpened: boolean[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public documentListContactColumns: string[] = [
    'documentName',
    'executionCollateralId',
    'executionOwnerName',
    'executionLedName',
    'uploadDate',
  ];
  public documentContactColumns: string[] = ['documentName', 'uploadDate'];
  public documentUpload: IUploadMultiFile[] = [];
  public documentContactUpload: IUploadMultiFile[] = [];
  public documentListConstactUpload: any[] = [];
  public documentListConstactUploadAsset: any[] = [];
  public cifNo: string = '';
  public isCheckIsOnly: boolean = false;
  public currentDate: Date | null = new Date();

  public tableColDisplay = [
    'selection',
    'orderNumber',
    'collateralId',
    'collateralTypeDesc',
    'collateralSubTypeDesc',
    'documentNo',
    'collateralDetails',
    'ownerId',
    'totalAppraisalValue',
    'ledRefNo',
    'ledName',
    'status',
  ];

  public tableAssetDisplay = [
    'selection',
    'orderNumber',
    'collateralTypeDesc',
    'collateralSubTypeDesc',
    'documentNo',
    'collateralDetails',
    'ownerId',
    'totalAppraisalValue',
    'ledRefNo',
    'ledName',
    'obligationStatus',
    'status',
  ];
  public tableColContactDisplay = [
    'colContactIndex',
    'colContact0',
    'colContact1',
    'colContact2',
    'colContact3',
    'colContact4',
  ];
  public dataGroup: any = [];

  /** Selection */
  public selections: SelectionModel<string>[] = [];
  public selectionsAsset: SelectionModel<string>[] = [];
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageIndexAsset: number = 1;
  public pageSizeAsset: number = 10;
  public LEXS_STATUS = CollateralCaseLexsStatus;

  get isTaskCOrTaskD() {
    return (
      this.taskCode === taskCode.R2E06_03_C ||
      this.taskCode === taskCode.R2E06_04_D ||
      [taskCode.R2E06_04_D, taskCode.R2E06_03_C].includes(
        this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse.withdrawSeizureLed?.status?.split(
          '_'
        )[0] as taskCode
      )
    );
  }
  public isUploadLater: boolean = false;
  public propertyDataSources: WithdrawnSeizureViewModel[] = [];
  public collateralColumns: string[] = WithdrawnCollateralColumns;
  public lgPersonColumn: string[] = WithdrawnPersonColumns;
  public assetColumns: string[] = WithdrawAssetColumns;

  public tableConfig: WithDrawnSeizureConfig = {
    propertyConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: false,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: false,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawnCollateralColumns,
      hasUploadDocument: true,
      uploadReadOnly: true,
      hasTitleTotal: true,
    },
    assetConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: false,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: false,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawAssetColumns,
      hasUploadDocument: true,
      uploadReadOnly: true,
      hasTitleTotal: true,
    },
    contactConfig: {
      hasAction: false,
      hasAdd: false,
      hasDelete: false,
      hasEdit: false,
      hasTitle: true,
      layout: 'row',
    },
  };

  get isOwnerTask(): any {
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  get canAction(): boolean {
    return this.isEditor && this.isOwnerTask && this.hasSavePermission && this.mode !== 'VIEW';
  }

  public accessPermissions = this.sessionService.accessPermissions();
  public hasSavePermission = false;
  private taskId: number = 0;
  private withdrawSeizureId: string | undefined;
  private withdrawSeizureLedId: string | undefined;
  public assetDataSources: MatTableDataSource<Assets>[] = [];
  public collateralDataSources: MatTableDataSource<Collaterals>[] = [];
  public contactDatSources: MatTableDataSource<Contacts>[] = [];
  public withdrawSeizuresLedData!: WithdrawSeizureLedAllResponse;
  private contactsSource: Contacts[] = [];
  public isTaskCode = false;
  private callbackDataReason = '';
  private callBackDataRemark = '';
  public successCount: number[] = [];
  public successCountAsset: number[] = [];
  public unsuccessCount: number[] = [];
  public unsuccessCountAsset: number[] = [];
  public groupCount: number[] = [];
  public groupCountAsset: number[] = [];
  public sourceContact: Array<Contacts[]> = [];
  public expanded: boolean[] = [];
  public expandedDoc: boolean[] = [];
  public expandedOther: boolean[] = [];
  public expandedDocOther: boolean[] = [];
  public expandedContact: boolean[] = [];
  public expandedContactDoc: boolean[] = [];
  public expandedDocEx: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private loggerService: LoggerService,
    public withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private notificationService: NotificationService,
    private litigationCaseService: LitigationCaseService,
    private decimalPipe: DecimalPipe,
    private sessionService: SessionService
  ) {
    this.onQueryParams();
  }

  get isEditor() {
    return ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
  }

  async ngOnInit(): Promise<void> {
    this.initPermission();
    await this.initialData();
    this.isViewMode();
    this.onInitialDocumentUpload();
    this.initialTaskCOrTaskCData();
  }

  initPermission() {
    this.hasSavePermission =
      this.isEditor && this.isOwnerTask && this.sessionService.hasPermission(PCode.SAVE_RESULT_WITHDRAW_SEIZURE);
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  getDataSource() {
    this.collateralDataSources =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.map(
        data =>
          new MatTableDataSource<Collaterals>(
            data.collaterals?.sort((a: any, b: any) => {
              const result = a.collateralId
                .toString()
                .localeCompare(b.collateralId.toString(), 'en', { numeric: true });
              return result;
            }) || []
          )
      ) || [];
    this.collateralDataSources.forEach(x => {
      x.data = x.filteredData;
    });
    this.assetDataSources =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.map(
        data =>
          new MatTableDataSource<Assets>(
            data.assets?.sort((a: any, b: any) => {
              const result = a.documentNo.toString().localeCompare(b.documentNo.toString(), 'en', { numeric: true });
              return result;
            }) || []
          )
      ) || [];

    this.assetDataSources.forEach(x => {
      x.data = x.filteredData;
    });
    this.contactDatSources =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.map(
        data =>
          new MatTableDataSource<Contacts>(
            data.contacts?.map(it => {
              return {
                ...it,
                paidFeeAmount: parseFloat(it.paidFeeAmount?.toString() || '') > 0 ? it.paidFeeAmount : '',
              } as Contacts;
            }) || []
          )
      ) || [];
  }

  async initialData(): Promise<void> {
    this.withdrawSeizuresLedData = this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse;

    this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse =
      await this.withdrawnSeizurePropertyService.getWithdrawSeizuresLed(
        Number(this.withdrawSeizureId),
        Number(this.withdrawSeizureLedId)
      );
    // case view mode but upload document index = 2
    if (
      [taskCode.R2E06_05_E].includes(
        this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse.withdrawSeizureLed?.status?.split(
          '_'
        )[0] as taskCode
      )
    ) {
      let checked = this.tableColDisplay.includes(AucCollateralColType.statusOther);
      let checkedAsset = this.tableAssetDisplay.includes(AucCollateralColType.statusOther);
      if (!checked) {
        this.tableColDisplay = [...this.tableColDisplay, AucCollateralColType.statusOther];
      }
      if (!checkedAsset) {
        this.tableAssetDisplay = [...this.tableAssetDisplay, AucCollateralColType.statusOther];
      }
    }

    if (
      this.isUploadLater &&
      this.isReadOnly &&
      this.isOwnerTask &&
      !this.documentUpload.find((x, i) => i === 1)?.imageId
    ) {
      this.isCheckIsOnly = true;
      this.isReadOnly = this.isReadOnly
        ? this.isOwnerTask && !this.documentUpload.find((x, i) => i === 1)?.imageId
          ? false
          : this.isReadOnly
        : this.isReadOnly;
    }
    this.initSelections();
    this.getDataSource();
    this.flatMapData();

    if (this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups) {
      this.isTableOpened = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(true);
      this.expanded = new Array(this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length).fill(
        true
      );
      this.expandedDoc = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(false);
      this.expandedOther = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(true);
      this.expandedDocOther = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(false);
      this.expandedContact = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(true);
      this.expandedContactDoc = new Array(
        this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.length
      ).fill(true);
    }

    if (this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups) {
      this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups.forEach((_group, index) => {
        this.calculateCountsForGroup(index);
        this.calculateCountsForGroupAsset(index);
      });
    }

    if (this.withdrawDateCtrl) {
      this.withdrawDateCtrl.setValue(this.withdrawSeizuresLedData.withdrawSeizureLed?.resultDate);
    }
    if (this.withdrawFeeCtrl) {
      this.contactsSource.forEach((contact, index) => {
        let formattedAmount = this.decimalPipe.transform(contact.paidFeeAmount, '1.2-2');
        this.withdrawFeeCtrl[index].setValue(formattedAmount);
      });
    }
    this.loggerService.logAPIResponse('withdrawSeizuresLedData', this.withdrawSeizuresLedData);

    this.uploadMultiInfo = {
      cif: this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.litigationCaseService.litigationCaseShortDetail?.litigationId,
      withdrawSeizureId: this.withdrawSeizureId,
      withdrawSeizuresLedId: this.withdrawSeizureLedId,
    };
    this.uploadListDocumentContactMultiInfo = {
      cif: this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.litigationCaseService.litigationCaseShortDetail?.litigationId,
      withdrawSeizureId: this.withdrawSeizureId,
      withdrawSeizuresLedId: this.withdrawSeizureLedId,
    };
  }

  isViewMode(): void {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (this.mode === 'EDIT' && this.isEditor && this.isOwnerTask && this.hasSavePermission) {
      this.withdrawDateCtrl = this.withdrawnSeizurePropertyService.withdrawDateCtrl;
      this.withdrawFeeCtrl = this.withdrawnSeizurePropertyService.withdrawFeeCtrl;
      this.isReadOnly = false;
    } else if (this.mode === 'VIEW' || !(this.isEditor && this.isOwnerTask && this.hasSavePermission)) {
      this.isReadOnly = true;
      if (this.taskCode === taskCode.R2E06_04_D) {
        this.tableColDisplay = this.tableColDisplay.filter(col => !['selection'].includes(col));
        this.tableAssetDisplay = this.tableAssetDisplay.filter(col => !['selection'].includes(col));
        this.isTaskCode = true;
      } else {
        this.tableColDisplay = this.tableColDisplay.filter(col => !['selection'].includes(col));
        this.tableAssetDisplay = this.tableAssetDisplay.filter(col => !['selection'].includes(col));
        this.isTaskCode = false;
      }
    }
    console.log('mode :: ', this.mode);
    console.log(`taskCode :: ${this.taskCode}, isTaskCode :: ${this.isTaskCode}`);
  }

  flatMapData(): void {
    this.contactsSource =
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse.withdrawSeizureLed?.withdrawSeizureLedGroups?.flatMap(
        group => group.contacts ?? []
      ) || [];

    this.contactsSource.forEach(() => {
      this.withdrawFeeCtrl.push(new UntypedFormControl(null));
    });

    this.withdrawnSeizurePropertyService.withdrawPaidFeeSource =
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse.withdrawSeizureLed?.withdrawSeizureLedGroups?.map(
        group =>
          group.contacts?.map(c => {
            return {
              ...c,
              paidFeeAmount: c.paidFeeAmount && c.paidFeeAmount > 0 ? c.paidFeeAmount : undefined,
            };
          }) ?? []
      ) || [];
    this.sourceContact = this.withdrawnSeizurePropertyService.withdrawPaidFeeSource;

    console.log('withdrawPaidFeeSource :: ', this.withdrawnSeizurePropertyService.withdrawPaidFeeSource);
  }

  async onSubmit(index: number, keyValue: string, keyResult: string, type: string): Promise<void> {
    const successText = 'สำเร็จ';
    const unsuccessText = 'ไม่สำเร็จ';
    const selectionLength = this.selections[index].selected.length;
    const successTextAsset = 'สำเร็จ';
    const unsuccessTextAsset = 'ไม่สำเร็จ';
    const selectionLengthAsset = this.selectionsAsset[index].selected.length;

    let collateralLength: number = 0;
    let assetLength: number = 0;
    if (
      this.withdrawSeizuresLedData &&
      this.withdrawSeizuresLedData.withdrawSeizureLed &&
      this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups
    ) {
      if (type === 'col') {
        if (this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups[index].collaterals) {
          collateralLength =
            this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups[index].collaterals?.length || 0;
        }
      } else {
        if (this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups[index].assets) {
          assetLength =
            this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups[index].assets?.length || 0;
        }
      }
    }

    const successSelectionLength = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.reduce(
      (acc, group, index) =>
        acc +
        (group.collaterals?.filter(
          item =>
            item.collateralId &&
            this.selections[index].isSelected(item.collateralId) &&
            item.withdrawSeizureResult === 'S'
        ).length ?? 0),
      0
    );
    const successSelectionLengthAsset =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.reduce(
        (acc, group, index) =>
          acc +
          (group.assets?.filter(
            item =>
              item.assetId &&
              this.selectionsAsset[index].isSelected(item.assetId.toString()) &&
              item.withdrawSeizureResult === 'S'
          ).length ?? 0),
        0
      );
    const unsuccessSelectionLength = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.reduce(
      (acc, group, index) =>
        acc +
        (group.collaterals?.filter(
          item =>
            item.collateralId &&
            this.selections[index].isSelected(item.collateralId) &&
            item.withdrawSeizureResult === 'U'
        ).length ?? 0),
      0
    );
    const unsuccessSelectionLengthAsset =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.reduce(
        (acc, group, index) =>
          acc +
          (group.assets?.filter(
            item =>
              item.assetId &&
              this.selectionsAsset[index].isSelected(item.assetId.toString()) &&
              item.withdrawSeizureResult === 'U'
          ).length ?? 0),
        0
      );
    if (keyValue === 'onSuccess') {
      if (this.withdrawAlreadySuccess(type)) {
        if (this.withdrawAlreadySuccess(type) && this.withDrawAlreadyPending(type)) {
          if (
            this.withdrawAlreadyUnSuccess(type) &&
            this.withdrawAlreadySuccess(type) &&
            this.withDrawAlreadyPending(type)
          ) {
            await this.notificationService
              .showCustomDialog({
                component: LegalExecutionWithdrawConfirmationDialogComponent,
                title: `ยืนยันบันทึกถอนทรัพย์${type === 'col' ? successText : successTextAsset} ทั้งหมด ${
                  type === 'col' ? selectionLength : selectionLengthAsset
                }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                rightButtonLabel: 'ยืนยันถอนยึดสำเร็จ',
                optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
                leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                iconClass: 'large fill-red',
                context: {
                  selectionLength: type === 'col' ? unsuccessSelectionLength : unsuccessSelectionLengthAsset,
                  message: type === 'col' ? unsuccessText : unsuccessTextAsset,
                  bottomMessage: type === 'col' ? successText : successTextAsset,
                },
                cancelEvent: true,
              })
              .then(async response => {
                if (response.isOption === true) {
                  type === 'col'
                    ? this.onWithdrawalSubmit(index, keyResult, 'C')
                    : this.onWithdrawalSubmitAsset(index, keyResult, 'C');
                  await this.initialData();
                } else if (response.isCancel) {
                  this.notificationService.closeAll();
                } else {
                  type === 'col'
                    ? this.onWithdrawalSubmit(index, keyResult, 'C')
                    : this.onWithdrawalSubmitAsset(index, keyResult, 'C');
                  await this.initialData();
                }
              });
          } else {
            type === 'col' ? this.onWithdrawalSubmit(index, keyResult) : this.onWithdrawalSubmitAsset(index, keyResult);
            await this.initialData();
          }
        } else if (this.withdrawAlreadySuccess(type) && this.withdrawAlreadyUnSuccess(type)) {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? successText : successTextAsset}`,
              rightButtonLabel: 'ยืนยันถอนยึดสำเร็จ',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              iconClass: 'large fill-red',
              context: {
                selectionLength: type === 'col' ? unsuccessSelectionLength : unsuccessSelectionLengthAsset,
                message: type === 'col' ? unsuccessText : unsuccessTextAsset,
                bottomMessage: type === 'col' ? successText : successTextAsset,
                onCheck: 'SuccessWithUnSuccess',
              },
              cancelEvent: true,
            })
            .then(async response => {
              if (response.isCancel !== true) {
                type === 'col'
                  ? this.onWithdrawalSubmit(index, keyResult, 'C')
                  : this.onWithdrawalSubmitAsset(index, keyResult, 'C');
              }
              await this.initialData();
            });
        } else {
          this.notificationService.alertDialog(
            'ทรัพย์บันทึกว่าถอนยึดทรัพย์สำเร็จแล้ว',
            'ทรัพย์ถูกบันทึกว่าถอนยึดสำเร็จเรียบร้อยแล้ว'
          );
          return;
        }
      } else if (this.withdrawAlreadyUnSuccess(type)) {
        if (this.withdrawAlreadyUnSuccess(type) && this.withDrawAlreadyPending(type)) {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? successText : successTextAsset} ทั้งหมด ${
                type === 'col' ? selectionLength : selectionLengthAsset
              }/${type === 'col' ? collateralLength : assetLength} รายการ`,
              rightButtonLabel: 'ยืนยันถอนยึดสำเร็จ',
              optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              iconClass: 'large fill-red',
              context: {
                selectionLength: type === 'col' ? unsuccessSelectionLength : unsuccessSelectionLengthAsset,
                message: type === 'col' ? unsuccessText : unsuccessTextAsset,
                bottomMessage: type === 'col' ? successText : successTextAsset,
              },
              cancelEvent: true,
            })
            .then(async response => {
              if (response.isOption === true) {
                type === 'col'
                  ? this.onWithdrawalSubmit(index, keyResult, 'A')
                  : this.onWithdrawalSubmitAsset(index, keyResult, 'A');
                await this.initialData();
              } else if (response.isCancel) {
                this.notificationService.closeAll();
              } else {
                type === 'col'
                  ? this.onWithdrawalSubmit(index, keyResult, 'B')
                  : this.onWithdrawalSubmitAsset(index, keyResult, 'B');
                await this.initialData();
              }
            });
        } else {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? successText : successTextAsset}`,
              rightButtonLabel: `ยืนยันถอนยึด${type === 'col' ? successText : successTextAsset}`,
              optionBtnLabel: '',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              iconClass: 'large fill-red',
              context: {
                onCheck: 'warning',
                message: type === 'col' ? unsuccessText : unsuccessTextAsset,
                bottomMessage: type === 'col' ? successText : successTextAsset,
              },
              cancelEvent: true,
            })
            .then(async response => {
              if (!response.isCancel) {
                type === 'col'
                  ? this.onWithdrawalSubmit(index, keyResult)
                  : this.onWithdrawalSubmitAsset(index, keyResult);
                await this.initialData();
              }
            });
        }
      } else {
        type === 'col' ? this.onWithdrawalSubmit(index, keyResult) : this.onWithdrawalSubmitAsset(index, keyResult);
        await this.initialData();
      }
    } else if (keyValue === 'onUnSuccess') {
      if (this.withdrawAlreadySuccess(type)) {
        if (this.withdrawAlreadySuccess(type) && this.withDrawAlreadyPending(type)) {
          if (
            this.withdrawAlreadyUnSuccess(type) &&
            this.withdrawAlreadySuccess(type) &&
            this.withDrawAlreadyPending(type)
          ) {
            await this.notificationService
              .showCustomDialog({
                component: LegalExecutionWithdrawConfirmationDialogComponent,
                title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                  type === 'col' ? selectionLength : selectionLengthAsset
                }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                rightButtonLabel: 'ยืนยันถอนยึดไม่สำเร็จ',
                optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
                leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                iconClass: 'large fill-red',
                context: {
                  selectionLength: type === 'col' ? successSelectionLength : successSelectionLengthAsset,
                  message: type === 'col' ? successText : successTextAsset,
                  bottomMessage: type === 'col' ? unsuccessText : unsuccessTextAsset,
                },
                cancelEvent: true,
              })
              .then(async response => {
                if (response.isOption === true) {
                  await this.notificationService
                    .showCustomDialog({
                      component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                      title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                        type === 'col' ? selectionLength : selectionLengthAsset
                      }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                      rightButtonLabel: 'COMMON.BUTTON_SAVE',
                      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                      buttonIconName: 'icon-save-primary',
                      iconClass: 'hideIcon',
                      cancelEvent: true,
                    })
                    .then(async customResponse => {
                      if (!customResponse.isCancel) {
                        this.callbackDataReason = customResponse.reason;
                        this.callBackDataRemark = customResponse.remark;
                        type === 'col'
                          ? this.onWithdrawalSubmit(index, keyResult, 'D')
                          : this.onWithdrawalSubmitAsset(index, keyResult, 'D');
                        await this.initialData();
                      }
                    });
                } else if (response.isCancel) {
                  this.notificationService.closeAll();
                } else {
                  await this.notificationService
                    .showCustomDialog({
                      component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                      title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                        type === 'col' ? selectionLength : selectionLengthAsset
                      }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                      rightButtonLabel: 'COMMON.BUTTON_SAVE',
                      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                      buttonIconName: 'icon-save-primary',
                      iconClass: 'hideIcon',
                      cancelEvent: true,
                    })
                    .then(async customResponse => {
                      if (!customResponse.isCancel) {
                        this.callbackDataReason = customResponse.reason;
                        this.callBackDataRemark = customResponse.remark;
                        type === 'col'
                          ? this.onWithdrawalSubmit(index, keyResult, 'D')
                          : this.onWithdrawalSubmitAsset(index, keyResult, 'D');
                        await this.initialData();
                      }
                    });
                }
              });
          } else {
            await this.notificationService
              .showCustomDialog({
                component: LegalExecutionWithdrawConfirmationDialogComponent,
                title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                  type === 'col' ? selectionLength : selectionLengthAsset
                }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                rightButtonLabel: 'ยืนยันถอนยึดไม่สำเร็จ',
                optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
                leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                iconClass: 'large fill-red',
                context: {
                  selectionLength: type === 'col' ? successSelectionLength : successSelectionLengthAsset,
                },
                cancelEvent: true,
              })
              .then(async response => {
                if (response.isOption === true) {
                  await this.notificationService
                    .showCustomDialog({
                      component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                      title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                        type === 'col' ? selectionLength : selectionLengthAsset
                      }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                      rightButtonLabel: 'COMMON.BUTTON_SAVE',
                      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                      buttonIconName: 'icon-save-primary',
                      iconClass: 'hideIcon',
                      cancelEvent: true,
                    })
                    .then(async customResponse => {
                      if (!customResponse.isCancel) {
                        this.callbackDataReason = customResponse.reason;
                        this.callBackDataRemark = customResponse.remark;
                        type === 'col'
                          ? this.onWithdrawalSubmit(index, keyResult, 'A')
                          : this.onWithdrawalSubmitAsset(index, keyResult, 'A');
                        await this.initialData();
                      }
                    });
                } else if (response.isCancel) {
                  this.notificationService.closeAll();
                } else {
                  await this.notificationService
                    .showCustomDialog({
                      component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                      title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                        type === 'col' ? selectionLength : selectionLengthAsset
                      }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                      rightButtonLabel: 'COMMON.BUTTON_SAVE',
                      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                      buttonIconName: 'icon-save-primary',
                      iconClass: 'hideIcon',
                      cancelEvent: true,
                    })
                    .then(async customResponse => {
                      if (!customResponse.isCancel) {
                        this.callbackDataReason = customResponse.reason;
                        this.callBackDataRemark = customResponse.remark;
                        type === 'col'
                          ? this.onWithdrawalSubmit(index, keyResult, 'B')
                          : this.onWithdrawalSubmitAsset(index, keyResult, 'B');
                        await this.initialData();
                      }
                    });
                }
              });
          }
        } else if (this.withdrawAlreadyUnSuccess(type) && this.withdrawAlreadySuccess(type)) {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                type === 'col' ? selectionLength : selectionLengthAsset
              }/${type === 'col' ? collateralLength : assetLength} รายการ`,
              rightButtonLabel: 'ยืนยันถอนยึดไม่สำเร็จ',
              optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ถอนสำเร็จ',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              iconClass: 'large fill-red',
              context: {
                selectionLength: type === 'col' ? successSelectionLength : successSelectionLengthAsset,
                message: type === 'col' ? successText : successTextAsset,
                bottomMessage: type === 'col' ? unsuccessText : unsuccessTextAsset,
              },
              cancelEvent: true,
            })
            .then(async response => {
              if (response.isOption === true) {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult, 'U')
                        : this.onWithdrawalSubmitAsset(index, keyResult, 'U');
                      await this.initialData();
                    }
                  });
              } else if (response.isCancel) {
                this.notificationService.closeAll();
              } else {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult, 'U')
                        : this.onWithdrawalSubmitAsset(index, keyResult, 'U');
                      await this.initialData();
                    }
                  });
              }
            });
        } else {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset}`,
              rightButtonLabel: `ยืนยันถอนยึด${type === 'col' ? unsuccessText : unsuccessTextAsset}`,
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              iconClass: 'large fill-red',
              context: {
                onCheck: 'warning',
                message: type === 'col' ? successText : successTextAsset,
                bottomMessage: type === 'col' ? unsuccessText : unsuccessTextAsset,
              },
            })
            .then(async response => {
              if (response === true) {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult)
                        : this.onWithdrawalSubmitAsset(index, keyResult);
                      await this.initialData();
                    }
                  });
              }
            });
        }
      } else if (this.withdrawAlreadyUnSuccess(type)) {
        if (this.withdrawAlreadyUnSuccess(type) && this.withDrawAlreadyPending(type)) {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: `ยืนยันบันทึกถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                type === 'col' ? selectionLength : selectionLengthAsset
              }/${type === 'col' ? collateralLength : assetLength} รายการ`,
              rightButtonLabel: 'ยืนยันถอนยึดไม่สำเร็จ',
              optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              cancelEvent: true,
              iconClass: 'large fill-red',
              context: {
                selectionLength: type === 'col' ? unsuccessSelectionLength : unsuccessSelectionLengthAsset,
                message: type === 'col' ? successText : successTextAsset,
                bottomMessage: type === 'col' ? unsuccessText : unsuccessTextAsset,
              },
            })
            .then(async response => {
              if (response.isOption === true) {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult, 'A')
                        : this.onWithdrawalSubmitAsset(index, keyResult, 'A');
                      await this.initialData();
                    }
                  });
              } else if (response.isCancel) {
                this.notificationService.closeAll();
              } else {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult, 'B')
                        : this.onWithdrawalSubmitAsset(index, keyResult, 'B');
                      await this.initialData();
                    }
                  });
              }
            });
        } else {
          await this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: 'ทรัพย์บันทึกว่ายึดทรัพย์ไม่สำเร็จแล้ว',
              rightButtonLabel: 'แก้ไขเหตุผล',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              cancelEvent: true,
              iconClass: 'large fill-red',
              context: {
                onCheck: 'alreadyUnsuccess',
              },
            })
            .then(async response => {
              if (response === true) {
                await this.notificationService
                  .showCustomDialog({
                    component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                    title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
                      type === 'col' ? selectionLength : selectionLengthAsset
                    }/${type === 'col' ? collateralLength : assetLength} รายการ`,
                    rightButtonLabel: 'COMMON.BUTTON_SAVE',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-save-primary',
                    iconClass: 'hideIcon',
                    cancelEvent: true,
                  })
                  .then(async customResponse => {
                    if (!customResponse.isCancel) {
                      this.callbackDataReason = customResponse.reason;
                      this.callBackDataRemark = customResponse.remark;
                      type === 'col'
                        ? this.onWithdrawalSubmit(index, keyResult)
                        : this.onWithdrawalSubmitAsset(index, keyResult);
                    }
                  });
                await this.initialData();
              }
            });
        }
      } else {
        await this.notificationService
          .showCustomDialog({
            component: LegalExecutionOfficeWithdrawUnsuccessComponent,
            title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unsuccessText : unsuccessTextAsset} ทั้งหมด ${
              type === 'col' ? selectionLength : selectionLengthAsset
            }/${type === 'col' ? collateralLength : assetLength} รายการ`,
            rightButtonLabel: 'COMMON.BUTTON_SAVE',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            buttonIconName: 'icon-save-primary',
            iconClass: 'hideIcon',
            context: {
              selectionLength: type === 'col' ? unsuccessSelectionLength : unsuccessSelectionLengthAsset,
            },
            cancelEvent: true,
          })
          .then(async customResponse => {
            if (!customResponse.isCancel) {
              this.callbackDataReason = customResponse.reason;
              this.callBackDataRemark = customResponse.remark;
              type === 'col'
                ? this.onWithdrawalSubmit(index, keyResult)
                : this.onWithdrawalSubmitAsset(index, keyResult);
            }
          });
        await this.initialData();
      }
    }
    await this.initialData();
    if (type === 'col') {
      this.calculateCountsForGroup(index);
      this.selections.forEach(selection => selection.clear());
    } else {
      this.calculateCountsForGroupAsset(index);
      this.selectionsAsset.forEach(selection => selection.clear());
    }
  }

  async onWithdrawalSubmit(index: number, keyResult: string, buttonClicked?: string): Promise<void> {
    let withdrawSeizureLedGroups = this.generateWithdrawSeizureLedGroups(index, keyResult, buttonClicked);

    const request: ResultRecordingTaskSubmitRequest = {
      headerFlag: 'DRAFT',
      withdrawSeizureLedGroups: withdrawSeizureLedGroups,
      withdrawSeizureLedId: Number(this.withdrawSeizureLedId),
    };
    this.loggerService.logAPIRequest('request', request);
    await this.withdrawnSeizurePropertyService
      .resultRecordingTaskSubmit(this.taskId, Number(this.withdrawSeizureId), request)
      .then(() => {
        this.notificationService.openSnackbarSuccess('บันทึกผลถอนยึดทรัพย์สำเร็จแล้ว');
      })
      .catch(error => console.error(error));
  }
  async onWithdrawalSubmitAsset(index: number, keyResult: string, buttonClicked?: string): Promise<void> {
    let withdrawSeizureLedGroups = this.generateWithdrawSeizureLedGroupsAsset(index, keyResult, buttonClicked);

    const request: ResultRecordingTaskSubmitRequest = {
      headerFlag: 'DRAFT',
      withdrawSeizureLedGroups: withdrawSeizureLedGroups,
      withdrawSeizureLedId: Number(this.withdrawSeizureLedId),
    };
    this.loggerService.logAPIRequest('request', request);
    await this.withdrawnSeizurePropertyService
      .resultRecordingTaskSubmit(this.taskId, Number(this.withdrawSeizureId), request)
      .then(() => {
        this.notificationService.openSnackbarSuccess('บันทึกผลถอนยึดทรัพย์สำเร็จแล้ว');
      })
      .catch(error => console.error(error));
  }

  generateWithdrawSeizureLedGroupsAsset(index: number, keyResult: string, buttonClicked?: string) {
    return this.selectionsAsset[index].selected
      .filter(assetId => {
        let allAsset = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.flatMap(
          group => group.assets || []
        );
        // When button A is clicked, exclude 'S' and 'U'
        if (buttonClicked === 'A') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && item.withdrawSeizureResult !== 'S' && item.withdrawSeizureResult !== 'U';
        }
        // When button C is clicked, exclude 'S'
        else if (buttonClicked === 'C') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && item.withdrawSeizureResult !== 'S';
        }
        // When button D is clicked, exclude 'U'
        else if (buttonClicked === 'D') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && item.withdrawSeizureResult !== 'U';
        } else if (buttonClicked === 'F') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && item.withdrawSeizureResult === 'P';
        } else if (buttonClicked === 'Unsuccess') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && item.withdrawSeizureResult === 'U';
        } else if (buttonClicked === 'AllUnSuccess') {
          let item = allAsset?.find(x => x.assetId?.toString() === assetId);
          return item && !!item.withdrawSeizureResult;
        }
        // When button B is clicked, include all
        return true;
      })
      .map(assetId => {
        if (keyResult === 'S') {
          return {
            assets: [
              {
                assetId: Number(assetId) || 0,
                withdrawSeizureResult: keyResult,
              },
            ],
          };
        } else {
          return {
            assets: [
              {
                assetId: Number(assetId) || 0,
                withdrawSeizureResult: keyResult,
                remark: this.callBackDataRemark ? this.callBackDataRemark : '',
                withdrawSeizureReason: this.callbackDataReason ? this.callbackDataReason : '',
              },
            ],
          };
        }
      });
  }
  generateWithdrawSeizureLedGroups(index: number, keyResult: string, buttonClicked?: string) {
    return this.selections[index].selected
      .filter(collateralId => {
        let allCollaterals = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.flatMap(
          group => group.collaterals || []
        );
        // When button A is clicked, exclude 'S' and 'U'
        if (buttonClicked === 'A') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && item.withdrawSeizureResult !== 'S' && item.withdrawSeizureResult !== 'U';
        }
        // When button C is clicked, exclude 'S'
        else if (buttonClicked === 'C') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && item.withdrawSeizureResult !== 'S';
        }
        // When button D is clicked, exclude 'U'
        else if (buttonClicked === 'D') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && item.withdrawSeizureResult !== 'U';
        } else if (buttonClicked === 'F') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && item.withdrawSeizureResult === 'P';
        } else if (buttonClicked === 'Unsuccess') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && item.withdrawSeizureResult === 'U';
        } else if (buttonClicked === 'AllUnSuccess') {
          let item = allCollaterals?.find(x => x.collateralId === collateralId);
          return item && !!item.withdrawSeizureResult;
        }
        // When button B is clicked, include all
        return true;
      })
      .map(collateralId => {
        if (keyResult === 'S') {
          return {
            collaterals: [
              {
                collateralId: collateralId,
                withdrawSeizureResult: keyResult,
              },
            ],
          };
        } else {
          return {
            collaterals: [
              {
                collateralId: collateralId,
                withdrawSeizureResult: keyResult,
                remark: this.callBackDataRemark ? this.callBackDataRemark : '',
                withdrawSeizureReason: this.callbackDataReason ? this.callbackDataReason : '',
              },
            ],
          };
        }
      });
  }

  withdrawAlreadySuccess(type: string): boolean {
    return (
      this.withdrawSeizuresLedData?.withdrawSeizureLed?.withdrawSeizureLedGroups?.some((group, index) =>
        type === 'col'
          ? group.collaterals?.some(
              item =>
                item.collateralId &&
                this.selections[index].isSelected(item.collateralId) &&
                item.withdrawSeizureResult === 'S'
            )
          : group.assets?.some(
              item =>
                item.assetId &&
                this.selectionsAsset[index].isSelected(item.assetId.toString()) &&
                item.withdrawSeizureResult === 'S'
            )
      ) ?? false
    );
  }

  withdrawAlreadyUnSuccess(type: string): boolean {
    return (
      this.withdrawSeizuresLedData?.withdrawSeizureLed?.withdrawSeizureLedGroups?.some((group, index) =>
        type === 'col'
          ? group.collaterals?.some(
              item =>
                item.collateralId &&
                this.selections[index].isSelected(item.collateralId) &&
                item.withdrawSeizureResult === 'U'
            )
          : group.assets?.some(
              item =>
                item.assetId &&
                this.selectionsAsset[index].isSelected(item.assetId.toString()) &&
                item.withdrawSeizureResult === 'U'
            )
      ) ?? false
    );
  }

  withDrawAlreadyPending(type: string): boolean {
    return (
      this.withdrawSeizuresLedData?.withdrawSeizureLed?.withdrawSeizureLedGroups?.some((group, index) =>
        type === 'col'
          ? group.collaterals?.some(
              item =>
                item.collateralId &&
                this.selections[index].isSelected(item.collateralId) &&
                item.withdrawSeizureResult === 'P'
            )
          : group.assets?.some(
              item =>
                item.assetId &&
                this.selectionsAsset[index].isSelected(item.assetId.toString()) &&
                item.withdrawSeizureResult === 'P'
            )
      ) ?? false
    );
  }

  // !! This mockup should be removed and replaced with actual data.
  onInitialDocumentUpload(): void {
    let tempData =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.flatMap(
        group => group.collaterals ?? []
      ) || [];
    this.isUploadLater =
      tempData.filter(x => x.withdrawSeizureResult === 'U' && x.withdrawSeizureReason === '01').length > 0;
    this.documentUpload = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedDocuments
      ? this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedDocuments.map((m, i) => {
          return <IUploadMultiFile>{
            ...m,
            viewOnly: true,
            uploadDate: m.uploadTimestamp,
            documentTemplateId: m.documentTemplate?.documentTemplateId,
            indexOnly: true,
            active: this.isUploadLater
              ? this.isOwnerTask && this.isReadOnly && i === 1
                ? true
                : this.isOwnerTask && this.isReadOnly && i !== 1
                  ? false
                  : m.active
              : m.active,
          };
        })
      : [
          {
            documentTemplate: {
              documentName: 'หนังสือแจ้งถอนการยึดทรัพย์',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
          {
            documentTemplate: {
              documentName: 'คำแถลงสวมสิทธิ์แทนโจทก์ (ถ้ามี)',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
          {
            documentTemplate: {
              documentName: 'คำแถลงขอถอนการยึดทรัพย์และรับค่าใช้จ่ายคืน',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
          {
            documentTemplate: {
              documentName: 'ใบขอรับเงินคืน',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
          {
            documentTemplate: {
              documentName: 'รายงานเจ้าหน้าที่คืนเงินให้ธนาคาร',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
          {
            documentTemplate: {
              documentName: 'สำเนาเช็คที่ธนาคารได้รับเงินวางประกันค่าใช้จ่ายคืน',
            },
            uploadRequired: true,
          } as IUploadMultiFile,
        ];

    const ledDoc = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedDocuments?.map(m => {
      return <WithdrawSeizureLedDocumentDto>{
        ledDocument: { uploadSessionId: m.imageId || '' },
      };
    });
    this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload = {
      withdrawSeizureLedDocuments: ledDoc,
    } as ResultRecordingTaskSubmitRequest;
    this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.forEach(x => {
      let temp = x.withdrawSeizureLedGroupDocuments
        ? x.withdrawSeizureLedGroupDocuments?.map(m => {
            return <IUploadMultiFile>{
              viewOnly: true,
              uploadDate: m.uploadTimestamp,
              indexOnly: true,
              documentTemplateId: m.documentTemplate?.documentTemplateId,
              ...m,
            };
          })
        : [];
      this.dataGroup.push(temp);
      console.log('this.dataGroup', this.dataGroup);
      const group = {
        withdrawSeizuresGroupId: x.withdrawSeizuresGroupId,
        withdrawSeizureLedGroupDocuments: temp.map(it => {
          const obj: WithdrawSeizureLedGroupDocumentDto = {
            ledGroupDocument: { uploadSessionId: it.imageId || '' },
          };
          return obj;
        }),
      };

      let consentDocuments = x.consentDocuments
        ? x.consentDocuments
            ?.filter(v => v.documentOf === 'COL')
            .map(row => {
              const obj = {
                documentTemplateId: row.document?.documentTemplate?.documentTemplateId,
                documentTemplate: row.document?.documentTemplate,
                uploadRequired: true,
                uploadDate: row.updateTimestamp,
                imageId: row.document?.imageId,
                removeDocument: true,
                attributes: {
                  collateralIds: row.collList,
                  collateralOwnerName: row.ownerName,
                  ledName: row.ledName,
                  id: row.id,
                },
              } as IUploadMultiFile;
              return obj;
            })
        : [];
      let consentDocumentsAsset = x.consentDocuments
        ? x.consentDocuments
            ?.filter(v => v.documentOf === 'NCOL')
            .map(row => {
              const obj = {
                documentTemplateId: row.document?.documentTemplate?.documentTemplateId,
                documentTemplate: row.document?.documentTemplate,
                uploadRequired: true,
                uploadDate: row.updateTimestamp,
                imageId: row.document?.imageId,
                removeDocument: true,
                attributes: {
                  collateralIds: row.collList,
                  collateralOwnerName: row.ownerName,
                  ledName: row.ledName,
                  id: row.id,
                },
              } as IUploadMultiFile;
              return obj;
            })
        : [];
      this.documentListConstactUpload.push(consentDocuments);
      this.documentListConstactUploadAsset.push(consentDocumentsAsset);

      console.log('documentListConstactUpload', this.documentListConstactUpload);
      console.log('documentListConstactUploadAsset', this.documentListConstactUploadAsset);

      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload = {
        ...this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload,
        withdrawSeizureLedGroups: this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload
          .withdrawSeizureLedGroups
          ? this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload.withdrawSeizureLedGroups.concat(group)
          : [group],
      };
    });
  }

  onQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
    });
    this.taskId = this.taskService.taskDetail.id || 0;
    this.withdrawSeizureId =
      this.taskService.taskDetail.objectId || this.withdrawnSeizurePropertyService.withdrawSeizureId.toString();
    this.withdrawSeizureLedId =
      JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId ||
      this.withdrawnSeizurePropertyService.withdrawSeizureLedId;
  }

  uploadFileEvent(event: any) {
    this.documentUpload = event;
    this.withdrawnSeizurePropertyService.isErrorLedDoc = false;
    this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload = {
      ...this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload,
      withdrawSeizureLedDocuments: event.map((item: IUploadMultiFile) => {
        const obj: WithdrawSeizureLedDocumentDto = {
          ledDocument: { uploadSessionId: item.imageId || '' },
        };

        return obj;
      }),
    };

    // case view mode but upload document index = 2
    if (this.isUploadLater && this.isCheckIsOnly) {
      this.documentUpload.forEach((x, i) => {
        if (i === 1 && x.active) {
          x.active = false;
        }
      });
      this.isReadOnly = true;
    }
    this.withdrawnSeizurePropertyService.withdrawDateCtrl.markAllAsTouched();
    this.withdrawnSeizurePropertyService.withdrawDateCtrl.updateValueAndValidity();
    console.log('withdrawDateCtrl after mark :: ', this.withdrawnSeizurePropertyService.withdrawDateCtrl);
  }

  uploadContactFileEvent(event: any, withdrawSeizuresGroupId: any) {
    this.documentContactUpload = event;
    this.withdrawnSeizurePropertyService.isErrorContactDoc = false;
    if (
      !this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload ||
      !this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload.withdrawSeizureLedGroups ||
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload?.withdrawSeizureLedGroups?.length === 0
    ) {
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload = {
        ...this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload,

        withdrawSeizureLedGroups: [
          {
            withdrawSeizuresGroupId: withdrawSeizuresGroupId,
            withdrawSeizureLedGroupDocuments: event.map((item: IUploadMultiFile) => {
              const obj: WithdrawSeizureLedGroupDocumentDto = {
                ledGroupDocument: { uploadSessionId: item.imageId || '' },
              };

              return obj;
            }),
          },
        ],
      };
    } else {
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllPayload.withdrawSeizureLedGroups?.forEach(v => {
        if (v.withdrawSeizuresGroupId === withdrawSeizuresGroupId) {
          v.withdrawSeizuresGroupId = withdrawSeizuresGroupId;
          v.withdrawSeizureLedGroupDocuments = event.map((item: IUploadMultiFile) => {
            const obj: WithdrawSeizureLedGroupDocumentDto = {
              ledGroupDocument: { uploadSessionId: item.imageId || '' },
            };

            return obj;
          });
        }
      });
    }
  }

  handleMenuTriggerClick(trigger: MatMenuTrigger): void {
    let hasSelection = false;
    this.selections.forEach(selection => {
      if (selection.selected.length > 0) {
        hasSelection = true;
      }
    });
    if (!hasSelection) {
      this.showNoSelectionAlert();
      trigger.closeMenu();
    }
  }
  handleMenuTriggerClickAsset(trigger: MatMenuTrigger): void {
    let hasSelection = false;
    this.selectionsAsset.forEach(selection => {
      if (selection.selected.length > 0) {
        hasSelection = true;
      }
    });
    if (!hasSelection) {
      this.showNoSelectionAlert();
      trigger.closeMenu();
    }
  }

  async showNoSelectionAlert(): Promise<void> {
    await this.notificationService.alertDialog(
      'ไม่มีทรัพย์ให้ระบุ',
      'กรุณาเลือกทรัพย์ในตารางเพื่อระบุผลการถอนยึดทรัพย์'
    );
  }

  async onWithdrawalCheck(index: number, value: string, keyResult: string, type: string): Promise<void> {
    const successText = 'สำเร็จ';
    const unSuccessText = 'ไม่สำเร็จ';

    const successTextAsset = 'สำเร็จ';
    const unsuccessTextAsset = 'ไม่สำเร็จ';
    let selectedItems: any = [];

    if (type === 'col') {
      this.selections[index].clear();
      const collateralIds = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[
        index
      ]?.collaterals
        ?.map(collateral => collateral.collateralId)
        .filter(id => id !== undefined) as string[];

      if (collateralIds) {
        this.selections[index].select(...collateralIds);
      }
      const validCollateralIds = this.selections[index].selected.filter(id => id !== undefined);

      selectedItems = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[
        index
      ].collaterals?.filter(item => item.collateralId && validCollateralIds.includes(item.collateralId));
    } else {
      this.selectionsAsset[index].clear();
      const assetIds = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[index]?.assets
        ?.map(asset => asset.assetId?.toString())
        .filter(id => id !== undefined) as string[];

      if (assetIds) {
        this.selectionsAsset[index].select(...assetIds);
      }
      const validAssetIds = this.selectionsAsset[index].selected.filter(id => id !== undefined);

      selectedItems = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[index].assets?.filter(
        item => item.assetId && validAssetIds.includes(item.assetId.toString())
      );
    }

    let selectionLength = this.selections[index].selected.length;
    let collateralLength: number = 0;
    let selectionLengthAsset = this.selectionsAsset[index].selected.length;
    let assetLength: number = 0;
    if (
      this.withdrawSeizuresLedData &&
      this.withdrawSeizuresLedData.withdrawSeizureLed &&
      this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups
    ) {
      if (type === 'col') {
        if (this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups[index].collaterals) {
          collateralLength =
            this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups[index].collaterals?.length || 0;
        }
      } else {
        if (this.withdrawSeizuresLedData.withdrawSeizureLed.withdrawSeizureLedGroups[index].assets) {
          assetLength =
            this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups[index].assets?.length || 0;
        }
      }
    }

    if (value === 'AllSuccess') {
      if (
        selectedItems &&
        selectedItems.some((item: any) => item.withdrawSeizureResult && item.withdrawSeizureResult === 'U')
      ) {
        await this.notificationService
          .showCustomDialog({
            component: LegalExecutionWithdrawConfirmationDialogComponent,
            title: `ยืนยันบันทึกถอนยึดทรัพย์สำเร็จทั้งหมด`,
            rightButtonLabel: 'ยืนยันถอนยึดสำเร็จทั้งหมด',
            optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            iconClass: 'large fill-red',
            context: {
              message: type === 'col' ? unSuccessText : unsuccessTextAsset,
              bottomMessage: type === 'col' ? successText : successTextAsset,
              onCheck: 'haveStatusU',
            },
          })
          .then(async response => {
            if (response.isOption === true) {
              type === 'col'
                ? this.onWithdrawalSubmit(index, keyResult, 'F')
                : this.onWithdrawalSubmitAsset(index, keyResult, 'F');
              await this.initialData();
            } else if (response.isCancel) {
              this.notificationService.closeAll();
            } else {
              type === 'col'
                ? this.onWithdrawalSubmit(index, keyResult, 'C')
                : this.onWithdrawalSubmitAsset(index, keyResult, 'C');
              await this.initialData();
            }
          });
      } else {
        await this.notificationService
          .showCustomDialog({
            component: LegalExecutionWithdrawConfirmationDialogComponent,
            title: `ยืนยันถอนยึดทรัพย์สำเร็จทั้งหมด`,
            rightButtonLabel: 'ยืนยัน',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            iconClass: 'large fill-red',
            context: {
              message: type === 'col' ? successText : successTextAsset,
              bottomMessage: type === 'col' ? successText : successTextAsset,
              onCheck: 'noUIncluded',
              collateralLength: type === 'col' ? collateralLength : assetLength,
              selectionLength: type === 'col' ? selectionLength : selectionLengthAsset,
            },
          })
          .then(async response => {
            if (!response.isCancel) {
              type === 'col'
                ? this.onWithdrawalSubmit(index, keyResult, 'C')
                : this.onWithdrawalSubmitAsset(index, keyResult, 'C');
              await this.initialData();
            }
          });
      }
    } else if (value === 'AllUnsuccess') {
      if (
        selectedItems &&
        selectedItems.some((item: any) => item.withdrawSeizureResult && item.withdrawSeizureResult === 'S')
      ) {
        await this.notificationService
          .showCustomDialog({
            component: LegalExecutionWithdrawConfirmationDialogComponent,
            title: `ยืนยันบันทึกถอนยึดทรัพย์ไม่สำเร็จทั้งหมด`,
            rightButtonLabel: 'ยืนยันถอนยึดไม่สำเร็จทั้งหมด',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            optionBtnLabel: 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
            cancelEvent: true,
            iconClass: 'large fill-red',
            context: {
              message: type === 'col' ? successText : successTextAsset,
              bottomMessage: type === 'col' ? unSuccessText : unsuccessTextAsset,
              onCheck: 'haveStatusU',
            },
          })
          .then(async response => {
            if (response.isOption === true) {
              await this.notificationService
                .showCustomDialog({
                  component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                  title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unSuccessText : unsuccessTextAsset} ทั้งหมด ${
                    type === 'col' ? selectionLength : selectionLengthAsset
                  }/${type === 'col' ? collateralLength : assetLength} ทรัพย์`,
                  rightButtonLabel: 'COMMON.BUTTON_SAVE',
                  leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                  buttonIconName: 'icon-save-primary',
                  iconClass: 'hideIcon',
                  cancelEvent: true,
                })
                .then(async customResponse => {
                  if (!customResponse.isCancel) {
                    this.callbackDataReason = customResponse.reason;
                    this.callBackDataRemark = customResponse.remark;
                    type === 'col'
                      ? this.onWithdrawalSubmit(index, keyResult, 'B')
                      : this.onWithdrawalSubmitAsset(index, keyResult, 'B');
                    await this.initialData();
                  }
                });
            } else if (response.isCancel) {
              this.notificationService.closeAll();
            } else {
              await this.notificationService
                .showCustomDialog({
                  component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                  title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unSuccessText : unsuccessTextAsset} ทั้งหมด ${
                    type === 'col' ? selectionLength : selectionLengthAsset
                  }/${type === 'col' ? collateralLength : assetLength} ทรัพย์`,
                  rightButtonLabel: 'COMMON.BUTTON_SAVE',
                  leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                  buttonIconName: 'icon-save-primary',
                  iconClass: 'hideIcon',
                  cancelEvent: true,
                })
                .then(async customResponse => {
                  if (!customResponse.isCancel) {
                    this.callbackDataReason = customResponse.reason;
                    this.callBackDataRemark = customResponse.remark;
                    type === 'col'
                      ? this.onWithdrawalSubmit(index, keyResult, 'AllUnSuccess')
                      : this.onWithdrawalSubmitAsset(index, keyResult, 'AllUnSuccess');
                    await this.initialData();
                  }
                });
            }
          });
      } else {
        await this.notificationService
          .showCustomDialog({
            component: LegalExecutionWithdrawConfirmationDialogComponent,
            title: `ยืนยันถอนยึดทรัพย์ไม่สำเร็จทั้งหมด`,
            rightButtonLabel: 'ยืนยัน',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            iconClass: 'large fill-red',
            context: {
              message: type === 'col' ? unSuccessText : unsuccessTextAsset,
              onCheck: 'noUIncluded',
              collateralLength: type === 'col' ? collateralLength : assetLength,
              selectionLength: type === 'col' ? selectionLength : selectionLengthAsset,
            },
          })
          .then(async response => {
            if (!response.isCancel) {
              await this.notificationService
                .showCustomDialog({
                  component: LegalExecutionOfficeWithdrawUnsuccessComponent,
                  title: `เหตุผลการถอนยึดทรัพย์${type === 'col' ? unSuccessText : unsuccessTextAsset} ทั้งหมด ${
                    type === 'col' ? selectionLength : selectionLengthAsset
                  }/${type === 'col' ? collateralLength : assetLength} ทรัพย์`,
                  iconClass: 'hideIcon',
                  rightButtonLabel: 'COMMON.BUTTON_SAVE',
                  leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                  buttonIconName: 'icon-save-primary',
                  cancelEvent: true,
                })
                .then(async customResponse => {
                  if (!customResponse.isCancel) {
                    this.callbackDataReason = customResponse.reason;
                    this.callBackDataRemark = customResponse.remark;
                    type === 'col'
                      ? this.onWithdrawalSubmit(index, keyResult, 'Unsuccess')
                      : this.onWithdrawalSubmitAsset(index, keyResult, 'Unsuccess');
                    await this.initialData();
                  }
                });
            }
          });
      }
    }
    await this.initialData();
    if (type === 'col') {
      this.selections.forEach(selection => selection.clear());
    } else {
      this.selectionsAsset.forEach(selection => selection.clear());
    }
  }

  toggleAllRows(index: number): void {
    if (this.isAllSelected(index)) {
      this.selections[index].clear();
    } else {
      const _mapperData = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[
        index
      ]?.collaterals?.map(m => m.collateralId) as string[];
      this.selections[index].select(..._mapperData);
    }
  }

  toggleAllRowsAsset(index: number): void {
    if (this.isAllSelectedAsset(index)) {
      this.selectionsAsset[index].clear();
    } else {
      const _mapperData = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[
        index
      ]?.assets?.map(m => m.assetId?.toString()) as string[];
      this.selectionsAsset[index].select(..._mapperData);
    }
  }

  onCheckboxChange(row: Collaterals, index: number): void {
    if (row.collateralId) {
      this.selections[index].toggle(row.collateralId);
    }
  }

  onCheckboxChangeAsset(row: Assets, index: number): void {
    if (row.assetId) {
      this.selectionsAsset[index].toggle(row.assetId.toString());
    }
  }

  isAllSelected(index: number): boolean {
    const numSelected = this.selections[index]?.selected.length || 0;
    const numRows =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[index]?.collaterals?.length || 0;
    return numSelected === numRows;
  }

  isAllSelectedAsset(index: number): boolean {
    const numSelected = this.selectionsAsset[index]?.selected.length || 0;
    const numRows =
      this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[index]?.assets?.length || 0;
    return numSelected === numRows;
  }

  initSelections(): void {
    const groupCount = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.length || 0;
    for (let i = 0; i < groupCount; i++) {
      this.selections[i] = new SelectionModel<string>(true, []);
      this.selectionsAsset[i] = new SelectionModel<string>(true, []);
    }
  }

  getMainContact(contacts: Contacts[]): Contacts | undefined {
    return contacts.some(it => it.isMainContact)
      ? contacts.find(contact => contact.isMainContact === true)
      : contacts[0];
  }

  joinOwnersString(owners: any[]): string {
    return (
      owners
        .map(owner => owner.ownerName)
        .join(', ')
        .trim() || '-'
    );
  }

  getResultMapper(result: string): string | undefined {
    return getSeizureResultValue(result);
  }

  onPageChange(event: PageEvent, index: number) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.collateralDataSources[index].filteredData = this.collateralDataSources[index].data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  onPageChangeAsset(event: PageEvent, index: number) {
    this.pageIndexAsset = event.pageIndex;
    this.pageSizeAsset = event.pageSize;
    this.assetDataSources[index].filteredData = this.assetDataSources[index].data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  checkList(data: any) {
    return data.length > 0 ? true : false;
  }

  initialTaskCOrTaskCData() {
    if (!this.isTaskCOrTaskD) return;
    this.propertyDataSources = [];
    this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.withdrawSeizureLedGroups?.forEach(
      (item, i) => {
        if ((item.collaterals && item.collaterals?.length > 0) || (item.assets && item.assets?.length > 0)) {
          let groupName = '';
          let groupId = '';
          if (item.contacts && item.contacts.length > 0) {
            const mainContact = item.contacts.some(it => it.isMainContact)
              ? item.contacts.find(it => it.isMainContact === true)
              : item.contacts[0] || null;
            groupName = `${mainContact?.firstName} ${mainContact?.lastName}`;
            groupId = mainContact?.personId || '';
          }

          this.propertyDataSources.push({
            index: i,
            groupName: groupName,
            groupId: groupId,
            asset: [...(item?.assets || [])],
            collaterals: [...(item?.collaterals || [])],
            contactPersons: [...(item?.contacts || [])],
            consentDocuments: [...(item?.consentDocuments || [])],
          });
        }
      }
    );
  }
  calculateCountsForGroup(groupIndex: number) {
    let group = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[groupIndex];

    if (group) {
      let successCount = 0;
      let unsuccessCount = 0;

      if (group.collaterals) {
        group.collaterals.forEach(collateral => {
          if (collateral.withdrawSeizureResult === 'S') {
            successCount++;
          } else if (collateral.withdrawSeizureResult === 'U') {
            unsuccessCount++;
          }
        });
        this.groupCount[groupIndex] = group.collaterals.length;
      } else {
        this.groupCount[groupIndex] = 0;
      }
      this.successCount[groupIndex] = successCount;
      this.unsuccessCount[groupIndex] = unsuccessCount;
    } else {
      this.groupCount[groupIndex] = 0;
    }
  }

  calculateCountsForGroupAsset(groupIndex: number) {
    let group = this.withdrawSeizuresLedData.withdrawSeizureLed?.withdrawSeizureLedGroups?.[groupIndex];

    if (group) {
      let successCount = 0;
      let unsuccessCount = 0;

      if (group.assets) {
        group.assets.forEach(asset => {
          if (asset.withdrawSeizureResult === 'S') {
            successCount++;
          } else if (asset.withdrawSeizureResult === 'U') {
            unsuccessCount++;
          }
        });
        this.groupCountAsset[groupIndex] = group.assets.length;
      } else {
        this.groupCountAsset[groupIndex] = 0;
      }
      this.successCountAsset[groupIndex] = successCount;
      this.unsuccessCountAsset[groupIndex] = unsuccessCount;
    } else {
      this.groupCountAsset[groupIndex] = 0;
    }
  }
}

// TODO All below Should be in the Service but wait for the working flow to flow first.
export enum SeizureResult {
  S = 'ถอนสำเร็จ',
  U = 'ถอนไม่สำเร็จ',
  P = 'รอบันทึก',
}

export function getSeizureResultValue(resultKey: string): string | undefined {
  return SeizureResult[resultKey as keyof typeof SeizureResult];
}
