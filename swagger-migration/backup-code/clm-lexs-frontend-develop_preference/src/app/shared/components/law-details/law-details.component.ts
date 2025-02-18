
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LitigationCaseRelatedLGIDDto } from '@lexs/lexs-client';
import { LawColType } from '@app/modules/auction/auction.model';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';

@Component({
  selector: 'app-law-details',
  templateUrl: './law-details.component.html',
  styleUrls: ['./law-details.component.scss'],
})
export class LawDetailsComponent implements OnInit {
  @Input() litigationCaseId: string = '';
  @Input() defaultExpand: boolean = false;

  public collateralColumns = [
    LawColType.labelNumber,
    LawColType.lgId,
    LawColType.customerId,
    LawColType.responseUnit
  ];
  public litigationCaseRelatedSource = new MatTableDataSource<any>([]);
  public isOpened: boolean = false;

  constructor(private litigationCaseService: LitigationCaseService) {}

  async ngOnInit(): Promise<void> {
    if (this.defaultExpand) {
      this.isOpened = true;
    }
    const response = await this.initLitigationCaseParent(Number(this.litigationCaseId));
    this.litigationCaseRelatedSource.data = response.content || [];
  }

  async initLitigationCaseParent(litigationCaseId: number) {
    if(!litigationCaseId) return { content: []} as LitigationCaseRelatedLGIDDto;
    return await this.litigationCaseService.getLitigationCaseRelatedLGIDList(litigationCaseId);
  }

}
