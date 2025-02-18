import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { CollateralDto, InquiryCollateralResponse } from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { mockCollateralDtos } from '../../preference-mock/mock-pref-data.const';
import { PreferenceService } from '../../preference.service';
import { ScenarioPreferenceEnum } from '../../preference.model';

@Component({
  selector: 'app-command-collateral-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  templateUrl: './command-collateral-dialog.component.html',
  styleUrl: './command-collateral-dialog.component.scss'
})
export class CommandCollateralDialogComponent {
  accountNo = '';
  public collateralColumns = [
    // เลขที่หลักประกัน
    'collateralNumber',
    // ประเภทหลัก
    'mainType',
    // ประเภทย่อย
    'subType',
    // เลขที่เอกสารสิทธิ์
    'documentNumber',
    // รายละเอียดทรัพย์
    'assetDetails',
    // สถานะหลักประกัน(LEXS)
    'statuscms',
    'status',

  ];
  //public collateralTableDataSource: CollateralDto[] = mockCollateralDtos;
   public collateralTableDataSource: InquiryCollateralResponse[] = []; // mockCollateralDtos;

  //inquiryCollaterals
  constructor(
      private preferenceService: PreferenceService,
    ) {

    }

  get currentScenario(){
    return this.preferenceService.currentScenario;
  }

  async dataContext(data: any) {
    this.accountNo = data?.accountNo;
    if(data.billNo)
      this.initData(data.billNo,data.preferenceGroupNo);
  }

  async initData(billNo: string, preferenceGroupNo: string){
    let arr_bill=[billNo];

    let mode: 'ADD' | 'VIEW' | 'EDIT' = 'VIEW';
    if(this.currentScenario === ScenarioPreferenceEnum.SCENARIO1){
      mode = 'ADD';
    }else if(this.currentScenario === ScenarioPreferenceEnum.SCENARIO3){
      mode = 'EDIT';
    }
    this.collateralTableDataSource = await this.preferenceService.inquiryCollaterals(arr_bill, mode, preferenceGroupNo);
  }
}
