import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { PreferenceCaseInfoRoutingModule } from './preference-case-info-routing.module';
import { PreferenceCaseInfoComponent } from './preference-case-info.component';
import { PreferenceModule } from '@app/modules/preference/preference.module';


@NgModule({
  declarations: [PreferenceCaseInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PreferenceCaseInfoRoutingModule, PreferenceModule],
})
export class PreferenceCaseInfoModule { }