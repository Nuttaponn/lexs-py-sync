import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CollateralCaseLexsStatus } from '@app/shared/constant';
import { WithDrawnSeizureConfig } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { Assets, Collaterals, LitigationCasePersonDto, WithdrawSeizureCollateralInfo } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { WithdrawnSeizureAddContactDialogComponent } from '../dialogs/withdrawn-seizure-add-contact-dialog/withdrawn-seizure-add-contact-dialog.component';
import { WithdrawnSeizureAddPropertyDialogComponent } from '../dialogs/withdrawn-seizure-add-property-dialog/withdrawn-seizure-add-property-dialog.component';
import { WithdrawnSeizurePropertyConfirmDialogComponent } from '../dialogs/withdrawn-seizure-property-confirm-dialog/withdrawn-seizure-property-confirm-dialog.component';
import { WithdrawnSeizurePropertyMoveDialogComponent } from '../dialogs/withdrawn-seizure-property-move-dialog/withdrawn-seizure-property-move-dialog.component';
import { WithdrawnSeizureViewModel } from '../withdrawn-seizure-property.model';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
  WithdrawnPersonColumns,
} from './withdrawn-seizure-property-select.model';

@Component({
  selector: 'app-withdrawn-seizure-property-select',
  templateUrl: './withdrawn-seizure-property-select.component.html',
  styleUrls: ['./withdrawn-seizure-property-select.component.scss'],
})
export class WithdrawnSeizurePropertySelectComponent implements OnInit {
  public messageBanner = 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_WITHDRAWN_2';
  public messageReturnBaner = `กรุณาตรวจสอบและอัปเดตข้อมูลการชะลอดำเนินคดี และกด “เสร็จสิ้น” เพื่อดำเนินการต่อ<br>เหตุผลในการขอแก้ไข: `;
  public returnReason = '';

  public persons: LitigationCasePersonDto[] = [];

