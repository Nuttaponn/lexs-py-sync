import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ILexsUserOption, UserMatchDialogResponse } from '@app/modules/configuration/config.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multi-user-match-dialog',
  templateUrl: './multi-user-match-dialog.component.html',
  styleUrls: ['./multi-user-match-dialog.component.scss'],
})
export class MultiUserMatchDialogComponent {
  public searchGroup: UntypedFormGroup = this.initSearchControl();
  public displayedColumns: string[] = ['selection', 'fullName', 'authorityName'];
  public selelectedNo!: string;
  public messageBanner!: string;
  public isSubmited: boolean = false;
  private selectedLength!: number;
  public userOptions: Array<ILexsUserOption> = [];
  public filteredUserOptions: Array<ILexsUserOption> = [];
  public currentDate = new Date();
  public effectiveDateErrorMsg: string = 'COMMON.ERROR_MSG_REQUIRED';
  public userMatchForm: UntypedFormGroup = this.initUserMatchForm();

  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {}

  private scrollToFirstInvalidControl() {
    let form = document.getElementById('userMatchForm');
    if (!!form) {
      let firstInvalidControl = form?.getElementsByClassName('ng-invalid')[0];
      firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      (firstInvalidControl as HTMLElement)?.focus();
    }
  }

  getControl(name: string): any {
    return this.userMatchForm.get(name);
  }

  initSearchControl() {
    return this.fb.group({
      searchInput: ['', Validators.minLength(3)],
    });
  }

  initUserMatchForm() {
    return this.fb.group({
      userId: [undefined, Validators.required],
      effectiveDate: [undefined, Validators.required],
    });
  }

  dataContext(data: any) {
    this.selectedLength = data.selectedLength ?? 0;
    this.userOptions = data.userOptions ?? [];
    this.filteredUserOptions = [...this.userOptions];
    this.messageBanner = `${this.selectedLength} ${this.translate.instant('CONFIGURATION.SUB_NUMBER_CHOSEN_USERS')}`;
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearch();
  }

  onSearch() {
    const searchText = this.searchGroup.get('searchInput')?.value.trim();

    if (searchText && this.searchGroup.get('searchInput')?.valid) {
      this.filteredUserOptions = [
        ...this.userOptions.filter(
          it =>
            it.fullname?.includes(searchText) ||
            it.userId?.includes(searchText) ||
            it.name?.includes(searchText) ||
            it.surname?.includes(searchText)
        ),
      ];
    } else {
      this.filteredUserOptions = [...this.userOptions];
    }
  }

  public async onClose(): Promise<boolean> {
    this.isSubmited = true;
    if (!this.selelectedNo || this.userMatchForm.invalid) {
      this.userMatchForm.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return false;
    }
    return true;
  }

  get returnData(): UserMatchDialogResponse {
    return {
      selectedUser: this.userOptions.find(dto => dto.userId === this.selelectedNo) ?? {},
      effectiveDate: this.getControl('effectiveDate').value,
    };
  }
}
