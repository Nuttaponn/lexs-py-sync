import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AccountDetailModule } from '@app/shared/components/account-detail/account-detail.module';
import { ActionBar, statusCode, taskCode } from '@app/shared/models';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { RouterService } from '@app/shared/services/router.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SubSink } from 'subsink';
import { PreferenceInfoComponent } from './preference-info/preference-info.component';
import { PreferenceService } from '../preference.service';
import { SessionService } from '@app/shared/services/session.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { ModeCompEnum, ScenarioPreferenceEnum, DefaultModeCompPreference } from '../preference.model';
import { ActivatedRoute } from '@angular/router';
import { MENU_ROUTE_PATH } from '@app/shared/constant';
import { PreferenceInfoCommandComponent } from "./preference-info/preference-info-command/preference-info-command.component";
import { PreferenceInfoClaimComponent } from "./preference-info/preference-info-claim/preference-info-claim.component";
import { LoggerService } from '@app/shared/services/logger.service';
import { AssignLawyerComponent } from './preference-info/assign-lawyer/assign-lawyer.component';
import { PreferenceDetails, PreferenceApproveRequest, AssignLawyerRequest } from "@lexs/lexs-client";
import { PreferenceDocumentPreparationComponent } from "./preference-document-preparation/preference-document-preparation.component";
import { NotificationService } from '@app/shared/services/notification.service';
import { RejectDialogComponent } from '../preference-component/reject-dialog/reject-dialog.component';
import {Utils} from "@shared/utils";

