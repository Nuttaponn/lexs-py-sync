import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '@app/shared/services/common.service';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { environment } from '@environments/environment';
import {
  DopaControllerService,
  DopaPageResponse,
  DopaPostRequest,
  DopaPostResponse,
  Pageable,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { AgentResponse } from './dopa.model';
@Injectable({
  providedIn: 'root',
})
export class DopaService {
  constructor(
    private httpClient: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private commonService: CommonService,
    private dopaControllerService: DopaControllerService,
    private logger: LoggerService
  ) {}

  async getDopaTask(pageOption: Pageable): Promise<DopaPageResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.dopaControllerService.queryDopaTask(pageOption.pageNumber, pageOption.pageSize))
    );
  }

  getAgentResponse(userId: number): Promise<AgentResponse> {
    // fixed URL to align with Agent program
    let basePath = environment.dopaAgentUrl;
    this.logger.info('asePath of Agent : ', basePath);
    return lastValueFrom(this.httpClient.post(`${basePath}/readcard/`, { userId: userId }));
  }

  async updateDopaTask(body: DopaPostRequest): Promise<DopaPostResponse> {
    this.commonService.startDopaLoading();
    const response = await this.errorHandlingService
      .invokeNoRetry(() => lastValueFrom(this.dopaControllerService.postDopa(body)))
      .catch(error => {
        this.logger.error('UPDATE Dopa :: ', error);
        this.commonService.stopDopaLoading();
        return {};
      });
    this.commonService.stopDopaLoading();
    return response;
  }
}