  public collateralColumns: string[] = WithdrawnCollateralColumns;
  public lgPersonColumn: string[] = WithdrawnPersonColumns;
  public assetColumns: string[] = WithdrawAssetColumns;
  public propertyDataSources: WithdrawnSeizureViewModel[] = [];
  public asssetDataSources: WithdrawnSeizureViewModel[] = [];
  public contactDataSources: WithdrawnSeizureViewModel[] = [];
  public tableConfig: WithDrawnSeizureConfig = {
    propertyConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: true,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: true,
      hasDelete: true,
      hasSelect: false,
      hasEdit: true,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: true,
      tableColumns: WithdrawnCollateralColumns,
      hasTitleTotal: true,
      hasUploadDocument: true,
    },
    assetConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: true,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: true,
      hasDelete: true,
      hasSelect: false,
      hasEdit: true,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: true,
      tableColumns: WithdrawAssetColumns,
      hasTitleTotal: true,
      hasUploadDocument: true,
    },
    contactConfig: {
      hasAction: true,
      hasAdd: true,
      hasDelete: true,
      hasEdit: true,
      hasTitle: true,
    },
    stepIndex: 1,
  };

  public propertyForm!: UntypedFormGroup;
  public excludeItems: string[] = [];
  public excludeItemsAsset: string[] = [];

  constructor(
    public withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private routerService: RouterService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // initScreenData
    if (this.withdrawnSeizurePropertyService?.withdrawSeizurePropertyCreateData?.withdrawSeizureGroups?.length === 0) {
      this.withdrawnSeizurePropertyService?.propertyForm?.reset();
      return;
    }
    this.returnReason = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.rejectReason || '';

    // mergeApiDataToLocalData
    if (
      this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData &&
      this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups &&
      this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups?.length > 0
    ) {
      this.withdrawnSeizurePropertyService?.propertyForm?.markAllAsTouched();

      let collatetals = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.flatMap(
        c => {
          return c.collaterals?.flatMap(n => n.collateralId);
        }
      );

      let assets = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.flatMap(c => {
        return c.assets?.flatMap(n => n.assetId?.toString());
      });

      this.withdrawnSeizurePropertyService?.withdrawSeizurePropertyCreateData?.withdrawSeizureGroups?.forEach(k => {
        let hasValueDataCol = k.collaterals?.filter(it => collatetals?.includes(it.collateralId)) || [];
        let hasValueDataAsset = k.assets?.filter(it => assets?.includes(it.assetId?.toString())) || [];
        if (hasValueDataCol?.length > 0 || hasValueDataAsset?.length > 0) {
        } else {
          this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.push(k);
        }
      });
    }

    // initTableData
    this.initTableData();
  }

  private initTableData() {
    this.propertyDataSources = [];
    this.withdrawnSeizurePropertyService.withdrawnExcludeItems = [];
    this.withdrawnSeizurePropertyService.withdrawnExcludeItemsAsset = [];
    this.excludeItems = [];
    this.excludeItemsAsset = [];
    this.withdrawnSeizurePropertyService.withdrawSeizureResponse = {
      ...this.withdrawnSeizurePropertyService?.withdrawSeizureResponse,
      // withdrawSeizureGroups:
      //   this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.filter(
      //     it => it.collaterals && it.collaterals.length > 0
      //   ),
    };
    this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach((item, i) => {
      if ((item.collaterals && item.collaterals?.length > 0) || (item.assets && item.assets?.length > 0)) {
        let groupName = '';
        let groupId = '';
        const selectProperties = item?.collaterals?.map(d => d.collateralId) as string[];
        const selectPropertiesAsset = item?.assets?.map(d => d.assetId?.toString()) as string[];
        const selectContacts = item.contacts?.map(d => d.personId) as string[];
        this.withdrawnSeizurePropertyService.propertyForm.get('properties')?.setValue(selectProperties);
        this.withdrawnSeizurePropertyService.propertyForm.get('assets')?.setValue(selectPropertiesAsset);
        this.excludeItems = [...this.excludeItems, ...selectProperties];
        this.excludeItemsAsset = [...this.excludeItemsAsset, ...selectPropertiesAsset];
        if (item.contacts && item.contacts.length > 0) {
          const mainContact = item.contacts.find((it, i) => it.isMainContact === true || i === 0);
          this.withdrawnSeizurePropertyService.propertyForm.get('contacts')?.setValue(selectContacts);
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
    });

    this.withdrawnSeizurePropertyService.withdrawnExcludeItems = [
      ...this.withdrawnSeizurePropertyService.withdrawnExcludeItems,
      ...this.excludeItems,
    ];
    this.withdrawnSeizurePropertyService.withdrawnExcludeItemsAsset = [
      ...this.withdrawnSeizurePropertyService.withdrawnExcludeItemsAsset,
      ...this.excludeItemsAsset,
    ];
  }

  async onAddMoreProperty(data: WithdrawnSeizureViewModel, listData: WithdrawnSeizureViewModel[]) {
    this.logger.info('onAddMoreProperty WithdrawnSeizurePropertySelectComponent');
    const _defaultSelectItems = data.collaterals.map(d => d.collateralId);
    const _defaultSelectItemsAsset = data?.asset?.map(d => d.assetId?.toString()) || [];

    // const _defaultSelectItems = listData.flatMap(x => x.collaterals?.map(d => d.collateralId) || [])
    // const _defaultSelectItemsAsset = listData.flatMap(x => x.asset?.map(d => d.assetId?.toString()) || [])
    console.log('_defaultSelectItems', _defaultSelectItems);
    console.log('_defaultSelectItemsAsset', _defaultSelectItemsAsset);
    console.log('this.excludeItemsAsset.', this.excludeItemsAsset);
    console.log('this.excludeItems.', this.excludeItems);
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizureAddPropertyDialogComponent,
      type: 'xlarge',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: `เลือกทรัพย์เพื่อบันทึกผู้ติดต่อราย ${data.groupName}`,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.ADD_CONFIRM',
      buttonIconName: 'icon-Check-Square',
      context: {
        groupName: data.groupName,
        collateralColumns: this.collateralColumns,
        assetColumns: this.assetColumns,
        assets: this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets,
        collaterals: this.withdrawnSeizurePropertyService.litigationCaseCollaterals.collaterals,
        defaultSelectItems: _defaultSelectItems,
        defaultSelectItemsAsset: _defaultSelectItemsAsset,
        excludeItemsAsset: this.excludeItemsAsset.filter(ex => !_defaultSelectItemsAsset.includes(ex)),
        excludeItems: this.excludeItems.filter(ex => !_defaultSelectItems.includes(ex)),
      },
    });

    if (res) {
      try {
        this.notificationService.openSnackbarSuccess('บันทึกเพิ่มทรัพย์สำเร็จแล้ว');
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (data.groupName === currentGroupName) {
            const existingItems = item.collaterals?.map(it => it.collateralId);
            const cleanData = res.selectProperties.filter(
              (it: Collaterals) => !existingItems?.includes(it.collateralId)
            );
            item.collaterals = [...(item.collaterals || []), ...cleanData];

            const existingItemsAsset = item.assets?.map(it => it.assetId);
            const cleanDataAsset = res.selectPropertiesAsset.filter(
              (it: Assets) => !existingItemsAsset?.includes(it.assetId)
            );
            item.assets = [...(item.assets || []), ...cleanDataAsset];
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  async onAddMorePropertyAsset(data: WithdrawnSeizureViewModel) {
    this.logger.info('onAddMorePropertyAsset WithdrawnSeizurePropertySelectComponent');
    const _defaultSelectItems = data?.asset?.map(d => d.assetId?.toString()) || [];
    console.log('data asset', data);
    console.log('data _defaultSelectItems', _defaultSelectItems);
    console.log(
      'data this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets',
      this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets
    );
    console.log('data excludeItemsAsset', this.excludeItemsAsset);
    console.log(
      'data !_defaultSelectItems.includes(ex)',
      this.excludeItemsAsset.filter(ex => !_defaultSelectItems.includes(ex))
    );
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizureAddPropertyDialogComponent,
      type: 'xlarge',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: `เลือกทรัพย์เพื่อบันทึกผู้ติดต่อราย ${data.groupName}`,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.ADD_CONFIRM',
      buttonIconName: 'icon-Check-Square',
      context: {
        groupName: data.groupName,
        assetColumns: this.assetColumns,
        assets: this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets,
        defaultSelectItemsAsset: _defaultSelectItems,
        excludeItemsAsset: this.excludeItemsAsset.filter(ex => !_defaultSelectItems.includes(ex)),
      },
    });

    if (res) {
      try {
        this.notificationService.openSnackbarSuccess('บันทึกเพิ่มทรัพย์สำเร็จแล้ว');
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (data.groupName === currentGroupName) {
            const existingItems = item.assets?.map(it => it.assetId?.toString());
            const cleanData = res.selectPropertiesAsset.filter(
              (it: Assets) => !existingItems?.includes(it.assetId?.toString())
            );
            item.assets = [...(item.assets || []), ...cleanData];
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  async onAddMoreContact(data: WithdrawnSeizureViewModel) {
    this.logger.info('onAddMoreContact WithdrawnSeizurePropertySelectComponent');
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizureAddContactDialogComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: 'เพิ่มผู้ติดต่อที่เกี่ยวข้องกับทรัพย์ที่เลือก',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_APPLY',
      buttonIconName: 'icon-save-primary',
      context: {
        lgPersonColumn: this.lgPersonColumn,
        contactTypeOptions: this.withdrawnSeizurePropertyService.litigationCasePersons.litigationCasePersons?.map(d => {
          return {
            ...d.person,
            name: `${d.person?.firstName} ${d.person?.lastName}`,
          };
        }),
        contactPersons: data.contactPersons,
        currentSelectPersons: data.contactPersons?.map(d => d.personId),
      },
    });
    if (res) {
      try {
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (data.groupName === currentGroupName) {
            item.contacts = item.contacts?.concat([
              { ...res.saveData, isMainContact: res.saveData.relation === 'MAIN_BORROWER' },
            ]);
            if (item.contacts?.length === 1) {
              !item.contacts[0].personId?.startsWith('CONTACT_') && item.contacts[0].relation === 'MAIN_BORROWER'
                ? (item.contacts[0].isMainContact = true)
                : (item.contacts[0].isMainContact = false);
            }
          }
        });
        this.logger.info(
          'onAddMoreContact WithdrawnSeizurePropertySelectComponent',
          this.withdrawnSeizurePropertyService?.withdrawSeizurePropertyCreateData
        );
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  async onDeletePropertyData(element: any, group: WithdrawnSeizureViewModel) {
    this.logger.info('onDeletePropertyData WithdrawnSeizurePropertySelectComponent');

    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizurePropertyConfirmDialogComponent,
      type: 'xsmall',
      autoWidth: false,
      iconName: 'icon-Error',
      iconClass: 'icon-medium fill-red',
      title: 'ยืนยันลบทรัพย์',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'ยืนยันลบทรัพย์',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
      context:
        group.consentDocuments &&
        group.consentDocuments?.length > 0 &&
        group.consentDocuments?.filter(x => x.document?.imageId).length > 0
          ? {
              isShowWarning:
                element.status === CollateralCaseLexsStatus.PENDING_SALE ||
                element.status === CollateralCaseLexsStatus.ON_SALE,
              messageBanner:
                '<h6>ระวังเอกสารที่อัปโหลดไว้จะไม่ถูกบันทึก</h6>ทรัพย์นี้มีการอัปโหลดเอกสารยินยอมงดการขายแล้ว หากแก้ไข/ลบ ทรัพย์ เอกสารจะหายไป และจำเป็นต้องอัปโหลดใหม่',
              confirmMessage: 'ต้องการยืนยันลบทรัพย์ที่เลือกออกจากผู้ติดต่อหรือไม่',
            }
          : {
              confirmMessage: 'ต้องการยืนยันลบทรัพย์ที่เลือกออกจากผู้ติดต่อหรือไม่',
            },
    });
    if (res) {
      try {
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (group.groupName === currentGroupName) {
            if (element && element.collateralId) {
              item.collaterals = item.collaterals?.filter(d => d.collateralId !== element.collateralId);
            }
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
        this.notificationService.openSnackbarSuccess(this.translate.instant('ลบทรัพย์สำเร็จ'));
      } catch (error) {
        this.logger.info('onRemoveData Error ::', error);
      }
    }
  }

  async onDeletePropertyAssetData(element: any, group: WithdrawnSeizureViewModel) {
    this.logger.info('onDeletePropertyData WithdrawnSeizurePropertySelectComponent');

    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizurePropertyConfirmDialogComponent,
      type: 'xsmall',
      autoWidth: false,
      iconName: 'icon-Error',
      iconClass: 'icon-medium fill-red',
      title: 'ยืนยันลบทรัพย์',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'ยืนยันลบทรัพย์',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
      context:
        group.consentDocuments &&
        group.consentDocuments?.length > 0 &&
        group.consentDocuments?.filter(x => x.document?.imageId).length > 0
          ? {
              isShowWarning:
                element.collateralCaseLexStatus === CollateralCaseLexsStatus.PENDING_SALE ||
                element.collateralCaseLexStatus === CollateralCaseLexsStatus.ON_SALE,
              messageBanner:
                '<h6>ระวังเอกสารที่อัปโหลดไว้จะไม่ถูกบันทึก</h6>ทรัพย์นี้มีการอัปโหลดเอกสารยินยอมงดการขายแล้ว หากแก้ไข/ลบ ทรัพย์ เอกสารจะหายไป และจำเป็นต้องอัปโหลดใหม่',
              confirmMessage: 'ต้องการยืนยันลบทรัพย์ที่เลือกออกจากผู้ติดต่อหรือไม่',
            }
          : {
              confirmMessage: 'ต้องการยืนยันลบทรัพย์ที่เลือกออกจากผู้ติดต่อหรือไม่',
            },
    });
    if (res) {
      try {
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (group.groupName === currentGroupName) {
            if (element && element.assetId) {
              item.assets = item.assets?.filter(d => d.assetId?.toString() !== element.assetId.toString());
            }
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
        this.notificationService.openSnackbarSuccess(this.translate.instant('ลบทรัพย์สำเร็จ'));
      } catch (error) {
        this.logger.info('onRemoveData Error ::', error);
      }
    }
  }

  async onDeleteGroupData(element: any) {
    this.logger.info('onEditPropertyData WithdrawnSeizurePropertySelectComponent', element);

    const foundWarningConditionItem = element.collaterals.filter(
      (it: Collaterals) =>
        it.status === CollateralCaseLexsStatus.ON_SALE || it.status === CollateralCaseLexsStatus.PENDING_SALE
    );

    const foundWarningConditionItemAsset = element.asset.filter(
      (it: Assets) =>
        it.collateralCaseLexStatus === CollateralCaseLexsStatus.ON_SALE ||
        it.collateralCaseLexStatus === CollateralCaseLexsStatus.PENDING_SALE
    );

    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizurePropertyConfirmDialogComponent,
      type: 'xsmall',
      autoWidth: false,
      iconName: 'icon-Error',
      iconClass: 'icon-medium fill-red',
      title: 'ยืนยันจะลบรายการนี้',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'ยืนยันลบรายการ',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
      context:
        element.consentDocuments &&
        element.consentDocuments?.length > 0 &&
        element.consentDocuments?.filter((x: any) => x.document?.imageId).length > 0
          ? {
              isShowWarning: foundWarningConditionItem.length > 0 || foundWarningConditionItemAsset.length > 0,
              messageBanner:
                '<h6>ระวังเอกสารที่อัปโหลดไว้จะไม่ถูกบันทึก</h6>ทรัพย์นี้มีการอัปโหลดเอกสารยินยอมงดการขายแล้ว หากแก้ไข/ลบ ทรัพย์ เอกสารจะหายไป และจำเป็นต้องอัปโหลดใหม่',
              confirmMessage: 'รายการทรัพย์ที่เกี่ยวข้องกับผู้ติดต่อนี้จะหายไป \n คุณต้องการลบรายการหรือไม่',
            }
          : {
              confirmMessage: 'รายการทรัพย์ที่เกี่ยวข้องกับผู้ติดต่อนี้จะหายไป \n คุณต้องการลบรายการหรือไม่',
            },
    });

    if (res) {
      try {
        console.log('element', element);
        if (this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData) {
          this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData?.withdrawSeizureGroups?.forEach(
            (x, index) => {
              if ((x.collaterals && x.collaterals?.length > 0) || (x.assets && x.assets?.length > 0)) {
                let tempData = x.collaterals?.flatMap(c => {
                  return c.collateralId;
                });
                let tempData1 = x.assets?.flatMap(c => {
                  return c.assetId?.toString();
                });
                let hasValueDataCol = element.collaterals?.filter((it: any) => tempData?.includes(it.collateralId));
                let hasValueDataAsset = element.asset?.filter((it: any) => tempData1?.includes(it.assetId?.toString()));
                if (hasValueDataCol?.length > 0 || hasValueDataAsset?.length > 0) {
                  this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData?.withdrawSeizureGroups?.splice(
                    index,
                    1
                  );
                }
              }
            }
          );
        }

        let dataContext = this.withdrawnSeizurePropertyService.withdrawSeizureResponse?.withdrawSeizureGroups?.find(
          (x, i) => i === element.index
        );
        if (dataContext) {
          console.log(
            'this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol',
            this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol
          );
          if (!this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol) {
            if (dataContext.collaterals && dataContext.collaterals?.length > 0) {
              let colData = dataContext.collaterals?.map(it => {
                return <WithdrawSeizureCollateralInfo>{
                  // ...it,
                  collateralDetails: it.collateralDetails,
                  collateralId: it.collateralId,
                  collateralSubType: it.collateralSubType,
                  collateralType: it.collateralType,
                  documentNo: it.documentNo,
                  ledName: it.ledName,
                  ledRefNo: it.ledRefNo,
                  obligationStatus: it.obligationStatus,
                  ownerName: it.ownerFullName,
                  status: it.status,
                  totalAppraisalValue: it.totalAppraisalValue,
                };
              });
              // public tempDataDeletedGroupCol!: any[];
              // public tempDataDeletedGroupAsset!: any[];
              this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol = colData || [];
              // this.withdrawnSeizurePropertyService.litigationCaseCollaterals.collaterals?.concat(colData || [])
            }
          }
          console.log(
            'this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset',
            this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset
          );
          if (!this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset) {
            if (dataContext.assets && dataContext.assets?.length > 0) {
              let colData = dataContext.assets?.map(it => {
                return <Assets>{
                  // ...it,
                  assentRlsStatus: it.assentRlsStatus,
                  assetId: it.assetId,
                  assetSubType: it.assetSubType,
                  assetSubTypeDesc: it.assetSubTypeDesc,
                  assetType: it.assetType,
                  assetTypeDesc: it.assetTypeDesc,
                  collateralCaseLexStatus: it.collateralCaseLexStatus,
                  collateralDetails: it.collateralDetails,
                  documentNo: it.documentNo,
                  ledId: it.ledId,
                  ledName: it.ledName,
                  ledRefNo: it.ledRefNo,
                  obligationStatus: it.obligationStatus,
                  ownerFullName: it.ownerFullName,
                  remark: it.remark,
                  totalAppraisalValue: it.totalAppraisalValue,
                  withdrawSeizureReason: it.withdrawSeizureReason,
                  withdrawSeizureResult: it.withdrawSeizureResult,
                };
              });
              this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset = colData || [];
              //  this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse?.assets?.concat(colData || [])
            }
          }
        }
        this.withdrawnSeizurePropertyService.withdrawSeizureResponse?.withdrawSeizureGroups?.splice(element.index, 1);
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
        this.notificationService.openSnackbarSuccess(this.translate.instant('ลบรายการสำเร็จ'));
      } catch (error) {
        this.logger.info('onRemoveData Error ::', error);
      }
    }
  }

  async onDeleteContact(element: any, group: WithdrawnSeizureViewModel) {
    this.logger.info('onDeletePropertyData WithdrawnSeizurePropertySelectComponent');
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยันลบผู้ติดต่อ',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันลบ',
      'ต้องการยืนยันลบผู้ติดต่อที่เกี่ยวข้องกับทรัพย์ที่เลือกไว้ใช่หรือไม่',
      optionsDialog
    );

    if (!res) return;

    try {
      this.logger.info(
        'onDeleteContact WithdrawnSeizurePropertySelectComponent',
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups
      );
      this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
        let currentGroupName = '';
        if (item.contacts && item.contacts.length > 0) {
          currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
        }
        if (group.groupName === currentGroupName) {
          if (element && element.personId) {
            item.contacts = item.contacts?.filter(d => d.personId !== element.personId);
          }
        }
      });
      this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
      this.initTableData();
      this.notificationService.openSnackbarSuccess(this.translate.instant('ลบผู้ติดต่อสำเร็จ'));
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  async onEditContact(element: any, group: WithdrawnSeizureViewModel) {
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizureAddContactDialogComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: 'เปลี่ยนผู้ติดต่อ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_APPLY',
      buttonIconName: 'icon-save-primary',
      context: {
        lgPersonColumn: this.lgPersonColumn,
        contactTypeOptions: this.withdrawnSeizurePropertyService.litigationCasePersons.litigationCasePersons?.map(d => {
          return {
            ...d.person,
            name: `${d.person?.firstName} ${d.person?.lastName}`,
          };
        }),
        contactPersons: group.contactPersons,
        currentSelectPersons: group.contactPersons?.map(d => d.personId),
        defaultSelect: element,
      },
    });

    if (res) {
      try {
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          let currentGroupName = '';
          if (item.contacts && item.contacts.length > 0) {
            currentGroupName = `${item?.contacts[0]?.firstName} ${item?.contacts[0]?.lastName}`;
          }
          if (group.groupName === currentGroupName) {
            item.contacts = item.contacts?.filter(ct => ct.personId !== element.personId);
            item.contacts = item.contacts?.concat([
              { ...res.saveData, isMainContact: res.saveData.relation === 'MAIN_BORROWER' },
            ]);
            if (item.contacts?.length === 1) {
              !item.contacts[0].personId?.startsWith('CONTACT_') && item.contacts[0].relation === 'MAIN_BORROWER'
                ? (item.contacts[0].isMainContact = true)
                : (item.contacts[0].isMainContact = false);
            }
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  async onEditProperty(element: any, group: WithdrawnSeizureViewModel) {
    const groupOptions = this.propertyDataSources
      .filter(it => it.groupId !== group.groupId)
      .map(d => {
        const optionText = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_LIST_OPTION', {
          CONTACT_NAME: d.groupName,
        });
        const obj = { text: optionText, value: d.groupId };
        return obj;
      });
    if (groupOptions.length === 0) {
      await this.notificationService.alertDialog(
        'ไม่สามารถย้ายทรัพย์ได้',
        'ไม่สามารถย้ายได้ เนื่องจากไม่มีรายการทรัพย์อื่นให้เลือก'
      );
      return;
    }
    const moveTitle = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_TITLE', {
      COLLATERAL_ID: element.collateralId,
    });
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizurePropertyMoveDialogComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: moveTitle,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_CONFIRM',
      buttonIconName: 'icon-Check-Square',
      context:
        group.consentDocuments &&
        group.consentDocuments?.length > 0 &&
        group.consentDocuments?.filter(x => x.document?.imageId).length > 0
          ? {
              isShowWarning:
                element.status === CollateralCaseLexsStatus.PENDING_SALE ||
                element.status === CollateralCaseLexsStatus.ON_SALE,
              groupTypeOptions: groupOptions,
              defaultSelect: group.groupId,
              collateralStatus: element.status,
              messageBanner:
                '<h6>ระวังเอกสารที่อัปโหลดไว้จะไม่ถูกบันทึก</h6>ทรัพย์นี้มีการอัปโหลดเอกสารยินยอมงดการขายแล้ว หากแก้ไข/ลบ ทรัพย์ เอกสารจะหายไป และจำเป็นต้องอัปโหลดใหม่',
            }
          : {
              groupTypeOptions: groupOptions,
              defaultSelect: group.groupId,
              collateralStatus: element.status,
            },
    });

    if (res) {
      try {
        this.logger.info('onEditProperty element', element);
        this.logger.info('onEditProperty res.targetGroup', res.targetGroup);

        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          const mainContacts = item.contacts?.find((d, i) => d.isMainContact || i === 0);
          if (group?.groupId !== res.targetGroup) {
            if (mainContacts?.personId === group.groupId && item.collaterals && item.collaterals.length > 0) {
              item.collaterals = item.collaterals?.filter(d => d.collateralId !== element.collateralId);
            }

            if (mainContacts?.personId === res.targetGroup) {
              item.collaterals?.push(element);
            }
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
        this.notificationService.openSnackbarSuccess(this.translate.instant('ย้ายทรัพย์สำเร็จ'));
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  async onEditPropertyAsset(element: any, group: WithdrawnSeizureViewModel) {
    const groupOptions = this.propertyDataSources
      .filter(it => it.groupId !== group.groupId)
      .map(d => {
        const optionText = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_LIST_OPTION', {
          CONTACT_NAME: d.groupName,
        });
        const obj = { text: optionText, value: d.groupId };
        return obj;
      });
    if (groupOptions.length === 0) {
      await this.notificationService.alertDialog(
        'ไม่สามารถย้ายทรัพย์ได้',
        'ไม่สามารถย้ายได้ เนื่องจากไม่มีรายการทรัพย์อื่นให้เลือก'
      );
      return;
    }
    const moveTitle = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_TITLE', {
      COLLATERAL_ID: element.assetId?.toString(),
    });
    const res = await this.notificationService.showCustomDialog({
      component: WithdrawnSeizurePropertyMoveDialogComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-Plus',
      title: moveTitle,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_CONFIRM',
      buttonIconName: 'icon-Check-Square',
      context:
        group.consentDocuments &&
        group.consentDocuments?.length > 0 &&
        group.consentDocuments?.filter(x => x.document?.imageId).length > 0
          ? {
              groupTypeOptions: groupOptions,
              defaultSelect: group.groupId,
              collateralStatus: element.collateralCaseLexStatus,
              isShowWarning:
                element.collateralCaseLexStatus === CollateralCaseLexsStatus.PENDING_SALE ||
                element.collateralCaseLexStatus === CollateralCaseLexsStatus.ON_SALE,
              messageBanner:
                '<h6>ระวังเอกสารที่อัปโหลดไว้จะไม่ถูกบันทึก</h6>ทรัพย์นี้มีการอัปโหลดเอกสารยินยอมงดการขายแล้ว หากแก้ไข/ลบ ทรัพย์ เอกสารจะหายไป และจำเป็นต้องอัปโหลดใหม่',
            }
          : {
              groupTypeOptions: groupOptions,
              defaultSelect: group.groupId,
              collateralStatus: element.collateralCaseLexStatus,
            },
    });

    if (res) {
      try {
        this.logger.info('onEditProperty element', element);
        this.logger.info('onEditProperty res.targetGroup', res.targetGroup);

        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
          const mainContacts = item.contacts?.find((d, i) => d.isMainContact || i === 0);
          if (group?.groupId !== res.targetGroup) {
            if (mainContacts?.personId === group.groupId && item.assets && item.assets.length > 0) {
              item.assets = item.assets?.filter(d => d.assetId?.toString() !== element.assetId.toString());
            }

            if (mainContacts?.personId === res.targetGroup) {
              item.assets?.push(element);
            }
          }
        });
        this.withdrawnSeizurePropertyService.propertyForm.markAsTouched();
        this.initTableData();
        this.notificationService.openSnackbarSuccess(this.translate.instant('ย้ายทรัพย์สำเร็จ'));
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }

  navigateCorrectRoute(path: string) {
    const destination = this.withdrawnSeizurePropertyService.routeCorrection(path);
    console.log('destination', destination);
    this.routerService.navigateTo(destination);
  }
}
