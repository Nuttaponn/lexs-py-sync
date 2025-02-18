import { Component, Input, OnInit } from '@angular/core';
import { CourtResultDto, CourtVerdictDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-decision-detail',
  templateUrl: './decision-detail.component.html',
  styleUrls: ['./decision-detail.component.scss'],
})
export class DecisionDetailComponent implements OnInit {
  @Input() data!: CourtResultDto[];
  @Input() litigationCaseId!: string;

  public isOpened: boolean = true;
  public courtLevel!: string;
  public resultCivilCourtVerdicts!: CourtVerdictDto;
  public resultAppealCourtVerdicts!: CourtVerdictDto;
  public resultSupremeCourtVerdicts!: CourtVerdictDto;

  constructor() {}

  ngOnInit(): void {
    // map data for each by courtLevel 'SUPREME' > 'APPEAL' > 'CIVIL'
    const filterCaseId = this.data.filter(item => item.litigationCaseId?.toString() === this.litigationCaseId);
    if (filterCaseId.find(item => item.courtLevel === 'SUPREME')) {
      this.courtLevel = 'SUPREME';
    } else if (filterCaseId.find(item => item.courtLevel === 'APPEAL')) {
      this.courtLevel = 'APPEAL';
    } else {
      this.courtLevel = 'CIVIL';
    }
    let findSupreme;
    let findAppeal;
    let findCivil;
    if (this.courtLevel === 'SUPREME') {
      // SUPREME Case
      findSupreme = this.data.filter(item => item.courtLevel === 'SUPREME')[0];
      this.resultSupremeCourtVerdicts = findSupreme?.courtVerdicts
        ? (findSupreme?.courtVerdicts.find(
            i => i.litigationCaseId?.toString() === this.litigationCaseId
          ) as CourtVerdictDto)
        : ({} as CourtVerdictDto);
      // Get civilCourtBlackCaseNo from SUPREME Case
      const civilCourtBlackCaseNo = findSupreme?.courtVerdicts
        ? findSupreme?.courtVerdicts[0].civilCourtBlackCaseNo
        : '';
      // APPEAL Case
      findAppeal = this.data.filter(item => item.courtLevel === 'APPEAL')[0];
      this.resultAppealCourtVerdicts = findAppeal?.courtVerdicts
        ? (findAppeal?.courtVerdicts.find(i => i.civilCourtBlackCaseNo === civilCourtBlackCaseNo) as CourtVerdictDto)
        : ({} as CourtVerdictDto);
      // CIVIL Case
      findCivil = this.data.filter(item => item.courtLevel === 'CIVIL')[0];
      this.resultCivilCourtVerdicts = findCivil?.courtVerdicts
        ? findCivil?.courtVerdicts.find(i => i.civilCourtBlackCaseNo === civilCourtBlackCaseNo) ||
          ({} as CourtVerdictDto)
        : ({} as CourtVerdictDto);
    } else if (this.courtLevel === 'APPEAL') {
      // APPEAL Case
      findAppeal = this.data.filter(item => item.courtLevel === 'APPEAL')[0];
      this.resultAppealCourtVerdicts = findAppeal?.courtVerdicts
        ? (findAppeal?.courtVerdicts.find(
            i => i.litigationCaseId?.toString() === this.litigationCaseId
          ) as CourtVerdictDto)
        : ({} as CourtVerdictDto);
      // Get civilCourtBlackCaseNo from APPEAL Case
      const civilCourtBlackCaseNo = findAppeal?.courtVerdicts ? findAppeal?.courtVerdicts[0].civilCourtBlackCaseNo : '';
      // CIVIL Case
      findCivil = this.data.filter(item => item.courtLevel === 'CIVIL')[0];
      this.resultCivilCourtVerdicts = findCivil?.courtVerdicts
        ? findCivil?.courtVerdicts.find(i => i.civilCourtBlackCaseNo === civilCourtBlackCaseNo) ||
          ({} as CourtVerdictDto)
        : ({} as CourtVerdictDto);
    } else {
      // CIVIL Case
      findCivil = this.data.filter(item => item.courtLevel === 'CIVIL')[0];
      this.resultCivilCourtVerdicts = findCivil?.courtVerdicts
        ? findCivil?.courtVerdicts.find(i => i.litigationCaseId?.toString() === this.litigationCaseId) ||
          ({} as CourtVerdictDto)
        : ({} as CourtVerdictDto);
    }
  }
}
