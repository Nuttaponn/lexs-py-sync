import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';
import { CollSubType } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { TYPE_CODE } from '../collateral.constant';
import { CollateralInfoService } from '../collateral-info.service';

@Component({
  selector: 'app-bond',
  templateUrl: './bond.component.html',
  styleUrls: ['./bond.component.scss'],
})
export class BondComponent implements OnInit {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  MODE = Mode;
  public collSubTypeOptions: Array<CollSubType> = [];
  public configCollSubType: DropDownConfig = {
    displayWith: 'collateralSubTypeDesc',
    valueField: 'collateralSubTypeCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'CUSTOMER.BOND_TYPE',
  };
  constructor(private collateralInfoService: CollateralInfoService) {}

  ngOnInit() {
    this.initDropdown();
  }

  initDropdown() {
    let subType = this.collateralInfoService.collateralSubType;
    this.collSubTypeOptions = subType.collateralSubType?.filter(
      f => f.collateralTypeCode === TYPE_CODE.BOND
    ) as Array<CollSubType>;
    if (this.mode == Mode.VIEW) {
      let sub: any = this.collSubTypeOptions.find(
        (f: CollSubType) => f.collateralSubTypeCode === this.control.get('collateralSubTypeCode')?.value
      );
      this.control.get('collateralSubTypeDesc')?.setValue(sub?.collateralSubTypeDesc);
    }
  }

  getControl(name: string) {
    return this.control.get(name);
  }
}
