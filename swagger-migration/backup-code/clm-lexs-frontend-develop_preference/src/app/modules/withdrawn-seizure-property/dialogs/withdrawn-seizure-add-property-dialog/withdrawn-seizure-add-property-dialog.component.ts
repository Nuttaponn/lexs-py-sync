import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { WithDrawnSeizureConfig } from '@app/shared/models';
import { Assets, WithdrawSeizureCollateralInfo } from '@lexs/lexs-client';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
} from '../../withdrawn-seizure-property-select/withdrawn-seizure-property-select.model';
import { UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'app-withdrawn-seizure-add-property-dialog',
  templateUrl: './withdrawn-seizure-add-property-dialog.component.html',
  styleUrls: ['./withdrawn-seizure-add-property-dialog.component.scss'],
})
export class WithdrawnSeizureAddPropertyDialogComponent implements OnInit {
  public collateralColumns: string[] = [];
  public assetColumns: string[] = [];

  public collaterals: WithdrawSeizureCollateralInfo[] = [];
  public assets: Assets[] = [];
  public tablePropertyControl = new UntypedFormControl(false);
  public tablePropertyAssetControl = new UntypedFormControl(false);

  public tableConfig: WithDrawnSeizureConfig = {
    propertyConfig: {
      mode: 'ADD',
      hasAction: false,
      hasViewContact: false,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: true,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawnCollateralColumns,
    },
    assetConfig: {
      mode: 'ADD',
      hasAction: false,
      hasViewContact: false,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: true,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawAssetColumns,
    },
    contactConfig: {},
    tabCollapse: false,
  };
  public excludeItems: string[] = [];
  public excludeItemsAsset: string[] = [];
  public defaultSelectItems: string[] = [];
  public defaultSelectItemsAsset: string[] = [];
  public selectProperties: string[] = [];
  public selectPropertiesAsset: string[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit WithdrawnSeizureAddPropertyDialogComponent');
    this.tablePropertyControl.reset();
    this.tablePropertyAssetControl.reset();
  }

  dataContext(data: any) {
    console.log('dataContext WithdrawnSeizureAddPropertyDialogComponent', data);
    this.collateralColumns = data.collateralColumns;
    this.collaterals = data.collaterals;
    this.excludeItems = data.excludeItems;
    this.assetColumns = data.assetColumns;
    this.excludeItemsAsset = data.excludeItemsAsset;
    this.defaultSelectItems = data.defaultSelectItems;
    this.defaultSelectItemsAsset = data.defaultSelectItemsAsset;
    this.assets = data.assets;
  }

  public async onClose(): Promise<boolean> {
    console.log('onClose WithdrawnSeizureAddPropertyDialogComponent');
    if (this.selectProperties.length > 0 || this.selectPropertiesAsset.length > 0) {
      this.tablePropertyControl.setErrors(null);
      this.tablePropertyAssetControl.setErrors(null);
    }

    if (this.selectProperties.length > 0) {
      this.tablePropertyControl.setValue(this.selectProperties.length > 0);
    }
    if (this.selectPropertiesAsset.length > 0) {
      this.tablePropertyAssetControl.setValue(this.selectPropertiesAsset.length > 0);
    }

    if (this.selectProperties.length > 0 || this.selectPropertiesAsset.length > 0) {
      return true;
    } else {
      this.tablePropertyControl.setErrors({ incorrect: true });
      this.tablePropertyAssetControl.setErrors({ incorrect: true });
      this.tablePropertyControl.markAllAsTouched();
      this.tablePropertyAssetControl.markAllAsTouched();
      return false;
    }
  }

  get returnData() {
    return {
      selectProperties: this.collaterals?.filter(data => this.selectProperties.includes(data.collateralId || '')),
      selectPropertiesAsset: this.assets?.filter(data =>
        this.selectPropertiesAsset.includes(data.assetId?.toString() || '')
      ),
    };
  }
  updateSelectProperty(event: SelectionModel<string>) {
    console.log('updateSelectProperty WithdrawnSeizurePropertyCreateGroupComponent', event.selected);
    this.tablePropertyControl.markAllAsTouched();
    this.selectProperties = event.selected;
    this.tablePropertyControl.setValue(this.selectProperties.length > 0);
  }

  updateSelectPropertyAsset(event: SelectionModel<string>) {
    console.log('updateSelectProperty WithdrawnSeizurePropertyCreateGroupComponent', event.selected);
    this.tablePropertyAssetControl.markAllAsTouched();
    this.selectPropertiesAsset = event.selected;
    this.tablePropertyAssetControl.setValue(this.selectPropertiesAsset.length > 0);
  }
}
