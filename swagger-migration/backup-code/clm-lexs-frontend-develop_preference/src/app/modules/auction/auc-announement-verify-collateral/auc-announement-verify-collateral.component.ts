import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionBar, TMode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionCollateralValidateRequest, AuctionDetails, AuctionLexsCollateralDto } from '@lexs/lexs-client';
import { DialogOptions } from '@spig/core';
import { AucCollateralColType } from '../auction.model';
import { AuctionService } from '../auction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auc-announement-verify-collateral',
  templateUrl: './auc-announement-verify-collateral.component.html',
  styleUrls: ['./auc-announement-verify-collateral.component.scss'],
})
export class AucAnnounementVerifyCollateralComponent implements OnInit {
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    primaryText: 'เสร็จสิ้น',
    primaryIcon: 'icon-Selected',
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  public title: string = 'AUCTION.TITLE_VERIFY_COLLATERAL';
  public messageBanner = 'AUCTION.MSG_BANNER_VERIFY_COLLATERAL';
  public verifyCollateralForm!: UntypedFormGroup;
  public dataToVerify: AuctionDetails | undefined;
  public tableColumnConfig = [
    AucCollateralColType.orderNumber,
    AucCollateralColType.sourceOfAsset,
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

  public tableDataSource: AuctionLexsCollateralDto[] = [];
  public selectCollateral: string = '';
  public mode: TMode = '' as TMode;

  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService,
    private notificationService: NotificationService,
    private routerService: RouterService,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.info('[AucAnnounementVerifyCollateralComponent][ngOnInit]');
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
      if (this.mode === 'VIEW') {
        this.tableColumnConfig = [...this.tableColumnConfig, AucCollateralColType.action];
        this.messageBanner = '';
        this.title = 'AUCTION.TITLE_VERIFY_COLLATERAL_VIEW';
        this.actionBar = { ...this.actionBar, hasPrimary: false };
      } else {
        this.tableColumnConfig = [
          ...this.tableColumnConfig,
          AucCollateralColType.announceLink,
          AucCollateralColType.action,
        ];
      }
    });
    this.tableDataSource = this.auctionService.auctionLexsCollateralResponse?.lexsCollaterals || [];
    this.auctionService.verifyCollateralForm = this.auctionService.getVerifyCollateralForm();
    this.verifyCollateralForm = this.auctionService.verifyCollateralForm;
    this.dataToVerify = this.auctionService.auctionCollateralToVerify;
  }

  async onBack() {
    if (this.verifyCollateralForm.touched) {
      await this.auctionService.openConfirmBackToEdit();
    } else {
      this.routerService.back();
    }
  }

  async onSubmit() {
    try {
      this.auctionService.verifyCollateralForm.markAllAsTouched();
      if (this.auctionService.verifyCollateralForm.valid) {
        const request: AuctionCollateralValidateRequest = {
          deedId: this.auctionService.auctionCollateralToVerify?.deedId,
          deedGroupId: this.auctionService.auctionCollateralToVerify?.deedGroupId,
          validationNote: this.auctionService.verifyCollateralForm.get('reason')?.value || '',
          validationResult: this.auctionService.verifyCollateralForm.get('result')?.value || '',
        };
        const response = await this.auctionService.postCollateralValidate(request);
        this.logger.info('onSubmit postCollateralValidate response :: ', response);
        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('ANNOUNCE_VERIFY_COLLATERAL.VERIFIED_SUCCESS')
        );
        this.routerService.back();
      }
    } catch (error) {
      await this.auctionService.handleErrorForAuction(error);
    }
  }

  async reSelectCollateral(data?: AuctionDetails) {
    try {
      const optionsDialog: DialogOptions = {
        rightButtonLabel: 'ยืนยันเลือกทรัพย์ใหม่',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonClass: 'primary',
        buttonIconName: 'icon-Selected',
      };

      const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
        'ยืนยันเลือกทรัพย์ใหม่',
        'ผลการตรวจสอบและหมายเหตุการตรวจสอบจะถูกรีเซท<br>คุณยืนยันที่จะเลือกทรัพย์ใหม่ใช่หรือไม่?',
        optionsDialog
      );
      if (!res) return;
      const request: AuctionCollateralValidateRequest = {
        deedId: data?.deedId,
        deedGroupId: data?.deedGroupId,
        validationNote: '',
        validationResult: 'UNMAP',
      };
      await this.auctionService.postCollateralValidate(request);
      this.auctionService.auctionCollateralToVerify = data;
      this.notificationService.openSnackbarSuccess('ปลดการจับคู่ทรัพย์ แล้ว');
      const url = this.auctionService.routeCorrection('auction-map-collateral');
      this.routerService.navigateTo(url, {
        mode: 'EDIT',
        isReselectCollateral: true,
      });
    } catch (error) {
      await this.auctionService.handleErrorForAuction(error);
    }
  }
}
