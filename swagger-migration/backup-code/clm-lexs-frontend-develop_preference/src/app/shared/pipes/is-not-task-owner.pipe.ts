import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from '@app/shared/services/session.service';

@Pipe({
  name: 'isNotTaskOwner',
})
export class IsNotTaskOwnerPipe implements PipeTransform {
  constructor(private sessionService: SessionService) {}

  transform(value: string, optional?: string): boolean {
    let _currentUserId = this.sessionService.currentUser?.userId;
    if (this.sessionService.isBUOwner() && !!this.sessionService.viewAs && this.sessionService.viewAs !== 'ADMIN') {
      _currentUserId = this.sessionService.viewAs;
    }
    if (!!optional && optional === 'AND_NOT_SUPPORT_ROLE') {
      const _supportKlawSecretary = JSON.parse(
        this.sessionService.currentUser?.attributes?.find(item => item.name === 'taskSupportRole')?.value || 'false'
      );
      return value !== _currentUserId && !!!_supportKlawSecretary;
    } else {
      return value !== _currentUserId;
    }
  }
}
