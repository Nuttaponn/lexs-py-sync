import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';
import { CollSubType, Dist, Prov, Subd } from '@lexs/lexs-client';
import { MasterDataService } from '@shared/services/master-data.service';
import { DropDownConfig } from '@spig/core';
import { CollateralInfoService } from '../collateral-info.service';
import { TYPE_CODE } from '../collateral.constant';

@Component({
  selector: 'app-land-info',
  templateUrl: './land-info.component.html',
  styleUrls: ['./land-info.component.scss'],
})
export class LandInfoComponent implements OnInit, OnChanges {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  @Input() collateralTypeCode: string = '';
  MODE = Mode;
  TYPE_CODE = TYPE_CODE;

  public districtOptions: Array<Dist> = [];
  public subDistrictOptions: Array<Subd> = [];
  public proviceOptions: Array<Prov> = [];
  public collSubTypeOptions: Array<CollSubType> = [];
  public configCollSubType: DropDownConfig = {
    displayWith: 'collateralSubTypeDesc',
    valueField: 'collateralSubTypeCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'CUSTOMER.TYPE_LICENSE',
  };
  public configDistrict: DropDownConfig = this.collateralInfoTabService.getAddressConfig('DISTRICT');
  public configSubDistrict: DropDownConfig = this.collateralInfoTabService.getAddressConfig('SUB_DISTRICT');
  public configProvice: DropDownConfig = this.collateralInfoTabService.getAddressConfig('PROVICE');

  constructor(
    private collateralInfoTabService: CollateralInfoService,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.initDropdown();
    if (this.mode == Mode.EDIT || this.mode == Mode.VIEW) {
      this.setDefault();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['mode']) {
      this.setDefault();
    }
  }

  getControl(name: string) {
    return this.control.get(name);
  }

  setDefault() {
    this.districtOptions = this.masterDataService.districtList.filter(
      (f: any) => f.provinceCode == this.control.get('provinceCode')?.value
    );
    this.subDistrictOptions = this.masterDataService.subDistrictList.filter(
      (f: any) =>
        f.districtCode == this.control.get('districtCode')?.value &&
        f.provinceCode == this.control.get('provinceCode')?.value
    );
  }

  initDropdown() {
    this.proviceOptions = this.masterDataService.provinceList;
    this.districtOptions = this.masterDataService.districtList;
    this.subDistrictOptions = this.masterDataService.subDistrictList;
    let subType = this.collateralInfoTabService.collateralSubType;
    this.collSubTypeOptions = subType.collateralSubType?.filter(
      f => f.collateralTypeCode === this.collateralTypeCode
    ) as Array<CollSubType>;
    if (this.mode == Mode.VIEW) {
      let sub: any = this.collSubTypeOptions.find(
        (f: any) => f.collateralSubTypeCode === this.control.get('collateralSubTypeCode')?.value
      );
      this.control.get('collateralSubTypeDesc')?.setValue(sub?.collateralSubTypeDesc);
    }
  }

  selectProvice(provinceCode: string) {
    let provice = this.proviceOptions.find(f => f.provinceCode === provinceCode);

    this.districtOptions = this.masterDataService.districtList.filter((f: any) => f.provinceCode == provinceCode);

    this.control.get('districtCode')?.setValue(null);
    this.control.get('district')?.setValue(null);
    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('province')?.setValue(provice?.provinceDesc);
  }
  selectDistrict(districtCode: string) {
    let district = this.districtOptions.find(f => f.districtCode === districtCode);
    this.subDistrictOptions = this.masterDataService.subDistrictList.filter(
      (f: any) => f.districtCode == districtCode && f.provinceCode == this.control.get('provinceCode')?.value
    );

    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('subDistrict')?.setValue(null);
    this.control.get('district')?.setValue(district?.districtDesc);
  }

  selectSubDistrict(subdistrictCode: string) {
    let subdistrict = this.subDistrictOptions.find(f => f.subdistrictCode === subdistrictCode);
    this.control.get('subDistrict')?.setValue(subdistrict?.subdistrictDesc);
  }
}
