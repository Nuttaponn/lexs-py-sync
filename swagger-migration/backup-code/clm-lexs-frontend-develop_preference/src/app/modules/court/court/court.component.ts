import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { CourtResultDto, CourtVerdictDto } from '@lexs/lexs-client';
import { SubSink } from 'subsink';
import { CourtService } from '../court.service';
import { LitigationCaseDownloadMap } from '../interface';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.scss'],
})
export class CourtComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  public _tabIndex: number = 0;
  @Input()
  set tabIndex(val: number) {
    this._tabIndex = val || this._tabIndex;
  }

  courtCivil: CourtResultDto[] = [];
  courtAppeal: CourtResultDto[] = [];
  courtSupreme: CourtResultDto[] = [];
  courtData: CourtResultDto[] = [];

  litigationCaseDownloadMap: LitigationCaseDownloadMap = {}

  constructor(
    private courtService: CourtService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initCourtList();
    this.courtCivil = this.getCourtByLevel(CourtVerdictDto.CourtLevelEnum.Civil);
    this.courtAppeal = this.getCourtByLevel(CourtVerdictDto.CourtLevelEnum.Appeal);
    this.courtSupreme = this.getCourtByLevel(CourtVerdictDto.CourtLevelEnum.Supreme);

    this.litigationCaseDownloadMap = this.getLitigationCaseDownloadMap();

    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this._tabIndex = Number(value['_underSubIndex'] || this._tabIndex || 0);
      })
    );
  }
  private getLitigationCaseDownloadMap() {
    let res: LitigationCaseDownloadMap = {}
    let civilLitigationCaseId = this.courtCivil[0]?.litigationCaseId ?? -1;
    let appealLitigationCaseId = this.courtAppeal[0]?.litigationCaseId ?? -1;
    let supremeLitigationCaseId = this.courtSupreme[0]?.litigationCaseId ?? -1;
    if (this.courtCivil.length > 0) {
      res[civilLitigationCaseId] = civilLitigationCaseId;
    }
    if (this.courtAppeal.length > 0) {
      res[appealLitigationCaseId] = civilLitigationCaseId;
    }
    if (this.courtSupreme.length > 0) {
      res[supremeLitigationCaseId] = appealLitigationCaseId;
    }
    return res;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Data Initialization
  async initCourtList() {
    try {
      this.courtService.courtResult = await this.courtService.getCourtResults(
        this.lawsuitService.currentLitigation.litigationId,
        this.taskService.taskDetail?.id
      );
      this.courtData = this.courtService.courtResult;
      this.courtService.courtResultSubject.next(this.courtData);
    } catch (e) {}
  }

  getCourtByLevel(courtLevel: CourtResultDto.CourtLevelEnum) {
    return this.courtData.filter(f => f.courtLevel === courtLevel) ?? [];
  }

  onTabChanged(event: MatTabChangeEvent) {
    this._tabIndex = event.index;
  }
}
