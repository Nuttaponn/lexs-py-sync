import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaveTrackingComponent } from '@app/modules/lawsuit/lawsuit-detail/save-tracking/save-tracking.component';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { LexsUserDto, LitigationCaseDto, LitigationDetailDto, NameValuePair } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { SessionService } from '@shared/services/session.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import moment from 'moment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-litigation-summary',
  templateUrl: './litigation-summary.component.html',
  styleUrls: ['./litigation-summary.component.scss'],
})
export class LitigationSummaryComponent implements OnInit, OnDestroy {
  @Input() litigationDetail!: LitigationDetailDto;
  @Input() blackCaseNo!: string;
  public litigationCase!: LitigationCaseDto;
  public litigationCaseCivil?: LitigationCaseDto;
  public litigationCaseAppeal?: LitigationCaseDto;
  public litigationCaseSupreme?: LitigationCaseDto;
  public lexsUser: Array<LexsUserDto> = [];
  public selectIndex: number = 0;

  private subs = new SubSink();

  public isOpened1 = true;
  public isOpened2 = true;
  public isOpened3 = true;
  public isOpened4 = true;
  public isOpened5 = true;
  public isOpened6 = true;
  public isOpened7 = true;
  public isOpened8 = true;

  public isSelectAllSuit = false;

  public ddlLawsuit: DropDownConfig = { searchPlaceHolder: '', labelPlaceHolder: 'แสดง' };
  public ddlLawsuitOptions: SimpleSelectOption[] = [];
  public ddlLawsuitCtrl: UntypedFormControl = new UntypedFormControl();

  public displayedColumns: string[] = ['no', 'track_name', 'track_date', 'status', 'track_status'];
  public dataSource: any;
  public displayedColumns_cc: string[] = ['no', 'costcenter', 'emp_name', 'tel', 'leader', 'tel_leader'];

