import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-preference-court-order',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
  templateUrl: './preference-court-order.component.html',
  styleUrl: './preference-court-order.component.scss'
})
export class PreferenceCourtOrderComponent {

}
