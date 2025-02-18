import { Injectable } from '@angular/core';
import { Utils } from '@app/shared/utils/util';
import { CollateralDto, CollateralSubTypeDto, ExternalAssetStatusDto } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { CollateralDtoHide } from './collateral.constant';

@Injectable({
  providedIn: 'root',
})
export class CollateralInfoService {
  private _assets: Array<CollateralDtoHide> = [];
  private _externalAssetStatus!: ExternalAssetStatusDto;
  private _collateralSubType!: CollateralSubTypeDto;
  count: number = 0;

  constructor() {}

  get externalAssetStatus(): ExternalAssetStatusDto {
    return this._externalAssetStatus;
  }

  set externalAssetStatus(_value: ExternalAssetStatusDto) {
    this._externalAssetStatus = _value;
  }

  get collateralSubType(): CollateralSubTypeDto {
    return this._collateralSubType;
  }

  set collateralSubType(_value: CollateralSubTypeDto) {
    this._collateralSubType = _value;
  }

  get currentAssets(): Array<CollateralDtoHide> {
    return this._assets;
  }

  set currentAssets(asset: Array<CollateralDto> | any) {
    const dataTable = this.mappingDataToTable(asset);
    this._assets = dataTable;
  }

  set addAsset(asset: Array<CollateralDto> | any) {
    const dataTable = this.addAssetData(asset);

    const data = this.mapToModel(dataTable);
    this._assets = Utils.deepClone(data);
  }

  set updateAsset(asset: CollateralDto | any) {
    const data = this.updateAssetData(asset);
    this._assets = Utils.deepClone(data);
  }

  getAddressConfig(type: 'DISTRICT' | 'SUB_DISTRICT' | 'PROVICE'): DropDownConfig {
    if (type === 'PROVICE') {
      return {
        displayWith: 'provinceDesc',
        valueField: 'provinceCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }
    if (type === 'DISTRICT') {
      return {
        displayWith: 'districtDesc',
        valueField: 'districtCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }
    if (type === 'SUB_DISTRICT') {
      return {
        displayWith: 'subdistrictDesc',
        valueField: 'subdistrictCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }

    return {};
  }

  mappingDataToTable(colList: any): Array<CollateralDtoHide> {
    let list: Array<any> = [];
    let object: Array<any> = [];
    object = colList?.reduce(
      (groups: any, item: any) => ({
        ...groups,

        [item?.collateralTypeCode]: [...(groups[item?.collateralTypeCode] || []), { ...item, hide: false }],
      }),
      {}
    );

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        const totalPages: any = element.length / 10;
        let obj: CollateralDtoHide = {
          data: element.length > 10 ? element.slice(0, 10) : element,
          collateralTypeCode: key,
          collateralTypeDesc: element[0].collateralTypeDesc,
          hide: false,
          totalElements: element.length,
          totalPages: element.length % 10 == 0 ? totalPages : parseInt(totalPages + 1),
          _data: element,
          currentPage: 1,
          fromIndex: 1,
          toIndex: 10,
          dataFilter: element,
        };

        list.push(obj);
      }
    }

    return list;
  }

  addAssetData(colList: any) {
    let list: Array<any> = [];
    for (const key in colList) {
      if (Object.prototype.hasOwnProperty.call(colList, key)) {
        const element = colList[key];
        element.collateralId = this.count++;
        let obj: CollateralDtoHide = {
          data: [element],
          collateralTypeCode: element.collateralTypeCode,
          collateralTypeDesc: element.collateralTypeDesc,
          hide: false,
          currentPage: 1,
          fromIndex: 1,
          toIndex: 10,
        };

        list.push(obj);
      }
    }

    return list;
  }

  updateAssetData(uDate: any) {
    let assets = this._assets;
    let sId = assets.findIndex(f => f.collateralTypeCode === uDate[0].collateralTypeCode);
    if (sId > -1) {
      let colId = assets[sId].data.findIndex(f => f.collateralId === uDate[0].collateralId);
      if (colId > -1) {
        assets[sId].data[colId] = { ...uDate[0] };
      }
    }
    return assets;
  }

  mapToModel(newAsset: any) {
    let asset = this._assets;
    let find = asset.findIndex((f: any) => f.collateralTypeCode === newAsset[0].collateralTypeCode);
    if (find > -1) {
      asset[find].data.push(newAsset[0].data[0]);
    } else {
      if (asset.length === 0) {
        asset = newAsset;
      } else {
        asset.push(newAsset[0]);
      }
    }

    return asset;
  }
}
