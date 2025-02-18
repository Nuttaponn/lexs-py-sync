import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { BlobType, FileType } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { Utils } from '@app/shared/utils/util';
import {
  ConfigurationControllerService,
  InquiryRoleOrganizationMapsDto,
  InquiryRoleOrganizationMapsResponse,
  LexsRole,
  LexsSubRole,
  LexsUserDto,
  LexsUserOption,
  LexsUserRequest,
  OrganizationMap,
  PhoneBookDto,
  PhonebookControllerService,
  RoleLevelMap,
  RolePermissionTemplateDto,
  UserControllerService,
  UserControllerV2Service,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _role: Array<LexsRole> | null = null;
  private _subRole: Array<LexsSubRole> | null = null;
  private _roleLevel: Array<LexsSubRole> | null = null;
  private _roleOrganization: Array<InquiryRoleOrganizationMapsDto> | null = null;
  private _organization: Array<OrganizationMap> | null = null;
  private _serachData: any = {};
  private _rolePermissionTemp: Array<RolePermissionTemplateDto> | null = null;
  constructor(
    private translate: TranslateService,
    private errorHandlingService: ErrorHandlingService,
    private userControllerService: UserControllerService,
    private userControllerV2Service: UserControllerV2Service,
    private phonebookControllerService: PhonebookControllerService,
    private configService: ConfigurationControllerService,
    private logger: LoggerService
  ) {}

  get currentRole(): Array<LexsRole> {
    return this._role || [];
  }

  set currentRole(role: Array<LexsRole>) {
    this._role = role;
  }

  get currentRolePermissionTemp(): Array<RolePermissionTemplateDto> {
    return this._rolePermissionTemp || [];
  }

  set currentRolePermissionTemp(roleTemp: Array<RolePermissionTemplateDto>) {
    this._rolePermissionTemp = roleTemp;
  }

  get currentSubRole(): Array<LexsRole> {
    return this._subRole || [];
  }

  set currentSubRole(role: Array<LexsRole>) {
    this._subRole = role;
  }

  get currentRoleLevel(): Array<RoleLevelMap> {
    return this._roleLevel || [];
  }

  set currentRoleLevel(roleLevel: Array<RoleLevelMap>) {
    this._roleLevel = roleLevel;
  }

  get currentRoleOrganization(): Array<InquiryRoleOrganizationMapsDto> {
    return this._roleOrganization || [];
  }

  set currentRoleOrganization(roleOrganization: Array<InquiryRoleOrganizationMapsDto>) {
    this._roleOrganization = roleOrganization;
  }

  get currentOrganization(): Array<OrganizationMap> {
    return this._organization || [];
  }

  set currentOrganization(organization: Array<RoleLevelMap>) {
    this._organization = organization;
  }

  get currentSearch(): any {
    return this._serachData;
  }

  set currentSearch(search: any) {
    this._serachData = search;
  }

  private _allUserOptions: LexsUserOption[] | null = null;
  public get allUserOptions(): LexsUserOption[] {
    return this._allUserOptions || [];
  }
  private set allUserOptions(value: LexsUserOption[]) {
    this._allUserOptions = value;
  }

  clearData() {
    this.currentSearch = {};
  }

  clearDataConfig() {
    this._role = null;
    this._subRole = null;
    this._roleLevel = null;
    this._organization = null;
    this._allUserOptions = null;
    this._rolePermissionTemp = null;
    this._roleOrganization = null;
  }

  async inquiryUsers(
    dataScope?: string,
    filterKeyword?: string,
    page?: number,
    role?: string,
    size?: number,
    subRole?: string
  ): Promise<any> {
    // TODO: display proper message for exception
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userControllerService.inquiryUsers(dataScope, filterKeyword, page, role, size, subRole))
    );
  }

  private _kFinanceApprvOptions!: LexsUserOption[];
  public get kFinanceApprvOptions(): LexsUserOption[] {
    return this._kFinanceApprvOptions || [];
  }
  public set kFinanceApprvOptions(value: LexsUserOption[]) {
    this._kFinanceApprvOptions = value;
  }

  private _kLawyerUserOptions!: LexsUserOption[];
  public get kLawyerUserOptions(): LexsUserOption[] {
    return this._kLawyerUserOptions || [];
  }
  public set kLawyerUserOptions(value: LexsUserOption[]) {
    this._kLawyerUserOptions = value;
  }

  async getUser(id: string) {
    // TODO: Set proper message on Snackbar
    return await this.errorHandlingService.invokeNoRetry(() => lastValueFrom(this.userControllerService.getUser(id)));
  }

  async saveUser(dataForm: UntypedFormGroup, flag: string) {
    const valueForm = dataForm.value;
    const request: LexsUserRequest = {
      authorityCode: valueForm.authorityCode,
      dataScopeCode: valueForm.dataScopeCode,
      factionCode: valueForm.factionCode,
      levelCode: valueForm.levelCode,
      groupCode: valueForm.groupCode,
      mobileNumber: valueForm.mobileNumber,
      organizationCode: valueForm.organizationCode,
      supervisorId: valueForm.supervisorId,
      roleCode: valueForm.roleCode,
      subRoleCode: valueForm.subRoleCode,
      teamCode: valueForm.teamCode,
      updateFlag: flag,
      lawyerCode: valueForm.lawyerCode,
    };

    // TODO: Set proper message on Snackbar
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.userControllerService.saveUser(valueForm.userId, request)),
      { notShowAsSnackBar: true }
    );
    // /v1/user/{userid} add hight level key to params when your role not hight level
  }

  async revokeUser(id: string) {
    // TODO: Set proper message on Snackbar
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userControllerService.revokeUser(id))
    );
  }

  async inquiryUserOptions(category?: string, roleCode?: string) {
    if (!!!category && !!!roleCode) {
      this._allUserOptions =
        this._allUserOptions === null
          ? await this.errorHandlingService.invokeNoRetry(
              () => lastValueFrom(this.userControllerService.inquiryUserOptions(category, roleCode)),
              { snackBarMessage: this.translate.instant('USER.SNACKBAR_FAIL') }
            )
          : this._allUserOptions;
      return this._allUserOptions;
    } else {
      const response = await this.errorHandlingService.invokeNoRetry(
        () => lastValueFrom(this.userControllerService.inquiryUserOptions(category, roleCode)),
        { snackBarMessage: this.translate.instant('USER.SNACKBAR_FAIL') }
      );
      return response;
    }
  }

  async inquiryUserOptionsAndRoleCode(id?: string, roleCode?: string) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.userControllerService.inquiryUserOptions(id, roleCode)),
      {
        snackBarMessage: this.translate.instant('USER.SNACKBAR_FAIL'),
      }
    );
  }

  async inquiryUserOptionsAndRoleCodeV2(
    category?: string,
    fractionCode?: Array<string>,
    roleCode?: Array<string>,
    subRoleCode?: Array<string>
  ) {
    let _response: Array<LexsUserOption> = [];
    try {
      _response = await lastValueFrom(
        this.userControllerV2Service.inquiryUserOptions(category, fractionCode, roleCode, subRoleCode)
      );
      return _response;
    } catch (error) {
      return _response;
    }
  }

  async inquiryUserOptionV2KlawUserByFnCode(fractionCode: string[] = []) {
    return await this.inquiryUserOptionsAndRoleCodeV2('KLAW', fractionCode, ['KLAW_USER']);
  }

  async getPhonebookUser(keyword: string) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.phonebookControllerService.getPhonebookUser(keyword)),
      { snackBarMessage: this.translate.instant('USER.SNACKBAR_FAIL') }
    );
  }

  async getRole() {
    this.currentRole = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquiryRole())
    );
  }

  async inquiryRoleOrganizationMaps() {
    const response: InquiryRoleOrganizationMapsResponse = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquiryRoleOrganizationMaps())
    );
    this.currentRoleOrganization = response.inquiryRoleOrganizationMapsDtos || [];
  }

  async getSubRole() {
    this.currentSubRole = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquirySubRoleMap())
    );
  }

  async getRoleLevel() {
    this.currentRoleLevel = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquiryRoleLevelMap())
    );
  }

  async getOrganization() {
    this.currentOrganization = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquiryOrganizationMap())
    );
  }

  async inquiryRoleTemplate() {
    this.currentRolePermissionTemp = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configService.inquiryRoleTemplate())
    );
  }

  async inquiryUsersExcel() {
    const date = Utils.getCurrentDate().replace('-', '');
    const filename = 'Export User ' + date;
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userControllerService.inquiryUsersExcelDownload())
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async inquiryRoleExcelDownload() {
    const filename = 'บันทึกสิทธิ์ผู้ใช้งานทั้งหมด';
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userControllerService.inquiryRoleExcelDownload())
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async getPhonebookOptions(keyword?: string): Promise<PhoneBookDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.phonebookControllerService.getPhonebookOptions(keyword))
    );
  }

  async saveMultipleUser(dataForm: UntypedFormGroup, flag: string, selection: SelectionModel<any>) {
    const dataTable = dataForm.get('dataTable') as UntypedFormArray;
    const valueForm = dataForm.value;
    let request: LexsUserRequest[] = [];

    for (let index = 0; index < dataTable.value.length; index++) {
      const element = dataTable?.value[index];
      const formGroup = dataTable.at(index);
      if (element?.mobileNumber && selection.isSelected(formGroup)) {
        const user: LexsUserRequest = {
          authorityCode: valueForm.authorityCode,
          dataScopeCode: valueForm.dataScopeCode,
          factionCode: valueForm.factionCode,
          groupCode: valueForm.groupCode,
          lawyerCode: valueForm.lawyerCode,
          levelCode: valueForm.levelCode,
          organizationCode: valueForm.organizationCode,
          supervisorId: valueForm.supervisorId,
          roleCode: valueForm.roleCode,
          subRoleCode: valueForm.subRoleCode,
          teamCode: valueForm.teamCode,
          updateFlag: flag,
          userId: element.userId,
          mobileNumber: element.mobileNumber,
        };
        request.push(user);
      }
    }
    this.logger.logAPIRequest('saveMultipleUser :: ', request);

    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.userControllerService.saveMultipleUser(request)),
      { notShowAsSnackBar: true }
    );
  }

  async getKtbBoss(organizationCode?: Array<string>): Promise<LexsUserDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.userControllerService.getKtbBoss(organizationCode))
    );
  }
}
