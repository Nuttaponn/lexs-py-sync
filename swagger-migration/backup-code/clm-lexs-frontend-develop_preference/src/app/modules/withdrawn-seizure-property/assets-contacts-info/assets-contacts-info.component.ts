import { Component, OnInit } from '@angular/core';
import { WithDrawnSeizureConfig } from '@app/shared/models';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
  WithdrawnPersonColumns,
} from '../withdrawn-seizure-property-select/withdrawn-seizure-property-select.model';
import { WithdrawnSeizureViewModel } from '../withdrawn-seizure-property.model';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Component({
  selector: 'app-assets-contacts-info',
  templateUrl: './assets-contacts-info.component.html',
  styleUrls: ['./assets-contacts-info.component.scss'],
})
export class AssetsContactsInfoComponent implements OnInit {
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

  constructor(private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService) {}

  ngOnInit(): void {
    // initTableData
    this.propertyDataSources = [];
    this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach((item, i) => {
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
        console.log('item', item);
        this.propertyDataSources.push({
          index: i,
          groupName: groupName,
          groupId: groupId,
          collaterals: [...(item?.collaterals || [])],
          asset: [...(item?.assets || [])],
          contactPersons: [...(item?.contacts || [])],
          consentDocuments: [...(item?.consentDocuments || [])],
        });
      }
    });

    console.log('this.propertyDataSources', this.propertyDataSources);
  }
}
