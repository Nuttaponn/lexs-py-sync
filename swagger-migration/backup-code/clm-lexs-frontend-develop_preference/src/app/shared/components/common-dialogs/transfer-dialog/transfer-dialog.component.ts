import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { TaskService } from '@app/modules/task/services/task.service';
import { SelectedInfo } from '@app/modules/task/task.interface';
import { UserService } from '@app/modules/user/user.service';
import { LexsUserTransferOption, TaskUserRequest } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss'],
})
export class TransferDialogComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  public isSubmited = false;
  public displayedColumns: string[] = ['radio', 'userId', 'name', 'roleName'];
  public taskCount!: number;
  private taskSelected!: Array<number>;
  public searchInput = new UntypedFormControl('', Validators.minLength(3));
  public selection = new SelectionModel<any>(false, []);
  public dataSource: Array<LexsUserTransferOption> = [];
  private selectedInfo: SelectedInfo = {};

  // Filter
  public roleFilterConfig: DropDownConfig = {
    labelPlaceHolder: 'TRANSFER_DIALOG.TRANSFER_ALL_ROLES',
    iconName: 'icon-Sorting',
  };
  public roleFilterControl = new UntypedFormControl('');
  public roleFilterOptions = this.userService.currentRole.map(r => ({
    value: r.roleCode,
    text: r.roleName,
  }));

  dataContext(data: any) {
    this.taskSelected = data.taskSelected;
    this.taskCount = data.taskCount;
  }

  async ngOnInit() {
    this.dataSource = await this.getEligibleUsers(this.searchInput.value, this.roleFilterControl.value);
  }

  async getEligibleUsers(keywords: string, roleCode: string) {
    const _request: TaskUserRequest = {
      keyword: keywords,
      roleCode: roleCode,
      taskIds: this.taskSelected,
    };
    this.taskService.transferUserOption = await this.taskService.transferTaskUserOption(_request);
    return this.taskService.transferUserOption;
  }

  async onClose() {
    this.isSubmited = true;
    if (this.selection.selected.length > 0) {
      return {
        selectedUser: this.selection.selected,
        selectedInfo: this.selectedInfo,
      };
    } else {
      return false;
    }
  }

  get returnData() {
    return {
      selectedUser: this.selection.selected,
      selectedInfo: this.selectedInfo,
    };
  }

  async submitSearch() {
    if (this.searchInput.valid) {
      this.dataSource = await this.getEligibleUsers(this.searchInput.value, this.roleFilterControl.value);
    }
  }

  async onRoleFilterSelect(value: string) {
    this.dataSource = await this.getEligibleUsers(this.searchInput.value, value);
  }

  onSelectUser(event: MatRadioChange, element: LexsUserTransferOption) {
    this.selection.select(event.value);
    this.selectedInfo = { title: element.title || '', name: element.name || '', surname: element.surname || '' };
  }
}
