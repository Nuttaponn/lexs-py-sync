import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { SessionService } from '@app/shared/services/session.service';
import { LitigationCaseAllegationDto, LitigationCaseDto, LitigationCasePersonDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import { SubSink } from 'subsink';
import { SuitService } from '../suit.service';

@Component({
  selector: 'app-indictment-main',
  templateUrl: './indictment-main.component.html',
  styleUrls: ['./indictment-main.component.scss'],
})
export class IndictmentMainComponent implements OnInit, OnDestroy {
  public dataForm!: UntypedFormGroup;
  public litigationId!: string;
  public caseId: number = 0;
  private isSavedDone: boolean = false;
  public updatedPersonList: LitigationCasePersonDto[] = [];
  public personIdList: string[] = [];
  public persons!: [];
  public isEditMode: boolean = false;
  private subs = new SubSink();

  public forceViewMode: boolean = false;
  constructor(
    private routerService: RouterService,
    private suitService: SuitService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.litigationId = value['litigationId'];
        this.caseId = Number(value['caseId']);
        this.forceViewMode = JSON.parse(value['forceViewMode'] || 'false');
      })
    );
  }

  ngOnInit() {
    const _owner = this.taskService.taskOwner;
    if (
      _owner &&
      this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) &&
      !this.forceViewMode
    ) {
      // owner task.
      this.isEditMode = true;
    } else {
      // not owner task.
      this.isEditMode = false;
    }

    // move service get litigationCaseDetail to SuitResolver
    // Init form data Indictment replace generateIndictmentForm wiht generateLitigationCaseForm
    this.dataForm = this.suitService.generateLitigationCaseForm(
      this.suitService.litigationCaseDetail,
      this.lawsuitService.currentLitigation
    );

    this.isSavedDone = false;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSave() {
    if (this.dataForm.valid && this.persons.length !== 0) {
      this.stroeIndictmentData();
      this.isSavedDone = true;
      this.suitService.hasEdit = true;
      this.onBack();
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('LAWSUIT.INDICTMENT.INDICTMENT_RECORD_SAVED')
      );
    }
  }

  async onBack() {
    if (!this.dataForm.dirty || this.isSavedDone) {
      this.routerService.back();
    } else {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      _confirm && this.routerService.back();
    }
  }

  async onCancel() {
    await this.onBack();
  }

  getPersons(persons: any) {
    this.persons = persons;
    this.personIdList = this.persons.map((item: { personId: string }) => item.personId);
    this.updatedPersonList = this.dataForm.get('persons')?.value.map((element: LitigationCasePersonDto) => {
      if (element.personId && this.personIdList.includes(element.personId)) {
        element.checked = true;
      } else {
        element.checked = false;
      }
      return element;
    });
  }

  stroeIndictmentData() {
    this.dataForm.get('persons')?.setValue(this.updatedPersonList);
    const _allegationsObj: Array<LitigationCaseAllegationDto> = this.dataForm.get('allegationsObj')?.value || [];
    const data: LitigationCaseDto = this.dataForm.getRawValue();
    if (this.suitService.litigationCaseDetail.id === this.caseId) {
      this.suitService.litigationCaseDetail = data;
      for (let index = 0; index < this.suitService.litigationCase.length; index++) {
        const element = this.suitService.litigationCase[index].cases;
        if (element) {
          this.suitService.litigationCase[index].cases = element.map((m: any) => {
            if (m.id === this.caseId) {
              const _detail = this.suitService.litigationCaseDetail;
              m.capitalAmount = _detail.capitalAmount;
              m.briefCase = _detail.briefCase;
              m.caseDate = _detail.caseDate;
              m.courtCode = _detail.courtCode;
              m.courtName = _detail.courtName;
              m.litigationCaseAllegations = _allegationsObj;
              m.litigationCaseAccounts = _detail.litigationCaseAccounts;
              m.persons = _detail.persons;
              m.litigationDocuments = _detail.litigationDocuments;
            }
            return m;
          });
        }
      }
    }
  }
}
