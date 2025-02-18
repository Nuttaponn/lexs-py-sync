import { coerceArray } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActionBar, WithDrawnSeizureConfig } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  Assets,
  Collaterals,
  Contacts,
  PersonForLitigationCaseDto,
  WithdrawSeizureCollateralInfo,
} from '@lexs/lexs-client';
import { DialogOptions } from '@spig/core';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
  WithdrawnPersonColumns,
} from '../withdrawn-seizure-property-select/withdrawn-seizure-property-select.model';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Component({
  selector: 'app-withdrawn-seizure-property-create-group',
  templateUrl: './withdrawn-seizure-property-create-group.component.html',
  styleUrls: ['./withdrawn-seizure-property-create-group.component.scss'],
})
export class WithdrawnSeizurePropertyCreateGroupComponent implements OnInit {
  public messageBanner: string = 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.GROUP_BANNER';
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    primaryText: 'ยืนยัน',
    primaryIcon: 'icon-save-primary',
    hasCancel: false,
    hasReject: false,
  };
  public tableConfig: WithDrawnSeizureConfig = {
    propertyConfig: {
      mode: 'EDIT',
      hasHeaderTitle: true,
      headerTitleText: 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.GROUP_CARD_TITLE',
      hasGroupDelete: false,
      hasAction: false,
      hasEditContact: true,
      hasViewContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: true,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      tableColumns: WithdrawnCollateralColumns,
      hasFilter: true,
      hasSumAppraisalValue: true,
      hasTotalSelect: true,
    },
    contactConfig: {
      hasHeaderTitle: true,
      hasAction: false,
      hasAdd: false,
      hasDelete: false,
      hasEdit: false,
      hasTitle: true,
    },
    assetConfig: {
      mode: 'EDIT',
      hasHeaderTitle: true,
      headerTitleText: 'รายการทรัพย์ที่จะยึด',
      hasGroupDelete: false,
      hasAction: false,
      hasEditContact: true,
      hasViewContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: true,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      tableColumns: WithdrawAssetColumns,
      hasFilter: true,
      hasSumAppraisalValue: true,
      hasTotalSelect: true,
    },
  };

  public collateralColumns: string[] = WithdrawnCollateralColumns;
  public lgPersonColumn: string[] = WithdrawnPersonColumns;
  public assetColumns: string[] = WithdrawAssetColumns;

  public collateralsSource: WithdrawSeizureCollateralInfo[] = [];
  public withdrawnContactPersonSource: PersonForLitigationCaseDto[] = [];

  public assetsSource: Assets[] = [];

  public contactTypeOptions: any[] = [];

  public selectContactId: string = '';
  public selectProperties: string[] = [];
  public selectAssets: string[] = [];
  public excluedItems: string[] = [];
  public excluedAssetItems: string[] = [];

  public tablePropertyControl = new UntypedFormControl(false);
  public tablePropertyAssetControl = new UntypedFormControl(false);
  public contactDDLControl = new UntypedFormControl('N/A', Validators.required);

  constructor(
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private routerService: RouterService,
    private notificationService: NotificationService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    console.log(
      'ngOnInit WithdrawnSeizurePropertyCreateGroupComponent',
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse
    );
    this.excluedItems = this.withdrawnSeizurePropertyService.withdrawnExcludeItems;
    this.excluedAssetItems = this.withdrawnSeizurePropertyService.withdrawnExcludeItemsAsset;
    this.tablePropertyControl.reset();
    this.tablePropertyAssetControl.reset();
    this.contactDDLControl.reset();
    //  this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {};
    console.log(
      'this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData',
      this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData
    );
    this.getCollateralTable();
    this.getAssetTable();
    this.getLitigationCasePersons();
    this.withdrawnSeizurePropertyService.withdrawSeizureId =
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse?.withdrawSeizureId || 0;
  }

  getCollateralTable() {
    if (
      this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol &&
      this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol.length > 0
    ) {
      this.withdrawnSeizurePropertyService.litigationCaseCollaterals.collaterals?.push(
        ...(this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol || [])
      );
    }
    let collatetals = coerceArray(this.withdrawnSeizurePropertyService.litigationCaseCollaterals.collaterals || []);
    if (collatetals.length > 0) {
      if (
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData &&
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups &&
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups.length > 0
      ) {
        let tempData =
          this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups?.flatMap(c => {
            return c.collaterals?.flatMap(n => n.collateralId);
          });
        console.log('tempData', tempData);
        collatetals = collatetals.filter(it => !tempData?.includes(it.collateralId));
      }
      if (
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse &&
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups &&
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups.length > 0
      ) {
        let tempDatas = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.flatMap(
          c => {
            return c.collaterals?.flatMap(n => n.collateralId);
          }
        );
        console.log('tempDatas', tempDatas);
        collatetals = collatetals.filter(it => !tempDatas?.includes(it.collateralId));
      }

      this.collateralsSource = collatetals.map(it => {
        return <WithdrawSeizureCollateralInfo>{
          ...it,
        };
      });
      console.log('const collatetals', collatetals);
    }
  }

  getAssetTable() {
    if (
      this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset &&
      this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset.length > 0
    ) {
      this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets?.push(
        ...(this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset || [])
      );
    }
    let assets = coerceArray(this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets || []);
    if (assets.length > 0) {
      if (
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData &&
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups &&
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups.length > 0
      ) {
        let tempData1 =
          this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups?.flatMap(c => {
            return c.assets?.flatMap(n => n.assetId?.toString());
          });
        console.log('tempData1', tempData1);
        assets = assets.filter(it => !tempData1?.includes(it.assetId?.toString()));
      }
      if (
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse &&
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups &&
        this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups.length > 0
      ) {
        let tempDatas = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.flatMap(
          c => {
            return c.assets?.flatMap(n => n.assetId?.toString());
          }
        );
        console.log('tempDatas', tempDatas);
        assets = assets.filter(it => !tempDatas?.includes(it.assetId?.toString()));
      }
      this.assetsSource = assets.map(it => {
        return <Assets>{
          ...it,
        };
      });
      console.log('const assets', assets);
    }
  }

  getLitigationCasePersons() {
    const excluedContactItems = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups
      ?.flatMap(it => it.contacts)
      .map(it => it?.personId);
    this.logger.info(excluedContactItems);

    this.withdrawnContactPersonSource =
      this.withdrawnSeizurePropertyService.litigationCasePersons.litigationCasePersons
        ?.filter(it => !excluedContactItems?.includes(it.person?.personId))
        .map(it => {
          const obj: PersonForLitigationCaseDto = {
            ...it.person,
            name: `${it.person?.firstName} ${it.person?.lastName}`,
          };
          return obj;
        }) || [];
  }

  onCancel() {
    if (
      this.tablePropertyControl.dirty ||
      this.tablePropertyControl.touched ||
      this.contactDDLControl.dirty ||
      this.contactDDLControl.touched ||
      this.tablePropertyAssetControl.dirty ||
      this.tablePropertyAssetControl.touched
    ) {
      this.openConfirmBackToEdit();
    } else {
      this.navigateCorrectRoute('assets-contacts-info-step');
    }
  }

  onSave() {
    console.log('onSave WithdrawnSeizurePropertyCreateGroupComponent');

    this.contactDDLControl.markAllAsTouched();
    if (this.selectProperties.length > 0 || this.selectAssets.length > 0) {
      this.tablePropertyControl.setErrors(null);
      this.tablePropertyAssetControl.setErrors(null);
    }
    if (this.selectProperties.length > 0) {
      this.tablePropertyControl.setValue(this.selectProperties.length > 0);
    }
    if (this.selectAssets.length > 0) {
      this.tablePropertyAssetControl.setValue(this.selectAssets.length > 0);
    }

    if (this.selectContactId && (this.selectProperties.length > 0 || this.selectAssets.length > 0)) {
      const selectedDataContact = this.withdrawnContactPersonSource
        .filter(d => d.personId === this.selectContactId)
        .map(con => {
          const obj: Contacts = {
            firstName: con.firstName,
            identificationNo: con.identificationNo,
            lastName: con.lastName,
            personId: con.personId,
            telephoneNo: con.telephoneNo,
            relation: con.relation,
            isMainContact: con.relation === 'MAIN_BORROWER',
          };
          return obj;
        });

      const selectedDataProperties =
        this.withdrawnSeizurePropertyService.litigationCaseCollaterals.collaterals
          ?.filter(d => this.selectProperties.includes(d.collateralId || ''))
          .map(it => {
            const obj: Collaterals = {
              ...it,
            };
            return obj;
          }) || [];
      const selectedDataPropertiesAsset =
        this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse.assets
          ?.filter(d => this.selectAssets.includes(d.assetId?.toString() || ''))
          .map(it => {
            const obj: Assets = {
              ...it,
            };
            return obj;
          }) || [];

      if (this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData?.withdrawSeizureGroups) {
        let data = {
          collaterals: [...selectedDataProperties],
          contacts: [...selectedDataContact],
          assets: [...selectedDataPropertiesAsset],
        };
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData.withdrawSeizureGroups?.push(data);
      } else {
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {
          // ...this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData,
          withdrawSeizureGroups: [
            {
              collaterals: [...selectedDataProperties],
              contacts: [...selectedDataContact],
              assets: [...selectedDataPropertiesAsset],
            },
          ],
        };
      }
      if (this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol) {
        this.withdrawnSeizurePropertyService.tempDataDeletedGroupCol = [];
      }
      if (this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset) {
        this.withdrawnSeizurePropertyService.tempDataDeletedGroupAsset = [];
      }
      this.notificationService.openSnackbarSuccess('บันทึกทรัพย์และผู้ติดต่อแล้ว');
      this.navigateCorrectRoute('assets-contacts-info-step');
    } else {
      if (this.selectProperties.length === 0 && this.selectAssets.length === 0) {
        this.tablePropertyControl.setErrors({ incorrect: true });
        this.tablePropertyAssetControl.setErrors({ incorrect: true });
        this.tablePropertyControl.markAllAsTouched();
        this.tablePropertyAssetControl.markAllAsTouched();
      }
    }
  }

  updateSelectContact(event: any) {
    console.log('updateSelectData WithdrawnSeizurePropertyCreateGroupComponent', event);
    console.log('updateSelectData WithdrawnSeizurePropertyCreateGroupComponent', this.contactTypeOptions);
    this.contactDDLControl.markAllAsTouched();
    this.selectContactId = event;
  }

  updateSelectProperty(event: SelectionModel<string>) {
    console.log('updateSelectProperty WithdrawnSeizurePropertyCreateGroupComponent', event.selected);
    this.tablePropertyControl.markAllAsTouched();
    this.selectProperties = event.selected;
    this.tablePropertyControl.setValue(this.selectProperties.length > 0);
  }

  updateSelectPropertyAsset(event: SelectionModel<string>) {
    console.log('updateSelectAsset WithdrawnSeizurePropertyCreateGroupComponent', event.selected);
    this.tablePropertyAssetControl.markAllAsTouched();
    this.selectAssets = event.selected;
    this.tablePropertyAssetControl.setValue(this.selectAssets.length > 0);
  }

  private async openConfirmBackToEdit() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'COMMON.EXIT_WITHOUT_SAVE',
      buttonIconName: 'icon-Arrow-Revert',
      rightButtonClass: 'primary',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'COMMON.EXIT_WITHOUT_SAVE',
      'มีการแก้ไขข้อมูลที่ยังไม่ได้ถูกบันทึก<br>คุณต้องการที่จะออกโดยไม่มีการบันทึกใช่หรือไม่?',
      optionsDialog
    );

    if (!res) return;
    try {
      this.navigateCorrectRoute('assets-contacts-info-step');
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  private navigateCorrectRoute(path: string) {
    const destination = this.withdrawnSeizurePropertyService.routeCorrection(path);
    this.routerService.navigateTo(destination, { skipUpdate: true });
  }
}
