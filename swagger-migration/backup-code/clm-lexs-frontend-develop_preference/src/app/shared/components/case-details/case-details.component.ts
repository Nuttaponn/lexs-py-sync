import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MENU_ROUTE_PATH } from '@app/shared/constant';
import { ITooltip } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { LitigationCaseShortDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
})
export class CaseDetailsComponent implements OnInit {
  @Input() auctionCaseTypeCode?: string;
  @Input() data!: LitigationCaseShortDto;
  @Input() title = 'TITLE_MSG.CASE_DETAIL';
  @Input() hidelawyer = false;
  @Input() isViewMode = false;

  public isOpened: boolean = true;
  private form!: UntypedFormGroup;
  public dataForm: any = {};
  public isLawsuitMenu = this.routerService.previousUrl.includes(MENU_ROUTE_PATH.LAWSUIT);
  public otherPreferenceGroupNos: Array<ITooltip> = [];
  public ownerFullNameMain: string = '';
  public ownerFullNames: Array<ITooltip> = [];

  constructor(
    private fb: UntypedFormBuilder,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.initForm(this.data);
    this.getRawData();
    if(this.auctionCaseTypeCode === '0002') {
      this.otherPreferenceGroupNos = (this.dataForm.otherPreferenceGroupNos as string[])?.map((item: string, index: number) => {
        if(index === 0) {
          return { title: 'เลขที่หนังสือสั่งการ', content: item, contentClasses: 'label-link' } as ITooltip
        } else {
          return { content: item, contentClasses: 'label-link' } as ITooltip
        }
      }) || []
      const _ownerFullName = (this.dataForm.ownerFullName as string).split(',');
      console.log("🚀 ~ _ownerFullName:", _ownerFullName)
      this.ownerFullNameMain = _ownerFullName[0]
      this.ownerFullNames = _ownerFullName?.filter((_, index) => index !== 0).map((item: string, index: number) => {
        if(index === 0) {
          return { title: 'ผู้ถือกรรมสิทธิ์', content: item } as ITooltip
        } else {
          return { content: item } as ITooltip
        }
      }) || []
    }

  }

  initForm(_data: any = {}) {
    this.form = this.fb.group({
      amdResponseUnitCode: _data.amdResponseUnitCode,
      amdResponseUnitName: _data.amdResponseUnitName,
      bankruptcyFilingExpiryDate: _data.bankruptcyFilingExpiryDate,
      bankruptcyLawyerId: _data.bankruptcyLawyerId,
      bookingCode: _data.bookingCode,
      bookingName: _data.bookingName,
      cifNo: _data.cifNo,
      civilCourtBlackCaseNo: _data.civilCourtBlackCaseNo,
      civilCourtCaseDate: _data.civilCourtCaseDate,
      civilCourtRedCaseNo: _data.civilCourtRedCaseNo, // คดีหมายเลขแดง / คดีหมายเลขแดงโจทก์นอก
      firstPossibleExecutionDueDate: _data.firstPossibleExecutionDueDate,
      legalExecutionLawyerId: _data.legalExecutionLawyerId,
      legalExecutionLawyerFullName: _data.legalExecutionLawyerFullName,
      litigationId: _data.litigationId,
      mainBorrowerName: _data.mainBorrowerName,
      publicAuctionLawyerId: _data.publicAuctionLawyerId,
      responseUnitCode: _data.responseUnitCode,
      responseUnitName: _data.responseUnitName,
      sumLimitAmount: coerceNumberProperty(_data.sumLimitAmount),
      courtVerdictDate: _data.courtVerdictDate,
      // for case type 0002
      plaintiff: _data.plaintiff, // ชื่อโจทก์
      defendant: _data.defendant, // ชื่อจำเลยที่ 1
      courtName: _data.courtName, // ศาล
      ledName: _data.ledName, // สำนักงานบังคับคดี
      preferenceGroupNo: _data.preferenceGroupNo, // เลขที่หนังสือสั่งการ
      executeNo: _data.executeNo, // เลขที่หมายแจ้งจากกรมบังคับคดี
      executeDate: _data.executeDate, // หมายลงวันที่
      ownerFullName: _data.ownerFullName, // ผู้ถือกรรมสิทธิ์
      caseType: _data.caseType, // ประเภทคดี
    });

    return this.form;
  }

  getRawData() {
    this.dataForm = this.form.getRawValue();
  }

  link() {
    this.routerService.navigate('');
    this.form = this.initForm(this.data);
  }

  navigateToLitigation(id?: any) {
    if (this.auctionCaseTypeCode === '0002') {
      this.routerService.navigateTo('/main/lawsuit/detail', { litigationId: id });
    } else {
      if (!!this.dataForm.litigationId && !this.isViewMode && !this.isLawsuitMenu) {
        this.routerService.navigateTo('/main/lawsuit/detail', { litigationId: this.data.litigationId });
      }
    }
  }

  onClickContent(event: any) {
    console.log('navigate to litigation :: ', event);
    this.navigateToLitigation(event.content);
  }
}
