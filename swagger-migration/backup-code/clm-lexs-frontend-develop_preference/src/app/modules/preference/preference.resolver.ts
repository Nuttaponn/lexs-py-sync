import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PreferenceService } from './preference.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { TaskService } from '../task/services/task.service';
import { PreferenceDetails } from '@lexs/lexs-client';
import { ScenarioPreferenceEnum } from './preference.model';

@Injectable({
  providedIn: 'root',
})
export class PreferenceResolver {

  constructor(
    private logger: LoggerService,
    private preferenceService: PreferenceService,
    private taskService: TaskService,
  ) {}

  isOnRequest : boolean = false;

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

      const preferenceGroupNo = route.queryParams['preferenceGroupNo'] || '0';
      const isOnRequest = route.queryParams['isOnRequest'] || false;
      let mode: 'ADD' | 'VIEW' | 'EDIT' = 'VIEW';
      if(isOnRequest){
        mode = 'ADD';
      }
      const preferenceDetails : PreferenceDetails = await this.preferenceService.inquiryDetails(preferenceGroupNo, mode);
      this.preferenceService.preferenceDetail = preferenceDetails;
      this.preferenceService.preferenceDetailForm = this.preferenceService.createPreferenceDetailForm(preferenceDetails);

      return true;
  }

}
