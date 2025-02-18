import { Inject, Injectable } from '@angular/core';
import { UserService } from '@app/modules/user/user.service';
import { TMode, taskCode } from '@app/shared/models';
import { MeLexsUserDto } from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { Configuration, TokenService } from '@spig/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { MasterDataService } from './master-data.service';
import { NotificationService } from './notification.service';
import { RouterService } from './router.service';

export interface AccessPermissions {
  subRoleCode: string;
  mode: TMode[];
  permissions: Array<string>;
}

export interface ActionOnScreen {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _currentUser: MeLexsUserDto | undefined;
  private _viewAs: string | undefined;
  private _isLogout: boolean = false;

  public viewAsFetchData: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private routerService: RouterService,
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(Configuration) private configuration: Configuration,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private masterDataService: MasterDataService,
    private userService: UserService
  ) {}

  get currentUser(): MeLexsUserDto | undefined {
    return this._currentUser;
  }

  set currentUser(newUser: MeLexsUserDto | undefined) {
    this._currentUser = newUser;
  }

  get isLogout(): boolean {
    return this._isLogout;
  }

  set isLogout(val: boolean) {
    this._isLogout = val;
  }

  // selected User ID for 'View As' option in title bar
  get viewAs(): string | undefined {
    return this._viewAs;
  }

  set viewAs(selectedUserId: string | undefined) {
    this._viewAs = selectedUserId;
  }

  clearCurrentUser(isLogout?: boolean) {
    if (!!isLogout) {
      this._isLogout = true;
    }
    this._currentUser = undefined;
    this.configuration.credentials = {};
    this.masterDataService.clearAllData();
    this.userService.clearDataConfig();
    this.viewAs = undefined;
  }

  async logout() {
    if (
      await this.notificationService.warningDialog('LOGOUT.TITLE', 'LOGOUT.MESSAGE', 'LOGOUT.BTN_RIGHT', 'icon-Exit')
    ) {
      this._isLogout = true;
      await this.logoutNavigate();
    }
  }

  async logoutNavigate() {
    this.routerService.navigate('login').then(async res => {
      if (res) {
        await this.commonService.exceptionNoRetryDialog(() => this.tokenService.logout());
        this.clearCurrentUser();
      }
    });
  }

  // Input is one of LexsUserPermissionCodes constant
  hasPermission(permCode: string): boolean {
    // Look into 'permissions' array of user
    if (this._currentUser) {
      return this._currentUser.permissions?.includes(permCode) || false;
    }
    return false;
  }

  hasPermissionByTaskCode(_taskCode: taskCode) {
    // R2E04
    if (_taskCode === taskCode.R2E04_02_2A) {
      return this.hasPermission(PCode.SUBMIT_DEBT_LEGAL_ENFORCEMENT);
    } else if (_taskCode === taskCode.R2E04_01_2B) {
      return this.hasPermission(PCode.DEBT_ENFORCEMENT_ASSIGNMENT);
    } else if (_taskCode === taskCode.R2E04_03_3A) {
      return this.hasPermission(PCode.SUBMIT_ENFORCEMENT_RESULT);
    }
    // R2E05
    else if (_taskCode === taskCode.R2E05_02_3C) {
      return this.hasPermission(PCode.DOCUMENT_INSPECTION_ASSET_SEIZURE);
    } else if (_taskCode === taskCode.R2E05_06_3F) {
      return this.hasPermission(PCode.ASSIGN_LAWYER_ASSET_SEIZURE);
    }
    // R2E06
    else if (_taskCode === taskCode.R2E06_01_A) {
      return this.hasPermission(PCode.EDIT_WITHDRAW_ASSET_SEIZURE);
    } else if (_taskCode === taskCode.R2E06_02_B) {
      return this.hasPermission(PCode.APPROVE_WITHDRAW_ASSET_SEIZURE);
    } else if (_taskCode === taskCode.R2E06_03_C) {
      return this.hasPermission(PCode.VERIFY_DOC_WITHDRAW_SEIZURE);
    } else if (_taskCode === taskCode.R2E06_04_D) {
      return this.hasPermission(PCode.ASSIGN_WITHDRAW_SEIZURE);
    } else if (_taskCode === taskCode.R2E06_05_E) {
      return this.hasPermission(PCode.SAVE_RESULT_WITHDRAW_SEIZURE);
      // R2E06
    } else if (_taskCode === taskCode.R2E09_00_1A || _taskCode === taskCode.R2E09_00_01_1A) {
      return this.hasPermission(PCode.ASSIGN_AUCTION);
    } else if (_taskCode === taskCode.R2E09_02_3B) {
      return this.hasPermission(PCode.SUBMIT_AUCTION_EXPENSE);
    } else if (_taskCode === taskCode.R2E09_06_7C) {
      return (
        this.hasPermission(PCode.SUBMIT_AUCTION_CHECK_INFO) ||
        this.hasPermission(PCode.VERIFY_AUCTION_CHECK_INFO) ||
        this.hasPermission(PCode.APPROVE_AUCTION_CHECK_INFO)
      );
    } else if (_taskCode === taskCode.R2E09_04_01_11) {
      return this.hasPermission(PCode.SUBMIT_AUCTION_DAY_RESULT);
    } else if (_taskCode === taskCode.R2E09_06_12C) {
      return (
        this.hasPermission(PCode.SUBMIT_AUCTION_CHECK_STAMP_DUTY) ||
        this.hasPermission(PCode.VERIFY_AUCTION_CHECK_STAMP_DUTY) ||
        this.hasPermission(PCode.APPROVE_AUCTION_CHECK_STAMP_DUTY)
      );
    } else if (_taskCode === taskCode.R2E09_05_01_12A) {
      return this.hasPermission(PCode.TRACK_PAYMENT_RECORD);
    } else if (_taskCode === taskCode.R2E09_09_01_13_1) {
      return this.hasPermission(PCode.SUBMIT_ACCOUNT_AUDIT_CERTIFICATION);
    } else if (_taskCode === taskCode.R2E09_09_03_14_1) {
      return this.hasPermission(PCode.APPROVE_ACCOUNT_AUDIT_CERTIFICATION);
    } else {
      return false;
    }
  }

  isCBC(): boolean {
    if (this._currentUser) {
      return this._currentUser.roleCode === 'CBC';
    }
    return false;
  }

  isBC(): boolean {
    if (this._currentUser) {
      return this._currentUser.roleCode === 'BC';
    }
    return false;
  }

  isAMDRestructure(): boolean {
    //check with ba for permission code
    if (this._currentUser) {
      return this._currentUser.roleCode === 'AMD_RESTRUCTURE';
    }
    return false;
  }

  isBUOwner(): boolean {
    if (this._currentUser) {
      return this._currentUser.roleCode === 'ADMIN';
    }
    return false;
  }

  isUserAdmin(): boolean {
    if (this._currentUser) {
      return this._currentUser.subRoleCode === 'USER_ADMIN';
    }
    return false;
  }

  isOwnerTask(id: string, enableTaskSupportRole?: boolean) {
    if (this._currentUser) {
      // for KlawSecretary
      const isSupportKlawSecretary = JSON.parse(
        this._currentUser?.attributes?.find(item => item.name === 'taskSupportRole')?.value || 'false'
      );
      let currentUserId = this._currentUser.userId;
      // If current logged-in user is 'BU Owner' and using 'View As' option then has to verify with selected User ID instead
      if (this.isBUOwner() && !!this._viewAs && this._viewAs !== 'ADMIN') {
        currentUserId = this._viewAs;
      }
      if (typeof enableTaskSupportRole === 'boolean') {
        return enableTaskSupportRole ? currentUserId === id || isSupportKlawSecretary : currentUserId === id;
      } else {
        return currentUserId === id || isSupportKlawSecretary;
      }
    }
    return false;
  }

  isUserApprover(): boolean {
    if (this._currentUser) {
      return this._currentUser.roleCode === 'ADMIN' || this._currentUser.subRoleCode === 'APPROVER';
    }
    return false;
  }

  async confirmExitWithoutSave(): Promise<boolean> {
    if (this.isLogout) {
      return true;
    }
    // if(!this.trialService.hasEdit){
    //   return false
    // }

    return await this.notificationService.warningDialog(
      'COMMON.EXIT_WITHOUT_SAVE',
      'COMMON.MESSAGE_EXIT',
      'COMMON.EXIT_WITHOUT_SAVE',
      'icon-Reset'
    );
  }

  accessPermissions(): AccessPermissions {
    switch (this._currentUser?.subRoleCode) {
      case 'MAKER':
      case 'ADMIN':
        return {
          subRoleCode: this._currentUser.subRoleCode,
          mode: ['ADD', 'EDIT', 'VIEW', 'DELETE'],
          permissions: this._currentUser.permissions || [],
        } as AccessPermissions;
      case 'APPROVER':
        return {
          subRoleCode: this._currentUser.subRoleCode,
          mode: ['VIEW', 'APPROVE'],
          permissions: this._currentUser.permissions || [],
        } as AccessPermissions;
      default:
        return {
          subRoleCode: 'VIEWER',
          mode: ['VIEW'],
          permissions: this._currentUser?.permissions || [],
        } as AccessPermissions;
    }
  }

  initAccessPermissions() {
    const reusult: ActionOnScreen = {
      canAdd: this.accessPermissions().mode.includes('ADD'),
      canEdit: this.accessPermissions().mode.includes('EDIT'),
      canDelete: this.accessPermissions().mode.includes('DELETE'),
      canApprove: this.accessPermissions().mode.includes('APPROVE'),
    };
    return reusult;
  }
}
