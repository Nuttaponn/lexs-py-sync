import { RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export interface CanComponentDeactivateState {
  canDeactivate: (state: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}
