import { Component, Input } from '@angular/core';
import { ModeCompEnum } from '@app/modules/preference/preference.model';

@Component({
  selector: 'app-preference-info-claim',
  standalone: true,
  imports: [],
  templateUrl: './preference-info-claim.component.html',
  styleUrl: './preference-info-claim.component.scss'
})
export class PreferenceInfoClaimComponent {

  @Input() mode: ModeCompEnum = ModeCompEnum.VIEW;

}
