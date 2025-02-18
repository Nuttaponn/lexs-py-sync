import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';
import { CollSubType } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { TYPE_CODE } from '../collateral.constant';
import { CollateralInfoService } from '../collateral-info.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() control!: UntypedFormGroup;
  public collateralSubTypeOption: Array<CollSubType> = [];
  accoutType: DropDownConfig = {
    displayWith: 'collateralSubTypeDesc',
    valueField: 'collateralSubTypeCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทบัญชี',
  };

  @Input() mode: string = '';
  MODE = Mode;

  constructor(private collateralInfoService: CollateralInfoService) {}

  async ngOnInit(): Promise<void> {
    let subType = this.collateralInfoService.collateralSubType;
    this.collateralSubTypeOption = subType.collateralSubType?.filter(
      f => f.collateralTypeCode === TYPE_CODE.ACCOUNT
    ) as Array<CollSubType>;
  }

  getControl(name: string) {
    return this.control.get(name);
  }
}
