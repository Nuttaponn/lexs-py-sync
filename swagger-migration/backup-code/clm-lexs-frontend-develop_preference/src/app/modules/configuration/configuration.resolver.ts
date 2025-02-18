import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { LexsConfigDto } from '@lexs/lexs-client';
import { SimpleSelectOption } from '@spig/core';
import { UserService } from '../user/user.service';
import { ILexsUserOption } from './config.model';
import { ConfigurationService } from './configuration.service';

export interface IConfigResolver {
  klawOptions?: Array<ILexsUserOption>;
  ddlkbdOptions?: Array<ILexsUserOption>;
  ddlUserOptions?: Array<SimpleSelectOption>;
  lexsConfigDto?: LexsConfigDto;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationResolver {
  constructor(
    private configurationService: ConfigurationService,
    private userService: UserService,
    private logger: LoggerService
  ) {}

  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/')
      .replace(/\/\/+/g, '/');
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<IConfigResolver> {
    this.logger.logResolverStart('ConfigurationResolver', route.queryParams['taskCode']);
    const taskCode = route.queryParams['taskCode'];
    if (taskCode === 'RESPONSE_UNIT_MAPPING' || taskCode === undefined) {
      let result: IConfigResolver = {
        klawOptions: [],
        ddlkbdOptions: [],
        ddlUserOptions: [],
        lexsConfigDto: {},
      };
      const inquiryResponse = await this.configurationService.inquiryConfig();
      if (inquiryResponse) {
        result.lexsConfigDto = inquiryResponse;
      }
      let klawOptionResponse: Array<ILexsUserOption> = await this.userService.inquiryUserOptions('KLAW');
      klawOptionResponse.map(x => {
        x.fullname = x.userId + ' - ' + x.name + ' ' + x.surname;
        return x;
      });
      if (klawOptionResponse) {
        result.klawOptions = [...klawOptionResponse];
      }

      let ddlkbdOptions: Array<ILexsUserOption> = await this.userService.inquiryUserOptionsAndRoleCode(
        'KTB',
        'PROSECUTION_DEPARTMENT'
      );
      ddlkbdOptions.map(x => {
        x.fullname = x.userId + ' - ' + x.name + ' ' + x.surname;
        return x;
      });
      if (ddlkbdOptions) {
        result.ddlkbdOptions = [...ddlkbdOptions];
      }
      // - When Initial Configuration component , use Angular Resolver to call following
      result.ddlUserOptions = [];
      result.ddlUserOptions.push({
        text: 'ผู้ดูแล',
        value: 'ALL',
      });
      if (!!ddlkbdOptions) {
        for (let obj of ddlkbdOptions) {
          result.ddlUserOptions?.push({
            text: obj.userId + ' - ' + obj.name + ' ' + obj.surname,
            value: obj.userId ?? '',
          });
        }
      }
      this.logger.logResolverEnd('ConfigurationResolver', result);
      return result;
    } else {
      this.logger.logResolverEnd('ConfigurationResolver');
      return {};
    }
  }
}
