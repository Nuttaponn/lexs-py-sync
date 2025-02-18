import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceDetailComponent } from './preference-detail/preference-detail.component';
import { PreferenceInfoComponent } from './preference-detail/preference-info/preference-info.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PreferenceRoutingModule,
    PreferenceDetailComponent,
    PreferenceInfoComponent
  ],
  exports: [PreferenceDetailComponent]
})
export class PreferenceModule { }