@Component({
  selector: 'app-preference-detail',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    AccountDetailModule,
    PreferenceInfoComponent,
    PreferenceInfoCommandComponent,
    PreferenceInfoClaimComponent,
    AssignLawyerComponent,
    PreferenceDocumentPreparationComponent
],
  templateUrl: './preference-detail.component.html',
  styleUrl: './preference-detail.component.scss'
})
export class PreferenceDetailComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  //Parameter Action Bar
  taskIcon: string = '';
  title: string = '';
  statusName : string = '';
  public actionBar: ActionBar = {
    hasCancel: false,
    hasSave: false,
    hasReject: false,
    hasPrimary: false
  };

  get currentScenario(){
    return this.preferenceService.currentScenario;
  }

  get modeCompPreference(){
    return this.preferenceService.modeCompPreference;
  }

  //Parameter workflow
  isFromTask: boolean = false;
  taskId: number = 0;
  taskCode!: taskCode;
  statusCode!: statusCode;
  isOnRequest: boolean = false;
  get isOwnerTask() {
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  accessPermissions = this.sessionService.accessPermissions();

  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private preferenceService: PreferenceService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {

    this.isOnRequest = this.route?.snapshot?.queryParams['isOnRequest'] || false;
    this.isFromTask = this.routerService.navigateFormTaskMenu;
    if(this.isFromTask){
      this.taskId = this.taskService.taskDetail?.id as number;
      this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
      this.statusCode = this.taskService.taskDetail?.statusCode as statusCode;
    }

    this.initScenarioPreference();
    this.initModeCompPreference();
    this.initActionBarStatus();
    this.initActionBarButton();

  }

  initScenarioPreference() {

    const isFromMenuLawSuit = this.routerService.currentRoute.includes(MENU_ROUTE_PATH.LAWSUIT);
    const isFromMenuPreference = this.routerService.currentRoute.includes(MENU_ROUTE_PATH.PREFERENCE);

    if(this.isFromTask && this.isOnRequest){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO1;
    }else if(this.isFromTask && this.taskCode === taskCode.EXECUTE_PREFERENCE && this.statusCode === statusCode.PENDING_APPROVAL){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO2;
    }else if(this.isFromTask && this.taskCode === taskCode.EXECUTE_PREFERENCE && this.statusCode === statusCode.CORRECT_PENDING){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO3;
    }else if(this.isFromTask && this.taskCode === taskCode.ASSIGN_LAWYER_PLAINTIFF_CASE && this.statusCode === statusCode.PENDING){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO4;
    }else if(this.isFromTask && this.taskCode === taskCode.PREPARE_PREFERENCE_DODUMENT && this.statusCode === statusCode.PENDING){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO5;
    }else if(!this.isFromTask && isFromMenuPreference){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO6;
    }else if(!this.isFromTask && isFromMenuLawSuit){
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARIO7;
    }else{
      this.preferenceService.currentScenario = ScenarioPreferenceEnum.SCENARI0;
    }

    this.logger.info('PreferenceDetail currentScenario : ', this.currentScenario);
  }

  initModeCompPreference(){

    //case show action-bar
    if(this.isFromTask || this.isOnRequest){
      this.modeCompPreference.isShowCompActionBar = true;
    }

    switch (this.currentScenario) {
      case ScenarioPreferenceEnum.SCENARIO1:
        this.preferenceService.modeCompPreference.isShowCompTab = false;
        this.preferenceService.modeCompPreference.isShowCompCommand = true;
        this.preferenceService.modeCompPreference.modeCompCommand = ModeCompEnum.EDIT;
        break;
      case ScenarioPreferenceEnum.SCENARIO2:
        this.preferenceService.modeCompPreference.isShowCompTab = false;
        this.preferenceService.modeCompPreference.isShowCompCommand = true;
        this.preferenceService.modeCompPreference.modeCompCommand = ModeCompEnum.VIEW;
        break;
      case ScenarioPreferenceEnum.SCENARIO3:
        this.preferenceService.modeCompPreference.isShowCompTab = false;
        this.preferenceService.modeCompPreference.isShowCompCommand = true;
        this.preferenceService.modeCompPreference.modeCompCommand = ModeCompEnum.EDIT;
        break;
      case ScenarioPreferenceEnum.SCENARIO4:
        this.preferenceService.modeCompPreference.isShowCompTab = false;
        this.preferenceService.modeCompPreference.isShowCompCommand = true;
        this.preferenceService.modeCompPreference.isShowCompAssignLawyer = true,
        this.preferenceService.modeCompPreference.modeCompCommand = ModeCompEnum.VIEW;
        this.preferenceService.modeCompPreference.modeCompAssignLawyer = ModeCompEnum.EDIT;
        break;
      case ScenarioPreferenceEnum.SCENARIO5:
        //TODO for mvp3 sprint2
        break;
      case ScenarioPreferenceEnum.SCENARIO6: case ScenarioPreferenceEnum.SCENARIO7:
        //TODO condition for show component mode view only for mvp3 sprint2
        this.preferenceService.modeCompPreference.isShowCompTab = true;
        this.preferenceService.modeCompPreference.isShowCompCommand = true;

        this.preferenceService.modeCompPreference.modeCompCommand = ModeCompEnum.VIEW;

        if(this.preferenceService.preferenceDetail?.lawyerId){
          this.preferenceService.modeCompPreference.isShowCompAssignLawyer = true,
          this.preferenceService.modeCompPreference.modeCompAssignLawyer = ModeCompEnum.VIEW;
          this.preferenceService.modeCompPreference.modeCompClaim = ModeCompEnum.VIEW;
        }
        break;
      default:
        this.preferenceService.modeCompPreference = new DefaultModeCompPreference();
      break;
    }


  }

  initActionBarStatus() {
    this.statusName = '';
    this.taskIcon = ''

    switch (this.currentScenario) {
      case ScenarioPreferenceEnum.SCENARIO1:
        this.title = 'รายละเอียดการบันทึกสั่งการบุริมสิทธิจำนอง';
         this.taskIcon = 'icon-Asset-nobg'
        break;
      case ScenarioPreferenceEnum.SCENARIO2:
        this.statusName = 'รอพิจารณาอนุมัติสั่งการบุริมสิทธิจำนอง';
        this.taskIcon = 'icon-Search'
        this.title = 'งานพิจารณาอนุมัติสั่งการยื่น';
        break;
      case ScenarioPreferenceEnum.SCENARIO3:
        this.taskIcon = 'icon-Search'
        this.title = 'รายละเอียดการบันทึกสั่งการบุริมสิทธิจำนอง';
        break;
      case ScenarioPreferenceEnum.SCENARIO4:
        this.statusName = 'รอบอบหมายงานให้ทนายความผู้รับผิดชอบ ขายทอดตลาด';
        this.taskIcon = 'icon-fluent-box-toolbox'
        this.title = 'มอบหมายทนายผู้รับผิดชอบ';
        break;
      case ScenarioPreferenceEnum.SCENARIO5:
        this.title = 'รอตรวจสอบเอกสารบุริมสิทธิจำนอง';
        break;
      default:
        this.title = '';
      break;
    }
  }

  initActionBarButton(){
    switch (this.currentScenario) {
      case ScenarioPreferenceEnum.SCENARIO1: //TODO when real api check permission
        if(this.accessPermissions.permissions.includes('START_PREFERENCE')){
          this.actionBar = {
            ...this.actionBar,
            hasSave: false,
            primaryText: 'COMMON.BUTTON_PROPOSE',
            primaryIcon: 'icon-save-primary',
            hasPrimary: true,
          };
        }
        break;
      case ScenarioPreferenceEnum.SCENARIO2 : //TODO when real api check condition isOwnerTask
        if(this.isOwnerTask){
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            primaryText: 'อนุมัติ',
            primaryIcon: 'icon-Selected',
            hasEdit: true,
            editIcon: 'icon-Arrow-Revert',
            editText: 'ส่งกลับแก้ไข',
          };
        }
        break;
      case ScenarioPreferenceEnum.SCENARIO3:
        if(this.isOwnerTask){
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            primaryText: 'นำเสนอ',
            primaryIcon: 'icon-save-primary',
          };
        }
        break;
      case ScenarioPreferenceEnum.SCENARIO4:
        if(this.isOwnerTask){
          this.actionBar = {
            ...this.actionBar,
            hasSave: false,
            primaryText: 'COMMON.BUTTON_FINISH',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
          };
        }
        break;
      default:
        this.actionBar = {
          ...this.actionBar,
        };
      break;
    }

  }

  async canDeactivate() {
    // if form dirty ask before destroy
    //  if confirm clear-data else stay on page
    // else clear-data and exit
    if (this.preferenceService.getForm().dirty||this.preferenceService.preferenceLawyerForm?.dirty) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.preferenceService.clearData();
        return true;
      }
      return false;
    } else {
      this.preferenceService.clearData();
      return true;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async onBack() {
    console.log('onBack',this.preferenceService.getForm().dirty);
    // const _confirm = await this.sessionService.confirmExitWithoutSave();
    //   if (_confirm) {
    //     this.routerService.back();
    //   }
    this.routerService.back();
  }

  async onSave() {

  }

  async onEdit() {
    switch (this.currentScenario) {
      case ScenarioPreferenceEnum.SCENARIO2:
        this.logger.debug('onReject ส่งกลับแก้ไข Scenario2');
        const taskId = this.taskId;
        const preferenceApproveRequest: PreferenceApproveRequest = {};
        preferenceApproveRequest.approvalStatus = 'REJECT';

        const context = {
          rejectTo : this.preferenceService.preferenceDetail?.createdByName || ''
        };
        const dialog = await this.notificationService.showCustomDialog({
          component: RejectDialogComponent,
          title: 'COMMON.LABEL_SEND_BACK_EDIT',
          iconName: 'icon-Arrow-Revert',
          rightButtonClass: 'long-button mat-warn',
          buttonIconName: 'icon-Arrow-Revert',
          rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          cancelEvent: true,
          context: context,
        });
        if (dialog && dialog.isSuccess) {
          preferenceApproveRequest.rejectReason = dialog.rejectReason;
          await this.preferenceService.approve(taskId, preferenceApproveRequest);
          this.routerService.back();
          this.notificationService.openSnackbarSuccess(`ส่งกลับแก้ไขสำเร็จ`);
        }
        break;
      default:
        break;
    }
  }

  async onSubmit() {
    // TODO: action for 'สั่งการบุริมสิทธิจำนอง'
    switch (this.currentScenario) {
      case ScenarioPreferenceEnum.SCENARIO1: case ScenarioPreferenceEnum.SCENARIO3:
        // TODO: action for 'สั่งการบุริมสิทธิจำนอง'
        //console.log('on save1', this.preferenceService.getForm().getRawValue())
        const saveForm = this.preferenceService.getForm()
        if (saveForm.invalid) {
          //console.log('on save2', Utils.findInvalidControls(this.preferenceService.getForm()))
          this.preferenceService.getForm().markAllAsTouched()
          return
        }
        // console.log('save foorm', saveForm.get('rejectReason')?.getRawValue())
        if (saveForm.get('rejectReason')?.getRawValue() === '') {
          saveForm.get('rejectReason')?.setValue(null)
        }
        if (saveForm.get('sell')?.getRawValue() === '') {
          saveForm.get('sell')?.setValue(null)
        }
        saveForm.get('redCaseNo')?.setValue((saveForm.get('elementRedCaseCiosCode')?.getRawValue() || '') + saveForm.get('elementRedCaseRunning')?.getRawValue() + '/' + saveForm.get('elementRedCaseYear')?.getRawValue())
        let data = saveForm.getRawValue()
        data.redCaseNo = (data?.elementRedCaseCiosCode || '') + data?.elementRedCaseRunning + '/' + data.elementRedCaseYear
        //console.log('save aaaaa', this.preferenceService.getForm().getRawValue())
        if (!data.customer?.cifNo) {
          this.notificationService.alertDialog(
            'ไม่สามารถนำเสนองานได้',
            'เนื่องจากยังไม่ได้ “เลือกรายละเอียดลูกหนี้”'
          );
          return
        }
        if (data.accounts?.length === 0) {
          this.notificationService.alertDialog(
            'ไม่สามารถนำเสนองานได้',
            'เนื่องจากยังไม่ได้ “เลือกรายละเอียดบัญชี”'
          );
          return
        }
        const hasImageId = data.documents?.find((f: any) => f.imageId)
        if (!hasImageId) {
          this.notificationService.alertDialog(
            'ไม่สามารถนำเสนองานได้',
            'เนื่องจากยังไม่ได้ “อัพโหลดเอกสาร”'
          );
          return
        }
        const collateralsSelected = data.collaterals;//?.filter((f: any) => f.selected)
        if (collateralsSelected?.length === 0) {
          // this.notificationService.openSnackbarWarning('โปรดกรอก cif')
          this.notificationService.alertDialog(
            'ไม่สามารถนำเสนองานได้',
            'เนื่องจากยังไม่ได้ “เลือกหลักประกัน อย่างน้อย 1 รายการ”'
          );
          return
        }
        // data.redCaseNo = (data?.elementRedCaseCiosCode || '') + data?.elementRedCaseRunning + '/' + data.elementRedCaseYear
        if(this.currentScenario === ScenarioPreferenceEnum.SCENARIO3){
          data.taskId = this.taskId;
          data.preferenceGroupNo = this.preferenceService.preferenceDetail.preferenceGroupNo;
        }
        //console.log('onSave3', data)
        await this.preferenceService.save(data);
        this.notificationService.openSnackbarSuccess(`นำเสนองานสำเร็จ`);
        this.preferenceService.getForm().markAsPristine()
        this.preferenceService.getForm().updateValueAndValidity();
        this.routerService.back();
        break;
      case ScenarioPreferenceEnum.SCENARIO2:
        this.logger.debug('onApprove อนุมัติ Scenario2');
        const preferenceApproveRequest: PreferenceApproveRequest = {};
        preferenceApproveRequest.approvalStatus = 'APPROVE';
        this.preferenceService.approve(this.taskId, preferenceApproveRequest);
        this.notificationService.openSnackbarSuccess(`อนุมัติสำเร็จ`);
        this.routerService.back();
        break;
      case ScenarioPreferenceEnum.SCENARIO4:
        if(this.preferenceService.preferenceLawyerForm?.valid){
          const assignLawyerRequest : AssignLawyerRequest = {
            lawyerId: this.preferenceService.preferenceLawyerForm.get('lawyerId')?.value
          }
          this.preferenceService.assignLawyer(this.taskId, assignLawyerRequest);
          this.notificationService.openSnackbarSuccess(`มอบหมายทนายสำเร็จ`);
          this.routerService.back();
        }else{
          this.preferenceService.preferenceLawyerForm.markAllAsTouched()
        }
        break;
      default:
        break;
    }
  }

  async onReject() {}
}
