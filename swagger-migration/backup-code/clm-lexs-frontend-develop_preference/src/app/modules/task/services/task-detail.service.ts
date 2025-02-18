import { Injectable } from '@angular/core';
import { ConfigurationService } from '@app/modules/configuration/configuration.service';
import { CourtService } from '@app/modules/court/court.service';
import { defermentState } from '@app/modules/deferment/deferment.model';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { AdvanceService } from '@app/modules/finance/services/advance.service';
import { ExpenseService } from '@app/modules/finance/services/expense.service';
import { LitigationCaseDtoMeta, SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { DocumentPreparationResolver } from '@app/shared/components/document-preparation/document-preparation/document-preparation.resolver';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import {
  ActionBar,
  IMessageBanner,
  TaskCodeDecree,
  TaskCodeMemorandumCourt,
  TaskCodePayExecutionFee,
  TaskCodeWorkAroundBugFlowType,
  statusCode,
  taskCode,
} from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { AccessPermissions, SessionService } from '@app/shared/services/session.service';
import {
  CourtDecreeDto,
  CourtResultDto,
  CourtTrialDetailDto,
  DefermentDto,
  DefermentExecItem,
  DocumentInfoRequest,
  DocumentReceiveRequest,
  DocumentSendRequest,
  LitigationDetailDto,
  NoticeLetterRequest,
  PersonDto,
  ResponseUnitMapTasksRequest,
  TaskDetailDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import moment from 'moment';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskDetailService {
  constructor(
    private translate: TranslateService,
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private suitService: SuitService,
    private configurationService: ConfigurationService,
    private sessionService: SessionService,
    private buddhistEraPipe: BuddhistEraPipe,
    private courtService: CourtService,
    private expenseService: ExpenseService,
    private advanceService: AdvanceService,
    private documentPreparationResolver: DocumentPreparationResolver,
    private defermentService: DefermentService,
    private logger: LoggerService
  ) {}

  private _defermentState!: defermentState;
  public get defermentState(): defermentState {
    return this._defermentState;
  }
  private set defermentState(value: defermentState) {
    this._defermentState = value;
  }

  /**
   * GET MESSAGE BANNER OR SNACK_BAR
   **/
  getMsgDefaultBannerMapper() {
    return new Map<taskCode, string>([
      ['CHANGE_RELATED_PERSON', ''], // Format [ชื่อข้อมูล(อ้างอิงจาก Header ของตาราง)] + [ลำดับ] + ถูก + [Action eg. เพิ่ม, แก้ไข, ลบ] + โดย + [User ID] + [User first name + Lastname] + เมื่อ + DD/MM/YYYY HH:MM:SS
      ['EDIT_MORTGAGE_ASSETS', ''], // Format [ชื่อข้อมูล(อ้างอิงจาก Header ของตาราง)] + [ลำดับ] + ถูก + [Action eg. เพิ่ม, แก้ไข, ลบ] + โดย + [User ID] + [User first name + Lastname] + เมื่อ + DD/MM/YYYY HH:MM:SS
      ['VERIFY_INFO_AND_DOCUMENT', 'TASK_DETAIL.MESSAGE_BANNER.VERIFY_INFO_AND_DOCUMENT'],
      ['RECORD_NOTICE', 'TASK_DETAIL.MESSAGE_BANNER.RECORD_NOTICE'],
      ['RECORD_NOTICE_GUARANTOR', 'TASK_DETAIL.MESSAGE_BANNER.RECORD_NOTICE_GUARANTOR'],
      ['SEND_AND_TRACK_NOTICE', 'TASK_DETAIL.MESSAGE_BANNER.SEND_AND_TRACK_NOTICE'],
      ['SEND_AND_TRACK_NOTICE_GUARANTOR', 'TASK_DETAIL.MESSAGE_BANNER.SEND_AND_TRACK_NOTICE_GUARANTOR'],
      ['CONFIRM_NOTICE_LETTER', 'TASK_DETAIL.MESSAGE_BANNER.CONFIRM_NOTICE_LETTER'],
      ['NEWSPAPER_ANNOUCEMENT', 'TASK_DETAIL.MESSAGE_BANNER.NEWSPAPER_ANNOUCEMENT'],
      ['SUBMIT_ORIGINAL_DOCUMENT', 'TASK_DETAIL.MESSAGE_BANNER.SUBMIT_ORIGINAL_DOCUMENT'],
      ['RECEIPT_ORIGINAL_DOCUMENT', 'TASK_DETAIL.MESSAGE_BANNER.RECEIPT_ORIGINAL_DOCUMENT'],
      ['COLLECT_LG_ID', 'TASK_DETAIL.MESSAGE_BANNER.COLLECT_LG_ID'],
      ['ADD_SUB_ACCOUNT', 'TASK_DETAIL.MESSAGE_BANNER.ADD_SUB_ACCOUNT'], // Format ข้อมูล + <ชื่อตาราง> + <ลำดับ> + ถูก + <Action> + โดย + <รหัสพนักงาน> + "-" + <ชื่อ นามสกุล> + เมื่อ + DD/MM/YYYY HH:MM:SS
      ['INDICTMENT_RECORD', 'TASK_DETAIL.MESSAGE_BANNER.INDICTMENT_RECORD'],
      ['CONFIRM_COURT_FEES_PAYMENT', 'TASK_DETAIL.MESSAGE_BANNER.CONFIRM_COURT_FEES_PAYMENT_0'],
      ['UPLOAD_COURT_FEES_RECEIPT', 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_COURT_FEES_RECEIPT_0'],
      ['REQUEST_DEFERMENT', ''],
      ['EXTEND_DEFERMENT', ''],
      ['REQUEST_CESSATION', ''],
      ['RESPONSE_UNIT_MAPPING', this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.RESPONSE_UNIT_MAPPING', { ID: '' })],
      ['CONSIDER_REMAINING_COSTS', ''],
      ['CONSIDER_APPROVE_CLOSE_LG', ''],
      ['AUTO_CREATE_DRAFT_CESSATION', 'TASK_DETAIL.MESSAGE_BANNER.WARNING_AUTO_CREATE_CESSATION'],
      ['AUTO_CREATE_DRAFT_DEFERMENT', 'TASK_DETAIL.MESSAGE_BANNER.WARNING_AUTO_CREATE_DEFERMENT'],
      ['MEMORANDUM_COURT_FIRST_INSTANCE', 'TASK_DETAIL.MESSAGE_BANNER.MEMORANDUM_COURT_FIRST_INSTANCE'],
      ['MEMORANDUM_COURT_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.MEMORANDUM_COURT_APPEAL'],
      ['MEMORANDUM_SUPREME_COURT', 'TASK_DETAIL.MESSAGE_BANNER.MEMORANDUM_SUPREME_COURT'],
      ['CONSIDER_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.CONSIDER_APPEAL'],
      ['APPROVE_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.APPROVE_APPEAL'],
      ['CONDITIONAL_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.CONDITIONAL_APPEAL'],
      ['CONSIDER_SUPREME_COURT', 'TASK_DETAIL.MESSAGE_BANNER.CONSIDER_SUPREME_COURT'],
      ['CHANGE_RELATED_PERSON_BLACK_CASE', ''],
      ['CHANGE_RELATED_PERSON_LITIGATION_CASE', ''],
      ['DECREASE_RELATED_PERSON_LITIGATION_CASE', ''],
      ['APPROVE_SUPREME_COURT', 'TASK_DETAIL.MESSAGE_BANNER.APPROVE_SUPREME_COURT'],
      ['CONDITIONAL_SUPREME_COURT', 'TASK_DETAIL.MESSAGE_BANNER.CONDITIONAL_SUPREME_COURT'],
      ['RECORD_DIAGNOSIS_DATE', 'TASK_DETAIL.MESSAGE_BANNER.COURT_TRIAL'],
      ['UPLOAD_E_FILING', ''],
      ['PAY_EXECUTION_FEE_FIRST_INSTANCE', 'TASK_DETAIL.MESSAGE_BANNER.PAY_EXECUTION_FEE'],
      ['PAY_EXECUTION_FEE_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.PAY_EXECUTION_FEE'],
      ['PAY_EXECUTION_FEE_SUPREME', 'TASK_DETAIL.MESSAGE_BANNER.PAY_EXECUTION_FEE'],
      ['UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE', 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_EXECUTION_RECEIPT'],
      ['UPLOAD_EXECUTION_RECEIPT_APPEAL', 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_EXECUTION_RECEIPT'],
      ['UPLOAD_EXECUTION_RECEIPT_SUPREME', 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_EXECUTION_RECEIPT'],
      ['TRY_CONFIRM_COURT_FEES_PAYMENT', 'TASK_DETAIL.MESSAGE_BANNER.TRY_CONFIRM_COURT_FEES_PAYMENT'],
    ]);
  }

  getMsgChangeRelatedPerson(_person?: PersonDto[]): string {
    const _additionalPersons = _person || [];
    const _findAddPerson = _additionalPersons.find(
      item => item.updateFlag === 'A' || item.updateFlag === 'U' || item.updateFlag === 'D'
    );
    return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.CHANGE_RELATED_PERSON', {
      0: _findAddPerson ? this.translate.instant('CUSTOMER.MAPPING.RELATION.' + _findAddPerson?.relation) : '',
      1: _findAddPerson ? this.translate.instant('UPDATE_FLAG.' + _findAddPerson?.updateFlag) : '',
      2: 'USER ID',
      3: 'FIRSTNAME LASTNAME',
      4: 'DATE TIME',
    });
  }

  getMsgEditMortgageAsset() {
    return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.EDIT_MORTGAGE_ASSETS', {
      0: 'ASSETS',
      1: 'NO',
      2: 'ACTION',
      3: 'USER ID',
      4: 'FIRSTNAME LASTNAME',
      5: 'DATE TIME',
    });
  }

  getMsgCollectLgId(_litigationDetail: LitigationDetailDto, _taskCreatedBy: string = '') {
    const attributes = this.taskService.taskDetail.attributes?.replace(',', ' และ ');
    const createdTime = this.taskService.taskDetail.createdTime;
    return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.COLLECT_LG_ID', {
      0: attributes,
      1: _litigationDetail.litigationId,
      2: _taskCreatedBy,
      3: this.buddhistEraPipe.transform(createdTime, 'DD/MM/YYYY'),
      4: this.buddhistEraPipe.transform(createdTime, 'HH:mm:ss'),
    });
  }

  getMsgAddSubAccount(_taskCreatedBy: string = '') {
    const createdTime = this.taskService.taskDetail.createdTime;
    return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.ADD_SUB_ACCOUNT', {
      0: _taskCreatedBy,
      1: this.buddhistEraPipe.transform(createdTime, 'DD/MM/YYYY HH:mm:ss'),
    });
  }

  getMsgIndictmentRecord(_statusCode: statusCode) {
    switch (_statusCode) {
      case 'IN_PROGRESS':
        return 'TASK_DETAIL.MESSAGE_BANNER.PAY_COURT_FEES';
      case 'PENDING_REVISE':
        return 'TASK_DETAIL.MESSAGE_BANNER.PENDING_REVISE_INDICTMENT_RECORD';
      default:
        return 'TASK_DETAIL.MESSAGE_BANNER.INDICTMENT_RECORD';
    }
  }

  getMsgConfirmCourtFeesPayment(_msgBanner: string, isShowSuccess: boolean) {
    if (_msgBanner === 'TASK_DETAIL.MESSAGE_BANNER.CONFIRM_COURT_FEES_PAYMENT_0' || isShowSuccess) {
      return {
        message: 'TASK_DETAIL.MESSAGE_BANNER.CONFIRM_COURT_FEES_PAYMENT_1',
        type: 'success',
      } as IMessageBanner;
    } else {
      return {
        message: 'TASK_DETAIL.MESSAGE_BANNER.CONFIRM_COURT_FEES_PAYMENT_0',
        type: 'info',
      } as IMessageBanner;
    }
  }

  getMsgUploadCourtFeesReceipt(_msgBanner: string) {
    if (_msgBanner === 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_COURT_FEES_RECEIPT_0') {
      return {
        message: 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_COURT_FEES_RECEIPT_1',
        type: 'success',
      } as IMessageBanner;
    }
    return {
      message: 'TASK_DETAIL.MESSAGE_BANNER.UPLOAD_COURT_FEES_RECEIPT_0',
      type: 'info',
    } as IMessageBanner;
  }

  getMsgDefermentTasks(_taskCode: taskCode, _deferment: DefermentDto, _litigationDetail: LitigationDetailDto) {
    this.logger.info('getMsgDefermentTasks :: ', _taskCode, _deferment, _litigationDetail);

    const _litigationId = _litigationDetail?.litigationId;
    const _defermentInfo = _litigationDetail.defermentInfo;
    const _cessationInfo = _litigationDetail.cessationInfo;

    if (_taskCode === 'REQUEST_DEFERMENT') {
      /* Set Banner in case REQUEST_DEFERMENT */
      const messageBanner: string = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.REQUEST_DEFERMENT', {
        LG_ID: _litigationId || '',
        CREATED_BY: (_defermentInfo?.createdBy || '') + '-' + (_defermentInfo?.createdByName || ''),
        CREATED_DATE: this.buddhistEraPipe.transform(_defermentInfo?.createdDate, 'DD/MM/YYYY HH:mm:ss') || '',
      });
      return messageBanner;
    } else if (_taskCode === 'EXTEND_DEFERMENT') {
      /* Set Banner in case EXTEND_DEFERMENT */
      const messageBanner: string = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.EXTEND_DEFERMENT', {
        LG_ID: _litigationId || '',
        CREATED_BY: (_defermentInfo?.createdBy || '') + '-' + (_defermentInfo?.createdByName || ''),
        CREATED_DATE: this.buddhistEraPipe.transform(_defermentInfo?.createdDate, 'DD/MM/YYYY HH:mm:ss') || '',
      });
      return messageBanner;
    } else if (_taskCode === 'REQUEST_CESSATION') {
      /* Set Banner in case REQUEST_CESSATION */
      const messageBanner: string = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.REQUEST_CESSATION', {
        LG_ID: _litigationId || '',
        CREATED_BY: (_cessationInfo?.createdBy || '') + '-' + (_cessationInfo?.createdByName || ''),
        CREATED_DATE: this.buddhistEraPipe.transform(_cessationInfo?.createdDate, 'DD/MM/YYYY HH:mm:ss') || '',
      });
      return messageBanner;
    } else if (_taskCode === 'AUTO_CREATE_DRAFT_CESSATION') {
      return 'TASK_DETAIL.MESSAGE_BANNER.WARNING_AUTO_CREATE_CESSATION';
    } else if (_taskCode === 'REQUEST_REVISE_CESSATION' || _taskCode === 'REQUEST_REVISE_DEFERMENT') {
      // get reason REVISE && last date
      let reason = '';
      let reasonList =
        _deferment.deferment?.defermentApprovalHistoryInfos
          ?.filter(e => e.approveResult === 'REVISE')
          .sort((a, b) => {
            if (!a.approveDate) {
              return 1;
            }
            if (!b.approveDate) {
              return -1;
            }
            if (a.approveDate && b.approveDate) {
              if (new Date(b.approveDate || '').valueOf() - new Date(a.approveDate || '').valueOf() === 0) {
                return new Date(b.createdDate || '').valueOf() - new Date(a.createdDate || '').valueOf();
              }
              return new Date(b.approveDate).valueOf() - new Date(a.approveDate).valueOf();
            }
            return 0;
          }) || [];
      reason = reasonList[0].reason || '';
      return this.translate.instant(
        _taskCode === 'REQUEST_REVISE_CESSATION'
          ? 'TASK_DETAIL.MESSAGE_BANNER.REQUEST_REVISE_CESSATION'
          : 'TASK_DETAIL.MESSAGE_BANNER.REQUEST_REVISE_DEFERMENT',
        {
          REASON: reason,
        }
      );
    } else if (_taskCode === 'SAVE_DRAFT_DEFERMENT') {
      if (_deferment.deferment?.extendDeferment == true) {
        return 'TASK_DETAIL.MESSAGE_BANNER.SAVE_DRAFT_DEFERMENT_EXPAND';
      } else {
        return 'TASK_DETAIL.MESSAGE_BANNER.SAVE_DRAFT_DEFERMENT';
      }
    } else if (_taskCode === 'SAVE_DRAFT_CESSATION') {
      return 'TASK_DETAIL.MESSAGE_BANNER.SAVE_DRAFT_CESSATION';
    } else if (_taskCode === 'R2E07-01-A') {
      return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_R2E07-01-A');
    } else if (_taskCode === 'R2E07-05-E') {
      return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_R2E07-05-E');
    } else {
      return 'TASK_DETAIL.MESSAGE_BANNER.WARNING_AUTO_CREATE_DEFERMENT';
    }
  }

  getMsgChangeRelatedPersonBlackCase(_litigationDetail: LitigationDetailDto) {
    const bannerAddPerson = _litigationDetail.bannerAddPerson;
    const bannerAddPersonReason = _litigationDetail.bannerAddPersonReason;
    return `${bannerAddPerson}<br>${bannerAddPersonReason}`;
  }

  getDefermentMsgBanner(_litigationDetail: LitigationDetailDto): IMessageBanner {
    let result: IMessageBanner = {};
    const executionDefermentStatuses = ['DEFERMENT_EXEC_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SEIZURE_SALE'];
    if (
      _litigationDetail.defermentStatus === 'NORMAL' &&
      !!!_litigationDetail.defermentInfo?.defermentId &&
      !!!_litigationDetail.defermentExecInfo?.defermentId &&
      !!!_litigationDetail.cessationInfo?.defermentId
    ) {
      // first time for defermention
      this.defermentState = defermentState.NORMAL;
      return result;
    } else {
      const _currentLitigation = this.lawsuitService.currentLitigation;
      if (
        _litigationDetail.defermentStatus === 'NORMAL' &&
        (!!!_litigationDetail.defermentInfo?.approved || !!!_litigationDetail.defermentExecInfo?.approved) &&
        !!!_litigationDetail.cessationInfo?.defermentId
      ) {
        // NORMAL or EXTEND && Pending approved
        const _createdByName =
          _currentLitigation.defermentInfo?.createdBy + '-' + _currentLitigation.defermentInfo?.createdByName;
        const _createdDate =
          this.buddhistEraPipe.transform(_currentLitigation.defermentInfo?.createdDate, 'DD/MM/YYYY') || '';
        this.defermentState =
          _litigationDetail.defermentInfo?.approved === undefined ||
          _litigationDetail.defermentInfo?.approved === false ||
          _litigationDetail.defermentExecInfo?.approved === undefined ||
          _litigationDetail.defermentExecInfo?.approved === false
            ? defermentState.NORMAL_PENDING_APPROVED
            : defermentState.DEFERMENT_PENDING_APPROVED;
        result = !this.sessionService.isUserApprover()
          ? {
              message:
                _litigationDetail.defermentInfo?.approved === undefined ||
                _litigationDetail.defermentInfo?.approved === false
                  ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.NORMAL_PENDING_APPROVED', {
                      CREATEDBYNAME: _createdByName,
                      CREATEDDATE: _createdDate,
                    })
                  : this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
                      CREATEDBYNAME: _createdByName,
                      CREATEDDATE: _createdDate,
                    }),
              type: 'warn-normal',
            }
          : {};
        return result;
      } else if (
        _litigationDetail.defermentStatus === 'NORMAL' &&
        (!!_litigationDetail.defermentInfo?.approved || !!_litigationDetail.defermentExecInfo?.approved)
      ) {
        // NORMAL && Approved
        this.defermentState = defermentState.DEFERMENT;
        return result;
      } else if (
        (_litigationDetail.defermentStatus === 'DEFERMENT' && !!!_litigationDetail.defermentInfo?.approved) ||
        (executionDefermentStatuses.includes(_litigationDetail.defermentStatus || '') &&
          !!!_litigationDetail.defermentExecInfo?.approved)
      ) {
        // EXTEND && Pending approved
        const _createdByName =
          _currentLitigation.defermentInfo?.createdBy + '-' + _currentLitigation.defermentInfo?.createdByName;
        const _createdDate =
          this.buddhistEraPipe.transform(_currentLitigation.defermentInfo?.createdDate, 'DD/MM/YYYY') || '';
        this.defermentState = defermentState.DEFERMENT_PENDING_APPROVED;
        result = !this.sessionService.isUserApprover()
          ? {
              message: this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByName,
                CREATEDDATE: _createdDate,
              }),
              type: 'warn-normal',
            }
          : {};
        return result;
      } else if (
        (_litigationDetail.defermentStatus === 'DEFERMENT' && !!_litigationDetail.defermentInfo?.approved) ||
        (executionDefermentStatuses.includes(_litigationDetail.defermentStatus || '') &&
          !!_litigationDetail.defermentInfo?.approved)
      ) {
        // EXTEND && Approved
        this.defermentState = defermentState.DEFERMENT;
        if (
          _currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
          !!!_litigationDetail.cessationInfo?.approved
        ) {
          this.defermentState = defermentState.CESSATION_PENDING_APPROVED;
        }
        return result;
      } else if (
        _litigationDetail.defermentStatus === 'NORMAL' &&
        _currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        !!!_litigationDetail.cessationInfo?.approved
      ) {
        // CESSATION && Pending approved
        const _createdByName =
          _currentLitigation.cessationInfo?.createdBy + '-' + _currentLitigation.cessationInfo?.createdByName;
        const _createdDate =
          this.buddhistEraPipe.transform(_currentLitigation.cessationInfo?.createdDate, 'DD/MM/YYYY') || '';
        this.defermentState = defermentState.CESSATION_PENDING_APPROVED;
        result = !this.sessionService.isUserApprover()
          ? {
              message: this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByName,
                CREATEDDATE: _createdDate,
              }),
              type: 'warn-normal',
            }
          : {};
        return result;
      } else if (
        _litigationDetail.defermentStatus === 'CESSATION' &&
        _currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        !!_litigationDetail.cessationInfo?.approved
      ) {
        // CESSATION && Approved
        this.defermentState = defermentState.CESSATION;
        return result;
      }
      return result;
    }
  }

  getMsgSnackbarApproved(_taskCode?: taskCode, _litigationDetail?: LitigationDetailDto) {
    let msgSnackbar = '';
    if (_taskCode === 'COLLECT_LG_ID') {
      msgSnackbar = this.translate.instant('TASK.REJECT_DIALOG.LG_ID_APPROVED_SUCCESS');
    } else if (_taskCode === 'REQUEST_DEFERMENT') {
      if (
        this.defermentService.deferment?.deferment?.defermentApproverCode === '2' &&
        (this.defermentService.deferment?.deferment?.currentApproveActor === 'FACTION' ||
          this.defermentService.deferment?.deferment?.currentApproveActor === 'GROUP')
      ) {
        msgSnackbar = `${this.translate.instant(
          'COMMON.LABEL_LITIGATION_ID'
        )}: ${_litigationDetail?.litigationId} ${this.translate.instant(
          'TASK.REJECT_DIALOG.REQUEST_DEFERMENT_AGREE_SUCCESS'
        )}`;
      } else {
        msgSnackbar = `${this.translate.instant(
          'COMMON.LABEL_LITIGATION_ID'
        )}: ${_litigationDetail?.litigationId} ${this.translate.instant(
          'TASK.REJECT_DIALOG.REQUEST_DEFERMENT_APPROVED_SUCCESS'
        )}`;
      }
    } else if (_taskCode === 'EXTEND_DEFERMENT') {
      if (
        this.defermentService.deferment?.deferment?.defermentApproverCode === '2' &&
        (this.defermentService.deferment?.deferment?.currentApproveActor === 'FACTION' ||
          this.defermentService.deferment?.deferment?.currentApproveActor === 'GROUP')
      ) {
        msgSnackbar = this.translate.instant('TASK.REJECT_DIALOG.EXTEND_DEFERMENT_AGREE_SUCCESS', {
          LG_ID: _litigationDetail?.litigationId || '',
        });
      } else {
        msgSnackbar = this.translate.instant('TASK.REJECT_DIALOG.EXTEND_DEFERMENT_APPROVED_SUCCESS', {
          LG_ID: _litigationDetail?.litigationId || '',
        });
      }
    } else if (_taskCode === 'REQUEST_CESSATION') {
      msgSnackbar = `${this.translate.instant(
        'COMMON.LABEL_LITIGATION_ID'
      )}: ${_litigationDetail?.litigationId} ${this.translate.instant(
        'TASK.REJECT_DIALOG.REQUEST_CESSATION_APPROVED_SUCCESS'
      )}`;
    } else if (_taskCode === 'CHANGE_RELATED_PERSON_BLACK_CASE') {
      msgSnackbar = this.translate.instant(
        'DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LEGAL.SNACKBAR_ADD_LEGAL_APPROVED',
        { LG_ID: _litigationDetail?.litigationId || '' }
      );
    } else if (_taskCode === 'CHANGE_RELATED_PERSON_LITIGATION_CASE') {
      msgSnackbar = this.translate.instant(
        'DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.SNACKBAR_ADD_LAWSUIT_APPROVED',
        {
          BLACK_CASE:
            this.lawsuitService.findBlackCaseTaskDetail(Number(this.taskService.taskDetail.litigationCaseId)) || '',
        }
      );
    } else if (_taskCode === 'DECREASE_RELATED_PERSON_LITIGATION_CASE') {
      msgSnackbar = this.translate.instant(
        'DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.SNACKBAR_REMOVE_LEGAL_APPROVED',
        { LG_ID: _litigationDetail?.litigationId || '' }
      );
    } else if (_taskCode === 'CONSIDER_REMAINING_COSTS') {
      msgSnackbar = `${this.translate.instant(
        'COMMON.LABEL_LITIGATION_ID'
      )}: ${_litigationDetail?.litigationId} ${this.translate.instant('LAWSUIT.CLOSE.MSG_REMAINING_COSTS_SUCCESS')}`;
    } else if (_taskCode === 'CONSIDER_APPROVE_CLOSE_LG') {
      msgSnackbar = `${this.translate.instant(
        'COMMON.LABEL_LITIGATION_ID'
      )}: ${_litigationDetail?.litigationId} ${this.translate.instant('LAWSUIT.CLOSE.MSG_APPROVE_SUCCESS')}`;
    } else if (
      _taskCode === 'DECREE_OF_FIRST_INSTANCE' ||
      _taskCode === 'DECREE_OF_APPEAL' ||
      _taskCode === 'DECREE_OF_SUPREME_COURT'
    ) {
      msgSnackbar = this.translate.instant('TASK.REJECT_DIALOG.APPROVE_DECREE_SUCCESS', {
        LG_ID: _litigationDetail?.litigationId,
      });
    } else {
      msgSnackbar = `${this.translate.instant(
        'COMMON.LABEL_CIF_NUMBER'
      )}: ${_litigationDetail?.customerId} ${this.translate.instant('TASK.REJECT_DIALOG.APPROVED_SUCCESS')}`;
    }
    return msgSnackbar;
  }

  getMsgPendingApprovalDecree(_taskDetail: TaskDetailDto, _courtResults: Array<CourtResultDto>) {
    const activeCase = _courtResults?.find(res => res.litigationCaseId == _taskDetail.litigationCaseId);
    const findCaseOrder = _courtResults
      ?.filter(res => res.courtLevel === activeCase?.courtLevel)
      .findIndex(res => res.litigationCaseId == _taskDetail.litigationCaseId);
    const findDecreeOrder =
      activeCase?.courtDecrees?.findIndex(d => d.litigationCaseId == _taskDetail.litigationCaseId) || 0;
    return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_DECREE', {
      DECREE_ORDER: findDecreeOrder ? findDecreeOrder + 1 : 1,
      CASE_ORDER: findCaseOrder ? findCaseOrder + 1 : 1,
      CREATED_BY: activeCase ? activeCase.userId + ' ' + activeCase?.userName : '',
      CREATED_DATE: this.buddhistEraPipe.transform(_taskDetail.createdTime, 'DD/MM/YYYY HH:mm:ss') || '',
    });
  }

  getMsgInvestigateHeir(_taskCode: taskCode, _statusCode: statusCode, _debtorNameCaseAddHeir: string) {
    let messageBanner: string = '';
    switch (_taskCode) {
      case 'INVESTIGATE_HEIR_OR_TRUSTEE':
        if (_statusCode === 'PENDING') {
          messageBanner = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_INVESTIGATE_HEIR_OR_TRUSTEE', {
            DEBTOR_NAME: _debtorNameCaseAddHeir || '',
          });
        } else if (_statusCode === 'PENDING_APPROVAL' || _statusCode === 'AWAITING') {
          messageBanner = this.translate.instant(
            'TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_INVESTIGATE_HEIR_OR_TRUSTEE',
            {
              DEBTOR_NAME: _debtorNameCaseAddHeir || '',
            }
          );
        }
        break;
      case 'PROCESS_NOT_PROSECUTE_1':
        messageBanner = this.translate.instant(
          'TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_INVESTIGATE_HEIR_OR_TRUSTEE',
          {
            DEBTOR_NAME: _debtorNameCaseAddHeir || '',
          }
        );
        break;
      case 'PROCESS_NOT_PROSECUTE_2':
        if (_statusCode === 'PENDING') {
          messageBanner = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PROCESS_NOT_PROSECUTE_2_MAKER', {
            DEBTOR_NAME: _debtorNameCaseAddHeir || '',
          });
        } else if (_statusCode === 'PENDING_APPROVAL') {
          messageBanner = this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PROCESS_NOT_PROSECUTE_2_APPROVER', {
            DEBTOR_NAME: _debtorNameCaseAddHeir || '',
          });
        }
        break;
    }

    return messageBanner;
  }

  getMsgDeferExecution(_litigation: LitigationDetailDto, _taskCode: taskCode, _deferment: DefermentExecItem) {
    switch (_taskCode) {
      case taskCode.R2E07_01_A:
        return _deferment.extendDeferment || false
          ? this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_R2E07-01-A_EXTEND')
          : this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_R2E07-01-A');

      case taskCode.R2E07_02_B:
        return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_R2E07-02-B', {
          LG_ID: _litigation.litigationId,
          CREATED_BY: _deferment.createdBy || '',
          CREATED_BY_NAME: _deferment.createdByName || '',
          CREATED_DATE: this.buddhistEraPipe.transform(_deferment.createdDate, 'DD/MM/YYYY HH:mm:ss') || '',
        });

      case taskCode.R2E07_03_C:
        return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_APPROVAL_R2E07-03-C', {
          LG_ID: _litigation.litigationId,
          CREATED_BY: _deferment.createdBy || '',
          CREATED_BY_NAME: _deferment.createdByName || '',
          CREATED_DATE: this.buddhistEraPipe.transform(_deferment.createdDate, 'DD/MM/YYYY HH:mm:ss') || '',
        });

      case taskCode.R2E07_04_D:
        const defermentHistory = _deferment.defermentApprovalHistoryInfos || [];
        return this.translate.instant('TASK_DETAIL.MESSAGE_BANNER.PENDING_R2E07-04-D', {
          REASON: defermentHistory?.[defermentHistory.length - 1]?.reason || '-',
        });
    }
  }

  getDecreeAutoFinishButtonText(decree: CourtDecreeDto) {
    const allRecorded = decree.defendants?.every(d => d.decreeDueDate);
    const daysUntilToday = moment(decree.defendants?.[0].decreeDueDate).diff(moment(), 'days');
    if (allRecorded) {
      if (daysUntilToday > 0) {
        return this.translate.instant('TASK.BTN_DECREE_AUTO_FINISH', {
          NO_DAYS: daysUntilToday,
        });
      } else {
        return null;
      }
    }
    return 'TASK.BTN_DECREE_AUTO_FINISH_INIT';
  }

  /**
   * INIT ACTION BAR
   **/
  checkTaskCodePermission(
    _statusCode: statusCode,
    _accessPermissions: AccessPermissions,
    _isDuplicate: boolean
  ): boolean {
    // check taskCode and permission
    const _owner = this.taskService.taskOwner;
    const isFinished = _statusCode === 'FINISHED';
    const isUserAdmin = this.sessionService.currentUser?.roleCode === 'USER_ADMIN';
    const isViewer = this.sessionService.currentUser?.subRoleCode === 'VIEWER';
    return (
      !isFinished &&
      _owner &&
      this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) &&
      !_isDuplicate &&
      !isUserAdmin &&
      !isViewer
    );
  }

  initActionBar(
    _deferment: DefermentDto,
    _taskCode: taskCode,
    _statusCode: statusCode,
    _flowType: string,
    _accessPermissions: AccessPermissions,
    _isDuplicate: boolean,
    _isRecordNoSuccess?: boolean
  ): ActionBar {
    const _owner = this.taskService.taskOwner;
    const isEditor = ['APPROVER', 'MAKER'].includes(_accessPermissions.subRoleCode);
    const checkTaskCodePermission = this.checkTaskCodePermission(_statusCode, _accessPermissions, _isDuplicate);

    if (checkTaskCodePermission) {
      if (_taskCode === 'RECEIVE_ADVANCE_PAYMENT') {
        return this.initAdvanceActionBar(_statusCode === 'PENDING_APPROVAL' ? true : false, _isRecordNoSuccess);
      }

      if (
        _statusCode === 'PENDING_APPROVAL' &&
        this.sessionService.isUserApprover() &&
        _taskCode !== 'PROCESS_NOT_PROSECUTE_2' &&
        _taskCode !== 'APPROVE_APPEAL' &&
        _taskCode !== 'APPROVE_SUPREME_COURT'
      ) {
        if (_taskCode === 'UPLOAD_E_FILING') {
          return {
            hasCancel: true,
            hasSave: false,
            hasReject: true,
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Reset',
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_APPROVE',
          } as ActionBar;
        } else if (['PROCESS_NOT_PROSECUTE_1', 'INVESTIGATE_HEIR_OR_TRUSTEE'].includes(_taskCode)) {
          return {
            hasCancel: false,
            hasSave: false,
            hasReject: true,
            rejectText: 'COMMON.BUTTON_NOT_APPROVE',
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_APPROVE',
          } as ActionBar;
        } else {
          // For Approver
          const _hideCancel = [
            taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
            taskCode.MEMORANDUM_COURT_APPEAL,
            taskCode.MEMORANDUM_SUPREME_COURT,
            taskCode.INDICTMENT_RECORD, // LEX2-39408 เนียนลบ ยกเลิก กรณีอนุมัตืปกติ
          ].includes(_taskCode);
          return {
            hasCancel: !_hideCancel,
            hasSave: false,
            hasReject: true,
            rejectText: 'COMMON.BUTTON_NOT_APPROVE',
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_APPROVE',
          } as ActionBar;
        }
      } else if (
        _statusCode === 'AWAITING' &&
        this.sessionService.isUserApprover() &&
        _taskCode !== 'INVESTIGATE_HEIR_OR_TRUSTEE'
      ) {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_SAVE_ACKNOWLEDGE',
        } as ActionBar;
      } else if (
        ((_statusCode === 'IN_PROGRESS' && _flowType !== 'EDIT_APPROVAL' && _flowType !== 'REQUIRED_APPROVAL') ||
          _statusCode === 'PENDING' ||
          _statusCode === 'PENDING_REVISE') &&
        isEditor &&
        ![
          'CONSIDER_REMAINING_COSTS',
          'CONSIDER_APPROVE_CLOSE_LG',
          'AUTO_CREATE_DRAFT_DEFERMENT',
          'AUTO_CREATE_DRAFT_CESSATION',
          'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE',
          'TRY_CONFIRM_COURT_FEES_PAYMENT',
          'INVESTIGATE_HEIR_OR_TRUSTEE',
          'PROCESS_NOT_PROSECUTE_1',
          'PROCESS_NOT_PROSECUTE_2',
          'REQUEST_REVISE_CESSATION',
          'REQUEST_REVISE_DEFERMENT',
          'SAVE_DRAFT_DEFERMENT',
          'SAVE_DRAFT_CESSATION',
        ].includes(_taskCode) &&
        !TaskCodePayExecutionFee.includes(_taskCode)
      ) {
        // IN_PROGRESS staus ( NOT EDIT_APPROVAL and REQUIRED_APPROVAL flow ) AND PENDING status can edit BY Admin / Approver / Maker
        const _hasSaveAsPrimary =
          _taskCode === taskCode.SEND_AND_TRACK_NOTICE ||
          _taskCode === taskCode.SEND_AND_TRACK_NOTICE_GUARANTOR ||
          _taskCode === taskCode.CONFIRM_NOTICE_LETTER ||
          _taskCode === taskCode.NEWSPAPER_ANNOUCEMENT;
        const _hideSave =
          _taskCode === taskCode.DECREE_OF_FIRST_INSTANCE ||
          _taskCode === taskCode.DECREE_OF_APPEAL ||
          _taskCode === taskCode.DECREE_OF_SUPREME_COURT ||
          _taskCode === taskCode.UPLOAD_COURT_FEES_RECEIPT ||
          _taskCode === taskCode.CONFIRM_COURT_FEES_PAYMENT ||
          _taskCode === taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE ||
          _taskCode === taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL ||
          _taskCode === taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME ||
          _taskCode === taskCode.CONDITIONAL_APPEAL ||
          _taskCode === taskCode.CONDITIONAL_SUPREME_COURT;
        const _hideCancel = [
          taskCode.RECORD_NOTICE,
          taskCode.RECORD_NOTICE_GUARANTOR,
          taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
          taskCode.MEMORANDUM_COURT_APPEAL,
          taskCode.MEMORANDUM_SUPREME_COURT,
          taskCode.INDICTMENT_RECORD, // LEX2-38408
          taskCode.CONDITIONAL_APPEAL,
          taskCode.CONDITIONAL_SUPREME_COURT,
        ].includes(_taskCode);

        let defaultButtonCompleteText = 'COMMON.BUTTON_COMPLETE';
        if (_taskCode === 'INDICTMENT_RECORD' && ['PENDING', 'PENDING_REVISE'].includes(_statusCode)) {
          defaultButtonCompleteText = 'COMMON.BUTTON_REQUEST_APPROVAL';
        } else if (
          _taskCode === taskCode.DECREE_OF_FIRST_INSTANCE ||
          _taskCode === taskCode.DECREE_OF_APPEAL ||
          _taskCode === taskCode.DECREE_OF_SUPREME_COURT
        ) {
          defaultButtonCompleteText = 'COMMON.BUTTON_FINISH';
        }
        return {
          hasCancel: !_hideCancel,
          hasSave: !_hasSaveAsPrimary && !_hideSave,
          hasReject: false,
          hasPrimary: true,
          primaryText: _hasSaveAsPrimary ? 'COMMON.BUTTON_SAVE' : defaultButtonCompleteText,
        } as ActionBar;
      } else if (_statusCode === 'FAILED' && isEditor) {
        // For Admin / Approver / Maker
        const _hasSave = _taskCode === taskCode.NEWSPAPER_ANNOUCEMENT;
        return {
          hasCancel: true,
          hasSave: !_hasSave,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_COMPLETE',
        } as ActionBar;
      } else if (_taskCode === 'CONSIDER_REMAINING_COSTS') {
        let isViewMode: boolean = false;
        if (
          (this.sessionService.currentUser?.subRoleCode === 'MAKER' ||
            this.sessionService.currentUser?.subRoleCode === 'APPROVER') &&
          this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)
        ) {
          isViewMode = false;
        } else {
          isViewMode = true;
        }
        return {
          hasPrimary: !isViewMode,
          primaryText: 'LAWSUIT.CLOSE.BTN_NO_OUTSTANDING_CHARGES',
          primaryIcon: 'icon-Selected',
          hasCancel: !isViewMode,
          hasReject: false,
          hasSave: false,
        } as ActionBar;
      } else if (_taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT' || _taskCode === 'AUTO_CREATE_DRAFT_CESSATION') {
        let _autoBtnName =
          _taskCode === 'AUTO_CREATE_DRAFT_DEFERMENT'
            ? this.translate.instant('LAWSUIT.BTN_DELAY_LITIGATION')
            : this.translate.instant('LAWSUIT.BTN_CEASE_LITIGATION');
        return {
          hasCancel: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasPrimary: true,
          hasReject: true,
          rejectText: 'COMMON.BUTTON_REJECT',
          primaryText: _autoBtnName,
          primaryIcon: 'icon-Pause',
        } as ActionBar;
      } else if (_taskCode === 'RECORD_OF_SUPREME_COURT' && _statusCode === 'AWAITING') {
        return {
          hasCancel: true,
          hasSave: true,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_COMPLETE',
        } as ActionBar;
      } else if (_statusCode === 'PENDING' && _taskCode === 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE') {
        let isViewMode: boolean = true;
        if (
          this.sessionService.currentUser?.subRoleCode === 'MAKER' &&
          this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)
        ) {
          isViewMode = false;
        } else {
          isViewMode = true;
        }
        return {
          hasPrimary: !isViewMode,
          primaryText: 'COMMON.BUTTON_ACKNOWLEDGE',
          primaryIcon: 'icon-Selected',
          hasCancel: false,
          hasReject: false,
          hasSave: false,
        } as ActionBar;
      } else if (TaskCodeMemorandumCourt.includes(_taskCode) && _statusCode === 'AWAITING') {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_ACKNOWLEDGE',
        } as ActionBar;
      } else if (TaskCodeDecree.includes(_taskCode) && _statusCode === 'AWAITING') {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: false,
          hasPrimary: true,
          displayPrimaryTextString: true,
          disabledPrimaryButton: true,
        } as ActionBar;
      } else if (
        TaskCodeWorkAroundBugFlowType.includes(_taskCode) &&
        ['PENDING', 'IN_PROGRESS'].includes(_statusCode)
      ) {
        /* 'else if' block: for work-around LEX2-5909 not showing save, submit buttons. Since flowType = 'EDIT_APPROVAL' */
        return {
          hasCancel: true,
          hasSave: true,
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        } as ActionBar;
      } else if (TaskCodePayExecutionFee.includes(_taskCode)) {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
          primaryIcon: 'icon-Selected',
          rejectText: 'TASK.BTN_NO_DECREE',
        };
      } else if (
        _statusCode === 'PENDING_APPROVAL' &&
        (_taskCode === 'APPROVE_APPEAL' || _taskCode === 'APPROVE_SUPREME_COURT')
      ) {
        return {
          hasCancel: false,
          hasSave: false,
          hasPrimary: true,
          hasReject: true,
          rejectNormalBtnStyle: true,
          primaryText: 'COMMON.BUTTON_APPROVE',
          rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          rejectIcon: 'icon-Reset',
        };
      } else if (_taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE') {
        const actionBar: ActionBar = {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          hasPrimary: true,
        };
        if (_statusCode === 'PENDING') {
          if (this.lawsuitService?.currentLitigation?.checkStatusAddHeir) {
            actionBar.hasPrimary = false;
            actionBar.hasReject = false;
          } else {
            actionBar.primaryText = 'COMMON.BUTTON_COMPLETE';
            actionBar.rejectText = 'CUSTOMER.BTN_NOT_FOUND';
          }
        } else if (_statusCode === 'AWAITING' && this.sessionService.isUserApprover()) {
          actionBar.primaryText = 'COMMON.BUTTON_APPROVE_AS_PROPOSED';
          actionBar.rejectText = 'COMMON.BUTTON_NOT_APPROVE';
        } else {
          actionBar.hasReject = false;
          actionBar.hasPrimary = false;
        }
        return actionBar;
      } else if (_taskCode === 'PROCESS_NOT_PROSECUTE_2' && _statusCode === 'PENDING') {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_AGREE_AS_PROPOSED',
          rejectText: 'COMMON.BUTTON_NOT_AGREE_AS_PROPOSED',
        } as ActionBar;
      } else if (_taskCode === 'PROCESS_NOT_PROSECUTE_2' && _statusCode === 'PENDING_APPROVAL') {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_APPROVE_AS_PROPOSED',
          rejectText: 'COMMON.BUTTON_NOT_APPROVE_AS_PROPOSED',
        } as ActionBar;
      } else if (
        (_taskCode === 'REQUEST_REVISE_CESSATION' || _taskCode === 'REQUEST_REVISE_DEFERMENT') &&
        _statusCode === 'PENDING'
      ) {
        return {
          hasCancel: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        } as ActionBar;
      } else if (
        (_taskCode === 'SAVE_DRAFT_DEFERMENT' || _taskCode === 'SAVE_DRAFT_CESSATION') &&
        _statusCode === 'PENDING'
      ) {
        return {
          hasCancel: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: true,
          rejectText: 'COMMON.BUTTON_DELTE',
          rejectIcon: 'icon-Bin',
          hasPrimary: true,
          primaryText:
            _taskCode === 'SAVE_DRAFT_CESSATION'
              ? 'LAWSUIT.DEFERMENT.SAVE_CESSATION'
              : _deferment.deferment?.extendDeferment == true
                ? 'LAWSUIT.DEFERMENT.SAVE_DEFERMENT_EXPAND'
                : 'LAWSUIT.DEFERMENT.SAVE_DEFERMENT',
        } as ActionBar;
      } else {
        return { hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false } as ActionBar;
      }
    } else {
      if (TaskCodeDecree.includes(_taskCode)) {
        if (_statusCode === 'PENDING_APPROVAL') {
          return {
            hasCancel: false,
            hasSave: false,
            hasReject: true,
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Arrow-Revert',
            rejectNormalBtnStyle: true,
            hasPrimary: false,
          } as ActionBar;
        } else if (_statusCode === 'FINISHED') {
          return {
            hasCancel: false,
            hasSave: false,
            hasReject: false,
            hasPrimary: true,
            displayPrimaryTextString: true,
            disabledPrimaryButton: true,
          } as ActionBar;
        } else {
          return { hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false } as ActionBar;
        }
      } else {
        return { hasCancel: false, hasSave: false, hasReject: false, hasPrimary: false } as ActionBar;
      }
    }
  }

  initFinanceActionBar(_taskCode: taskCode): ActionBar {
    switch (_taskCode) {
      case 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION':
        return {
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: true,
          rejectText: 'COMMON.BUTTON_NOT_APPROVE',
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_APPROVE',
          hasCancel: false,
        } as ActionBar;
      case 'EXPENSE_CLAIM_PAYMENT_APPROVAL':
        return {
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: true,
          rejectText: 'COMMON.BUTTON_NOT_APPROVE',
          rejectIcon: 'icon-Dismiss-Square',
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_APPROVE',
          hasCancel: false,
        } as ActionBar;
      case 'EXPENSE_CLAIM_CORRECTION':
        if (this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION') {
          return {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            rejectText: 'FINANCE.REJECT_DIALOG.TITLE_PAYMENT_BOOK_CANCEL',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT',
          } as ActionBar;
        } else if (
          this.expenseService.expenseDetail?.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL'
        ) {
          return {
            hasCancel: false,
            hasSave: false,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: true,
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Arrow-Revert',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT_PAYMENT',
          } as ActionBar;
        } else {
          return {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: true,
            rejectText: 'FINANCE.REJECT_DIALOG.TITLE_PAYMENT_BOOK_CANCEL',
            hasPrimary: true,
            primaryText: 'FINANCE.BUTTON_SUBMIT',
          } as ActionBar;
        }
      case 'EXPENSE_CLAIM_RECEIPT_UPLOAD':
        if (this.taskService.taskDetail.statusCode == 'PENDING_APPROVAL') {
          return {
            hasCancel: false,
            hasSave: false,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Arrow-Revert',
            hasReject: true,
            hasPrimary: true,
            primaryText: 'COMMON.LABEL_APPROVE',
          } as ActionBar;
        } else {
          return {
            hasCancel: false,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE_DARFT',
            hasReject: false,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
          } as ActionBar;
        }
      case 'EXPENSE_CLAIM_VERIFICATION':
        return {
          hasCancel: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: true,
          rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          rejectIcon: 'icon-Arrow-Revert',
          hasPrimary: true,
          primaryText: 'FINANCE.BUTTON_SUBMIT_PAYMENT',
        } as ActionBar;
      case 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT':
      case 'REVERSE_EXPENSE_CLAIM_OTHER':
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          rejectText: 'FINANCE.BUTTON_REJECT_REFUND',
          hasPrimary: true,
          primaryText: 'FINANCE.BUTTON_SUBMIT_REFUND',
        } as ActionBar;
      default:
        return { hasSave: false, hasReject: false, hasPrimary: false, hasCancel: false } as ActionBar;
    }
  }

  initAdvanceActionBar(isApproved: boolean, isNoRecordSuccess: boolean = false) {
    if (isApproved) {
      return {
        hasCancel: false,
        hasSave: false,
        hasReject: true,
        hasPrimary: true,
        rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
        rejectIcon: 'icon-Arrow-Revert',
        primaryText: 'COMMON.BUTTON_APPROVE',
        primaryIcon: 'icon-Selected',
      };
    } else {
      if (isNoRecordSuccess) {
        return {
          hasCancel: false,
          hasSave: false,
          hasReject: true,
          hasPrimary: true,
          rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          rejectIcon: 'icon-Arrow-Revert',
          primaryText: 'FINANCE.BUTTON_SUBMIT_SENT_DATA',
          primaryIcon: 'icon-Selected',
        };
      } else {
        return {
          hasCancel: false,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE_DARFT',
          hasReject: true,
          hasPrimary: true,
          rejectText: 'FINANCE.BUTTON_CANCEL_LIST',
          primaryText: 'FINANCE.BUTTON_SUBMIT',
          primaryIcon: 'icon-Selected',
        };
      }
    }
  }

  /**
   * INIT DOCUMENT DATA
   **/
  initDocumentData() {
    this.documentService.currentDocPerson = this.documentService.getDocumentPerson();
    this.documentService.currentDocCol = this.documentService.getDocumentCollateral();
    this.documentAccountService.customer = this.documentService.customer;
    this.documentAccountService.filterRelevantAccountDocuments();
  }

  async initDocumentAuditLog() {
    await this.documentPreparationResolver.resolve();
  }

  /**
   * GET REQUEST PAYLOAD DATA FOR API
   **/
  getPayloadDocumentInfoRequest(_mode: 'SAVE' | 'SUBMIT', _taskId?: number): DocumentInfoRequest | false {
    const documentInfo = this.documentService.getDocumentInfoRequest(_taskId) as any;
    if (_mode === 'SUBMIT') {
      const requestPayload: DocumentInfoRequest = {
        documents: documentInfo.documents,
        closeTaskId: documentInfo.closeTaskId ? documentInfo.closeTaskId : null,
      };
      const validator = this.documentService.checkCondition(documentInfo);
      return validator ? requestPayload : false;
    } else {
      const requestPayload: DocumentInfoRequest = {
        documents: documentInfo.documents,
        closeTaskId: documentInfo.closeTaskId ? documentInfo.closeTaskId : null,
      };
      return requestPayload;
    }
  }

  getPayloadNoticeLetterRequest(_mode: 'SAVE' | 'SUBMIT', _taskId: number): NoticeLetterRequest {
    const requestPayload: NoticeLetterRequest = {
      headerFlag:
        _mode === 'SUBMIT' ? NoticeLetterRequest.HeaderFlagEnum.Submit : NoticeLetterRequest.HeaderFlagEnum.Draft,
      notices: this.lawsuitService.noticeLetterRequest.notices,
      taskId: _taskId,
    };
    return requestPayload;
  }

  getPayloadDocumentReceiveRequest(
    _mode: 'SAVE' | 'SUBMIT',
    documentInfo: any,
    _taskId?: number
  ): DocumentReceiveRequest {
    if (_mode === 'SUBMIT') {
      const requestPayload: DocumentReceiveRequest = {
        documents: documentInfo.receiveDocumentReq,
        taskId: _taskId,
        headerFlag: DocumentReceiveRequest.HeaderFlagEnum.Submit,
        rejectedExceedDocuments: this.documentService.rejectedExceedDocuments,
      };
      return requestPayload;
    } else {
      const requestPayload: DocumentReceiveRequest = {
        documents: documentInfo.receiveDocumentReq,
        taskId: _taskId,
        headerFlag: DocumentReceiveRequest.HeaderFlagEnum.Draft,
        rejectedExceedDocuments: this.documentService.rejectedExceedDocuments,
      };
      return requestPayload;
    }
  }

  getPayloadDocumentSendRequest(_mode: 'SAVE' | 'SUBMIT', documentInfo: any, _taskId?: number): DocumentSendRequest {
    const requestPayload: DocumentSendRequest = {
      documents: documentInfo.sendDocumentReq,
      taskId: _taskId,
      headerFlag:
        _mode === 'SUBMIT' ? DocumentSendRequest.HeaderFlagEnum.Submit : DocumentSendRequest.HeaderFlagEnum.Draft,
    };
    return requestPayload;
  }

  getIndictmentRecordCaseMapper() {
    let caseMapper: LitigationCaseDtoMeta = {};
    for (let index = 0; index < this.suitService.litigationCase.length; index++) {
      const element = this.suitService.litigationCase[index];
      const item = element.cases?.find((f: any) => f.actionFlag === true);
      if (item) {
        caseMapper = item;
        break;
      }
    }
    return caseMapper;
  }

  getPayloadCourtTrial(_mode: 'SAVE' | 'SUBMIT', _lgId: string): CourtTrialDetailDto {
    const requestPayload: CourtTrialDetailDto = {
      headerFlag:
        _mode === 'SUBMIT' ? CourtTrialDetailDto.HeaderFlagEnum.Submit : CourtTrialDetailDto.HeaderFlagEnum.Draft,
      litigationId: _lgId,
      litigationCaseId: _lgId ? Number(this.taskService.taskDetail.litigationCaseId) : 0,
    };
    return requestPayload;
  }

  getPayloadResponseUnitMap(_mode: 'SAVE' | 'SUBMIT', _taskId: number): ResponseUnitMapTasksRequest {
    const requestPayload: ResponseUnitMapTasksRequest = {
      headerFlag:
        _mode === 'SUBMIT'
          ? ResponseUnitMapTasksRequest.HeaderFlagEnum.Submit
          : ResponseUnitMapTasksRequest.HeaderFlagEnum.Draft,
      taskId: _taskId,
      responseUnitRequest: this.configurationService.getResponseUnitMapRequestList(),
    };
    return requestPayload;
  }

  /**
   * CLEAR DATA
   **/
  clearAllData() {
    this.documentService.clearData();
    this.lawsuitService.clearData();
    this.taskService.clearData();
    this.suitService.clearData();
    this.configurationService.clearData();
    this.courtService.clearData();
    this.advanceService.clearData();
  }

  // set hasEdit to false when save draft
  resetHasEdit() {
    this.documentService.hasEdit = false;
    this.lawsuitService.hasEdit = false;
  }

  verifyCanDeactivate(_nextRouting: string) {
    const ignorePathClearData = ['/task/detail/suit-indictment', '/court/court-detail'];
    return (
      ignorePathClearData.includes(_nextRouting) ||
      _nextRouting.startsWith('/main/task/detail/suit-indictment') ||
      _nextRouting.startsWith('/main/lawsuit/court/court-detail') ||
      _nextRouting.startsWith('/main/lawsuit/court/decree-detail') ||
      _nextRouting.startsWith('/main/lawsuit/court/execution-detail') ||
      _nextRouting.startsWith('/main/lawsuit/court/execution-receipt-upload') ||
      _nextRouting.startsWith('/main/task/detail/efiling-form') ||
      _nextRouting.startsWith('/main/task/detail/court-fee-form') ||
      _nextRouting.startsWith('/main/lawsuit/deferment/defer/debt-summary') ||
      _nextRouting.startsWith('/main/task/court/court-detail') ||
      _nextRouting.startsWith('/main/task/deferment/defer/seizure-property') ||
      _nextRouting.startsWith('/main/task/court/execution-detail')
    );
  }
}
