import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { CommonTabsService } from '@app/shared/components/common-tabs/common-tabs.service';
import {
  ActionBar,
  IUploadMultiFile,
  Mode,
  TaskCodeAppeal,
  TaskCodeSupreme,
  statusCode,
  taskCode,
} from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CourtVerdictDto, DisputeAppealDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-court-detail',
  templateUrl: './court-detail.component.html',
  styleUrls: ['./court-detail.component.scss'],
})
export class CourtDetailComponent implements OnInit {
  courtDetail?: CourtVerdictDto;
  courtLevel?: CourtVerdictDto.CourtLevelEnum;
  courtLevelText = '';
  public actionBar: ActionBar = {
    hasCancel: false,
    hasSave: false,
    hasReject: false,
    hasPrimary: true,
    saveText: 'COMMON.BUTTON_SAVE',
  };
  public courtVDetail!: CourtVerdictDto;
  public showDispute: boolean = false;
  public showCustomerOG: boolean | undefined = false;
  public isSavedDone = true;
  public MODE = Mode;
  public isViewMode: boolean = false;
  public courtVerdictForm!: UntypedFormGroup;
  public taskCode!: taskCode;
  public statusCode!: statusCode;

  public consAppealCtrl: UntypedFormGroup = this.fb.group({});
  public disputeAppealForm: UntypedFormGroup = this.fb.group({});

  public isSaveCaseEnd: boolean = JSON.parse(this.route.snapshot.queryParams['isSaveCaseEnd'] || false);

  private taskCodeAppeal = TaskCodeAppeal;
  private taskCodeSupreme = TaskCodeSupreme;

  constructor(
    private translate: TranslateService,
    private courtService: CourtService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private routerService: RouterService,
    private commonTabsService: CommonTabsService,
    private fb: UntypedFormBuilder
  ) {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.statusCode = this.taskService.taskDetail.statusCode as statusCode;
  }

  ngOnInit() {
    this.initData();
    this.initActionBar();
  }

  initActionBar() {
    if (this.showDispute || this.isSaveCaseEnd) {
      this.actionBar.hasPrimary = true;
    } else {
      this.actionBar.hasPrimary = !this.isViewMode;
    }
    if (this.showDispute) {
      if (this.courtVDetail.courtLevel === CourtVerdictDto.CourtLevelEnum.Civil) {
        this.actionBar.primaryText = 'COURT.SAVE_DISPUTE';
      } else if (this.courtVDetail.courtLevel === CourtVerdictDto.CourtLevelEnum.Appeal) {
        this.actionBar.primaryText = 'COURT.SAVE_DISPUTE_SUPREME';
      }
      this.actionBar.primaryIcon = 'icon-save-primary';
    } else {
      if (this.taskCode === 'CONDITIONAL_APPEAL') {
        this.actionBar.primaryText = 'COURT.LABEL_APPEAL_WITH_CONDITION';
      } else if (this.taskCode === 'CONDITIONAL_SUPREME_COURT') {
        this.actionBar.primaryText = 'COURT.LABEL_SUSPEND_APPEAL_WITH_CONDITION';
      } else if (this.taskCode === 'CONSIDER_APPEAL' || this.taskCode === 'APPROVE_APPEAL') {
        this.actionBar.primaryText = 'COURT.BUTTON_SAVE_CONSIDER';
      } else if (this.taskCode === 'APPROVE_SUPREME_COURT') {
        this.actionBar.primaryText = 'COURT.BUTTON_SAVE_RESULT_CONSIDER';
      } else {
        if (this.isSaveCaseEnd && !!this.courtVDetail.caseEnd) {
          this.actionBar.primaryText = 'COURT.BUTTON_SAVE_CASE_END';
        } else {
          this.actionBar.primaryText = 'COURT.BUTTON_SAVE_RESULT_OF_TRIAL';
        }
      }
      this.actionBar.primaryIcon = 'icon-save-primary';
      switch (this.courtVDetail?.courtLevel) {
        case CourtVerdictDto.CourtLevelEnum.Civil:
          this.courtLevelText = 'COURT.CIVIL';
          break;
        case CourtVerdictDto.CourtLevelEnum.Appeal:
          this.courtLevelText = 'COURT.APPEAL';
          break;
        case CourtVerdictDto.CourtLevelEnum.Supreme:
          this.courtLevelText = 'COURT.SUPREAM';
          break;
        default:
          break;
      }
    }
  }

