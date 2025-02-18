import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-preference-judge',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
  templateUrl: './preference-judge.component.html',
  styleUrl: './preference-judge.component.scss'
})
export class PreferenceJudgeComponent {

}
