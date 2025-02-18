import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { ActionBar, Mode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CourtDecreeDto, CourtDecreePersonDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-execution-detail',
  templateUrl: './execution-detail.component.html',
  styleUrls: ['./execution-detail.component.scss'],
})
export class ExecutionDetailComponent implements OnInit {
  constructor(
    private courtService: CourtService,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private sessionService: SessionService
  ) {}

  public MODE = Mode;
  public isViewMode = this.route.snapshot.queryParams['mode'] === this.MODE.VIEW;

  public actionBar: ActionBar = {
    hasCancel: false,
    hasSave: false,
    hasReject: false,
    hasPrimary: !this.isViewMode,
    primaryIcon: 'icon-save-primary',
  };

  public currentDecree: CourtDecreeDto = {
    headerFlag: 'DRAFT',
  };
  public currentDefendant: CourtDecreePersonDto = {
    headerFlag: 'DRAFT',
  };
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public documents: any[] = [];
  public sendType: CourtDecreePersonDto.DecreePersonResultStatusEnum | undefined;

  public form = this.fb.group({
    remark: [''],
    sendStatus: [null],
    sendType: [null],
    sendResultDate: [null],
    otherSendTypeDesc: [''],
  });

  ngOnInit(): void {
    this.currentDecree = this.courtService.currentDecree || {};
    this.currentDefendant = this.courtService.currentDecreePerson || {};

    this.documents = [
      {
        documentId: this.currentDecree.courtDecreeDocuments?.documentId || 0,
        documentTemplate: this.currentDecree.courtDecreeDocuments?.documentTemplate,
        documentTemplateId: this.currentDecree.courtDecreeDocuments?.documentTemplate?.documentTemplateId,
        imageId: this.currentDecree.courtDecreeDocuments?.imageId || '',
        uploadRequired: true,
        removeDocument: true,
        uploadDate: this.currentDecree.courtDecreeDocuments?.documentDate,
        isUpload: !!this.currentDecree.courtDecreeDocuments?.imageId,
        viewOnly: this.isViewMode,
      },
    ];
    if (!this.documents[0]?.imageId) this.documents = [];
    this.initForm();
  }

  initForm() {
    this.form.controls['remark'].setValue(this.currentDefendant.remark);
    this.form.controls['sendStatus'].setValue(this.currentDefendant.sendStatus);
    this.form.controls['sendResultDate'].setValue(this.currentDefendant.sendResultDate);
    this.form.controls['sendType'].setValue(this.currentDefendant.sendType);
    this.sendType = this.currentDefendant.sendType;
    this.form.controls['otherSendTypeDesc'].setValue(this.currentDefendant.otherSendTypeDesc);
  }

  getControl(name: string) {
    return this.form.controls[name];
  }

  onSendResultChange(event: any) {
    if (event.value === 'SEND') {
      this.form.controls['sendResultDate'].setValidators(Validators.required);
    } else {
      this.form.controls['sendResultDate'].clearValidators();
    }
    this.form.controls['sendResultDate'].setValue(null);
    this.form.controls['sendResultDate'].updateValueAndValidity();
  }

  onSendTypeChange(event: any) {
    if (!['CLOSE', 'SIGN', 'ANNOUNCE', 'OTHER'].includes(event.value)) return;
    this.sendType = event.value;
    if (this.sendType === 'OTHER') {
      this.form.controls['otherSendTypeDesc'].addValidators(Validators.required);
    } else {
      this.form.controls['otherSendTypeDesc'].clearValidators();
      this.form.controls['otherSendTypeDesc'].setValue('');
    }
    this.form.controls['sendResultDate'].setValue(null);
    this.form.controls['otherSendTypeDesc'].updateValueAndValidity();
  }

  onDateChange(control: string, value: Date) {
    if (!moment(value).isValid()) {
      this.form.controls[control].setValue(null);
    } else {
      this.form.controls[control].setValue(value);
    }
    this.form.controls[control].markAsTouched();
    this.form.controls[control].updateValueAndValidity();
  }

  async onBack() {
    if (!this.isViewMode) {
      const res = await this.sessionService.confirmExitWithoutSave();
      if (res) {
        this.routerService.back();
      }
    } else {
      this.routerService.back();
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const sendStatus = this.form.controls['sendStatus'].value;
      const req = {
        ...this.currentDefendant,
        remark: this.form.controls['remark'].value,
        sendStatus: sendStatus,
        sendType: sendStatus === 'SEND' ? this.sendType : null,
        sendResultDate: sendStatus === 'SEND' ? this.form.controls['sendResultDate'].value : null,
        otherSendTypeDesc:
          sendStatus === 'SEND' && this.sendType === 'OTHER' ? this.form.controls['otherSendTypeDesc'].value : null,
        taskId: this.taskService.taskDetail.id,
        updateFlag: 'U',
      } as CourtDecreePersonDto;

      try {
        await this.courtService.updateCourtDecreePerson(req);
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${
            this.currentDecree.litigationId
          } ${this.translate.instant(`TASK.LABEL_EXECUTION_RECORD_SUCCESS`)}`
        );
        this.routerService.back();
      } catch (e) {}
    } else {
      this.form.markAllAsTouched();
    }
  }
}
