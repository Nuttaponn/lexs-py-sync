import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { MeLexsUserDto } from '@lexs/lexs-client';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {}
  async resolve(route: ActivatedRouteSnapshot): Promise<MeLexsUserDto> {
    this.logger.logResolverStart('UserResolver');
    const user = await this.userService.getUser(route.queryParams['userId']);
    if (user) {
      this.logger.logResolverEnd('UserResolver');
      return user;
    } else {
      this.logger.logResolverEnd('UserResolver');
      return {};
    }
  }
}
