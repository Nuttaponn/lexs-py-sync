import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { Dist, Prov, Subd } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-register-address-dialog',
  templateUrl: './register-address-dialog.component.html',
  styleUrls: ['./register-address-dialog.component.scss'],
})
export class RegisterAddressDialogComponent implements OnInit {
  public control: UntypedFormGroup = this.initForm();

  public districtOptions: Array<Dist> = [];
  public subDistrictOptions: Array<Subd> = [];
  public proviceOptions: Array<Prov> = [];

  public districtObj: Dist = {};
  public subdistrictObj: Subd = {};
  public proviceObj: Prov = {};

  public diableDropdownProvince: boolean = false;
  public disableDropdownDistrict: boolean = false;
  public disableDropdownSubdistrict: boolean = false;

  public configDistrict: DropDownConfig = this.getAddressConfig('DISTRICT');
  public configProvice: DropDownConfig = this.getAddressConfig('PROVICE');
  public configSubDistrict: DropDownConfig = this.getAddressConfig('SUB_DISTRICT');

  constructor(
    private masterDataService: MasterDataService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.initDropdown();
    this.setDefault();
  }

  initDropdown() {
    this.proviceOptions = this.masterDataService.provinceList;
    this.districtOptions = this.masterDataService.districtList;
    this.subDistrictOptions = this.masterDataService.subDistrictList;
  }

  setDefault() {
    this.initInfo();
    if (this.proviceObj.provinceDesc && this.districtObj.districtDesc && this.subdistrictObj.subdistrictDesc) {
      this.districtOptions = this.masterDataService.districtList.filter(
        (f: any) => f.provinceCode == this.control.get('provinceCode')?.value
      );
      this.subDistrictOptions = this.masterDataService.subDistrictList.filter(
        (f: any) =>
          f.districtCode == this.control.get('districtCode')?.value &&
          f.provinceCode == this.control.get('provinceCode')?.value
      );

      this.diableDropdownProvince = false;
      this.disableDropdownDistrict = false;
      this.disableDropdownSubdistrict = false;
    } else {
      this.control.get('provinceCode')?.setValue('');
      this.control.get('districtCode')?.setValue('');
      this.control.get('subdistrictCode')?.setValue('');

      this.diableDropdownProvince = false;
      this.disableDropdownDistrict = true;
      this.disableDropdownSubdistrict = true;
    }
    this.updateConfigDropdown();
  }

  updateConfigDropdown() {
    this.configDistrict = this.getAddressConfig('DISTRICT');
    this.configProvice = this.getAddressConfig('PROVICE');
    this.configSubDistrict = this.getAddressConfig('SUB_DISTRICT');
  }

  async dataContext(dataCtx: any) {
    const dto = dataCtx?.dto;
    if (!!dto) {
      this.control.get('addressLine')?.setValue(dto?.addressLine);
      this.control.get('provinceCode')?.setValue(dto?.provinceCode);
      this.control.get('districtCode')?.setValue(dto?.districtCode);
      this.control.get('subdistrictCode')?.setValue(dto?.subdistrictCode);
    }
  }

  initForm() {
    return this.fb.group({
      addressLine: ['', Validators.required],
      provinceCode: [null, Validators.required],
      districtCode: [null, Validators.required],
      subdistrictCode: [null, Validators.required],
      provinceName: [null, Validators.required],
      districtName: [null, Validators.required],
      subdistrictName: [null, Validators.required],
    });
  }

  getControl(name: string) {
    return this.control.get(name);
  }

  selectProvice(provinceCode: string) {
    let provice = this.proviceOptions.find(f => f.provinceCode === provinceCode);

    this.districtOptions = this.masterDataService.districtList.filter((f: any) => f.provinceCode == provinceCode);

    this.control.get('provinceCode')?.setValue(provice?.provinceCode);
    this.control.get('districtCode')?.setValue(null);
    this.control.get('subdistrictCode')?.setValue(null);

    this.diableDropdownProvince = false;
    this.disableDropdownDistrict = false;
    this.disableDropdownSubdistrict = true;
    this.updateConfigDropdown();
  }

  selectDistrict(districtCode: string) {
    this.subDistrictOptions = this.masterDataService.subDistrictList.filter(
      (f: any) => f.districtCode == districtCode && f.provinceCode == this.control.get('provinceCode')?.value
    );
    this.control.get('subdistrictCode')?.setValue(null);

    this.diableDropdownProvince = false;
    this.disableDropdownDistrict = false;
    this.disableDropdownSubdistrict = false;
    this.updateConfigDropdown();
  }

  selectSubDistrict(subdistrictCode: string) {
    let subdistrict = this.subDistrictOptions.find(f => f.subdistrictCode === subdistrictCode);
    this.control.get('subdistrictCode')?.setValue(subdistrict?.subdistrictCode);

    this.diableDropdownProvince = false;
    this.disableDropdownDistrict = false;
    this.disableDropdownSubdistrict = false;
    this.updateConfigDropdown();
  }

  initInfo() {
    this.proviceObj = this.proviceOptions.find(f => f.provinceCode === this.control.get('provinceCode')?.value) || {};
    this.districtObj =
      this.districtOptions.find(
        f =>
          f.districtCode == this.control.get('districtCode')?.value &&
          f.provinceCode == this.control.get('provinceCode')?.value
      ) || {};
    this.subdistrictObj =
      this.subDistrictOptions.find(
        f =>
          f.districtCode == this.control.get('districtCode')?.value &&
          f.provinceCode == this.control.get('provinceCode')?.value &&
          f.subdistrictCode == this.control.get('subdistrictCode')?.value
      ) || {};

    this.control.get('provinceName')?.setValue(this.proviceObj.provinceDesc);
    this.control.get('districtName')?.setValue(this.districtObj.districtDesc);
    this.control.get('subdistrictName')?.setValue(this.subdistrictObj.subdistrictDesc);
  }

  getAddressConfig(type: 'DISTRICT' | 'SUB_DISTRICT' | 'PROVICE'): DropDownConfig {
    if (type === 'PROVICE') {
      return {
        disableSelect: this.diableDropdownProvince,
        displayWith: 'provinceDesc',
        valueField: 'provinceCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }
    if (type === 'DISTRICT') {
      return {
        disableSelect: this.disableDropdownDistrict,
        displayWith: 'districtDesc',
        valueField: 'districtCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }
    if (type === 'SUB_DISTRICT') {
      return {
        disableSelect: this.disableDropdownSubdistrict,
        displayWith: 'subdistrictDesc',
        valueField: 'subdistrictCode',
        searchPlaceHolder: '',
        labelPlaceHolder: 'COMMON.LABEL_' + type,
      };
    }
    return {};
  }

  public async onClose() {
    this.initInfo();
    if (this.control.invalid) {
      this.control.markAllAsTouched();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    return this.control.getRawValue();
  }
}
