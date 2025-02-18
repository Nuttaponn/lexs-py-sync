import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { AuctionLexsSeizureDto, AuctionMatchRequest } from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { AuctionService } from '../auction.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { MasterDataService } from '@app/shared/services/master-data.service';

@Component({
  selector: 'app-auc-announement-match-dialog',
  templateUrl: './auc-announement-match-dialog.component.html',
  styleUrls: ['./auc-announement-match-dialog.component.scss']
})
export class AucAnnounementMatchDialogComponent implements OnInit {

  public msgBanner = 'หลังจากกดปุ่ม “ยืนยันจับคู่” แล้วจะไม่สามารถกลับมาแก้ไขรายละเอียดคดี และเลขประกาศขายทอดตลาดได้';

  public redCaseFilterControl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public redCaseFilterConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RED_CASE_NO',
  };
  public redCaseFilterOption: SimpleSelectOption[] = [];

  public courtNameFilterControl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public courtNameFilterConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_COURT_NAME',
  };
  public courtNameFilterOption: SimpleSelectOption[] = [];


  public ledFilterControl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public ledFilterConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_LED',
  };
  public ledFilterOption: SimpleSelectOption[] = [];

  private auctionLexsSeizures: AuctionLexsSeizureDto[] = []

  constructor(
    private litigationCaseService: LitigationCaseService,
    private auctionService: AuctionService,
    private logger: LoggerService,
    private masterDataService: MasterDataService,
  ) {}

  ngOnInit(): void {}

  async dataContext(data: any) {
    console.log("🚀 ~ data:", data)

    this.auctionLexsSeizures = data.auctionLexsSeizures;
    this.redCaseFilterOption = this.auctionLexsSeizures.map(it => {
      return { text: it.redCaseNo, value: it.redCaseNo } as SimpleSelectOption;
    });
    this.courtNameFilterOption = (await this.masterDataService.court(false)).court?.map(c => ({
      text: c.name ?? '',
      value: c.value ?? '',
    })) || [];
    this.ledFilterOption = (await this.masterDataService.led()).leds?.map(l => ({
      text: l.ledName ?? '',
      value: l.ledId ?? '',
    })) || [];
    this.redCaseFilterOption = this.auctionService.getUniqueListByValue(this.redCaseFilterOption);
    this.ledFilterOption = this.auctionService.getUniqueListByValue(this.ledFilterOption);

    this.redCaseFilterOption = [{ text: 'คดีหมายเลขแดง', value: 'All' } as SimpleSelectOption].concat(
      this.redCaseFilterOption
    );
    this.courtNameFilterOption = [{ text: 'ชื่อศาล', value: 'All' } as SimpleSelectOption].concat(
      this.courtNameFilterOption
    );
    this.ledFilterOption = [{ text: 'สำนักงานบังคับคดี', value: 'All' } as SimpleSelectOption].concat(
      this.ledFilterOption
    );
  }

  public async onClose(): Promise<boolean> {
    console.log('onClose :: ', this.redCaseFilterControl, this.courtNameFilterControl, this.ledFilterControl)
    if(this.redCaseFilterControl.invalid || this.courtNameFilterControl.invalid || this.ledFilterControl.invalid) {
      this.redCaseFilterControl.markAllAsTouched();
      this.courtNameFilterControl.markAllAsTouched();
      this.ledFilterControl.markAllAsTouched();
      return false;
    } else {
      try {
        const aucRef = Number(this.auctionService.selectAnouncementDetail?.aucRef);
        const _redCaseNo = this.redCaseFilterOption.find(m => m.value === this.redCaseFilterControl.value)
        const _led = this.ledFilterOption.find(m => m.value === this.ledFilterControl.value)
        const _court = this.courtNameFilterOption.find(m => m.value === this.courtNameFilterControl.value)
        const request: AuctionMatchRequest = {
          redCaseNo: _redCaseNo?.value.toString() || '',
          ledId: Number(_led?.value),
          courtNo: _court?.value.toString() || '',
        };
        await this.auctionService.postAuctionMatch(aucRef, request);
        return true;
      } catch (error: any) {
        this.logger.info('AucAnnounementMatchComponent => onSubmit', error);
        return false;
      }
    }
  }

  get returnData() {
    return true;
  }
}
