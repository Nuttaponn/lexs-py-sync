import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigurationSearchConditionReq,
  ExtendResponseUnitUserDto,
  ILexsUserOption,
} from '@app/modules/configuration/config.model';
import { IConfigResolver } from '@app/modules/configuration/configuration.resolver';
import { ConfigurationService } from '@app/modules/configuration/configuration.service';
import { UserMatchComponent } from '@app/modules/configuration/user-match/user-match.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { PageOfResponseUnitUserDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import {
  DialogOptions,
  DropDownConfig,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';

interface IPageSelection {
  page: number;
  selectedExtendResponseUnitUserDtos: ExtendResponseUnitUserDto[];
  selectedCustomPrimaryKeys: string[];
}
@Component({
  selector: 'app-configuration-matching',
  templateUrl: './configuration-matching.component.html',
  styleUrls: ['./configuration-matching.component.scss'],
})
export class ConfigurationMatchingComponent implements OnInit {
  @Input() taskId!: number;
  public isOpened = true;
  public displayedColumns: string[] = [
    'selection',
    'no',
    'responseUnitCode',
    'responseUnitName',
    'userIdName',
    'teamName',
    'bossIdName',
    'createdDate',
    'effectiveDate',
    'cmd',
  ];
  private resolverData!: IConfigResolver;

  //dropdown popup
  private ddlkbdOptions: Array<ILexsUserOption> = [];
  private pageSelections: IPageSelection[] = [];

  private pageOfResponseUnitUserDto: PageOfResponseUnitUserDto = {};
  public extendResponseUnitUserDtoList: ExtendResponseUnitUserDto[] = []; /* main data -> original DtoList */

  private curentPage: number = 0;
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  /** Selection */
  public selection = new SelectionModel<string>(true, []);

  public searchCtrl: UntypedFormGroup = this.initSearchControl();

  private currentSortBy: string[] = ['userId'];
  private currentSortOrder: string = 'ASC';

  public placeholder = 'CONFIGURATION.HEAD_COLUMN_RESPONSE_UNIT_CODE';
  public ddlUserOptions: Array<SimpleSelectOption> = [];
  public ddlUserConfig: DropDownConfig = { iconName: 'icon-Filter', searchPlaceHolder: '', searchWith: 'text' };

  constructor(
    private translate: TranslateService,
    public fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute
  ) {
    this.resolverData = this.route.snapshot.data['configResolver'] as IConfigResolver;
  }

  async ngOnInit() {
    this.ddlkbdOptions = this.resolverData?.ddlkbdOptions || [];
    this.ddlUserOptions = this.resolverData?.ddlUserOptions || [];
    await this.initTablePart();
    this.configurationService.clearData(); /* Clear Data OnInit to make sure that service is clean */
  }

  initSearchControl() {
    return this.fb.group({
      userId: 'ALL',
      responseUnitCode: ['', Validators.minLength(3)],
    });
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearchFilter(true);
  }

