import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from '@app/shared/utils/util';
import { MeLexsUserDto, RolePermissionTemplateDto } from '@lexs/lexs-client';
import { DASH_BOARD, KEY_TEMPLATE_UAM, MODE } from '../user-form.constant';
import { UserService } from '../user.service';
@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss'],
})
export class UserPopupComponent implements OnInit {
  public MODE = MODE;
  public mode = MODE.VIEW;
  public dashBoard = Utils.deepClone(DASH_BOARD);
  public KEY_TEMPLATE_UAM: any[] = KEY_TEMPLATE_UAM;
  public list: any = {};
  public isUserAdmin: boolean = false;

  private permissions: Array<string> = [];
  private user: MeLexsUserDto = {};
  private rolePermissionTemp: Array<RolePermissionTemplateDto> = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.rolePermissionTemp = this.userService.currentRolePermissionTemp;
    let roleCode: string | undefined = '';
    let subRoleCode: string | undefined = '';
    if (this.data.mode === MODE.ADD || this.data.mode === MODE.EDIT) {
      roleCode = this.data.roleCode;
      subRoleCode = this.data.subRoleCode;
      this.permissions = this.getPermissionSetByRole(roleCode, subRoleCode);
    } else if (this.mode === MODE.VIEW) {
      this.user = await this.userService.getUser(this.data.userIdRoute);
      roleCode = this.user.roleCode;
      subRoleCode = this.user.subRoleCode;
      this.permissions = this.user.permissions || [];
    }

    this.setDefaultTemplate();
  }

  getPermissionSetByRole(roleCode: string | undefined, subRoleCode: string | undefined): Array<string> {
    let set = this.rolePermissionTemp.filter(
      (f: RolePermissionTemplateDto) => f.roleCode === roleCode && f.subRoleCode === subRoleCode
    );
    return set[0]?.permissionCodeSet || [];
  }

  setDefaultTemplate() {
    for (let index = 0; index < KEY_TEMPLATE_UAM.length; index++) {
      const pair: any = KEY_TEMPLATE_UAM[index];
      let name: any = pair.key;
      if (!this.list[name]) this.list[name] = [];
      this.list[name] = this.setDefaultToArray(pair.value);
    }
  }

  setDefaultToArray(list: Array<any>): any {
    for (let index = 0; index < list.length; index++) {
      const db = list[index];
      if (this.permissions?.find((f: any) => f === db.code)) {
        db.checked = true;
      } else {
        db.checked = false;
      }
    }
    return list;
  }

  addDataToSet(list: any) {
    for (let index = 0; index < list.length; index++) {
      const db = list[index];
      if (db.checked) {
        this.permissions.push(db.code);
      }
    }
  }
}
