import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { CourtTrialDetailDto, CourtTrialDto, CourtTrialUpdateResponse, LitigationDocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { TrialService } from './../trial.service';
export type HearingInfo = 'สืบพยาน' | 'ชี้สองสถาน' | 'อื่นๆ' | 'ไกล่เกลี่ย/  นัดพร้อม' | 'ฟังคำพิพากษา';
export const _hearingInfo = {
  INVESTIGATE_WITNESS: 'สืบพยาน' as HearingInfo,
  SETTLEMENT: 'ไกล่เกลี่ย/นัดพร้อม' as HearingInfo,
  PRETRIAL: 'ชี้สองสถาน' as HearingInfo,
  VERDICT: 'ฟังคำพิพากษา' as HearingInfo,
  OTHER: 'อื่นๆ' as HearingInfo,
};

@Component({
  selector: 'app-trial-dialog-save-detail',
  templateUrl: './trial-dialog-save-detail.component.html',
  styleUrls: ['./trial-dialog-save-detail.component.scss'],
})
export class TrialDialogSaveDetailComponent implements OnInit {
  public documentUpload: IUploadMultiFile[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public document: LitigationDocumentDto[] = [];
  public isViewMode!: boolean;
  public dataForm!: UntypedFormGroup;
  public isNewRecord!: boolean;
  public isEdit!: boolean;
  public indexCourt!: number;
  public indexCourtDetail!: number;
  public courtLevel!: CourtTrialDto.CourtLevelEnum;
  public taskId!: number;
  public hearingInfoList: string[] = [];
  public CourtTrialDto = CourtTrialDto;
  public hearingInfo = _hearingInfo;
  public appointmentTime!: number;
  public lawyerName!: string;
  public litigationCaseId!: number;
  public uploadMultiInfo: IUploadMultiInfo = { cif: '' };
  public isUpload: boolean = false;
  constructor(
    public fb: UntypedFormBuilder,
    public trialService: TrialService,
    public translateService: TranslateService,
    public notificationService: NotificationService,
    public lawsuitService: LawsuitService,
    public routerService: RouterService
  ) {}

  get formData() {
    return this.dataForm.controls;
  }

  ngOnInit(): void {
    this.appointmentTime = this.dataForm.get('appointmentTime')?.value;
    this.uploadMultiInfo = {
      cif: this.lawsuitService.currentLitigation.customerId || '',
      litigationId: this.lawsuitService.currentLitigation.litigationId,
    };
    this.document = [this.dataForm.get('attachment')?.value];
    this.documentUpload =
      this.document && this.document[0] !== undefined && this.document.length > 0
        ? this.document.map((m, index) => {
            return {
              imageId: m.imageId,
              isUpload: !!m.imageId,
              documentTemplate: m.documentTemplate,
              documentTemplateId: m.documentTemplate?.documentTemplateId,
              uploadDate: m.documentDate,
              removeDocument: true,
              indexOnly: true,
              active: true,
            } as IUploadMultiFile;
          })
        : [];
  }

  dataContext(data: any) {
    this.isViewMode = data.isViewMode;
    this.isNewRecord = data.isNewRecord;
    this.isEdit = data.isEdit;
    this.indexCourt = data.indexCourt;
    this.indexCourtDetail = data.indexCourtDetail;
    this.courtLevel = data.courtLevel;
    this.taskId = data.taskId;
    this.lawyerName = data.lawyerName;
    this.litigationCaseId = data.litigationCaseId;
    if (this.isNewRecord) {
      let litigationId: string = this.lawsuitService.currentLitigation.litigationId || '';
      this.dataForm = this.trialService.generateTrialForm(
        this.trialService.generateNewRecord(this.lawyerName, litigationId, this.litigationCaseId)
      );
      this.hearingInfoList = this.dataForm.get('appointment')?.value;
    } else if (!this.isNewRecord) {
      delete data['isViewMode'];
      delete data['isUpload'];
      delete data['isNewRecord'];
      delete data['indexCourt'];
      delete data['indexCourtDetail'];
      delete data['courtLevel'];
      delete data['taskId'];
      delete data['lawyerName'];
      this.dataForm = this.trialService.generateTrialForm({
        ...data,
        headerFlag: 'DRAFT',
      });
      this.hearingInfoList = this.dataForm.get('appointment')?.value;
    }
  }

  getTrialFlag() {
    let current = this.routerService.currentStack.pop();
    this.trialService.hasEdit = current === '/main/task';
  }

  public async onClose(): Promise<boolean> {
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();

    let appointmentList: (string | undefined)[] = [];
    const mapper = new Map<string, string>([
      ['checkboxInvestigate', this.hearingInfo.INVESTIGATE_WITNESS],
      ['checkboxSettlement', this.hearingInfo.SETTLEMENT],
      ['checkboxPretrial', this.hearingInfo.PRETRIAL],
      ['checkboxVerdict', this.hearingInfo.VERDICT],
      ['checkboxOther', this.hearingInfo.OTHER],
    ]);

    Object.keys(this.dataForm.getRawValue()).forEach(item => {
      if (item.includes('checkbox') && !!this.dataForm.get(item)?.value) {
        appointmentList.push(mapper.get(item));
      }
    });

    this.dataForm.get('appointment')?.setValue(appointmentList);
    this.dataForm.get('appointment')?.updateValueAndValidity();

    let isNotHearingInfo = [...this.dataForm.get('appointment')?.value].length === 0;
    if (this.dataForm.invalid || isNotHearingInfo) {
      return false;
    } else {
      if (this.dataForm.valid && this.isNewRecord) {
        if (!this.isUpload) {
          this.dataForm.get('attachment')?.setValue(null);
          this.dataForm.get('attachment')?.updateValueAndValidity();
        }

        let newRecord: CourtTrialDetailDto | any = {
          ...[this.dataForm.getRawValue() as unknown as CourtTrialDetailDto].map(object => {
            object.updateFlag = CourtTrialDetailDto.UpdateFlagEnum.A;
            object.headerFlag = CourtTrialDetailDto.HeaderFlagEnum.Draft;
            return object;
          }),
        } as unknown as CourtTrialDetailDto;
        let res: CourtTrialUpdateResponse = await this.trialService.updateCourtTrial(
          newRecord[0],
          this.taskId ? this.taskId : undefined
        );

        if (res.id && (res.documentId === 0 || (res.documentId && res.documentId > 0))) {
          newRecord[0].id = res.id;
          newRecord[0].attachment = this.dataForm.get('attachment')?.value
            ? { ...this.dataForm.get('attachment')?.value, documentId: res.documentId }
            : null;

          this.trialService.trial[this.indexCourt].courtTrialDetails = [
            ...(this.trialService.trial[this.indexCourt].courtTrialDetails as CourtTrialDetailDto[]),
            newRecord[0],
          ];
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant('LAWSUIT.TRIAL.HEARING_DATE_SAVED')
          );
          this.getTrialFlag();
        }
      } else if (this.dataForm.valid && this.isEdit) {
        if (this.dataForm.get('attachment')?.value === this.trialService._templateDocument && !this.isUpload) {
          this.dataForm.get('attachment')?.setValue(null);
          this.dataForm.get('attachment')?.updateValueAndValidity();
        }

        let newRecord!: CourtTrialDetailDto | any;
        this.trialService.trial = this.trialService.trial.map((element, index) => {
          if (index === this.indexCourt) {
            element.courtTrialDetails = (element.courtTrialDetails as CourtTrialDetailDto[]).map(
              (record, indexRecord) => {
                if (record && indexRecord === this.indexCourtDetail) {
                  newRecord = {
                    ...[this.dataForm.getRawValue() as unknown as CourtTrialDetailDto].map(object => {
                      object.updateFlag = CourtTrialDetailDto.UpdateFlagEnum.U;
                      object.headerFlag = CourtTrialDetailDto.HeaderFlagEnum.Draft;
                      return object;
                    }),
                  } as unknown as CourtTrialDetailDto;
                  record = newRecord[0];
                  return record;
                }
                return record;
              }
            );
          }
          return element;
        });
        // validate logic ??
        let res: CourtTrialUpdateResponse = await this.trialService.updateCourtTrial(
          newRecord[0],
          this.taskId ? this.taskId : undefined
        );
        if (res.id && (res.documentId === 0 || (res.documentId && res.documentId > 0))) {
          newRecord[0].attachment = this.dataForm.get('attachment')?.value
            ? { ...this.dataForm.get('attachment')?.value, documentId: res.documentId }
            : null;
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant('LAWSUIT.TRIAL.HEARING_DATE_SAVED')
          );
          this.getTrialFlag();
        }
      }
      return true;
    }
  }

  formatAppointmentTime(time: string) {
    return time.substring(0, 2) + ':' + time.substring(2, 4);
  }
  onChangeAppointmentTime(time: number) {
    let timeWithZeroAdded = +time.toString() + '0';
    if (timeWithZeroAdded === '00') {
      this.dataForm.get('appointmentTime')?.setValue(null);
      this.dataForm.get('appointmentTime')?.updateValueAndValidity();
      return this.appointmentTime;
    }
    this.dataForm
      .get('appointmentTime')
      ?.setValue(
        time.toString().length === 4
          ? this.formatAppointmentTime(time.toString())
          : this.formatAppointmentTime(timeWithZeroAdded)
      );
    this.dataForm.get('appointmentTime')?.updateValueAndValidity();
    return this.appointmentTime;
  }

  uploadFileEvent(list: any) {
    let attachment!: LitigationDocumentDto;
    if (this.isNewRecord) {
      attachment = { ...list[0], documentDate: new Date().toISOString(), documentId: 0, active: true };
    } else if (this.isEdit) {
      attachment = {
        ...list[0],
        documentDate: new Date().toISOString(),
        documentId: this.dataForm.get('attachment')?.value.documentId,
        active: true,
      };
    }
    this.dataForm.get('attachment')?.setValue(attachment);
    this.dataForm.get('attachment')?.updateValueAndValidity();
    if (!!list[0].uploadDate && !!list[0].imageId && !!list[0].isUpload) this.isUpload = true;
  }
}