  async onOpenUserMatchDialog(selectedDto: ExtendResponseUnitUserDto) {
    let updatedDtoIndex = this.configurationService.updatedResponseUnitUsers.findIndex(
      dto => dto.customPrimaryKey === selectedDto.customPrimaryKey
    );
    const myContext = {
      extendedResponseUnitUserDetailsDtos:
        updatedDtoIndex >= 0
          ? [...(this.configurationService.updatedResponseUnitUsers[updatedDtoIndex].responseUnitUserDetailsDto ?? [])]
          : [...(selectedDto.responseUnitUserDetailsDto ?? [])],
      ddlcc_kbdOptions: [...this.ddlkbdOptions],
    };
    const dialogSetting: DialogOptions = {
      component: UserMatchComponent,
      title: 'CONFIGURATION.USER_MATCH_TITLE',
      iconName: 'icon-Edit',
      rightButtonLabel: 'CONFIGURATION.CONFIRM_MATCHING_BTN',
      buttonIconName: 'icon-Selected',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    const res = await this.notificationService.showCustomDialog(dialogSetting);

    if (!res) return;

    if (res.isEdited === true) {
      if (updatedDtoIndex < 0) {
        this.configurationService.updatedResponseUnitUsers.push({ ...selectedDto });
        updatedDtoIndex = this.configurationService.updatedResponseUnitUsers.length - 1;
      }
      this.configurationService.updatedResponseUnitUsers[updatedDtoIndex].responseUnitUserDetailsDto = [
        ...res?.extendedResponseUnitUserDetailsDtos,
      ];
    }

    this.notificationService.openSnackbarSuccess(this.translate.instant('CONFIGURATION.EDIT_MATCHING_SUCCESS'));
  }

  async initTablePart() {
    this.curentPage = 0;
    this.clearPageData();
    await this.inquiryResponseUnitUsers({});

    this.setDataToPageSelections(); /* push new IPageSelection */
  }

  clearPageData() {
    this.selection = new SelectionModel<string>(true, []);
    this.pageSelections = [];
  }

  setDataToPageSelections() {
    const index = this.pageSelections.findIndex(obj => obj.page === this.curentPage);
    if (index >= 0) {
      this.pageSelections[index].selectedCustomPrimaryKeys = this.selection.selected;

      this.pageSelections[index].selectedExtendResponseUnitUserDtos = [];
      for (const dto of this.extendResponseUnitUserDtoList) {
        if (this.selection.selected.includes(dto.customPrimaryKey ?? '')) {
          this.pageSelections[index].selectedExtendResponseUnitUserDtos.push({ ...dto });
        }
      }
    } else {
      this.pageSelections.push({
        page: this.curentPage,
        selectedExtendResponseUnitUserDtos: [],
        selectedCustomPrimaryKeys: this.selection.selected,
      });
    }
  }

  async pageEvent(event: number) {
    this.setDataToPageSelections(); /* save current pageSelection */

    this.curentPage = event - 1;

    await this.onSearchFilter();

    this.getDataToPageSelections(); /* get new pageSelection */
  }

  async onSearchFilter(isClearPageDate: boolean = false) {
    if (isClearPageDate) this.clearPageData();
    if (this.searchCtrl.get('responseUnitCode')?.invalid) {
      return;
    }

    const searchCondReq: ConfigurationSearchConditionReq = {
      userId: this.searchCtrl.get('userId')?.value,
      responseUnitCode: this.searchCtrl.get('responseUnitCode')?.value || null,
    };

    await this.inquiryResponseUnitUsers(searchCondReq);
  }

  onCheckboxChange(row: ExtendResponseUnitUserDto) {
    row.customPrimaryKey && this.selection.toggle(row.customPrimaryKey);
  }

  async inquiryResponseUnitUsers(searchCondReq: ConfigurationSearchConditionReq) {
    searchCondReq = {
      ...searchCondReq,
      page: this.curentPage,
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    };

    if (!!this.taskId) {
      this.pageOfResponseUnitUserDto = await this.configurationService.inquiryResponseUnitMapTasks(
        (this.taskId ?? '').toString(),
        searchCondReq
      );
    } else {
      this.pageOfResponseUnitUserDto = await this.configurationService.inquiryResponseUnitUsers(searchCondReq);
    }

    this.extendResponseUnitUserDtoList = this.pageOfResponseUnitUserDto.content || [];

    for (let i in this.extendResponseUnitUserDtoList) {
      this.extendResponseUnitUserDtoList[i].no = (this.curentPage * 10 + Number(i) + 1).toString();
      this.extendResponseUnitUserDtoList[i].customPrimaryKey = this.getCustomPrimaryKey(
        this.extendResponseUnitUserDtoList[i]
      );
    }
    const { resultConfig, actionConfig } = Utils.setPagination(
      this.pageOfResponseUnitUserDto.pageable,
      this.pageOfResponseUnitUserDto.numberOfElements,
      this.pageOfResponseUnitUserDto.totalPages,
      this.pageOfResponseUnitUserDto.totalElements
    );
    this.pageResultConfig = resultConfig;
    this.pageActionConfig = actionConfig;
  }

  getCustomPrimaryKey(dto: ExtendResponseUnitUserDto): string {
    return `${dto.userId}|${dto.responseUnitCode}|${dto.ktbBossUserId}|${dto.teamName}`;
  }

  isAllSelected() {
    return this.selection.selected.length === this.extendResponseUnitUserDtoList.length;
  }

  async onClickPairResponseUnits() {
    // many pair
    const selectedDtos = this.getAllSelectedDtos();

    const responseUnituserNumber = selectedDtos.length;

    if (responseUnituserNumber <= 0) {
      await this.notificationService.alertDialog(
        'CONFIGURATION.ALERT_DIALOG_UNABLE_MATCH_TITLE',
        'CONFIGURATION.ALERT_DIALOG_UNABLE_MATCH_CONTENT',
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
      return;
    }

    // TODO: open dialog
    // https://www.figma.com/file/v86HuNshwBXPjhvc8E55fK/MVP-1.3---LEXS?node-id=279%3A387089&t=0GKmPNYcZ4Fp8h7G-0
    const res = await this.configurationService.callMultiUserMatchDialogComponent(responseUnituserNumber, [
      ...this.ddlkbdOptions,
    ]);
    if (typeof res === 'boolean') return;

    /** จังหวะวนเพื่อ Add ข้อมูล temporary */
    const { selectedUser, effectiveDate } = res;
    let countUpdate = 0;

    // * ฉันสามารถกดปุ่ม “ยืนยันเลือกหน่วยงานดูแลลูกหนี้" เพื่อบันทึกการเปลี่ยนแปลง โดยระบบจะทําการเปลี่ยนแปลงให้หากผ่าน validation
    // ๐ หากไม่เลือกผู้ดูแลหรือไม่เลือกวันที่เริ่มต้นดูแล ระบบจะแสดง error message ที่ข้อมูลนั้นสีแดงและยังคงอยู่ในหน้านี้ donee
    // ๐ หากเลือกตรงกับผู้ดูแลรายเดิมที่มีผลอยู่และไม่ได้มีรายการผู้ดูแลรายอื่นมาคั่นระหว่างวันที่มีผลกับรายการผู้ดูแลที่รับผิดชอบในอนาคตให้ ignore รายการของหน่วยงานนี้(เหมือนไม่ได้เลือก)
    // ๐ หากวันที่ที่มีผลตรงกับรายการในอนาคตของรายการที่มีอยู่แล้วให้ ignore รายการของหน่วยงานนี้(เหมือนไม่ได้เลือก)

    for (let selectedDto of selectedDtos) {
      const index = this.configurationService.updatedResponseUnitUsers?.findIndex(
        dto => dto.customPrimaryKey === selectedDto.customPrimaryKey
      );

      if (index >= 0) {
        /** ถ้ามีข้อมูลที่ save ไว้ก่อนหน้านี้ให้เอามาใช้ก่อน */
        if (
          !this.configurationService.isBusinessLogicAddUserInvalid(
            this.configurationService.getBusinessLogicAddUserValidate(
              [...(this.configurationService.updatedResponseUnitUsers[index].responseUnitUserDetailsDto ?? [])],
              selectedUser.userId ?? '',
              effectiveDate
            )
          )
        ) {
          this.configurationService.updatedResponseUnitUsers[index].responseUnitUserDetailsDto = [
            ...this.configurationService.businessLogicAddUserAddNewUserToList(selectedUser, effectiveDate, [
              ...(this.configurationService.updatedResponseUnitUsers[index].responseUnitUserDetailsDto ?? []),
            ]),
          ];
          countUpdate += 1;
        }
      } else {
        /** ถ้าไม่มีข้อมูลที่ save ไว้ก่อนหน้านี้ */
        const pageListIndex = selectedDtos?.findIndex(dto => dto.customPrimaryKey === selectedDto.customPrimaryKey);

        if (
          !this.configurationService.isBusinessLogicAddUserInvalid(
            this.configurationService.getBusinessLogicAddUserValidate(
              [...(selectedDtos[pageListIndex].responseUnitUserDetailsDto ?? [])],
              selectedUser.userId ?? '',
              effectiveDate
            )
          )
        ) {
          selectedDtos[pageListIndex].responseUnitUserDetailsDto = [
            ...this.configurationService.businessLogicAddUserAddNewUserToList(selectedUser, effectiveDate, [
              ...(selectedDtos[pageListIndex].responseUnitUserDetailsDto ?? []),
            ]),
          ];

          this.configurationService.updatedResponseUnitUsers.push({ ...selectedDtos[pageListIndex] });
          countUpdate += 1;
        }
      }
    }

    if (countUpdate > 0) {
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('CONFIGURATION.SUCCESS_BAR_MULTI_USER_ADDED', {
          RES_UNIT_NUM: countUpdate,
          USER: selectedUser.fullname,
        })
      );
    } else {
      this.notificationService.alertDialog(
        'CONFIGURATION.ALERT_DIALOG_MULTI_USER_UNABLE_ADD_TITLE',
        'CONFIGURATION.ALERT_DIALOG_MULTI_USER_UNABLE_ADD_CONTENT',
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
    }
    /** reset configuration-matching */
    await this.initTablePart();
  }

  getAllSelectedDtos(): ExtendResponseUnitUserDto[] {
    this.setDataToPageSelections(); /* Save current stage PaginationData */

    let selected: ExtendResponseUnitUserDto[] = [];
    for (let pageSelection of this.pageSelections) {
      selected = [...selected, ...pageSelection.selectedExtendResponseUnitUserDtos];
    }
    return selected;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _mapperData = this.extendResponseUnitUserDtoList.map(m => {
        return m.customPrimaryKey;
      }) as string[];
      this.selection.select(..._mapperData);
    }
  }

  getDataToPageSelections() {
    const index = this.pageSelections.findIndex(obj => obj.page === this.curentPage);
    this.selection.clear();
    if (index >= 0) {
      this.selection.select(...this.pageSelections[index].selectedCustomPrimaryKeys);
    } else {
      this.setDataToPageSelections(); /* push new IPageSelection */
    }
  }
}
