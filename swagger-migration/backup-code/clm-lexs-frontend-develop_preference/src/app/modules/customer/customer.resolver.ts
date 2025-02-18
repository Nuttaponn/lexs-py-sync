import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { LoggerService } from '@app/shared/services/logger.service';
import { CustomerDetailDto, PageOfCustomerDto } from '@lexs/lexs-client';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private logger: LoggerService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<PageOfCustomerDto | CustomerDetailDto> {
    this.logger.logResolverStart('CustomerResolver');
    const urlPath =
      route.url.length === 0
        ? '/main/customer'
        : route.url[0].path === ''
          ? '/main/customer'
          : '/main/customer/' + route.url[0].path;
    if (urlPath === '/main/customer') {
      const request: SearchConditionRequest = {
        tab: 'USER',
        sortBy: ['customerId'],
        sortOrder: 'ASC',
      };
      try {
        const response = await this.customerService.inquiryCustomers(request);
        this.logger.logResolverEnd('CustomerResolver');
        return response;
      } catch (error) {
        this.logger.logResolverEnd('CustomerResolver');
        return {};
      }
    } else {
      const _customerId =
        route.queryParams['customerId'] ||
        this.customerService.tempCustomerId ||
        this.customerService.customerDetail.customerId;
      if (this.customerService.tempCustomerId) {
        this.customerService.tempCustomerId = undefined;
      }
      this.customerService.customerDetail = await this.customerService.getCustomer(_customerId);
      this.logger.logResolverEnd('CustomerResolver');
      return this.customerService.customerDetail;
    }
  }
}
