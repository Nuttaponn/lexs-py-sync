import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { DOC_TEMPLATE } from '@app/shared/constant';
import {
  CourtTrialControllerService,
  CourtTrialDetailDto,
  CourtTrialDto,
  LitigationDocumentDto,
} from '@lexs/lexs-client';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { lastValueFrom } from 'rxjs';
import { _hearingInfo } from './trial-dialog-save-detail/trial-dialog-save-detail.component';
@Injectable({
  providedIn: 'root',
})
export class TrialService {
  constructor(
    private courtTrialControllerService: CourtTrialControllerService,
    private errorHandlingService: ErrorHandlingService,
    private fb: UntypedFormBuilder
  ) {}
  public _templateDocument: LitigationDocumentDto = {
    documentDate: '',
    documentId: 0,
    active: true,
    documentTemplate: {
      documentName: 'รายงานกระบวนพิจารณา',
      documentTemplateId: DOC_TEMPLATE.LEXSF063,
      optional: false,
    },
    documentTemplateId: DOC_TEMPLATE.LEXSF063,
    imageName: 'รายงานกระบวนพิจารณา',
    imageId: '',
  };
  private _trial!: CourtTrialDto[];
  public get trial(): CourtTrialDto[] {
    return this._trial;
  }
  public set trial(value: CourtTrialDto[]) {
    this._trial = value;
  }

  // For tracking have edit some value in screen
  private _hasEdit: boolean = false;
  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  async getCourtTrial(litigationId: string, taskId?: number): Promise<CourtTrialDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtTrialControllerService.getCourtTrial(litigationId, taskId))
    );
  }

  async updateCourtTrial(courtTrial: CourtTrialDetailDto, taskId?: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtTrialControllerService.updateCourtTrial(courtTrial, taskId))
    );
  }

  generateTrialForm(_courtDetailObject: CourtTrialDetailDto) {
    return this.fb.group({
      appointmentDate: [{ value: _courtDetailObject.appointmentDate || undefined, disabled: false }],
      appointmentTime: [{ value: _courtDetailObject.appointmentTime || undefined, disabled: false }],
      litigationId: [{ value: _courtDetailObject.litigationId || '', disabled: false }],
      saveStatus: [{ value: _courtDetailObject.saveStatus || 'SAVE', disabled: false }],
      litigationCaseId: [{ value: _courtDetailObject.litigationCaseId || 0, disabled: false }],
      appointment: [{ value: _courtDetailObject.appointment || [], disabled: false }],
      id: [{ value: _courtDetailObject.id || 0, disabled: false }],
      remark: [{ value: _courtDetailObject.remark || undefined, disabled: false }],
      attachment: [{ value: _courtDetailObject.attachment || this._templateDocument, disabled: false }],
      source: [{ value: _courtDetailObject.source || '-', disabled: false }],
      cios: [{ value: _courtDetailObject.cios || false, disabled: false }],
      checkboxInvestigate: [
        { value: _courtDetailObject.appointment?.includes(_hearingInfo.INVESTIGATE_WITNESS) || false, disabled: false },
      ],
      checkboxSettlement: [
        { value: _courtDetailObject.appointment?.includes(_hearingInfo.SETTLEMENT) || false, disabled: false },
      ],
      checkboxPretrial: [
        { value: _courtDetailObject.appointment?.includes(_hearingInfo.PRETRIAL) || false, disabled: false },
      ],
      checkboxVerdict: [
        { value: _courtDetailObject.appointment?.includes(_hearingInfo.VERDICT) || false, disabled: false },
      ],
      checkboxOther: [
        { value: _courtDetailObject.appointment?.includes(_hearingInfo.OTHER) || false, disabled: false },
      ],
    });
  }
  generateNewRecord(lawyerName: string, litigationId: string, litigationCaseId: number): CourtTrialDetailDto {
    return {
      actionFlag: true,
      appointment: [],
      appointmentDate: undefined,
      appointmentTime: undefined,
      attachment: this._templateDocument,
      cios: false,
      documentId: 0,
      headerFlag: 'DRAFT',
      id: 0,
      litigationCaseId: litigationCaseId,
      litigationId: litigationId,
      remark: undefined,
      saveStatus: 'SAVE',
      source: lawyerName,
      updateFlag: 'A',
    };
  }
}
