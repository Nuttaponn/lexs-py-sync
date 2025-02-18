import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { LexsUserTransferOption, NameValuePair, TaskTransferRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import { SelectedInfo } from '../../../../modules/task/task.interface';

@Component({
  selector: 'app-transfer-reason-dialog',
  templateUrl: './transfer-reason-dialog.component.html',
  styleUrls: ['./transfer-reason-dialog.component.scss'],
})
export class TransferReasonDialogComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private taskService: TaskService
  ) {}

  // common
  public taskCount!: number;
  public menu!: string;
  public control!: UntypedFormGroup;
  public msgBanner = '';

  // for task
  public selectedUser: string = '';
  private selectedInfo: SelectedInfo = {};

  // for finance expense
  public config: DropDownConfig = {
    labelPlaceHolder: 'TRANSFER_DIALOG.RECIPIENT',
    displayWith: 'name',
    valueField: 'value',
  };
  public options: NameValuePair[] = [];

  ngOnInit() {
    if (this.menu === 'FINANCE_EXPENSE') {
      this.getTransferTaskUserOption();
    }
  }

  async dataContext(data: any) {
    this.menu = data.menu;
    this.taskCount = data.taskCount;
    this.control = this.setFormCtrl();
    switch (this.menu) {
      case 'TASK':
        this.selectedUser = data.selectedUser;
        this.selectedInfo = data.selectedInfo;
        this.msgBanner = this.translate.instant('TRANSFER_DIALOG.MSG_BANNER_TRANSFER_TASK_1', {
          TASKCOUNT: this.taskCount,
          USER: `${this.selectedUser}-${this.selectedInfo.title}${this.selectedInfo.name} ${this.selectedInfo.surname}`,
        });
        break;
      case 'FINANCE_EXPENSE':
        this.control.get('taskIds')?.setValue(data.taskSelected);
        this.control.get('taskIds')?.updateValueAndValidity();
        this.msgBanner = this.translate.instant('TRANSFER_DIALOG.MSG_BANNER_TRANSFER_TASK_2', {
          TASKCOUNT: this.taskCount,
        });
        break;
      default:
        break;
    }
  }

  setFormCtrl() {
    switch (this.menu) {
      case 'TASK':
        return this.fb.group({
          note: '',
        });
      case 'FINANCE_EXPENSE':
        return this.fb.group({
          note: ['', Validators.required],
          targetUserId: ['', Validators.required],
          taskIds: [[], Validators.required],
        });
      default:
        return this.fb.group({});
    }
  }

  async onClose() {
    switch (this.menu) {
      case 'TASK':
        return this.returnData;
      case 'FINANCE_EXPENSE':
        if (this.control.invalid) {
          this.control.markAllAsTouched();
          return false;
        } else {
          const request = this.control.getRawValue() as TaskTransferRequest;
          const response = await this.taskService.transferExpenseTask(request);
          if (response === null) {
            return this.returnData;
          } else {
            return false;
          }
        }
      default:
        return false;
    }
  }

  get returnData() {
    switch (this.menu) {
      case 'TASK':
        return {
          selectedUser: this.selectedUser,
          note: this.control.get('note')?.value,
        };
      case 'FINANCE_EXPENSE':
        return this.options.find(item => item.value === this.control.get('targetUserId')?.value)?.name;
      default:
        return false;
    }
  }

  getTransferTaskUserOption() {
    const userOptions: LexsUserTransferOption[] = this.taskService.transferUserOption || [];
    this.options = userOptions?.map(item => {
      return {
        name: `${item.userId} - ${item.name} ${item.surname}`,
        value: item.userId,
      } as NameValuePair;
    });
  }
}