  initData() {
    const action = this.route.snapshot.queryParams['action'];
    if (action === 'CONSIDER_APPEAL' || action === 'CONSIDER_SUPREME_COURT') {
      // init form case Consider Appeal or Supreme
      this.courtVDetail = this.courtService.courtAppealBundle.courtVerdicts || ({} as CourtVerdictDto);
      this.consAppealCtrl = this.courtService.initFormConsiderAppeal(
        this.courtService.courtAppealBundle,
        this.taskCode,
        this.statusCode
      );
    } else if (action === 'DISPUTE_APPEAL') {
      const disputeMode = this.route.snapshot.queryParams['disputeMode'];
      this.showDispute = true;
      this.courtVDetail = this.courtService.currentDisputeAppealBundle.courtVerdicts || ({} as CourtVerdictDto);
      this.disputeAppealForm = this.courtService.initDisputeAppealForm(
        this.courtService.currentDisputeAppealBundle,
        disputeMode
      );
    } else {
      this.courtVDetail = this.courtService.courtVerdictDetail;
    }
    this.isViewMode = this.route.snapshot.queryParams['mode'] === this.MODE.VIEW;
  }

  async onBack() {
    if (this.courtService?.courtVerdictForm?.dirty || this.disputeAppealForm?.dirty) {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      if (_confirm) {
        this.routerService.back();
        this.commonTabsService.tabNavigateTo.next(7);
        switch (this.courtVDetail?.courtLevel) {
          case CourtVerdictDto.CourtLevelEnum.Civil:
            this.commonTabsService.subTabNavigateTo.next(0);
            break;
          case CourtVerdictDto.CourtLevelEnum.Appeal:
            this.commonTabsService.subTabNavigateTo.next(1);
            break;
          case CourtVerdictDto.CourtLevelEnum.Supreme:
            this.commonTabsService.subTabNavigateTo.next(2);
            break;
          default:
            break;
        }
      }
    } else {
      this.routerService.back();
    }
  }

