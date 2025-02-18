import { Component, OnInit } from '@angular/core';
import {
  AssetInvestigationLitigationCaseCreateInfoResponse,
  AssetInvestigationLitigationInfoResponse,
  LitigationCaseShortDto,
} from '@lexs/lexs-client';
import { LitigationCaseService } from '@shared/services/litigation-case.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { InvestigatePropertyService } from '../investigate-property.service';
import { taskCode } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import { TaskService } from '@app/modules/task/services/task.service';

@Component({
  selector: 'app-investigate-property-command',
  templateUrl: './investigate-property-command.component.html',
  styleUrls: ['./investigate-property-command.component.scss'],
})
export class InvestigatePropertyCommandComponent implements OnInit {
  public form!: UntypedFormGroup;
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public caseDetailTitle = 'INVESTIGATE_PROPERTY.CASE_DETAIL';
  public mode = '';
  public isViewMode = false;
  public assetInvestigationCreateInfo!:
    | AssetInvestigationLitigationCaseCreateInfoResponse
    | AssetInvestigationLitigationInfoResponse;
  public dropDownOption: SimpleSelectOption[] = [
    { value: '1', text: 'ไม่มีทรัพย์จำนอง' },
    { value: '2', text: 'ขายทรัพย์แล้วไม่พอชำระหนี้' },
    { value: '3', text: 'ฟ้องล้มละลาย' },
    { value: '4', text: 'ปรับโครงสร้างหนี้' },
    { value: '5', text: 'ขายหนี้' },
    { value: '6', text: 'อื่นๆ' },
  ];
  public ddlConfig: DropDownConfig = {
    disableSelect: false,
    displayWith: 'text',
    valueField: 'value',
    iconName: '',
    labelPlaceHolder: 'INVESTIGATE_PROPERTY.REASON_FOR_INVESTIGATION',
  };
  constructor(
    private litigationCaseService: LitigationCaseService,
    private investigatePropertyService: InvestigatePropertyService,
    private sessionService: SessionService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.isViewMode = !this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
    if (this.investigatePropertyService?.taskCode === taskCode.R2E03_01_01) {
      this.assetInvestigationCreateInfo = this.investigatePropertyService.assetInvestigationInfo;
      this.investigatePropertyService.assetInvestigationForm =
        this.investigatePropertyService.getAssetInvestigationForm(
          this.investigatePropertyService.assetInvestigationInfo
        );
    } else {
      this.assetInvestigationCreateInfo = this.investigatePropertyService.assetInvestigationCreateInfo;
      this.investigatePropertyService.assetInvestigationForm =
        this.investigatePropertyService.getAssetInvestigationForm(
          this.investigatePropertyService.assetInvestigationCreateInfo
        );
    }

    this.form = this.investigatePropertyService.assetInvestigationForm;
    this.form?.get('reasonCode')?.valueChanges.subscribe(val => {
      if (val === '6') {
        this.form.get('remark')?.setValidators(Validators.required);
      } else {
        this.form.get('remark')?.clearValidators();
      }
      this.form.get('remark')?.updateValueAndValidity();
    });
  }

  getControl(name: string): UntypedFormControl {
    return this.form?.get(name) as UntypedFormControl;
  }
}
