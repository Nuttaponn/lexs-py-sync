import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ExtendedLitigationCaseGroupDto } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.model';
import { RouterService } from '@shared/services/router.service';
import { PreferenceService } from '../../preference.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { PreferenceGroupDto, NameValuePair } from '@lexs/lexs-client';
import ExecuteTypeEnum = PreferenceGroupDto.ExecuteTypeEnum;

@Component({
  selector: 'app-preference-command-info',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PipesModule],
  templateUrl: './preference-command-info.component.html',
  styleUrl: './preference-command-info.component.scss',
})
export class PreferenceCommandInfoComponent implements OnInit {
  constructor(
    private routerService: RouterService,
    private preferenceService: PreferenceService,
    private lawsuitService: LawsuitService
  ) {}

  public groupByCaseList: Array<ExtendedLitigationCaseGroupDto> = [];
  commandDetails: CommandDetails[] = [];
  displayedColumns: string[] = ['no', 'orderNumber', 'orderDate', 'status'];
  public isOpenedList: boolean[] = [];

  async ngOnInit() {
    await this.setupPageData();
  }

  async setupPageData() {
     this.isOpenedList = new Array(this.groupByCaseList.length ?? 0).fill(true);

    const litigationId: string = this.lawsuitService.currentLitigation?.litigationId || '0';

    // Fetch data from PreferenceService
    const dataResponse: PreferenceGroupDto[] = await this.preferenceService.getPreference(litigationId);

    // If no data, use mock data
    // if (!dataResponse || dataResponse.length === 0) {
    //   this.commandDetails.forEach((command) => {
    //     if (!command.preferenceGroupDto) return;
    //     dataResponse.push({
    //       executeType:
    //         command.preferenceGroupDto.executeType &&
    //         (Object.values(ExecuteTypeEnum) as string[]).includes(command.preferenceGroupDto.executeType)
    //           ? (command.preferenceGroupDto.executeType as ExecuteTypeEnum)
    //           : undefined,
    //       blackCaseNo: command.preferenceGroupDto.blackCaseNo,
    //       redCaseNo: command.preferenceGroupDto.redCaseNo,
    //       lawyerOfficeCode: command.preferenceGroupDto.lawyerOfficeCode,
    //       lawyerOfficeName: command.preferenceGroupDto.lawyerOfficeName,
    //       lawyerId: command.preferenceGroupDto.lawyerId,
    //       lawyerName: command.preferenceGroupDto.lawyerName,
    //       preferenceGroupNo: command.preferenceGroupDto.preferenceGroupNo,
    //       createdDate: command.preferenceGroupDto.createdDate,
    //       createdByFullName: command.preferenceGroupDto.createdByFullName,
    //     });
    //   });
    // }

    dataResponse.forEach((data, index) => {
      let en = {} as CommandDetails;
      en.commandNumber = index + 1;
      en.preferenceGroupDto = data;
      en.isShow =  true;
      this.commandDetails.push(en);
    });

    // Map data to model
    // this.commandDetails = this.commandDetails.map((command, index) => ({
    //   ...command,
    //   preferenceGroupDto: dataResponse[index] || command.preferenceGroupDto,
    //   isShow: true,
    //   commandNumber: index + 1,

    // }));

    console.log( this.commandDetails );
  }

  expandPanel(index: number): void {
    this.commandDetails[index].isShow = !this.commandDetails[index].isShow;
  }

  navigateToDetail(preferenceGroupNo: string): void {
    if (preferenceGroupNo) {
      this.routerService.navigateTo('/main/preference/detail', {
        preferenceGroupNo:preferenceGroupNo
      });
    }
  }

  getExecuteTypeName(value: ExecuteTypeEnum | undefined): string {
    if (!value) {
      return 'ไม่ทราบประเภท';
    }
    const match = executeType.find((item) => item.value === value);
    return match?.name ?? 'ไม่ทราบประเภท';
  }
}

export interface CommandDetails {
  commandNumber: number;
  preferenceGroupDto: PreferenceGroupDto;
  isShow: boolean;
}

export const executeType: NameValuePair[] = [
  { name: 'หมายส่งโฉนดจากกรมบังคับคดี', value: ExecuteTypeEnum.DeedLed },
  { name: 'ประกาศขายทอดตลาด', value: ExecuteTypeEnum.Auction },
  { name: 'รายงานการยึด', value: ExecuteTypeEnum.Seizure },
  { name: 'อื่นๆ', value: ExecuteTypeEnum.Other },
];
