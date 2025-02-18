import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SeizurePropertyService } from '@app/modules/seizure-property/seizure-property.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseShortDto, NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-responsible-lawyer',
  templateUrl: './responsible-lawyer.component.html',
  styleUrls: ['./responsible-lawyer.component.scss'],
})
export class ResponsibleLawyerComponent implements OnInit {
  @Input() mode: TMode = 'VIEW';
  @Input() data!: LitigationCaseShortDto; // for render static data (view mode) from BE
  @Input() dataForm!: UntypedFormGroup; // for render editable data (edit mode) from BE
  @Input() labelLawyer: string = 'ทนายความผู้รับผิดชอบ';
  @Input() isOpened: boolean = true;
  @Input() hasExpand: boolean = true;

  @Output() onOpenExpansion = new EventEmitter();

  public responLawyerOptions: NameValuePair[] = [];
  public responLawyerConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'ทนายความผู้รับผิดชอบ',
    searchPlaceHolder: 'โปรดเลือกทนายความผู้รับผิดชอบ',
  };

  constructor(
    private userService: UserService,
    private seizurePropertyService: SeizurePropertyService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    if (this.mode !== 'VIEW') {
      this.responLawyerOptions = this.userService.kLawyerUserOptions.map(i => {
        let nameValuePair: NameValuePair = {
          name: `${i.userId} - ${i.name} ${i.surname}`,
          value: i.userId,
        };
        return nameValuePair;
      });
    } else {
      this.responLawyerOptions = [];
    }
  }

  selectLawyer() {
    if ([taskCode.R2E05_06_3F, taskCode.R2E05_09_4].includes(this.taskService.taskDetail.taskCode as taskCode)) {
      this.seizurePropertyService.hasEdit = true;
    }
  }

  openExpansion() {
    this.onOpenExpansion.emit();
  }
}
