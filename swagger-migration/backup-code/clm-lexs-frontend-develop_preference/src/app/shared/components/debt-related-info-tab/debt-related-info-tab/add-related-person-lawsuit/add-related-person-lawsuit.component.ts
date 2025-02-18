import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { LitigationCaseDto, PersonLitigationInfo, PersonLitigationInfoRequest, PersonRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DebtRelatedInfoTabService } from '../../debt-related-info-tab.service';

@Component({
  selector: 'app-add-related-person-lawsuit',
  templateUrl: './add-related-person-lawsuit.component.html',
  styleUrls: ['./add-related-person-lawsuit.component.scss'],
})
export class AddRelatedPersonLawsuitComponent implements OnInit {
  public stepper = [
    {
      title: 'DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.STEPPER_TITLE_PAYEE_INSTEAD',
      active: true,
      isNextClicked: false,
    },
    {
      title: 'DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.STEPPER_TITLE_LAWSUIT',
      active: false,
      isNextClicked: false,
    },
  ];
  public selection = new SelectionModel<any>(true, []);
  // ข้อมูลผู้รับชำระหนี้แทนและจำเลยร่วม
  public personInfoList: Array<IPersonDto> = [];
  public personInfoListHeader: string[] = ['selected', 'name', 'relationDesc', 'identificationNo'];
  // ข้อมูลคดีความ
  public lawsuitInfoList: Array<LitigationCaseDto> = [];
  public lawsuitInfoListHeader: string[] = ['selected', 'blackCaseNo', 'redCaseNo', 'caseType'];
  public lawSelect!: LitigationCaseDto;
  public remark: UntypedFormControl = new UntypedFormControl();
  public isSaveClicked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddRelatedPersonLawsuitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    const res: PersonLitigationInfo = await this.debtRelatedInfoTabService.getAdditionalPersonsRelation(
      this.data?.context?.litigationId,
      'addPersonLitigationCase'
    );
    this.personInfoList = res?.additionalPersons || [];
    this.lawsuitInfoList = res?.cases || [];

    this.personInfoList.sort((a, b) => {
      const nameA = a.name || 0;
      const nameB = b.name || 0;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  get isAllSelected() {
    return this.selection.selected.length === this.personInfoList.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(...this.personInfoList);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  get checkNextIsActive() {
    let active = false;
    if (this.stepper.length > 1) {
      this.stepper.forEach((e, i) => {
        if (i > 0 && e.active === true) {
          active = true;
        }
      });
    }
    return active;
  }

  formatMessage() {
    let message = this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.MESSAGE_PAYEE_INSTEAD');
    if (this.selection.selected.length > 0) {
      message += `: ${this.selection.selected[0].name}`;
      if (this.selection.selected.length > 1) {
        message += ` และอีก ${this.selection.selected.length - 1} บุคคล`;
      }
    }
    return message;
  }

  get findLastIndexActive() {
    const index = this.stepper.reverse().findIndex(x => x.active === true);
    const count = this.stepper.length - 1;
    const finalIndex = index >= 0 ? count - index : index;
    return finalIndex;
  }

  backButtonClicked() {
    const finalIndex = this.findLastIndexActive;
    if (finalIndex > -1) {
      this.stepper[finalIndex].isNextClicked = false;
      this.stepper[finalIndex].active = false;
      this.isSaveClicked = false;
    }
  }

  rightButtonNextClicked() {
    const indexFind = this.stepper.findIndex(e => e.active);
    if (indexFind > -1) {
      this.stepper[indexFind].isNextClicked = true;
      if (this.selection.selected.length > 0) {
        this.stepper[indexFind + 1].active = true;
      }
    }
  }

  async rightButtonSaveClicked() {
    this.isSaveClicked = true;
    this.remark.markAsTouched();
    if (this.lawSelect === null || this.lawSelect === undefined || this.remark.invalid) {
      return;
    }
    this.selection.selected?.map((e: IPersonDto) => (e.updateFlag = PersonRequest.UpdateFlagEnum.A)); // for add
    const request: PersonLitigationInfoRequest = {
      additionalPersons: this.selection.selected,
      headerFlag: PersonLitigationInfoRequest.HeaderFlagEnum.Draft,
      litigationCaseId: this.lawSelect.litigationCaseId,
      litigationId: this.data?.context?.litigationId,
      reason: this.remark.value,
    };
    try {
      await this.debtRelatedInfoTabService.updateCaseAdditionalPersonsBlackCase(request);
      this.dialogRef.close(true);
    } catch (error) {}
  }
}
