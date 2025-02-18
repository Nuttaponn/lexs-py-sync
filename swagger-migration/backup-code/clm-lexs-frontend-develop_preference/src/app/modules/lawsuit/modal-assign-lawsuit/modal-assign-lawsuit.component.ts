import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import { LexsRole, LexsUserOption, TransferLitigationRequest } from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';

interface ELexsUserOption extends LexsUserOption {
  fullName?: string;
}
@Component({
  selector: 'app-modal-assign-lawsuit',
  templateUrl: './modal-assign-lawsuit.component.html',
  styleUrls: ['./modal-assign-lawsuit.component.scss'],
})
export class ModalAssignLawsuitComponent implements OnInit {
  legalStatusConfig: DropDownConfig = { iconName: 'icon-Filter', searchPlaceHolder: '' };
  /** search control */
  public searchGroup: UntypedFormGroup = this.initSearchControl();

  displayedColumns: string[] = ['no', 'userId', 'fullName', 'roleCode'];
  dataSource: ELexsUserOption[] = [];
  selectDataSource: any;
  dataSourceFillter: ELexsUserOption[] = [];
  dataSourceCount: number;

  selelectedNo!: string;
  level: string = 'LITIGATION';
  levelList: { name: string; value: string }[] = [
    { name: 'มอบหมายระดับเลขที่กฎหมาย (LG ID)', value: 'LITIGATION' },
    { name: 'มอบหมายระดับคดี', value: 'CASE' },
  ];
  messageBanner: any;
  // seasons: string[] = ['1'];
  isSubmited: boolean = false;
  roleConfig = {
    iconName: 'icon-Filter',
    displayWith: 'roleName',
    valueField: 'roleCode',
    labelPlaceHolder: 'ทุกหน้าที่',
  };
  roleOptions: Array<LexsRole> = [{ roleCode: 'ALL', roleName: 'ค้นหา LEXS Role' }];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private lawsuitService: LawsuitService,
    private sessionService: SessionService,
    private translateService: TranslateService
  ) {
    this.dataSourceCount = 0;
  }
  async ngOnInit() {
    let currentUser: any = this.sessionService.currentUser;
    let getUserList = await this.lawsuitService.transferTaskUserOption();
    this.dataSource = getUserList.filter(e => e.userId !== currentUser.userId);
    this.dataSource.map(e => {
      e.fullName = `${e.title}${e.name} ${e.surname}`;
    });
    this.dataSourceFillter = Utils.deepClone(this.dataSource);
    const role = this.dataSourceFillter.map(e => e.roleCode);
    const roleList = role.filter((item, index) => role.indexOf(item) == index);

    let dataRoleList = [...this.roleOptions];
    roleList.map(e => {
      dataRoleList.push({ roleCode: e, roleName: e });
    });

    this.roleOptions = dataRoleList;
  }
  initSearchControl() {
    return this.formBuilder.group({
      searchInput: ['', Validators.minLength(3)],
      role: ['ALL'],
    });
  }

  dataContext(data: any) {
    this.selectDataSource = data.icontents;
    this.dataSourceCount = data.icontents.length;
    this.messageBanner = `${this.dataSourceCount} ${this.translateService.instant('LAWSUIT.SUIT_SELECTED')}`;
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearch();
  }

  onSearch() {
    let data: ELexsUserOption[] = this.dataSource;
    const searchText = this.searchGroup.get('searchInput')?.value.trim();
    const searchRole = this.searchGroup.get('role')?.value;

    let dataFilter = [];

    if (searchRole === 'ALL') {
      if (searchText && this.searchGroup.get('searchInput')?.valid) {
        dataFilter = data.filter(it => it.fullName?.includes(searchText) || it.userId?.includes(searchText));
      } else {
        dataFilter = data;
      }
    } else {
      const filterRole = data.filter(it => it.roleCode?.includes(searchRole));
      dataFilter = filterRole;
      if (searchText && this.searchGroup.get('searchInput')?.valid) {
        dataFilter = filterRole.filter(it => it.fullName?.includes(searchText) || it.userId?.includes(searchText));
      }
    }

    this.dataSourceFillter = dataFilter;
  }

  public async onClose(): Promise<boolean> {
    this.isSubmited = true;
    if (!this.selelectedNo) {
      return false;
    }

    const request: TransferLitigationRequest = {
      transferLevel: this.level,
      selectedLitigationList: this.selectDataSource,
      targetUserId: this.selelectedNo,
    };
    let popupStatus = false;

    await this.lawsuitService
      .transferLitigation(request)
      .then(() => (popupStatus = true))
      .catch(() => (popupStatus = false));
    return popupStatus;
  }

  get returnData() {
    const data = this.dataSource.filter(e => e.userId == this.selelectedNo)[0];
    return {
      count: this.dataSourceCount,
      data: data,
    };
  }
}
