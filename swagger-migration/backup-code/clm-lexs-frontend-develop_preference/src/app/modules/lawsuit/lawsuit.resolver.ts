import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { LoggerService } from '@app/shared/services/logger.service';
import { LitigationDetailDto, PageOfLitigationDto } from '@lexs/lexs-client';
import { SuitService } from './lawsuit-detail/suit/suit.service';
import { LawsuitService } from './lawsuit.service';

@Injectable({
  providedIn: 'root',
})
export class LawsuitResolver {
  constructor(
    private lawsuitService: LawsuitService,
    private suitService: SuitService,
    private logger: LoggerService
  ) {}

  private litigationId!: string;

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<PageOfLitigationDto | LitigationDetailDto> {
    this.logger.logResolverStart('LawsuitResolver', route.queryParams);
    const urlPath =
      route.url.length === 0
        ? '/main/lawsuit'
        : route.url[0].path === ''
          ? '/main/lawsuit'
          : '/main/lawsuit/' + route.url[0].path;
    console.log('route', route.url);
    this.litigationId = route.queryParams['lgId'] || route.queryParams['litigationId'];
    if (urlPath === '/main/lawsuit') {
      const request: SearchConditionRequest = {
        tab: 'USER',
        sortBy: ['litigationId'],
        sortOrder: 'ASC',
      };
      try {
        const response = await this.lawsuitService.inquiryLawsuits(request);
        this.logger.logResolverEnd('LawsuitResolver');
        return response;
      } catch (error) {
        this.logger.logResolverEnd('LawsuitResolver');
        return {};
      }
    } else {
      let litigation: LitigationDetailDto;
      if (!!!this.lawsuitService.currentLitigation) {
        litigation = await this.lawsuitService.getLitigation(this.litigationId);
      } else {
        if (this.litigationId !== this.lawsuitService.currentLitigation.litigationId) {
          litigation = await this.lawsuitService.getLitigation(
            this.litigationId || this.lawsuitService.currentLitigation.litigationId || ''
          );
        } else {
          litigation = this.lawsuitService.currentLitigation;
        }
      }
      this.lawsuitService.currentLitigation = litigation;
      this.suitService.litigationCase = (await this.suitService.getLitigationCase(litigation.litigationId ?? '')) ?? [];
      // close litigation expense
      if (urlPath === '/main/lawsuit/close') {
        await this.getExpenseInfo(litigation.litigationId || '');
      }

      if (litigation) {
        this.logger.logResolverEnd('LawsuitResolver return ', litigation);
        return litigation;
      } else {
        this.logger.logResolverEnd('LawsuitResolver return {}');
        return {};
      }
    }
  }

  async getExpenseInfo(litigationId: string) {
    this.lawsuitService.currentLitigation.expenseInfo = await this.lawsuitService.getExpenseInfo(litigationId);
  }
}
