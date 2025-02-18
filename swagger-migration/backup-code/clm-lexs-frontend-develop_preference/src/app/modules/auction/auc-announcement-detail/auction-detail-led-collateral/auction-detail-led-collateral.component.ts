import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { TMode, auctionActionCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { DialogOptions, DropDownConfig, IDialogStep, SimpleSelectOption } from '@spig/core';
import { AucCollateralColType } from '../../auction.model';
import { AuctionService } from '../../auction.service';
import { AuctionDetails, AuctionDetailsAssetOwner, AuctionLexsCollateralResponse, AuctionLexsNonPledgeAssestDto, NameValuePair } from '@lexs/lexs-client';
import { NotificationService } from '@app/shared/services/notification.service';
import { DetailCollateralLexsDialogComponent } from '../detail-collateral-lexs-dialog/detail-collateral-lexs-dialog.component';
import { AddCollateralLexsDialogComponent } from '../add-collateral-lexs-dialog/add-collateral-lexs-dialog.component';
import { ConfirmCollateralLexsDialogComponent } from '../confirm-collateral-lexs-dialog/confirm-collateral-lexs-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { AuctionDeedInfoResponse } from 'projects/lexs/lexs-client/src/model/auctionDeedInfoResponse';
import { AuctionLexsCollateralDtoWithAsset } from '../../auc-announement-map-collateral/auc-announement-map-collateral.component';

@Component({
  selector: 'app-auction-detail-led-collateral',
  templateUrl: './auction-detail-led-collateral.component.html',
  styleUrls: ['./auction-detail-led-collateral.component.scss'],
})
export class AuctionDetailLedCollateralComponent implements OnInit {
  @Input() data: Array<AuctionDetails> = [];
  @Output() onUpdateSelectItem = new EventEmitter<any>();

  isOpened: boolean = true;
  mode: TMode = '' as TMode;
  public actionCode!: auctionActionCode;
  ACTION_TYPE = auctionActionCode;
  tableConfig = { hasTotal: true };

  public dataMatche: Array<AuctionDetails> = [];
  public dataUnMatche: Array<AuctionDetails> = [];
  public dataFromLEXS: Array<AuctionDetails> = [];

  public propertyContact: UntypedFormControl = new UntypedFormControl('N/A');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
  };

  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก',
  };

  public collateralGroupOption: SimpleSelectOption[] = [
    { text: 'Group1', value: '1' },
    { text: 'Group2', value: '2' },
  ];
  public statusFilterOption: SimpleSelectOption[] = [
    { text: 'Doc1', value: '1' },
    { text: 'Doc2', value: '2' },
  ];
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: 'ASC' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: 'DESC' },
  ];

  public TABLE_FILTER_KEY = {
    TYPE: 'collateralType',
    STATUS: 'status',
  };

  propertyConfig: any;

  LEXS_STATUS: any;
  isEditMode: any;

  public selection = new SelectionModel<string>(true, []);

  private defaultColumnConfig = [
    AucCollateralColType.orderNumber,
    AucCollateralColType.fsubbidnum,
    AucCollateralColType.assettypedesc,
    AucCollateralColType.landtype,
    AucCollateralColType.deedno,
    AucCollateralColType.assetDetail,
    AucCollateralColType.redCaseNo,
    AucCollateralColType.saletypedesc,
    AucCollateralColType.debtname,
    AucCollateralColType.ownername,
    AucCollateralColType.personName1,
    AucCollateralColType.personName2,
    AucCollateralColType.occupant,
    AucCollateralColType.ledname,
    AucCollateralColType.remark,
  ];
  public collateralCheckColumns = [...this.defaultColumnConfig, AucCollateralColType.action];
  public collateralMatchedUnmatchedColumns = [...this.defaultColumnConfig, AucCollateralColType.announceLink];
  public collateralMatchedColumns = [
    ...this.defaultColumnConfig,
    AucCollateralColType.announceLink,
    AucCollateralColType.statusSuccess,
    AucCollateralColType.action,
  ];
  public collateralUnmatchedColumns: any = [];
  public collateralFromLEXSColumns = ['index', 'propertySet', 'collateralType', 'subCollateralType', 'documentNumber', 'assetDetail', 'redCaseNo', 'saleTypeDesc', 'mortgagee', 'ownername', 'accuser', 'defendant', 'occupant', 'ledname', 'remark', 'announceLink', 'command'];
  public pageSize = 10;
  public pageIndex: number = 1;
  public tabIndex: number = 0;
  public tableDataSource: any;
  public dataSelected: any;
  public dataConfirm: any;
  private dialogConfig: DialogOptions = {
    title: 'เพิ่มทรัพย์จากระบบ LEXS',
    iconName: 'icon-Plus',
    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
    cancelEvent: true,
  };
  private collateralSeleted = []; // prepare for using on dialog data passing
  private occupantOptions: NameValuePair[] = [];

  private aucRef!: number;
  private deedGroupNo!: string;
  private auctionDeedInfo!: AuctionDeedInfoResponse;

  private stepsInfo: IDialogStep[] = [
    {
      index: 0,
      label: 'เลือกทรัพย์ที่ต้องการเพิ่มจากระบบ LEXS',
      active: false,
    },
    {
      index: 1,
      label: 'บันทึกข้อมูลรายละเอียดทรัพย์',
      active: false,
    },
    {
      index: 2,
      label: 'บันทึกราคาวางหลักประกันและราคาประเมิน',
      active: false,
    },
  ];

  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private masterDataService: MasterDataService
  ) { }

  async ngOnInit(): Promise<void> {
    this.logger.info('[AuctionDetailLedCollateralComponent][ngOnInit]', this.auctionService.auctionCollaterals);
    this.actionCode = this.auctionService.actionCode as auctionActionCode;
    this.mode = this.auctionService.mode as TMode;
    this.dataMatche = this.data.filter(it => it.collateralMatched === true);
    this.dataUnMatche = this.data.filter(it => it.collateralMatched !== true);

    // LEX2-42467 เพิ่ม ทรัพย์ที่เพิ่มจากระบบ LEXS (แพ่ง)
    // TODO: verify aucRef / deedGroupNo ref.
    if (this.auctionService.auctionCollaterals?.auctionCollaterals) {
      this.aucRef = this.auctionService.auctionCollaterals?.auctionCollaterals[0]?.aucRef || 0;
      this.deedGroupNo = this.auctionService.auctionCollaterals?.auctionCollaterals[0]?.deedGroupId?.toString() || '';
    } else {
      this.aucRef = 0;
      this.deedGroupNo = '';
    }
    this.occupantOptions = await this.masterDataService.getOccupantOptions();
    this.dataFromLEXS = this.auctionService.auctionCollaterals?.auctionCollaterals?.filter(item => item.auctionAnnounceSource === 'LEXS') || [];
    this.collateralFromLEXSColumns = this.mode === 'VIEW' ? this.collateralFromLEXSColumns.filter(i => i !== 'command') : this.collateralFromLEXSColumns;

    if (this.mode === 'VIEW') {
      this.collateralUnmatchedColumns = [...this.defaultColumnConfig, AucCollateralColType.statusPending];
    } else {
      this.collateralUnmatchedColumns = [
        ...this.defaultColumnConfig,
        AucCollateralColType.announceLink,
        AucCollateralColType.statusPending,
        AucCollateralColType.action,
      ];
    }
    setTimeout(() => {
      this.tabIndex = this.auctionService.previousIndexCollateralDetail || 0;
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.logger.info('[AuctionDetailLedCollateralComponent][viewAnnouncementDocument]', event.index);
    this.tabIndex = event.index;
    this.auctionService.previousIndexCollateralDetail = event.index;
  }

  async onAddCollateralLexs() {
    //this.auctionDeedInfo = await this.auctionService.getAuctionDeedInfo(this.aucRef, { deedGroupNo: this.deedGroupNo } as AuctionDeedInfoRequest);
    const litigationCaseId = Number(this.auctionService?.selectAnouncementDetail?.litigationCaseId);
    const ledId = Number(this.auctionService?.selectAnouncementDetail?.ledId);
    const aucRef = Number(this.aucRef);
    const auctionResponse = await this.auctionService.getInquirySeizureInfo(aucRef, ledId, litigationCaseId);
    this.tableDataSource = auctionResponse.nonPledgeAssets && auctionResponse.nonPledgeAssets.length > 0
      ? this.getAuctionResponseWithAsset(auctionResponse)
      : this.auctionService.auctionLexsCollateralResponse?.lexsCollaterals || [];
    const dialogSetting: DialogOptions = {
      component: AddCollateralLexsDialogComponent,
      steps: this.stepsInfo.map(s => s.index === 0 ? { ...s, active: true } : s),
      rightButtonLabel: 'TASK.BTN_NEXT',
      buttonIconName: 'icon-Direction-Right',
      context: {
        data: this.tableDataSource,
        occupantOptions: this.occupantOptions,
        auctionDeedInfo: this.auctionDeedInfo,
      },
    };
    const result = await this.notificationService.showCustomDialog({ ...this.dialogConfig, ...dialogSetting });
    console.log('🚀 ~ result:', result);
    this.dataSelected = result.dataSelected;
    if (!result.isCancel) {
      await this.detailCollateralLexs();
    } else {
      this.notificationService.closeAll();
    }
  }

  async detailCollateralLexs() {
    const dialogSetting: DialogOptions = {
      component: DetailCollateralLexsDialogComponent,
      steps: this.stepsInfo.map(s => s.index === 0 || s.index === 1 ? { ...s, active: true } : s),
      contentCssClasses: ['space_between'],
      rightButtonLabel: 'TASK.BTN_NEXT',
      buttonIconName: 'icon-Direction-Right',
      backIconName: 'icon-Direction-Left',
      context: {
        dataSelected: this.dataSelected,
        occupantOptions: this.occupantOptions,
        auctionDeedInfo: this.auctionDeedInfo
      },
      backButtonLabel: 'กลับไปขั้นตอนก่อนหน้า',
    };
    const result = await this.notificationService.showCustomDialog({ ...this.dialogConfig, ...dialogSetting });
    this.dataConfirm = result
    this.auctionDeedInfo = await this.auctionService.getAuctionDeedInfo(this.aucRef, this.deedGroupNo);
    console.log('🚀 ~ result:', result);
    if (result.isBack) {
      await this.onAddCollateralLexs();
    } else if (result.isCancel) {
      this.notificationService.closeAll();
    } else {
       await this.confirmCollateralLexs();
    }
  }

  async confirmCollateralLexs() {
    const dialogSetting: DialogOptions = {
      component: ConfirmCollateralLexsDialogComponent,
      steps: this.stepsInfo.map(s => ({ ...s, active: true })),
      contentCssClasses: ['space_between'],
      rightButtonLabel: 'ยืนยันเพิ่มทรัพย์',
      buttonIconName: 'icon-Check-Square',
      backIconName: 'icon-Direction-Left',
      context: {
        dataSelected: this.getMacthDeedMapping(this.dataConfirm),
        occupantOptions: this.occupantOptions,
        auctionDeedInfo: this.auctionDeedInfo,
        aucRef:this.aucRef,
        deedGroupNo:this.deedGroupNo
      },
      backButtonLabel: 'กลับไปขั้นตอนก่อนหน้า',
    };
    const result = await this.notificationService.showCustomDialog({ ...this.dialogConfig, ...dialogSetting });
    console.log('🚀 ~ result:', result);
    if (result.isBack) {
      await this.detailCollateralLexs();
    } else if (result.isCancel) {
      this.notificationService.closeAll();
    } else {
      if (!!result) {
        // after call api to submit
        this.notificationService.openSuccessBanner('เพิ่มทรัพย์จากระบบ LEXS', {
          buttonText: this.translateService.instant('COMMON.BUTTON_ACKNOWLEDGE'),
        });
      }
    }
  }


  getAuctionResponseWithAsset(auctionResponse: AuctionLexsCollateralResponse) {
    let auctionData: AuctionLexsCollateralDtoWithAsset[];
    let collateralData = auctionResponse?.lexsCollaterals?.map(obj => ({
      ...obj,
      isNotPledgeAsset: false,
    })) as AuctionLexsCollateralDtoWithAsset[];

    // Concatenating nonPledgeAssets into lexsCollaterals

    auctionData =
      (auctionResponse.nonPledgeAssets &&
        (collateralData.concat(
          auctionResponse.nonPledgeAssets.map((asset: AuctionLexsNonPledgeAssestDto) => {
            return {
              collateralId: asset.assetId,
              lexsRedCaseNo: asset.assetRedCaseNo,
              ledId: asset.ledId?.toString() || '',
              ledName: asset.ledName,
              lexsCollateralTypeCode: asset.assetCollateralTypeCode?.toString() || '',
              lexsCollateralTypeDesc: asset.assetCollateralTypeDesc,
              lexsCollateralSubTypeCode: asset.assetCollateralSubTypeCode?.toString() || '',
              lexsCollateralSubTypeDesc: asset.assetCollateralSubTypeDesc,
              lexsDocumentNo: asset.assetDocumentNo,
              lexsCollateralsDescription: asset.assetDescription,
              lexsDefendant: asset.assetDefendant,
              lexsPlaintiffName: asset.assetPlaintiffname,
              lexsOwnerFullName: asset.assetOwners ? this.getLexsOwnerFullNameAsset(asset.assetOwners) : '',
              assetObligationBy: asset.assetObligationBy || '',
              isNotPledgeAsset: true,
              assetId: asset.assetId,
            };
          })
        ) as AuctionLexsCollateralDtoWithAsset[])) ||
      [];
    return auctionData;
  }

  getLexsOwnerFullNameAsset(assetOwners: Array<AuctionDetailsAssetOwner>) {
    let result: string = '';

    assetOwners.forEach(assetOwner => {
      if (assetOwner.firstName && assetOwner.lastName) {
        if (assetOwner.custTypeConst === 'P') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName} ${assetOwner.lastName}, `;
        } else if (assetOwner.custTypeConst === 'C') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName}, `;
        } else result += '-, ';
      }
    });

    // Check if there's a non-empty result before slicing
    if (result.length > 0) {
      result = result.slice(0, -2); // Removing the last ', ' from the concatenated string
    }

    return result;
  }


  getMacthDeedMapping(data: any) {
    const getDataRawValue = data.getRawValue();
    const result = getDataRawValue.map((e: any) => {
      return {
        collateralId: e.collateralId,
        colGroup: e.colGroup,
        ledName: e.ledName,
        lexsCollateralTypeDesc: e.lexsCollateralTypeDesc,
        lexsCollateralSubTypeDesc: e.lexsCollateralSubTypeDesc,
        lexsCollateralsDescription: e.lexsCollateralsDescription,
        lexsDefendant: e.lexsDefendant,
        lexsDocumentNo: e.lexsDocumentNo,
        lexsOwnerFullName: e.lexsOwnerFullName,
        lexsPlaintiffName: e.lexsPlaintiffName,
        proprietaryType: e.proprietaryType,
        remark: e.remark,
        assetObligationBy: e.assetObligationBy,
        lexsRedCaseNo: e.lexsRedCaseNo,
        numberOfCollateral: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? Number(e?.numberOfCollateral || 1) + Number(this.auctionDeedInfo.totalDeeds) : 1,
        saleTypeDesc: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.saleTypeDesc : '',
        reserveFund: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.reserveFund : '',
        reserveFund1: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.reserveFund1 : '',
        assetPrice2: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.assetPrice2 : '',
        assetPrice3: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.assetPrice3 : '',
        assetPrice4: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.assetPrice4 : '',
        assetPrice5: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? this.auctionDeedInfo.assetPrice5 : '',
        isView: e.colGroup ===  this.auctionDeedInfo.totalDeeds ? 'VIEW' : 'EDIT',
      }
    })
    return result;
  }
}
