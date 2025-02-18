import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  CollateralTypes,
  ERROR_CODE,
  SEIZURE_COLLATERAL_TYPE,
  SeizureCollateralTypes,
  SeizureLedTypes,
} from '@app/shared/constant';
import { ITabNav, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { coerceString } from '@app/shared/utils';
import {
  CollateralAppraisalDocumentDto,
  CompletedTitleDeedDocumentApprovalRequest,
  DocumentAmdReSubmitRequest,
  DocumentReqOriginalChannelRequest,
  ExcessDocument,
  ExcessDocumentResponse,
  GenerateCoverPageRequest,
  GetSeizurePrepTitleDeedDraftResponse,
  GetSeizurePrepTitleDeedResponse,
  LitigationCaseShortDto,
  NonPledgePropSubmitRequest,
  NonPledgePropertiesAsset,
  NonPledgePropertiesInfoResponse,
  PostExcessDocumentRequest,
  PostExcessDocumentResponse,
  PostExecutionLawyerSubmitRequest,
  PostSeizureInfoRequest,
  PostSubmitDocumentValidationRequest,
  PostTaskSubmitRequest,
  PutExcessDocumentRequest,
  RejectCoverPageGenerateRequest,
  SeizureAmdCoverPageRequest,
  SeizureCollateralResultRequest,
  SeizureCollateralsRequest,
  SeizureCommandResponse,
  SeizureControllerService,
  SeizureDocumentApprovalDraftResponse,
  SeizureDocumentTitleDeed,
  SeizureDocumentsTitleDeedResponse,
  SeizureFeeControllerService,
  SeizureLedsInfo,
  SeizureLedsInfoResponse,
  SeizureLitigationCaseControllerService,
  SeizureLitigationControllerService,
  SeizureMoveRequest,
  SeizurePerpPerson,
  SeizurePerpPersonResponse,
  SeizureTitleDeedDocument,
  SeizureTitleDeedRejectedReason,
  SelectedDocument,
  SubmitTitleDeedDocumentApprovalRequest,
  TitleDeedDocument,
  UserControllerV2Service,
  ValidateRequestDto,
} from '@lexs/lexs-client';
import { lastValueFrom, map, of } from 'rxjs';
import { TaskService } from '../task/services/task.service';
import { CollateralTypeDTO, ILegalExecution } from './models';
import { TitleDeedDocumentExtend } from './seizure-document-info/seizure-document-info.constant';
import { SEIZURE_PROPERTY_TABS } from './seizure-property.constant';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SeizurePropertyService {
  private _seizurePropertyTabs: ITabNav[] = SEIZURE_PROPERTY_TABS;
  public get seizurePropertyTabs(): ITabNav[] {
    return this._seizurePropertyTabs;
  }

  public set seizurePropertyTabs(value: ITabNav[]) {
    this._seizurePropertyTabs = value;
  }

  public _docStatus = {
    currentSeizure: 0,
    totalSeizure: 0,
  };

  private _documentsTitleDeed: Array<TitleDeedDocument> = [];
  public get documentsTitleDeed(): Array<TitleDeedDocument> {
    return this._documentsTitleDeed;
  }
  public set documentsTitleDeed(value: Array<TitleDeedDocument>) {
    this._documentsTitleDeed = value;
  }
  private _seizureDocumentsTitleDeed: Array<SeizureDocumentTitleDeed> = [];
  public get seizureDocumentsTitleDeed(): Array<SeizureDocumentTitleDeed> {
    return this._seizureDocumentsTitleDeed;
  }
  public set seizureDocumentsTitleDeed(value: Array<SeizureDocumentTitleDeed>) {
    this._seizureDocumentsTitleDeed = value;
  }
  private _docmentPerson!: Array<SeizurePerpPerson>;
  public get docmentPerson(): Array<SeizurePerpPerson> {
    return this._docmentPerson;
  }
  public set docmentPerson(value: Array<SeizurePerpPerson>) {
    this._docmentPerson = value;
  }

  private _docCollateralAppraisal!: Array<CollateralAppraisalDocumentDto>;
  public get docCollateralAppraisal(): Array<CollateralAppraisalDocumentDto> {
    return this._docCollateralAppraisal;
  }
  public set docCollateralAppraisal(value: Array<CollateralAppraisalDocumentDto>) {
    this._docCollateralAppraisal = value;
  }
  private _excessDocuments!: Array<ExcessDocument>;
  public get excessDocuments(): Array<ExcessDocument> {
    return this._excessDocuments;
  }
  public set excessDocuments(value: Array<ExcessDocument>) {
    this._excessDocuments = value;
  }

  get docStatus() {
    return this._docStatus;
  }

  private _hasEdit: boolean = false;
  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }
  private _mode: string = '';
  public get mode(): string {
    return this._mode;
  }
  public set mode(value: string) {
    this._mode = value;
  }

  private _hasTaskSubmit: boolean = false;
  public get hasTaskSubmit(): boolean {
    return this._hasTaskSubmit;
  }
  public set hasTaskSubmit(value: boolean) {
    this._hasTaskSubmit = value;
  }

  private _hasHidelawyer: boolean = false;
  public get hasHidelawyer(): boolean {
    return this._hasHidelawyer;
  }
  public set hasHidelawyer(value: boolean) {
    this._hasHidelawyer = value;
  }
  private _isDimCoverPageDownload: boolean = false;
  public get isDimCoverPageDownload(): boolean {
    return this._isDimCoverPageDownload;
  }
  public set isDimCoverPageDownload(value: boolean) {
    this._isDimCoverPageDownload = value;
  }

  public seizurePageType: SEIZURE_COLLATERAL_TYPE = SeizureCollateralTypes.PLEDGE;
  private _seizureDTO!: NonPledgePropertiesInfoResponse;
  public get seizureDTO(): NonPledgePropertiesInfoResponse {
    return this._seizureDTO;
  }
  public set seizureDTO(value: NonPledgePropertiesInfoResponse) {
    this._seizureDTO = value;
  }

  public selection = new SelectionModel<number | NonPledgePropertiesAsset>(true, []);

  constructor(
    private fb: UntypedFormBuilder,
    private seizureControllerService: SeizureControllerService,
    private errorHandlingService: ErrorHandlingService,
    private litigationCaseService: LitigationCaseService,
    private userController: UserControllerV2Service,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private seizureLitigationControllerService: SeizureLitigationControllerService,
    private seizureLitigationCaseControllerService: SeizureLitigationCaseControllerService,
    private seizureFeeControllerService: SeizureFeeControllerService,
    private translate: TranslateService
  ) {}

  /**
   * Get Seizure Execution (หน้าดำเนินการบันทึกผลการตั้งเรื่องยึดทรัพย์จำนอง)
   * GET /v1/seizure/litigation/{litigationId}/legal-executions/seizure/execution
   * @returns
   */
  getSeizureExecution(litigationId: string) {
    return this.seizureLitigationControllerService.getSeizureExecution(litigationId).pipe(
      map(result => result.litigationCases || []),
      map(litigationCases => litigationCases.flatMap(it => it.seizures)),
      map(seizures => seizures.flatMap(it => it?.seizureLeds)),
      map(seizureLeds => {
        return seizureLeds.map((data, index) => {
          const value = data || <SeizureLedsInfo>{};
          const deletable = value.seizureLedType !== SeizureLedTypes.MAIN;
          return <ILegalExecution>{
            seizureId: coerceString(value.seizureId),
            seizureLedId: coerceString(value.ledId),
            orderNo: index + 1,
            legalExecutionName: value.ledName,
            legalDepartment: 'SEIZURE_OFFICE_TYPE.' + value.seizureLedType,
            totalAsset: coerceNumberProperty(value.collaterals?.length, 0),
            keepDate: coerceString(value.ledRefNo),
            collectionNumber: coerceString(value.ledRefNoDate),
            reportStatus: 'SEIZURE_STATUS.' + value.status,
            isFeePaid: value.isFeePaid,
            action: {
              deletable: deletable,
              actionable: true,
            },
          };
        });
      })
    );
  }

  /**
   * GET /v1/seizure/{seizureId}/collaterals-leds/info
   * @description รายละเอียดสำนักงานบังคับคดีหลัก
   * @param seizureId
   * @returns
   */
  getCollateralLEDById(seizureId: string): Promise<SeizureLedsInfoResponse> {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getSeizureCollateralsLedsInfoBySeizureId(seizureId))
    );
  }

  /**
   * GET /v1/seizure/seizureLeds/{seizureLedId}/collaterals-leds/info
   * @description รายละเอียดสำนักงานบังคับคดีหลัก
   * @param seizureId
   * @returns
   */
  getSeizureLedsCollateralsLedsInfoBySeizureLedId(seizureId: string): Promise<SeizureLedsInfo> {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getSeizureLedsCollateralsLedsInfoBySeizureLedId(Number(seizureId)))
    );
  }

  /**
   * ยืนยันบันทึก
   * @param seizureLedId
   * @param request
   * @returns
   */
  saveSeizureLED(seizureLedId: string, request: PostSeizureInfoRequest) {
    const sLedId = coerceNumberProperty(seizureLedId);
    return this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.seizureControllerService.saveSeizureLedsInfo(sLedId, request)),
      { disableErrorDisplay: true, notShowAsSnackBar: true }
    );
  }

  /**
   * ดึงรายชื่อสำนักงานบังคับคดี
   * GET /v1/seizure/{seizureId}/litigation-case-leds
   * @returns
   */
  getExecutionOffices(seizureId: string) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getLitigationCaseLedsBySeizureId(seizureId)).then(
        result => result.litigationCaseLeds || []
      )
    );
  }

  /**
   * ลบรายชื่อสํานักงานบังคับคดี
   * DELETE /v1/seizure/{seizureId}/seizureLeds/{seizureLedId}
   * @param seizureLedId
   * @param seizureId
   * @returns
   */
  deleteSeizureLed(seizureId: string, seizureLedId: string) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.deleteSeizureLedsBySeizureIdAndSeizureLedId(seizureId, seizureLedId))
    );
  }

  /**
   * เพิ่มชื่อสํานักงานบังคับคดี
   * POST /v1/seizure/{seizureId}/leds/{ledId}/collaterals
   * @returns
   */
  mapNewSeizureExecution(seizureId: string, ledId: string, request: SeizureCollateralsRequest) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.saveSeizureLedsCollaterals(ledId, seizureId, request))
    );
  }

  /**
   * ดึงรายชื่อทนายความ
   * @param category
   * @param roleCode
   * @param fractionCode
   * @returns
   */
  getLawyerOptions(category: string = 'KLAW', roleCode: string = 'KLAW_USER', fractionCode: string = 'LAW006') {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userController.inquiryUserOptions(category, [fractionCode], [roleCode]))
    );
  }

  /**
   * ดึงประเภทหลักประกัน
   * @returns
   */
  getCollateralTypes() {
    return lastValueFrom(of(<CollateralTypeDTO[]>CollateralTypes));
  }

  /**
   * ยืนยันลบทรัพย์ /v1/seizure/seizureLedId/{seizureLedId}/collateral
   * @param seizureLedId
   * @param collateralId
   * @returns
   */
  removeCollateral(seizureLedId: string, collateralId: string) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.deleteSeizureLedsCollateral(collateralId, seizureLedId))
    );
  }

  /**
   * เพิ่มทรัพท์
   * @param seizureId
   * @param ledId
   * @param collaterals
   * @returns
   */
  addCollateral(seizureId: string, ledId: string, collaterals: SeizureCollateralsRequest) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.saveSeizureLedsCollaterals(ledId, seizureId, collaterals))
    );
  }

  /**
   * ย้ายทรัพท์
   * @param seizureId
   * @param seizureLedId
   * @param newLedId
   * @param collateralId
   * @returns
   */
  moveCollateral(seizureId: string, seizureMoveRequest: SeizureMoveRequest) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.moveSeizureLeds(seizureId, seizureMoveRequest))
    );
  }

  /**
   * Upload เอกสาร
   * @param documentTemplateId
   * @param seizureLedId
   * @param file
   * @returns
   */
  directUpload(documentTemplateId: string, seizureLedId: string, file: Blob, isManualError = false): Promise<any> {
    if (isManualError) {
      return lastValueFrom(
        this.seizureControllerService.uploadSeizureLedsDocument(documentTemplateId, seizureLedId, file)
      );
    } else {
      return this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(this.seizureControllerService.uploadSeizureLedsDocument(documentTemplateId, seizureLedId, file))
      );
    }
  }

  deleteDocument(documentTemplateId: string, seizureLedId: number): Promise<any> {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.deleteSeizureLedsDocument(documentTemplateId, seizureLedId))
    );
  }

  /**
   * Get Upload Receipt Non-EFilling
   * @param seizureLedId
   * @returns
   */
  getReceiptInfo(seizureLedId: string) {
    return lastValueFrom(
      this.seizureFeeControllerService.getUploadReceiptNonEFilling(coerceNumberProperty(seizureLedId))
    );
  }

  public lawyerForm!: UntypedFormGroup;
  getLawyerForm(data?: LitigationCaseShortDto) {
    if (data) {
      return this.fb.group({
        legalExecutionLawyerId: data.legalExecutionLawyerId || '',
      });
    } else {
      return this.fb.group({});
    }
  }

  getPostTaskSubmitRequest(data: Array<TitleDeedDocumentExtend>): PostTaskSubmitRequest {
    let ret: PostTaskSubmitRequest = {
      collateralIdList: [],
      documents: [],
    };
    ret.documents = data
      ?.filter(
        (f: TitleDeedDocumentExtend) =>
          f?.sent ||
          (this.litigationCaseService.listCollaterals?.includes(f?.relatedCollateral?.collateralId) &&
            (f.sendMethod === 'AT_KLAW' || f.sendMethod === 'TRIGGER_DIMS'))
      )
      .map(({ sent, readyForAsset, ...keepAttrs }) => keepAttrs) as SelectedDocument[];
    return ret;
  }

  getSubmitTitleDeedDocumentApprovalRequest(
    data: Array<TitleDeedDocumentExtend>,
    headerFlag: SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum
  ): SubmitTitleDeedDocumentApprovalRequest {
    let ret: SubmitTitleDeedDocumentApprovalRequest = {
      documents: [],
      headerFlag: headerFlag,
    };
    let documents = data
      ?.filter((f: TitleDeedDocumentExtend) => f.approve === false || f.approve === true || f.sent)
      .map((m: any) => {
        let rejectedReason: SeizureTitleDeedRejectedReason = {
          rejectedReason: m.rejectedReasonId,
          rejectedRemarks: m.rejectedRemarks,
          pageCount: m.docCount,
          documentName: m.name,
        };
        m.rejectedReason = rejectedReason;
        return m;
      }) as Array<SeizureTitleDeedDocument>;

    ret.documents = documents;
    return ret;
  }

  async validateTitleDeed(documents: Array<TitleDeedDocumentExtend>, isResubmit?: boolean) {
    let listAmd = [];
    let valid = false;
    if (isResubmit) {
      listAmd = documents?.filter((f: TitleDeedDocumentExtend) => f.sendMethod === 'AMD_MANUAL');
      valid = listAmd.every(r => r.sent || r.sendStatus) || listAmd.length === 0;
    } else {
      listAmd = documents?.filter(
        (f: TitleDeedDocumentExtend) =>
          f.sent || f.sendStatus || f.sendMethod === 'AT_KLAW' || f.sendMethod === 'TRIGGER_DIMS'
      );
      valid =
        listAmd.every(r => r.sent || r.sendStatus || r.sendMethod === 'AT_KLAW' || r.sendMethod === 'TRIGGER_DIMS') ||
        listAmd.length === 0;
    }
    if (!valid) {
      if (isResubmit) {
        await this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          `กรุณาระบุการส่งเอกสารต้นฉบับ ให้ครบถ้วน`
        );
        return false;
      } else {
        await this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          `
        กรุณาตรวจสอบความถูกต้องตามรายการ เพื่อสั่งการ:
        <br/>
        1. ต้องมีการเลือกทรัพย์อย่างน้อย 1 รายการ <br/>
        2. ต้องมีการเตรียมเอกสารต้นฉบับและนำส่งให้ครบถ้วน  <br/>
        3. รายงานการตรวจสภาพและประเมินราคาในรูปแบบ electronic file ต้องแสดงให้ครบถ้วนทุกรายการ`
        );
        return false;
      }
    }
    return true;
  }

  async validateTitleDeedApprove(documents: Array<TitleDeedDocumentExtend>, headerFlag: string) {
    let ret = { sucesss: false, type: '' };
    let msg: string = `ไม่สามารถยืนยันบันทึกรับเอกสารต้นฉบับได้ เนื่องจากยังระบุสถานะการรับ/ปฏิเสธเอกสารไม่ครบทุกรายการ
      กรุณากดปุ่ม ‘บันทึกร่าง’ เพื่อบันทึกข้อมูล และกลับมาทำต่อในภายหลัง หรือ ‘ยกเลิก’ เพื่อกลับไประบุสถานะต่อไป`;
    let msg1: string = `เอกสารต้นฉบับที่ถูกระบุว่าได้รับแล้ว จะไม่สามารถแก้ไขได้
หากมีเอกสารที่ถูกปฏิเสธต้นฉบับที่ยังต้องรอได้รับการแก้ไขจากต้นทางและกลับมาบันทึกรับต้นฉบับใหม่อีกครั้ง
คุณยืนยันจะบันทึกหรือไม่`;
    let list = documents?.filter(
      (f: TitleDeedDocumentExtend) =>
        f?.sendMethod === 'AMD_MANUAL' || (f?.approvedStatus === false && f?.sendMethod === 'TRIGGER_DIMS')
    );
    let allApprove = list?.every(r => r?.approve === true || r?.approvedStatus === true);
    if (headerFlag === SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Submit) {
      let onlyApprove = list?.every(r => r?.approve === true || r?.approvedStatus === true) && list?.length > 0;
      if (onlyApprove) {
        const confirm = await this.notificationService.warningDialog(
          'ยืนยันรับต้นฉบับ',
          'เอกสารต้นฉบับที่ถูกระบุว่าได้รับแล้ว จะไม่สามารถแก้ไขได้ คุณต้องการที่จะดำเนินการต่อใช่หรือไม่?',
          'ยืนยันรับต้นฉบับ'
        );
        if (confirm) return { sucesss: true, type: 'SUBMIT' };
      } else {
        let isKLaw = list.every(f => f?.sendMethod === 'AT_KLAW');
        if (!isKLaw) {
          const done = await this.notificationService.alertDialog(
            'ไม่สามารถดำเนินการได้',
            'กรุณาระบุข้อมูลการรับเอกสารต้นฉบับให้ถูกต้องครบถ้วนก่อนกดเสร็จสิ้น'
          );
          if (done) return { sucesss: false, type: 'SUBMIT' };
        } else {
          return { sucesss: true, type: 'SUBMIT' };
        }
      }
    }
    if (headerFlag === SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Draft) {
      if (allApprove) {
        const confirm = await this.notificationService.alertDialog(
          'ไม่สามารถดำเนินการได้',
          `มีการบันทึกรับเอกสารต้นฉบับสำเร็จทั้งหมดแล้ว
        กรุณากดเสร็จสิ้นเพื่อจบงาน`
        );
        if (confirm) return { sucesss: false, type: 'DRAFT' };
      } else {
        let hasValue =
          list?.every(r => r?.approve === true || r?.approve === false || r?.approvedStatus === true) &&
          list?.length > 0;
        if (hasValue) {
          const done = await this.notificationService.warningDialog(
            'ยืนยันบันทึกรับเอกสารต้นฉบับ',
            msg1,
            'ยืนยันบันทึก'
          );
          if (done) {
            return { sucesss: true, type: 'DRAFT_PARTIAL' };
          }
        } else {
          const confirm = await this.notificationService.warningDialog(
            'ระบบไม่สามารถยืนยันการบันทึกได้',
            msg,
            'บันทึกร่าง'
          );
          if (confirm) {
            return { sucesss: true, type: 'DRAFT' };
          }
        }
      }
    }
    return ret;
  }

  handleSaveError(error: HttpErrorResponse) {
    const errors = error.error?.errors;
    const errorCode = errors ? errors[0].code : '';
    const title = 'ไม่สามารถกดยืนยันบันทึกได้';

    switch (errorCode) {
      case ERROR_CODE.S003:
      case ERROR_CODE.S004:
      case ERROR_CODE.S005: {
        const msg = this.translate.instant('SEIZURE_ERROR_CODE.S003');
        this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE', 'icon-Check-Square');
        break;
      }
      case ERROR_CODE.S006:
        const msg = this.translate.instant('SEIZURE_ERROR_CODE.S006');
        this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          msg,
          'COMMON.BUTTON_ACKNOWLEDGE',
          'icon-Check-Square'
        );
        break;
      default: {
        const msg = this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR');
        const btnText = 'COMMON.BUTTON_ACKNOWLEDGE';
        this.notificationService.openSnackbarError(msg, { buttonText: btnText });
        break;
      }
    }
  }

  async getSeizureDocumentsTitleDeed(seizureId: string): Promise<SeizureDocumentsTitleDeedResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getSeizureDocumentsTitleDeed(seizureId))
    );
  }

  async postTaskSubmit(caseId: number, request: PostTaskSubmitRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.postTaskSubmit(caseId, request))
    );
  }

  async getSeizurePrepPerson(caseId: number): Promise<SeizurePerpPersonResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getSeizurePrepPerson(caseId))
    );
  }

  async getSeizurePrepTitleDeed(caseId: number): Promise<GetSeizurePrepTitleDeedResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getSeizurePrepTitleDeed(caseId))
    );
  }

  async getCollateralAppraisal(caseId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getCollateralAppraisal(caseId))
    );
  }

  async getCollateralAppraisalSeizure(caseId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getCollateralAppraisal(caseId))
    );
  }

  async getSeizurePrepTitleDeedDraft(caseId: number): Promise<GetSeizurePrepTitleDeedDraftResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getSeizurePrepTitleDeedDraft(caseId))
    );
  }

  async getLitigationCaseCollateralsSeizurePrepDraft(caseId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getLitigationCaseCollateralsSeizurePrepDraft(caseId))
    );
  }
  async getSeizureCollateralsLedsInfoBySeizureId(seizureId: string): Promise<SeizureLedsInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getSeizureCollateralsLedsInfoBySeizureId(seizureId))
    );
  }
  async getDocumentsApprovalDraft(seizureId: number): Promise<SeizureDocumentApprovalDraftResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getDocumentsApprovalDraft(seizureId))
    );
  }
  async getExcessDocuments(seizureId: string): Promise<ExcessDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getExcessDocuments(seizureId))
    );
  }
  async submitTitleDeedDocumentApproval(
    seizureId: string,
    request: SubmitTitleDeedDocumentApprovalRequest
  ): Promise<ExcessDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.seizureControllerService.submitTitleDeedDocumentApproval(seizureId, request)),
      { notShowAsSnackBar: true }
    );
  }

  async addNewExcessDocuments(
    seizureId: number,
    postExcessDocumentRequest: PostExcessDocumentRequest
  ): Promise<PostExcessDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.addNewExcessDocuments(seizureId, postExcessDocumentRequest))
    );
  }
  async updateSeizureExcessDocs(
    refId: number,
    seizureId: number,
    putSeizureExcessDocsRequest: PutExcessDocumentRequest
  ): Promise<PostExcessDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.seizureControllerService.updateSeizureExcessDocs(refId, seizureId, putSeizureExcessDocsRequest)
      )
    );
  }
  async deleteExcessDoc(refId: number, seizureId: number): Promise<PostExcessDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.deleteExcessDoc(refId, seizureId))
    );
  }
  async completedTitleDeedDocumentApproval(
    seizureId: string,
    request: CompletedTitleDeedDocumentApprovalRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.completedTitleDeedDocumentApproval(seizureId, request))
    );
  }
  async getSeizureCommand(litigationId: string): Promise<SeizureCommandResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationControllerService.getSeizureCommand(litigationId))
    );
  }
  async postExecutionLawyerSubmit(
    seizureId: number,
    postExecutionLawyerSubmitRequest: PostExecutionLawyerSubmitRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.seizureControllerService.postExecutionLawyerSubmit(seizureId, postExecutionLawyerSubmitRequest)
      )
    );
  }

  async amdResubmit(seizureId: number, documentAmdReSubmitRequest: DocumentAmdReSubmitRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.amdResubmit(seizureId, documentAmdReSubmitRequest))
    );
  }
  async validate(validateRequestDto: ValidateRequestDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.seizureControllerService.validate(validateRequestDto)),
      { notShowAsSnackBar: true }
    );
  }

  async rejectCoverPageGenerate(
    seizureId: number,
    rejectCoverPageGenerateRequest: RejectCoverPageGenerateRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.rejectCoverPageGenerate(seizureId, rejectCoverPageGenerateRequest))
    );
  }

  async generateSeizureAmdCoverPage(
    seizureId: number,
    seizureAmdCoverPageRequest: SeizureAmdCoverPageRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.generateSeizureAmdCoverPage(seizureId, seizureAmdCoverPageRequest))
    );
  }

  async postGenerateCoverPage(caseId: number, request: GenerateCoverPageRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.postGenerateCoverPage(caseId, request))
    );
  }

  checkDocumentIsReady() {
    let code = this.taskService.taskDetail.taskCode as taskCode;
    let personCout = this._docmentPerson.filter(r => r.imageId)?.length;
    let personTotal = this._docmentPerson?.length || 0;
    let lgCount = this.litigationCaseService.litigationCaseDocuments?.length || 0;
    let colleteralAppraisalCount = this.docCollateralAppraisal?.filter(r => r.imageId)?.length;
    let colleteralAppraisalCountTotal = this.docCollateralAppraisal?.length || 0;
    if (code === taskCode.R2E05_01_2D || this._mode === 'EDIT') {
      let selectedCol = this.documentsTitleDeed?.filter((f: TitleDeedDocumentExtend) =>
        this.litigationCaseService.listCollaterals?.includes(f?.relatedCollateral?.collateralId)
      );
      let titleDeedCount =
        selectedCol?.filter(
          (f: TitleDeedDocumentExtend) =>
            f?.sent || f?.readyForAsset || f?.sendMethod === 'TRIGGER_DIMS' || f?.sendMethod === 'AT_KLAW'
        )?.length || 0;
      this._docStatus.currentSeizure = personCout + lgCount + colleteralAppraisalCount + titleDeedCount;
      this._docStatus.totalSeizure = personTotal + lgCount + colleteralAppraisalCountTotal + (selectedCol?.length || 0);
    } else if (code === taskCode.R2E05_02_3C || code === taskCode.R2E05_06_3F) {
      let titleDeedCount =
        this.seizureDocumentsTitleDeed?.filter((f: TitleDeedDocumentExtend) => f?.approvedStatus || f?.approve)
          ?.length || 0;
      this._docStatus.currentSeizure = personCout + lgCount + colleteralAppraisalCount + titleDeedCount;
      this._docStatus.totalSeizure =
        personTotal + lgCount + colleteralAppraisalCountTotal + (this.seizureDocumentsTitleDeed?.length || 0);
    } else if (code === taskCode.R2E05_03_3D) {
      let titleDeedCount =
        this.seizureDocumentsTitleDeed?.filter((f: TitleDeedDocumentExtend) => f?.sendStatus || f?.sent)?.length || 0;
      this._docStatus.currentSeizure = personCout + lgCount + colleteralAppraisalCount + titleDeedCount;
      this._docStatus.totalSeizure =
        personTotal + lgCount + colleteralAppraisalCountTotal + (this.seizureDocumentsTitleDeed?.length || 0);
    } else {
      if (this._hasTaskSubmit) {
        let titleDeedCount =
          this.documentsTitleDeed?.filter((f: TitleDeedDocumentExtend) => f?.sendStatus)?.length || 0;
        this._docStatus.currentSeizure = personCout + lgCount + colleteralAppraisalCount + titleDeedCount;
        this._docStatus.totalSeizure =
          personTotal + lgCount + colleteralAppraisalCountTotal + (this.documentsTitleDeed?.length || 0);
      } else {
        let titleDeedCount =
          this.documentsTitleDeed?.filter((f: TitleDeedDocumentExtend) => f?.approvedStatus)?.length || 0;
        this._docStatus.currentSeizure = personCout + lgCount + colleteralAppraisalCount + titleDeedCount;
        this._docStatus.totalSeizure =
          personTotal + lgCount + colleteralAppraisalCountTotal + (this.documentsTitleDeed?.length || 0);
      }
    }
  }

  async setSeizureDocumentsTitleDeed(formSave: boolean = false, _seizureId: string = '0') {
    const seizureId = this.taskService.taskDetail.objectId || _seizureId;
    const seizureDocumentsTitleDeed = await this.getSeizureDocumentsTitleDeed(seizureId);
    this._seizureDocumentsTitleDeed = seizureDocumentsTitleDeed.titleDeedDocuments || [];
    this.isDimCoverPageDownload = seizureDocumentsTitleDeed.isDimCoverPageDownload || false;
    this.mode = formSave ? 'UPDATE_E05_02_3C' : this.mode || '';
  }

  setTimeStamp() {
    this._excessDocuments = this._excessDocuments.map((m: ExcessDocument) => {
      if (!m.submittedTimestamp) {
        m.submittedTimestamp = new Date().toISOString();
      }
      return m;
    });
  }

  saveSeizureLedsCollaterals(
    seizureId: string,
    result: 'SUCCESS' | 'FAILED',
    collateralIds: string[] = [],
    applyToAll: boolean = false,
    reasonId: number | undefined = undefined,
    remark: string = '',
    isNonMortgage?: boolean
  ) {
    let request: SeizureCollateralResultRequest = {
      remarks: remark,
      result: result,
      reasonId: reasonId,
      applyToAll: applyToAll,
    };

    if (isNonMortgage) {
      let assetsList = collateralIds.map(x => parseInt(x));
      request = { ...request, assetIdList: assetsList };
    } else {
      request = { ...request, collateralIdList: collateralIds };
    }

    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.seizureControllerService.saveSeizureLedsCollateralsResult(coerceNumberProperty(seizureId), request)
      )
    );
  }

  /**
   * เสร็จสิ้น
   * @param seizureId
   * @returns
   */
  submitSeizure(seizureId: string) {
    const id = coerceNumberProperty(seizureId);
    return this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.seizureControllerService.submitSeizure(id)),
      { notShowAsSnackBar: true }
    );
  }

  /**
   * นำส่งเอกสารทางไปรษณีย์
   * @param seizureLedId
   * @param request
   * @returns
   */
  async sendChannelSeizure(seizureLedId: string, request: DocumentReqOriginalChannelRequest) {
    const sLedId = coerceNumberProperty(seizureLedId);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.updateDocumentReqOriginalChannel(sLedId, request))
    );
  }

  async downloadKtbLogisticDoc(seizureId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.downloadKtbLogisticDoc(seizureId))
    );
  }

  selectedNonPledgeAssetIdList: number[] = [];
  async getNonPledgeProperties(caseId: number): Promise<NonPledgePropertiesInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getNonPledgePropertiesInfo(caseId))
    );
  }

  async submitNonPledgeProperties(caseId: number, request: NonPledgePropSubmitRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.nonPledgePropSubmit(caseId, request))
    );
  }

  async seizureDocumentValidationSubmit(
    seizureId: number,
    postSubmitDocumentValidationRequest: PostSubmitDocumentValidationRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.seizureControllerService.seizureDocumentValidationSubmit(seizureId, postSubmitDocumentValidationRequest)
      )
    );
  }

  async getSeizureNonPledgePropertiesInfo(seizureId: number): Promise<NonPledgePropertiesInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getSeizureNonPledgePropertiesInfo(seizureId))
    );
  }
}
