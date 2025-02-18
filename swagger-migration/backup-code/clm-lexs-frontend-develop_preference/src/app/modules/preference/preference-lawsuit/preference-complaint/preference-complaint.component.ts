import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-preference-complaint',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
  templateUrl: './preference-complaint.component.html',
  styleUrl: './preference-complaint.component.scss'
})
export class PreferenceComplaintComponent {

}
