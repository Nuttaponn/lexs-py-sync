import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAIN_ROUTES } from '@app/shared/constant';
import { Utils } from '@app/shared/utils';
import { LexsRole, LexsSubRole, LexsUserDto, MeLexsUserDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import {
  DialogOptions,
  DropDownConfig,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { SubSink } from 'subsink';
import { LevelList } from '../user-form.constant';
import { UserService } from '../user.service';
import { InquiryUsersRequest, UserInformation } from './../user.model';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  private userInformation!: UserInformation;
  private subRoleMaster: Array<LexsSubRole> = [];
  private subs = new SubSink();

  public displayedColumns: string[] = [
    'userId',
    'fullName',
    'email',
    'phone',
    'lexsRole',
    'lexsSubRole',
    'lastLogin',
    'command',
  ];
  public dataSource: Array<LexsUserDto> = [];
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;
  public placeholder: string = 'USER.PLACEHOLDER_SEARCH_USER';
  public dataForm: UntypedFormGroup = this.fb.group({});
  public levelConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    labelPlaceHolder: 'USER.PERMISSION_LEVEL_PLACEHOLDER',
  };
  public levelOptions: SimpleSelectOption[] = LevelList;
  public roleConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'roleName',
    valueField: 'roleCode',
    labelPlaceHolder: 'USER.PERMISSION_ROLE_PLACEHOLDER',
  };
  public roleOptions: Array<LexsRole> = [{ roleCode: 'ALL', roleName: 'LEXS role' }];
  public subRoleConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'subRoleName',
    valueField: 'subRoleCode',
    labelPlaceHolder: 'USER.PERMISSION_SUB_ROLE_PLACEHOLDER',
  };
  public subRoleOptions: Array<LexsSubRole> = [{ subRoleName: 'LEXS sub-role', subRoleCode: 'ALL' }];
  public filter: InquiryUsersRequest = {
    filterKeyword: '',
    dataScope: '',
    role: '',
    subRole: '',
    page: 0,
    size: 0,
  };
  public currentUser: MeLexsUserDto = {};

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private sessionService: SessionService,
    private routerService: RouterService
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(value => {
        value && this.fetchInquiryUsers();
      }),
      this.routerService.onReloadUrl.subscribe(value => {
        if (value === MAIN_ROUTES.USER) this.ngOnInit();
      })
    );
  }

  ngOnInit(): any {
    this.initForm();
    this.initDropdown();
    if (Object.values(this.userService.currentSearch).length > 0) {
      this.initSearch();
    }
    this.onSearch(0);
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fetchInquiryUsers() {
    this.onSearch(this.pageActionConfig?.currentPage || 0);
  }

  initSearch() {
    let search = Utils.deepClone(this.userService.currentSearch);
    this.dataForm.patchValue({
      role: search.role,
      subRole: search.subRole,
      dataScope: search.dataScope,
      filterKeyword: search.filterKeyword,
    });
  }

  async inquiryUsers(
    dataScorp?: string,
    filterKeyword?: string,
    page?: number,
    role?: string,
    size?: number,
    subRole?: string
  ) {
    this.userInformation = await this.userService.inquiryUsers(dataScorp, filterKeyword, page, role, size, subRole);
    this.dataSource = this.userInformation.content;
    this.pageResultConfig = {
      fromIndex: this.userInformation.pageable.pageSize * this.userInformation.pageable.pageNumber + 1 || 0,
      toIndex:
        this.userInformation.pageable.pageSize * this.userInformation.pageable.pageNumber +
          this.userInformation.numberOfElements || 0,
      totalElements: this.userInformation.totalElements || 0,
    };
    this.pageActionConfig = {
      totalPages: this.userInformation.totalPages || 0,
      currentPage: this.userInformation.pageable.pageNumber + 1 || 1,
      fromPage: 1,
      toPage: this.userInformation.totalPages || 1,
    };
  }

  initDropdown() {
    const role: Array<LexsRole> = this.userService.currentRole;
    const subRole: Array<LexsSubRole> = this.userService.currentSubRole;
    this.roleOptions = role.concat(this.roleOptions);
    this.subRoleMaster = subRole;
  }

  initForm() {
    this.dataForm = this.fb.group({
      role: '',
      subRole: '',
      dataScope: '',
      filterKeyword: [null, Validators.compose([Validators.minLength(3)])],
    });
  }

  async onSearch(page: number) {
    const value = this.dataForm.value;
    this.filter = {
      filterKeyword: value.filterKeyword,
      dataScope: value.dataScope ? value.dataScope : 'ALL',
      page: page,
      size: 10,
      role: value.role ? value.role : 'ALL',
      subRole: value.subRole ? value.subRole : 'ALL',
    };
    await this.inquiryUsers(
      this.filter.dataScope,
      this.filter.filterKeyword,
      this.filter.page,
      this.filter.role,
      this.filter.size,
      this.filter.subRole
    );
  }

  selectRole(role: string) {
    this.userService.currentSearch = {
      ...this.userService.currentSearch,
      role: role,
    };
    const defaultSubRole = [{ subRoleName: 'ทุกหน้าที่รอง', subRoleCode: 'ALL' }] as Array<LexsSubRole>;

    if (role == 'ALL') {
      const arrayUniqueByKey = [
        ...new Map(this.subRoleMaster.map((item: any) => [item['subRoleCode'], item])).values(),
      ];
      this.subRoleOptions = defaultSubRole.concat(arrayUniqueByKey);
    } else {
      const subRole = this.subRoleMaster.filter(code => code.roleCode === role);
      this.subRoleOptions = defaultSubRole.concat(subRole);
    }
    this.onSearch(0);
  }
  selectSubRole(subRole: string) {
    this.userService.currentSearch = {
      ...this.userService.currentSearch,
      subRole: subRole,
    };
    this.onSearch(0);
  }

  onSelectLevel(dataScope: string) {
    this.userService.currentSearch = {
      ...this.userService.currentSearch,
      dataScope: dataScope,
    };
    this.onSearch(0);
  }

  onSearchText() {
    this.dataForm.get('filterKeyword')?.markAllAsTouched();
    this.dataForm.get('filterKeyword')?.updateValueAndValidity();
    const keyWord = this.dataForm.get('filterKeyword')?.value;
    this.userService.currentSearch = {
      ...this.userService.currentSearch,
      filterKeyword: keyWord,
    };
    if (keyWord && keyWord?.length >= 3) {
      this.onSearch(0);
    } else {
      this.onSearch(0);
    }
  }

  getControl(name: string): any {
    return this.dataForm.get(name);
  }

  viewBtn(selectedUserId: string) {
    this.routerService.navigateTo('/main/user/view', {
      userId: selectedUserId,
    });
  }

  addBtn() {
    this.routerService.navigateTo('/main/user/add');
  }

  async deleteBtn() {
    const res = await this.userService.revokeUser(this.dataForm.get('userId')?.value);
    if (res) {
      this.notificationService.openSnackbarSuccess(
        `${'Username'} ${this.translate.instant('USER.SNACKBAR_SUCCESS_DETAIL')}`
      );
    }
  }

  async onClickDelete(user: LexsUserDto) {
    const userId = user.userId as string;
    // pending field disable for status from BE, user.disable
    const optionsDialog: DialogOptions = {
      rightButtonLabel: user.disable ? 'USER.NOTIFICATION_ENABLE_BTN_CONFIRM' : 'USER.NOTIFICATION_DISABLE_BTN_CONFIRM',
      buttonIconName: 'icon-Dismiss-Circle',
      autoFocus: false,
      contentCssClasses: ['actions-right-full-width'],
      leftButtonClass: 'width-pct-47-button',
      rightButtonClass: user.disable ? 'primary long-button' : '',
    };

    let titleDialog = user.disable
      ? this.translate.instant('USER.NOTIFICATION_ENABLE_TITLE')
      : this.translate.instant('USER.NOTIFICATION_DISABLE_TITLE');
    let detailDialog = `${user.userId}-${user.title}${user.name} ${user.surname} ${
      user.disable
        ? this.translate.instant('USER.NOTIFICATION_ENABLE_SUB_DETAIL')
        : this.translate.instant('USER.NOTIFICATION_DISABLE_SUB_DETAIL')
    }<br/> ${
      user.disable
        ? this.translate.instant('USER.NOTIFICATION_ENABLE_CONFIRM_DETAIL')
        : this.translate.instant('USER.NOTIFICATION_DISABLE_CONFIRM_DETAIL')
    }`;
    const result = await this.notificationService.confirmRemoveCenterAlignedDialog(
      titleDialog,
      detailDialog,
      optionsDialog
    );
    if (result) {
      await this.userService.revokeUser(userId);
      this.notificationService.openSnackbarSuccess(
        `${user.userId} ${
          user.disable
            ? this.translate.instant('USER.SNACKBAR_ENABLE_SUCCESS_DETAIL')
            : this.translate.instant('USER.SNACKBAR_DISABLE_SUCCESS_DETAIL')
        }`
      );
      this.inquiryUsers();
    }
  }
  pageEvent(event: number) {
    this.pageActionConfig.currentPage = event;
    this.onSearch(event - 1);
  }

  edit(path: any, id: any) {
    this.routerService.navigateTo(path, { userId: id });
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearchText();
  }

  async onSaveExcel() {
    await this.userService.inquiryUsersExcel();
  }

  async onSaveExcelPermission() {
    await this.userService.inquiryRoleExcelDownload();
  }
}
