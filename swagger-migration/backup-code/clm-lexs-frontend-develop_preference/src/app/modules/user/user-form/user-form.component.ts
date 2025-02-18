import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from '@app/shared/services/master-data.service';
import {
  InquiryRoleOrganizationMapsDto,
  LexsRole,
  LexsSubRole,
  MeLexsUserDto,
  NameValuePair,
  OrganizationMap,
  PageOfLexsUserDto,
  PhoneBookDto,
  RoleLevelMap,
  RolePermissionTemplateDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { DialogOptions, DropDownConfig } from '@spig/core';
import { DataScopeList, LEVEL_CODE, MODE, UPDATE_FLAG } from '../user-form.constant';
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, AfterViewInit {
  mode: string = MODE.ADD;
  MODE = MODE;
  role: Array<LexsRole> = [];
  dropDownRoleConfig: DropDownConfig = {
    displayWith: 'roleName',
    valueField: 'roleCode',
    labelPlaceHolder: 'LEXS role',
    searchWith: 'roleName',
  };
  subRole: Array<LexsSubRole> = [];
  dropDownSubRoleConfig: DropDownConfig = {
    displayWith: 'subRoleName',
    valueField: 'subRoleCode',
    labelPlaceHolder: 'LEXS sub-role',
    searchWith: 'subRoleName',
  };
  DataScopeList: Array<any> = DataScopeList;
  dropDownDataScopeConfig: DropDownConfig = {
    displayWith: 'text',
    valueField: 'code',
    labelPlaceHolder: 'สิทธิ์ในการดูข้อมูล',
  };
  level: Array<RoleLevelMap> = [];
  dropDownLevelConfig: DropDownConfig = {
    displayWith: 'levelName',
    valueField: 'levelCode',
    searchPlaceHolder: 'ระดับ',
    labelPlaceHolder: 'ระดับ (ระบุ)',
  };

  detail: Array<any> = [];
  dropDownDetailConfig = {
    forInput: false,
    disabledSelect: false,
    displayWith: 'name',
    valueField: 'code',
    labelPlaceHolder: 'ระบุ',
  };
  dropDownOgConfig = {
    forInput: false,
    disabledSelect: false,
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'ค้นหาหน่วยงาน',
  };
  displayedColumns: string[] = [
    'select',
    'fullName',
    'email',
    'team',
    'supervisorId',
    'supervisorName',
    'position',
    'mobileNumber',
  ];
  user: MeLexsUserDto = {};
  users: Array<any> = [];
  dropDownUserConfig = {
    labelPlaceHolder: 'ค้นหา User ID *',
  };
  dropDownUserOtionConfig = {
    labelPlaceHolder: 'ค้นหา User ID หัวหน้า',
  };
  usersOption: Array<any> = [];
  userType: 'BULK' | 'PERSON' | undefined;
  dataForm: UntypedFormGroup = this.fb.group({});
  actionBar = {
    hasBackButton: true,
    disabledBackButton: false,
    hasCancelButton: false,
    disabledCancelButton: false,
    cancelButtonText: '',
    showNavBarInformation: true,
    hasPrimaryButton: false,
    primaryButtonText: '',
    primaryButtonIcon: 'icon-save-primary',
    hasEditButton: false,
    editButtonText: '',
    hasDeleteButton: false,
    deleteButtonText: '',
    deleteButtonIcon: '',
    deleteButtonPositive: false,
  };
  roleMaster: Array<LexsRole> = [];
  subRoleMaster: Array<LexsSubRole> = [];
  levelMaster: Array<RoleLevelMap> = [];
  detailMaster: Array<OrganizationMap> = [];
  roleOrgMapper: Array<InquiryRoleOrganizationMapsDto> = [];
  currentUser: MeLexsUserDto = {};
  isUserAdmin: boolean = false;
  userIdRoute: string = '';
  rolePermissionTemp: Array<RolePermissionTemplateDto> = [];
  selection = new SelectionModel<any>(true);
  listKTB: Array<NameValuePair> = [];
  tableDataSource = new MatTableDataSource(this.dataTable?.controls);

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private routerService: RouterService,
    private route: ActivatedRoute,
    private userService: UserService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private masterDataService: MasterDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    const paramsUserId = this.route?.snapshot?.queryParams['userId'];
    this.rolePermissionTemp = this.userService.currentRolePermissionTemp;
    this.roleOrgMapper = this.userService.currentRoleOrganization;

    this.initForm();
    this.assignMode(paramsUserId);
    this.initDropdown();
    let ktbOrg = await this.masterDataService.ktbOrg();
    this.listKTB = ktbOrg.ktbOrg || [];
    if (this.mode === MODE.EDIT || this.mode === MODE.VIEW) {
      this.userIdRoute = this.activatedRoute.snapshot.data['userDto'].userId;
      this.user = await this.userService.getUser(this.userIdRoute);
      this.pathValue();
      this.onSelectRole(this.user.roleCode);
      this.selectLevel(this.user.levelCode);
      this.selectDetail(this.dataForm.get('detailCode')?.value);
    }
    if (this.mode === MODE.EDIT) this.mapRoleWithOrganization();
  }

  mapRoleWithOrganization() {
    let _organizationCode = '';
    if (this.mode === MODE.ADD) {
      if (this.userType === 'PERSON') {
        _organizationCode = this.dataForm.get('originalOrganizationCode')?.value || '';
      } else if (this.userType === 'BULK') {
        _organizationCode = this.dataForm.get('orgCode')?.value || '';
      } else {
        console.log('other user type');
      }
    } else {
      _organizationCode = this.user.originalOrganizationCode || '';
    }

    if (_organizationCode !== '') {
      const _roleOrgMapper = this.roleOrgMapper.filter(i => i.organizationCode === _organizationCode);
      const _findMapper = this.roleMaster.filter(i => !!_roleOrgMapper.find(j => j.roleCode === i.roleCode));
      this.role = _findMapper.length !== 0 ? [..._findMapper] : this.roleMaster;
    } else {
      this.role = this.roleMaster;
    }

    if (this.mode === MODE.EDIT) {
      if (this.role.length === 1) {
        this.dataForm.get('roleCode')?.setValue(this.role[0].roleCode);
        this.dataForm.get('roleCode')?.updateValueAndValidity();
        this.onSelectRole(this.role[0].roleCode);
        this.dataForm.get('subRoleCode')?.setValue('');
        this.dataForm.get('subRoleCode')?.updateValueAndValidity();
        this.dataForm.get('dataScopeCode')?.setValue('');
        this.dataForm.get('dataScopeCode')?.updateValueAndValidity();
        this.dataForm.get('levelCode')?.setValue('');
        this.dataForm.get('levelCode')?.updateValueAndValidity();
        this.dataForm.get('detailCode')?.setValue('');
        this.dataForm.get('detailCode')?.updateValueAndValidity();
      } else {
        const _formRoleCode = this.dataForm.get('roleCode')?.value;
        // IF Currnet not match on list mapper will be reset data
        if (!!!this.role.find(i => i.roleCode === _formRoleCode)) {
          this.dataForm.get('roleCode')?.setValue('');
          this.dataForm.get('roleCode')?.updateValueAndValidity();
          this.dataForm.get('subRoleCode')?.setValue('');
          this.dataForm.get('subRoleCode')?.updateValueAndValidity();
          this.dataForm.get('dataScopeCode')?.setValue('');
          this.dataForm.get('dataScopeCode')?.updateValueAndValidity();
          this.dataForm.get('levelCode')?.setValue('');
          this.dataForm.get('levelCode')?.updateValueAndValidity();
          this.dataForm.get('detailCode')?.setValue('');
          this.dataForm.get('detailCode')?.updateValueAndValidity();
        }
      }
    } else if (this.mode === MODE.ADD) {
      if (this.role.length === 1) {
        this.dataForm.get('roleCode')?.setValue(this.role[0].roleCode);
        this.dataForm.get('roleCode')?.updateValueAndValidity();
        this.onSelectRole(this.role[0].roleCode);
      }
    } else {
      console.log('mapRoleWithOrganization mode :: ', this.mode);
    }
  }

  ngAfterViewInit() {
    this.dataForm.markAsPristine();
    this.cd.detectChanges();
  }
  getControl(name: string): any {
    return this.dataForm?.get(name);
  }

  initForm() {
    this.dataForm = this.fb.group({
      userId: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      userInput: [''],
      fullName: [{ value: '', disabled: this.mode === MODE.VIEW }],
      email: [{ value: '', disabled: this.mode === MODE.VIEW }],
      originalOrganizationCode: '',
      originalOrganizationName: [{ value: '', disabled: this.mode === MODE.VIEW }],
      position: [{ value: '', disabled: this.mode === MODE.VIEW }],
      mobileNumber: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      lawyerCode: [{ value: '', disabled: this.mode === MODE.VIEW }],
      supervisorId: [{ value: '', disabled: this.mode === MODE.VIEW }],
      supervisorName: '',
      roleCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      roleName: '',
      subRoleCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      subRoleName: '',
      dataScopeCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      dataScopeName: [{ value: '', disabled: this.mode === MODE.VIEW }],
      levelCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      levelName: '',
      detailCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      detailName: '',
      authorityCode: '',
      authorityName: '',
      factionCode: '',
      factionName: '',
      groupCode: '',
      groupName: '',
      organizationCode: '',
      organizationName: '',
      teamCode: '',
      teamName: '',
      checkAllDashboard: '',
      checkAllCustomer: '',
      checkAllLaw: '',
      checkAllExpenses: '',
      checkAllIncome: '',
      checkAllTransfer: '',
      dataTable: this.fb.array([]),
      orgCode: [{ value: '', disabled: this.mode === MODE.VIEW }, Validators.required],
      orgName: [{ value: '', disabled: this.mode === MODE.VIEW }],
    });
  }

  get dataTable(): UntypedFormArray {
    return this.dataForm.get('dataTable') as UntypedFormArray;
  }

  async initDropdown() {
    this.roleMaster = this.userService.currentRole;
    this.subRoleMaster = this.userService.currentSubRole;
    this.levelMaster = this.userService.currentRoleLevel;
    this.detailMaster = this.userService.currentOrganization;
    this.role = this.roleMaster;
  }

  async pathValue() {
    let fullName = '';
    if (this.user?.title && this.user?.name && this.user?.surname) {
      fullName = this.user?.title + ' ' + this.user?.name + ' ' + this.user?.surname;
    }
    this.dataForm.patchValue({
      userId: this.user?.userId,
      fullName: fullName,
      userInput: this.user.userId + '-' + fullName,
      email: this.user?.email,
      originalOrganizationCode: this.user?.originalOrganizationCode,
      originalOrganizationName: this.user?.originalOrganizationName,
      position: this.user?.position,
      mobileNumber: this.user?.mobileNumber,
      supervisorId: this.user?.supervisorId,
      supervisorName: this.user?.supervisorName,
      roleCode: this.user?.roleCode,
      roleName: this.user?.roleName,
      subRoleCode: this.user?.subRoleCode,
      subRoleName: this.user?.subRoleName,
      dataScopeCode: this.user?.dataScopeCode,
      levelCode: this.user?.levelCode,
      levelName: this.user?.levelName,
      lawyerCode: this.user?.lawyerCode,
    });

    const sc = DataScopeList.find(f => this.user?.dataScopeCode === f.code);
    sc && this.dataForm.get('dataScopeName')?.setValue(sc?.text);

    if (this.user.levelCode) {
      if (this.user.levelCode === LEVEL_CODE.ORGANIZATION) {
        this.dataForm.get('detailCode')?.setValue(this.user?.organizationCode);
        this.dataForm.get('detailName')?.setValue(this.user?.organizationName);
        this.dataForm.get('organizationCode')?.setValue(this.user?.organizationCode);
        this.dataForm.get('organizationName')?.setValue(this.user?.organizationName);
      }
      if (this.user.levelCode === LEVEL_CODE.GROUP) {
        this.dataForm.get('detailCode')?.setValue(this.user?.groupCode);
        this.dataForm.get('detailName')?.setValue(this.user?.groupName);
        this.dataForm.get('groupCode')?.setValue(this.user?.groupCode);
        this.dataForm.get('groupName')?.setValue(this.user?.groupName);
      }
      if (this.user.levelCode === LEVEL_CODE.OFFICER || this.user.levelCode === LEVEL_CODE.ALL) {
        this.dataForm.get('detailCode')?.setValue(this.user?.authorityCode);
        this.dataForm.get('detailName')?.setValue(this.user?.authorityName);
        this.dataForm.get('authorityCode')?.setValue(this.user?.authorityCode);
        this.dataForm.get('authorityName')?.setValue(this.user?.authorityName);
      }
      if (this.user.levelCode === LEVEL_CODE.FACTION) {
        this.dataForm.get('detailCode')?.setValue(this.user?.factionCode);
        this.dataForm.get('detailName')?.setValue(this.user?.factionName);
        this.dataForm.get('factionCode')?.setValue(this.user?.factionCode);
        this.dataForm.get('factionName')?.setValue(this.user?.factionName);
      }
      if (this.user.levelCode === LEVEL_CODE.TEAM) {
        this.dataForm.get('detailCode')?.setValue(this.user?.teamCode);
        this.dataForm.get('detailName')?.setValue(this.user?.teamName);
        this.dataForm.get('teamCode')?.setValue(this.user?.teamCode);
        this.dataForm.get('teamName')?.setValue(this.user?.teamName);
      }
    }
  }

  selectMultipleFiles(e: any, index: number) {
    this.selection.toggle(e);
    if (!this.selection.isSelected(e)) {
      this.dataTable.at(index)?.get('mobileNumber')?.clearValidators();
      this.dataTable.at(index)?.get('mobileNumber')?.updateValueAndValidity();
    } else {
      this.dataTable.at(index)?.get('mobileNumber')?.addValidators(Validators.required);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    let numRows = this.dataTable?.length;
    return numSelected === numRows;
  }

  selectAllMultiple(event: any) {
    let isAllSelected = false;
    if (this.isAllSelected()) {
      this.selection.clear();
      isAllSelected = true;
    }

    this.dataTable.controls.forEach((e: any, index: number) => {
      if (isAllSelected) {
        this.dataTable.at(index)?.get('mobileNumber')?.clearValidators();
        this.dataTable.at(index)?.get('mobileNumber')?.updateValueAndValidity();
      } else {
        this.dataTable.at(index)?.get('mobileNumber')?.addValidators(Validators.required);
        this.selection.select(e);
      }
    });
  }

  async getPhonebookUser(keyword: string, type?: string) {
    this.usersOption = [];
    this.users = [];
    const res = await this.userService.getPhonebookUser(keyword);
    if (res?.length > 0) {
      this.users = res.map(m => {
        return {
          text: `${m.userId}-${m.title}${m.name}  ${m.surname}`,
          value: m.userId,
          ...m,
        };
      });
    }

    if (res?.length === 0) {
      this.notificationService.openSnackbarError(`${'Username'} ${this.translate.instant('USER.SNACKBAR_FAIL')}`);
    }
  }

  async dupliucateUserError() {
    const res = await this.notificationService.alertDialog(
      'USER.DUPLICATE_USER_MSG',
      'USER.EXIST_USER_MSG',
      'COMMON.BUTTON_ACKNOWLEDGE',
      'icon-Selected'
    );
    if (res) {
      this.dataForm.patchValue({
        userId: '',
        userInput: '',
        fullName: '',
      });
      this.users = [];
    }
  }

  setLexsRole(item: PhoneBookDto | MeLexsUserDto) {
    let userid = item.userId?.toUpperCase();
    let isKtbUser = userid?.startsWith('K');
    if (!isKtbUser) {
      let roleList = this.userService.currentOrganization.filter(
        f => f.organizationCode === item.originalOrganizationCode
      );
      if (this.mode === MODE.EDIT) {
        this.dataForm.patchValue({
          originalOrganizationCode: '',
          originalOrganizationName: '',
          organizationCode: '',
          groupName: '',
          groupCode: '',
          authorityName: '',
          authorityCode: '',
          factionName: '',
          factionCode: '',
          teamName: '',
          teamCode: '',
          roleCode: '',
          roleName: '',
          subRoleCode: '',
          subRoleName: '',
          dataScopeCode: '',
          levelCode: '',
          levelName: '',
          detailCode: '',
        });
        this.initDropdown();
      }
      if (roleList && roleList.length > 0) {
        this.role = this.roleMaster.filter(f => f.roleCode === roleList[0]?.roleCode);
        if (this.role?.length === 1) {
          this.dataForm.get('roleCode')?.setValue(this.role[0].roleCode);
          this.dataForm.get('roleName')?.setValue(this.role[0].roleName);
        }
      } else {
        this.role = this.roleMaster;
      }
    }
  }

  async onSelectPhoneBookUser(item: PhoneBookDto) {
    if (this.currentUser?.userId === item?.userId) {
      this.dupliucateUserError();
    } else {
      const res : PageOfLexsUserDto = await this.userService.inquiryUsers('ALL', item.userId); // this api search like user
      const searchMatchUser = res.content?.find(obj => obj.userId === item.userId) || null;
      const foundUser = (searchMatchUser == null || !searchMatchUser?.userId) ? false : true ;
      if (res?.content?.length !== 0 && foundUser) {
        this.dupliucateUserError();
      } else {
        let fullName = '';
        if (item.title && item.name && item.surname) {
          fullName = item.title + ' ' + item.name + ' ' + item.surname;
        }
        this.dataForm.patchValue({
          fullName: fullName,
          email: item?.email,
          originalOrganizationCode: item?.originalOrganizationCode,
          originalOrganizationName: item?.originalOrganizationName,
          position: item?.position,
          userId: item?.userId,
        });

        if (item?.supervisorId && item?.supervisorName) {
          this.dataForm.get('supervisorId')?.setValue(item?.supervisorId);
          this.dataForm.get('supervisorName')?.setValue(`${item?.supervisorName}`);
        }
      }
    }
    this.users = [];
    this.mapRoleWithOrganization();
  }

  async saveUser(flag: string) {
    if (this.userType === 'PERSON') {
      return this.userService.saveUser(this.dataForm, flag);
    }
    if (this.userType === 'BULK') {
      return this.userService.saveMultipleUser(this.dataForm, flag, this.selection);
    }
  }

  async assignMode(userId?: string) {
    this.userType = 'PERSON';
    if (this.router.routerState.snapshot.url.includes('/add')) {
      this.mode = MODE.ADD;
      this.actionBar.hasCancelButton = true;
      this.actionBar.hasPrimaryButton = true;
      this.actionBar.primaryButtonText = 'USER.ADD_USER';
    }
    if (this.router.routerState.snapshot.url.includes('/edit')) {
      this.mode = MODE.EDIT;
      this.actionBar.hasCancelButton = true;
      this.actionBar.hasPrimaryButton = true;
      this.actionBar.primaryButtonText = 'COMMON.BUTTON_SAVE';
      this.actionBar.hasBackButton = false;
    }
    if (this.router.routerState.snapshot.url.includes('/view')) {
      this.mode = MODE.VIEW;
      this.userIdRoute = this.activatedRoute.snapshot.data['userDto'].userId;
      this.user = await this.userService.getUser(this.userIdRoute);
      this.actionBar.deleteButtonText = this.user.disable ? 'COMMON.BUTTON_ENABLE' : 'COMMON.BUTTON_DISABLE';
      this.actionBar.editButtonText = 'COMMON.BUTTON_EDIT';
      if (this.currentUser.userId !== userId && this.currentUser.roleCode !== 'ADMIN') {
        this.onChangeDeleteButton();
      }
    }
  }

  async onSelectOrg(event: string | undefined) {
    this.dataTable.clear();
    let phonebooks: PhoneBookDto[] = await this.userService.getPhonebookOptions(this.dataForm.get('orgCode')?.value);
    for (let index = 0; index < phonebooks.length; index++) {
      const element: PhoneBookDto = phonebooks[index];
      this.dataTable.push(
        this.fb.group({
          mobileNumber: '',
          fullName: (element?.title || '') + ' ' + element?.name + ' ' + element.surname,
          email: element?.email,
          team: element?.originalOrganizationName,
          position: element.position,
          supervisorId: element.supervisorId,
          supervisorName: element.supervisorName,
          userId: element?.userId,
        })
      );
    }

    const org = this.listKTB.find(obj => obj.value === event);

    this.dataForm.get('orgName')?.setValue(org?.name);
    this.dataForm.get('orgCode')?.setValue(org?.value);
    this.tableDataSource = new MatTableDataSource(this.dataTable?.controls);
    this.mapRoleWithOrganization();
  }

  onSelectRole(key: string | undefined) {
    this.dataForm.markAsDirty();
    const roleCode = this.role.find(obj => obj.roleCode === key);
    if (roleCode) {
      this.dataForm.get('roleName')?.setValue(roleCode.roleName);
    }
    this.subRole = this.subRoleMaster.filter(code => code.roleCode === key);
    this.level = this.levelMaster.filter(code => code.roleCode === key);
    this.detail = [];
    if (this.mode === MODE.EDIT || this.mode === MODE.VIEW) {
      this.selectLevel(this.dataForm.get('levelCode')?.value);
    }
    if (key === 'KLAW_USER') {
      this.dataForm.get('lawyerCode')?.addValidators(Validators.required);
    }
    this.isUserAdmin = false;
    if (key === 'USER_ADMIN') {
      this.isUserAdmin = true;
    }
  }

  selectSubRole(subRoleCode: any) {
    const subRole = this.subRole.find(obj => obj.subRoleCode === subRoleCode);
    if (subRole) {
      this.dataForm.get('subRoleName')?.setValue(subRole.subRoleName);
    }
    this.dataForm.markAsDirty();
  }
  selectDataScope(e: any) {
    this.dataForm.markAsDirty();
  }

  selectLevel(levelCode: any) {
    this.dataForm.markAsDirty();
    const detail = this.detailMaster.filter(f => {
      return f.roleCode === this.dataForm.get('roleCode')?.value;
    });
    let list: any = [];
    if (levelCode === LEVEL_CODE.ORGANIZATION) {
      list = detail.map(f => {
        return { name: f?.organizationName, code: f?.organizationCode, ...f };
      });
    }
    if (levelCode === LEVEL_CODE.GROUP) {
      list = detail.map(f => {
        return { name: f?.groupName, code: f?.groupCode, ...f };
      });
    }
    if (levelCode === LEVEL_CODE.OFFICER || levelCode === LEVEL_CODE.ALL) {
      list = detail.map(f => {
        return { name: f?.authorityName, code: f?.authorityCode, ...f };
      });
    }
    if (levelCode === LEVEL_CODE.FACTION) {
      list = detail.map(f => {
        return { name: f?.factionName, code: f?.factionCode, ...f };
      });
    }
    if (levelCode === LEVEL_CODE.TEAM) {
      list = detail.map(f => {
        return { name: f?.teamName, code: f?.teamCode, ...f };
      });
    }
    this.detail = [...new Map(list.map((item: any) => [item['code'], item])).values()];
  }

  selectDetail(detailCode: any) {
    const detail = this.detail.find(f => f.code === detailCode);
    this.dataForm.get('organizationName')?.setValue(detail.organizationName);
    this.dataForm.get('organizationCode')?.setValue(detail.organizationCode);
    this.dataForm.get('groupName')?.setValue(detail.groupName);
    this.dataForm.get('groupCode')?.setValue(detail.groupCode);
    this.dataForm.get('authorityName')?.setValue(detail.authorityName);
    this.dataForm.get('authorityCode')?.setValue(detail.authorityCode);
    this.dataForm.get('factionName')?.setValue(detail.factionName);
    this.dataForm.get('factionCode')?.setValue(detail.factionCode);
    this.dataForm.get('teamName')?.setValue(detail.teamName);
    this.dataForm.get('teamCode')?.setValue(detail.teamCode);
  }

  async onSearch(e: any) {
    const userInput = this.dataForm.get('userInput')?.value;
    if (userInput && userInput?.length >= 4) {
      this.getPhonebookUser(userInput);
    }
  }

  edit() {
    this.mode = MODE.EDIT;
    this.routerService.navigateByUrl('main/user/edit?userId=' + this.dataForm.get('userId')?.value);
  }

  switch(e: any) {
    let exceptRole = ['KLAW_USER', 'KLAW_FINANCIAL', 'KLAW_SECRETARY'];
    this.dataForm.reset();
    this.dataForm.markAsUntouched();
    if (this.userType == 'BULK') {
      this.role = this.roleMaster.filter(f => !exceptRole.includes(f?.roleCode || '-'));
    } else {
      this.role = this.roleMaster;
    }
  }

  formIsValid() {
    let lawyerCode: boolean | undefined = true;
    let roleCode = this.dataForm.get('roleCode')?.valid;
    let subRoleCode = this.dataForm.get('subRoleCode')?.valid;
    let dataScopeCode = this.dataForm.get('dataScopeCode')?.valid;
    let levelCode = this.dataForm.get('levelCode')?.valid;
    let detailCode = this.dataForm.get('detailCode')?.valid;
    if (this.dataForm.get('roleCode')?.value === 'KLAW_USER') {
      lawyerCode = this.dataForm.get('lawyerCode')?.valid;
    }
    if (this.userType === 'BULK') {
      let table = this.selection.selected.length !== 0 && this.dataTable.valid;
      let org = this.dataForm.get('orgCode')?.valid;
      return table && org && roleCode && subRoleCode && dataScopeCode && levelCode && detailCode;
    } else if (this.userType === 'PERSON') {
      let userId = this.dataForm.get('userId')?.valid;
      let mobileNumber = this.dataForm.get('mobileNumber')?.valid;
      return (
        userId && mobileNumber && roleCode && subRoleCode && dataScopeCode && levelCode && detailCode && lawyerCode
      );
    }
    return false;
  }

  async save() {
    const user = this.dataForm.value;
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();
    if (this.formIsValid()) {
      if (this.mode === MODE.EDIT) {
        await this.saveUser(UPDATE_FLAG.UPDATE);
        this.dataForm.markAsPristine();
        this.back();
        this.notificationService.openSnackbarSuccess(
          `${user.userId} ${this.translate.instant('USER.SNACKBAR_UPDATE')}`
        );
      }
      if (this.mode === MODE.ADD) {
        await this.saveUser(UPDATE_FLAG.CREATE);
        this.dataForm.markAsPristine();
        this.back();
        if (this.userType === 'PERSON') {
          this.notificationService.openSnackbarSuccess(`${user.userId} ${this.translate.instant('USER.SNACKBAR_ADD')}`);
        } else {
          this.notificationService.openSnackbarSuccess(
            `${this.translate.instant('USER.SNACKBAR_MULTI_ADD', {
              orgName: this.dataForm.get('orgName')?.value,
            })}`
          );
        }
      }
    }
  }

  async deleteBtn() {
    const user = this.dataForm.value;
    const userId = user.userId as string;
    const optionsDialog: DialogOptions = {
      rightButtonLabel: this.user.disable
        ? 'USER.NOTIFICATION_ENABLE_BTN_CONFIRM'
        : 'USER.NOTIFICATION_DISABLE_BTN_CONFIRM',
      buttonIconName: 'icon-Dismiss-Circle',
      autoFocus: false,
      contentCssClasses: ['actions-right-full-width'],
      leftButtonClass: 'width-pct-47-button',
      rightButtonClass: this.user.disable ? 'primary long-button' : '',
    };

    let titleDialog = this.user.disable
      ? this.translate.instant('USER.NOTIFICATION_ENABLE_TITLE')
      : this.translate.instant('USER.NOTIFICATION_DISABLE_TITLE');
    let detailDialog = `${user.userId}-${this.user.title}${this.user.name} ${this.user.surname} ${
      this.user.disable
        ? this.translate.instant('USER.NOTIFICATION_ENABLE_SUB_DETAIL')
        : this.translate.instant('USER.NOTIFICATION_DISABLE_SUB_DETAIL')
    }<br/> ${
      this.user.disable
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
          this.user.disable
            ? this.translate.instant('USER.SNACKBAR_ENABLE_SUCCESS_DETAIL')
            : this.translate.instant('USER.SNACKBAR_DISABLE_SUCCESS_DETAIL')
        }`
      );
      this.user = await this.userService.getUser(this.userIdRoute);
      this.actionBar.deleteButtonText = this.user.disable
        ? this.translate.instant('COMMON.BUTTON_ENABLE')
        : this.translate.instant('COMMON.BUTTON_DISABLE');
      this.onChangeDeleteButton();
    }
  }

  async cancel() {
    this.back();
  }

  back() {
    this.routerService.navigateTo('/main/user');
  }

  async canDeactivate() {
    if (!!!this.dataForm.dirty) {
      return true;
    }
    return await this.sessionService.confirmExitWithoutSave();
  }
  onChangeDeleteButton() {
    this.actionBar.hasEditButton = true;
    this.actionBar.hasDeleteButton = true;
    this.actionBar.deleteButtonPositive = this.user.disable ? true : false;
    this.actionBar.deleteButtonIcon = this.user.disable ? 'icon-Checkmark-Circle-Regular' : 'icon-Dismiss-Circle';
  }

  openPopup() {
    let res = this.dialog.open(UserPopupComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        userIdRoute: this.userIdRoute,
        roleCode: this.getControl('roleCode').value,
        subRoleCode: this.getControl('subRoleCode').value,
        roleName: this.getControl('roleName').value,
        subRoleName: this.getControl('subRoleName').value,
        mode: this.mode,
      },
    });

    res.afterClosed().subscribe(i => {
      if (!i) {
      }
    });
  }
}
