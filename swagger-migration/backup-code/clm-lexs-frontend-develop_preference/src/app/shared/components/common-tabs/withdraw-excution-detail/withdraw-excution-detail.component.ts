import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { MENU_ROUTE_PATH } from '@app/shared/constant';
import { TMode, statusCode, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { NameValuePair, WithdrawWritOfExecResponse } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
@Component({
  selector: 'app-withdraw-excution-detail',
  templateUrl: './withdraw-excution-detail.component.html',
  styleUrls: ['./withdraw-excution-detail.component.scss'],
})
export class WithdrawExcutionDetailComponent implements OnInit {
  public isOpened: boolean = true;
  @Input() mode: TMode = 'VIEW';
  @Input() data!: WithdrawWritOfExecResponse;
  @Input() dataForm!: UntypedFormGroup;

  public withdrawWritOfExecReasonConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'COMMON.PLACEHOLDER_REASON_OF_EXECUTION',
    searchPlaceHolder: 'COMMON.PLACEHOLDER_SEARCH_REASON_OF_EXECUTION',
  };

  public withdrawWritOfExecReasonOptions: NameValuePair[] = [
    {
      name: this.translate.instant('COMMON.NO_RESIDUAL_DEBT'),
      value: '01',
    },
    {
      name: this.translate.instant('COMMON.LABEL_ETC'),
      value: '02',
    },
  ];

  public form!: UntypedFormGroup;
  public taskCode: taskCode | string = '';
  public statusCode: statusCode | string = '';
  public isFromTask: boolean = false;

  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private taskService: TaskService
  ) {
    this.isFromTask = this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.TASK);
  }

  ngOnInit() {
    if (this.mode == 'EDIT') {
      if (this.isFromTask) {
        this.statusCode = this.taskService.taskDetail.statusCode || '';
      }

      if (
        (this.statusCode === 'CORRECT_PENDING' || this.statusCode === 'PENDING') &&
        this.data.withdrawWritOfExecReason === '02'
      ) {
        this.dataForm.controls['withdrawWritOfExecReason'].setValue(this.data.withdrawWritOfExecReason);
        this.dataForm.controls['withdrawWritOfExecOtherReasonRemark'].setValue(
          this.data.withdrawWritOfExecOtherReasonRemark
        );
        this.onSelectedwithdrawWritOfExecReason('02');
      } else {
        this.dataForm.controls['withdrawWritOfExecReason'].setValue('01');
      }
    }
  }

  getControl(name: string): any {
    return this.dataForm.get(name);
  }

  async onSelectedwithdrawWritOfExecReason(data: string) {
    if (data == '02') {
      this.dataForm.get('withdrawWritOfExecOtherReasonRemark')?.setValidators(Validators.required);
      this.dataForm.get('withdrawWritOfExecOtherReasonRemark')?.updateValueAndValidity();
    } else {
      this.dataForm.get('withdrawWritOfExecOtherReasonRemark')?.clearValidators();
      this.dataForm.get('withdrawWritOfExecOtherReasonRemark')?.updateValueAndValidity();
    }
  }
}
