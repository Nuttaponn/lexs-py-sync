import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';
import { Dist, NameValuePair, Prov, Subd } from '@lexs/lexs-client';
import { MasterDataService } from '@shared/services/master-data.service';
import { DropDownConfig } from '@spig/core';
import { CollateralInfoService } from '../collateral-info.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
})
export class SalaryComponent implements OnInit {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  MODE = Mode;

  public juristicType: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทนิติบุคคล',
  };
  public districtOptions: Array<Dist> = [];
  public subDistrictOptions: Array<Subd> = [];
  public proviceOptions: Array<Prov> = [];
  public juristicTypeOption: Array<NameValuePair> = [];
  public configDistrict: DropDownConfig = this.collateralInfoTabService.getAddressConfig('DISTRICT');
  public configSubDistrict: DropDownConfig = this.collateralInfoTabService.getAddressConfig('SUB_DISTRICT');
  public configProvice: DropDownConfig = this.collateralInfoTabService.getAddressConfig('PROVICE');

  mappingEmployerType: { [key: string]: string } = {
    '': '-',
  };

  constructor(
    private collateralInfoTabService: CollateralInfoService,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    this.initDropdown();
    if (this.mode == Mode.EDIT || this.mode == Mode.VIEW) {
      this.setDefault();
    }
    this.getJuType();
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

  async getJuType() {
    let juType = await this.masterDataService.juristicType();
    this.juristicTypeOption = juType.juristicType as Array<NameValuePair>;

    for (let obj of this.juristicTypeOption) {
      this.mappingEmployerType[obj.value ?? ''] = obj.name ?? '-';
    }
  }

  getControl(name: string) {
    return this.control.get(name);
  }

  initDropdown() {
    this.proviceOptions = this.masterDataService.provinceList;
    this.districtOptions = this.masterDataService.districtList;
    this.subDistrictOptions = this.masterDataService.subDistrictList;
  }

  selectProvice(provinceCode: string) {
    const provice = this.proviceOptions.find(f => f.provinceCode === provinceCode);

    this.districtOptions = this.masterDataService.districtList.filter((f: any) => f.provinceCode == provinceCode);

    this.control.get('districtCode')?.setValue(null);
    this.control.get('district')?.setValue(null);
    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('province')?.setValue(provice?.provinceDesc);
  }
  selectDistrict(districtCode: string) {
    const district = this.districtOptions.find(f => f.districtCode === districtCode);
    this.subDistrictOptions = this.masterDataService.subDistrictList.filter(
      (f: any) => f.districtCode == districtCode && f.provinceCode == this.control.get('provinceCode')?.value
    );

    this.control.get('subdistrictCode')?.setValue(null);
    this.control.get('subDistrict')?.setValue(null);
    this.control.get('district')?.setValue(district?.districtDesc);
  }
  selectSubDistrict(subdistrictCode: string) {
    const subdistrict = this.subDistrictOptions.find(f => f.subdistrictCode === subdistrictCode);
    this.control.get('subDistrict')?.setValue(subdistrict?.subdistrictDesc);
  }
}