  async onSubmit() {
    const action = this.route.snapshot.queryParams['action'];
    const courtAppealMode = this.route.snapshot.queryParams['mode'];
    const disputeMode = this.route.snapshot.queryParams['disputeMode'];

    if (
      this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE' ||
      this.taskCode === 'MEMORANDUM_COURT_APPEAL' ||
      this.taskCode === 'MEMORANDUM_SUPREME_COURT'
    ) {
      this.courtService.courtVerdictForm.markAllAsTouched();
      this.courtService.courtVerdictForm.updateValueAndValidity();
      let uploaded = await this.checkDocisUploaded();

      console.log('checkDocisUploaded :: ', uploaded);
      // * Note uploaded will have 3 values
      // 1. true means display a pop-up and user clicks confirm.
      // 2. undefined means display a pop-up and user clicks cancel.
      // 3. false means a pop-up is not display.
      if ((this.courtService.courtVerdictForm.valid && uploaded === false) || uploaded) {
        const req = this.courtService.getCourtVerdictoRequest();
        const request: CourtVerdictDto = {
          ...req,
          headerFlag: CourtVerdictDto.HeaderFlagEnum.Draft,
        };
        await this.courtService.updateCourtVerdict(request);
        this.courtService.hasEdit = false;
        this.courtService.courtVerdictForm.markAsPristine();

        this.onBack();
        let courtMsg = '';
        switch (this.taskCode) {
          case 'MEMORANDUM_COURT_FIRST_INSTANCE':
            courtMsg = this.translate.instant('COURT.MEMORANDUM_COURT_FIRST_INSTANCE');
            break;
          case 'MEMORANDUM_COURT_APPEAL':
            courtMsg = this.translate.instant('COURT.MEMORANDUM_COURT_APPEAL');
            break;
          case 'MEMORANDUM_SUPREME_COURT':
            courtMsg = this.translate.instant('COURT.MEMORANDUM_SUPREME_COURT');
            break;
          default:
            break;
        }
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('COURT.SAVE_OUTCOME_OF_THE_PROCEEDINGS', {
            COURT_MSG: courtMsg,
          })
        );
      }
      return;
    } else if (this.taskCodeAppeal.includes(this.taskCode) || this.taskCodeSupreme.includes(this.taskCode)) {
      this.consAppealCtrl.get('appealDescription')?.setValidators(Validators.maxLength(10000));
      this.consAppealCtrl.get('appealDescription')?.updateValueAndValidity();
      this.consAppealCtrl.markAllAsTouched();
      this.consAppealCtrl.updateValueAndValidity();
      if (!!this.consAppealCtrl?.valid) {
        const _courtAppeal = this.courtService.courtAppealBundle.courtAppeal;
        const _courtAppealRawValue = this.consAppealCtrl.getRawValue();
        this.courtService.courtAppealBundle.courtAppeal = { ..._courtAppeal, ..._courtAppealRawValue };
        if (this.courtService.courtAppealBundle.courtAppeal) {
          this.courtService.courtAppealBundle.courtAppeal.updateFlag = courtAppealMode === Mode.ADD ? 'A' : 'U';
        }
        await this.courtService.saveDarftCourtAppeal(this.taskCode);
        this.onBack();
      } else {
        this.consAppealCtrl && this.consAppealCtrl.markAllAsTouched();
        this.consAppealCtrl && this.consAppealCtrl.updateValueAndValidity();
      }
    } else {
      if (action === 'DISPUTE_APPEAL') {
        const formValid =
          this.disputeAppealForm.valid && this.disputeAppealForm.controls['disputeDefendants'].value.length > 0;
        // check document validity
        const documents = this.disputeAppealForm.controls['disputeAppealDocuments'].value;
        let documentValid = true;
        documents.forEach((doc: IUploadMultiFile) => {
          if (doc.documentTemplate?.optional === false && !doc.imageId) documentValid = false;
        });
        if (formValid && documentValid) {
          this.disputeAppealForm.controls['disputeAppealDocuments'].setErrors(null);
          const req: DisputeAppealDto = {
            defendantAppealDate: this.disputeAppealForm.controls['defendantAppealDate'].value,
            disputeAppealDescription: this.disputeAppealForm.controls['disputeAppealDescription'].value,
            disputeAppealDocuments: this.disputeAppealForm.controls['disputeAppealDocuments'].value,
            disputeAppealId: this.courtService.currentDisputeAppealBundle.disputeAppeal?.disputeAppealId || 0,
            disputeDefendants: this.disputeAppealForm.controls['disputeDefendants'].value,
            finishEfilling: this.courtService.currentDisputeAppealBundle.disputeAppeal?.finishEfilling,
            lastDisputeAppealDate: this.disputeAppealForm.controls['lastDisputeAppealDate'].value,
            litigationCaseId:
              this.courtService.currentDisputeAppealBundle.disputeAppeal?.litigationCaseId ||
              this.route.snapshot.queryParams['litigationCaseId'],
            requestDefer: this.disputeAppealForm.controls['requestDefer'].value,
          };
          if (disputeMode === Mode.ADD) {
            req.updateFlag = 'A';
          } else {
            req.updateFlag = 'U';
          }
          try {
            const res = await this.courtService.updateDisputeAppeal(req);
            if (res === null) this.routerService.back();
          } catch (e) {}
        } else {
          this.disputeAppealForm.markAllAsTouched();
          if (!documentValid) this.disputeAppealForm.controls['disputeAppealDocuments'].setErrors({ invalid: true });
        }
      } else {
        if (this.isSaveCaseEnd) {
          this.courtService.courtVerdictForm.markAllAsTouched();
          this.courtService.courtVerdictForm.updateValueAndValidity();
          let uploaded = await this.checkDocisUploaded();
          if ((this.courtService.courtVerdictForm.valid && uploaded === false) || uploaded) {
            const req = this.courtService.getCourtVerdictoRequest() as CourtVerdictDto;
            const request: CourtVerdictDto = {
              litigationId: req.litigationId || this.courtVDetail.litigationId,
              litigationCaseId: req.litigationCaseId,
              headerFlag: CourtVerdictDto.HeaderFlagEnum.Update,
              caseEnd: req.caseEnd,
              caseEndCode: req.caseEndCode,
              courtVerdictDocuments: req.courtVerdictDocuments,
            };
            await this.courtService.updateCourtVerdict(request);
            this.courtService.hasEdit = false;
            this.courtService.courtVerdictForm.markAsPristine();
            this.onBack();
            this.notificationService.openSnackbarSuccess(this.translate.instant('COURT.SAVE_THE_CASE_END'));
          }
        }
      }
    }
  }

  async checkDocisUploaded() {
    let uploaded = this.courtService.courtVerdictForm?.get('requireVerdictDoc')?.value;
    let hasEditCourt = this.courtService.courtVerdictDetail?.courtFee?.find((f: any) => f.hasEdit);
    let hasEditLaw = this.courtService.courtVerdictDetail?.debtorLawyerFee?.find((f: any) => f.hasEdit);
    let confirm = false;
    if ((uploaded === '' || uploaded === false) && (hasEditCourt || hasEditLaw)) {
      confirm = await this.notificationService.warningDialog(
        'COURT.WARNING_TITLE',
        `${this.translate.instant('COURT.WARNING_DIALOG')} ${this.translate.instant('COURT.WARNING_NOTATION')}`,
        'COURT.CONFIRM_SAVE',
        'icon-Direction-Right'
      );
    }

    return confirm;
  }
}
