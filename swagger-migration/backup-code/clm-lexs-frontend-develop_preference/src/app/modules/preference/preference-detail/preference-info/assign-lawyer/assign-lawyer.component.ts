import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PreferenceHeaderComponent } from '@app/modules/preference/preference-component/preference-header/preference-header.component';
import { ModeCompEnum } from '@app/modules/preference/preference.model';
import { PreferenceService } from '@app/modules/preference/preference.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { LoggerService } from '@app/shared/services/logger.service';
import { SharedModule } from '@app/shared/shared.module';
import { NameValuePair, PreferenceDetails, ShotLexsUser } from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownConfig, SpigCoreModule, SpigShareModule } from '@spig/core';

interface extendDropDownConfig extends ShotLexsUser{
  txtDisplay?: string;
}

@Component({
  selector: 'app-assign-lawyer',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    PreferenceHeaderComponent,
  ],
  templateUrl: './assign-lawyer.component.html',
  styleUrl: './assign-lawyer.component.scss'
})
export class AssignLawyerComponent implements OnInit {

  @Input() mode: ModeCompEnum = ModeCompEnum.VIEW;

  taskId: number = 0;
  lawyerList: extendDropDownConfig[] = [];
  dataForm!: UntypedFormGroup;

  get isViewMode(): boolean {
    return this.mode === ModeCompEnum.VIEW;
  }

  constructor(
      private preferenceService: PreferenceService,
      private taskService: TaskService,
      private logger: LoggerService,
    )
  {}

  ngOnInit(): void {
    this.preferenceService.preferenceLawyerForm = this.preferenceService.createPreferenceLawyerForm();
    this.dataForm = this.preferenceService.preferenceLawyerForm;

    this.preferenceDetail = this.preferenceService.preferenceDetail;
    this.taskId = this.taskService.taskDetail?.id as number;
    this.initDropdown();
  }

  async initDropdown(){
    if(!this.isViewMode){
      this.lawyerList = await this.preferenceService.getAssignLawyer(this.taskId);
      this.lawyerList.map(m=>{
          m.txtDisplay = m.userId +' - '+m.fullName;
      });
    }
  }

  onSelectDropdown(event: any){
    this.logger.debug("🚀 ~ event onSelectDropdown :", event);
  }

  preferenceDetail : PreferenceDetails = {};

  public isOpened: boolean = true;

  public defaultConfig: DropDownConfig = {
    displayWith: 'txtDisplay',
    valueField: 'userId',
  };

  public lawyerConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ทนายความ',
  };
  expandPanel(): void {
    this.isOpened = !this.isOpened;
  }

}

