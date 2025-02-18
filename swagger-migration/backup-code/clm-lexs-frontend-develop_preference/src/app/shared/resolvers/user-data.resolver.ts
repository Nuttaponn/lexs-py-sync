import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@app/modules/user/user.service';
import { MeLexsUserDto } from '@lexs/lexs-client';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataResolver {
  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<MeLexsUserDto | null> {
    this.logger.logResolverStart('UserDataResolver');
    if (state.url === '/main/user') {
      await Promise.all([
        this.userService.currentRole.length === 0 && this.userService.getRole(),
        this.userService.currentSubRole.length === 0 && this.userService.getSubRole(),
        this.userService.currentRoleLevel.length === 0 && this.userService.getRoleLevel(),
        this.userService.currentOrganization.length === 0 && this.userService.getOrganization(),
        this.userService.currentRolePermissionTemp.length === 0 && this.userService.inquiryRoleTemplate(),
        this.userService.currentRoleOrganization.length === 0 && this.userService.inquiryRoleOrganizationMaps(),
      ]);
      this.logger.logResolverEnd('UserDataResolver');
      return {};
    } else if (state.url === '/main/task') {
      if (this.userService.currentRole.length === 0) {
        await this.userService.getRole();
      }
      this.logger.logResolverEnd('UserDataResolver');
      return null;
    }
    this.logger.logResolverEnd('UserDataResolver');
    return null;
  }
}