  private followUpStatuses: Array<NameValuePair> | undefined = [];
  public hasLitigationCase = false;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private masterDataService: MasterDataService,
    private lawsuitService: LawsuitService,
    private route: ActivatedRoute
  ) {
    this.litigationDetail = this.lawsuitService.currentLitigation;
    if (this.route?.snapshot?.queryParams['blackCaseNo']) {
      this.blackCaseNo = this.route?.snapshot?.queryParams['blackCaseNo'];
    }
  }

  get ddlLawsuitNotAllOptions() {
    return this.ddlLawsuitOptions.filter(i => i.value !== 'ALL');
  }

  async ngOnInit() {
    // get follow-up status
    const followUpRes = await this.masterDataService.followUpStatus();
    this.followUpStatuses = followUpRes.followUpStatus;

    this.setddl();
    this.setData();
    this.setDataFollowsup();
    this.subs.add(
      this.ddlLawsuitCtrl.valueChanges.subscribe(value => {
        this.selectIndex = this.ddlLawsuitNotAllOptions.findIndex(x => x.value === this.ddlLawsuitCtrl.value) + 1;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setDataFollowsup() {
    this.dataSource = [];
    if (this.litigationDetail?.followups) {
      this.dataSource = this.litigationDetail?.followups.sort((a, b) => {
        const d1 = a.followupDate || '';
        const d2 = b.followupDate || '';
        return d1.localeCompare(d2);
      });
    }
  }

  setddl() {
    this.ddlLawsuitOptions = [{ text: 'ทุกคดี', value: 'ALL' }];
    let blackCaseNum: number = 1;
    this.litigationDetail?.cases?.forEach(data => {
      const en = this.ddlLawsuitOptions.find(x => x.value === data.civilCourtBlackCaseNo);
      if (!en) {
        let opt: SimpleSelectOption = {
          text: '',
          value: '',
        };
        const civilCourtBlackCaseNo = data.civilCourtBlackCaseNo || '';
        const blackCaseText =
          this.translate.instant('CUSTOMER.CASE_INFO.LIGITATION_CASE_TITLE') +
          ' ' +
          blackCaseNum +
          ': ' +
          this.translate.instant('COMMON.LABEL_BLACK_CASE_NO') +
          ' ' +
          civilCourtBlackCaseNo +
          '';
        opt.text = blackCaseText || '';
        opt.value = data.civilCourtBlackCaseNo ? data.civilCourtBlackCaseNo : '';
        this.ddlLawsuitOptions.push(opt);
        blackCaseNum++;
      }
    });
    if (this.ddlLawsuitOptions.length > 0) {
      if (!!!this.ddlLawsuitCtrl.value) {
        this.ddlLawsuitCtrl.setValue(this.ddlLawsuitOptions[0].value);
        this.ddlLawsuitCtrl.updateValueAndValidity();
      }
      this.fiterData();
    }
  }
  setData() {
    this.lexsUser = [];
    if (this.blackCaseNo) {
      const matchedOption = this.litigationDetail.cases?.find(c => c.blackCaseNo === this.blackCaseNo);
      this.ddlLawsuitCtrl.setValue(matchedOption?.civilCourtBlackCaseNo || this.ddlLawsuitOptions[0].value);
      this.ddlLawsuitCtrl.updateValueAndValidity();
      this.selectIndex = this.ddlLawsuitNotAllOptions.findIndex(x => x.value === this.ddlLawsuitCtrl.value) + 1;
      this.fiterData();
    }
    //LEX2-312 change-label-and-data kdn + kbd to kbd(กบม)
    if (this.litigationDetail?.amdUser) this.lexsUser.push(this.litigationDetail.amdUser);
    if (this.litigationDetail?.kbdUser) this.lexsUser.push(this.litigationDetail.kbdUser);
    if (this.litigationDetail?.lawyerUser) this.lexsUser.push(this.litigationDetail.lawyerUser);
  }

  ddlOnChanges(val: any) {
    if (val === 'ALL') {
      this.isSelectAllSuit = true;
    } else {
      this.isSelectAllSuit = false;
    }
    this.fiterData();
  }

  fiterData() {
    this.litigationCaseCivil = undefined;
    this.litigationCaseAppeal = undefined;
    this.litigationCaseSupreme = undefined;
    this.hasLitigationCase = (this.litigationDetail.cases && this.litigationDetail?.cases?.length > 0) || false;
    this.litigationCase = this.litigationDetail?.cases ? this.litigationDetail.cases[0] : {};
    if (this.litigationDetail?.cases) {
      if (!this.isSelectAllSuit) {
        this.litigationCaseCivil = this.litigationDetail?.cases.find(
          x =>
            x.civilCourtBlackCaseNo === this.ddlLawsuitCtrl.value &&
            x.courtLevel === LitigationCaseDto.CourtLevelEnum.Civil
        );
        this.litigationCaseAppeal = this.litigationDetail?.cases.find(
          x =>
            x.civilCourtBlackCaseNo === this.ddlLawsuitCtrl.value &&
            x.courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal
        );
        this.litigationCaseSupreme = this.litigationDetail?.cases.find(
          x =>
            x.civilCourtBlackCaseNo === this.ddlLawsuitCtrl.value &&
            x.courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme
        );
      } else {
        this.litigationCaseCivil = this.litigationDetail?.cases.find(
          x => x.courtLevel === LitigationCaseDto.CourtLevelEnum.Civil
        );
        this.litigationCaseAppeal = this.litigationDetail?.cases.find(
          x => x.courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal
        );
        this.litigationCaseSupreme = this.litigationDetail?.cases.find(
          x => x.courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme
        );
      }
    }
  }

  async savetracking() {
    if (!this.followUpStatuses) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      return;
    }

    const res = await this.notificationService.showCustomDialog({
      component: SaveTrackingComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-save-primary',
      title: 'LAWSUIT.TAB_LITIFATION_TRACKING_DIALOG_HEADER',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      context: {
        followUpStatuses: this.followUpStatuses,
        litigationDetail: this.litigationDetail,
        currentUser: this.sessionService.currentUser,
      },
    });

    if (res) {
      try {
        await this.lawsuitService.updateFollowup({
          litigationId: this.litigationDetail.litigationId,
          // @ts-ignore
          followupDate: moment(res.followupDate).toDate(),
          followupStatus: res.followupStatus,
          litigationStatus: this.litigationDetail.litigationStatusCode,
          remark: res.remark,
        });
        this.notificationService.openSnackbarSuccess(this.translate.instant('LAWSUIT.DIALOG_FOLLOW_UP_UPDATE_SUCCESS'));
        // refresh object LitigationFollowupDto on screen
        const detailsRes = await this.lawsuitService.getLitigation(this.litigationDetail.litigationId!);
        this.litigationDetail = detailsRes;
        this.setDataFollowsup();
      } catch (e) {
        this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    }
  }
}
