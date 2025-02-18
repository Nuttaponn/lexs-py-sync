import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AucAnnoucementKtbRoutingModule } from './auc-annoucement-ktb-routing.module';
import { AucAnnoucementKtbComponent } from './auc-annoucement-ktb.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AucAnnoucementKtbFinishedComponent } from '../auc-annoucement-ktb-finished/auc-annoucement-ktb-finished.component';
import { AucAnnoucementKTBProcessComponent } from '../auc-annoucement-ktb-process/auc-annoucement-ktb-process.component';
import { AucAnnoucementKtbNewComponent } from '../auc-annoucement-ktb-new/auc-annoucement-ktb-new.component';
@NgModule({
  declarations: [AucAnnoucementKtbComponent, AucAnnoucementKTBProcessComponent, AucAnnoucementKtbFinishedComponent, AucAnnoucementKtbNewComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    AucAnnoucementKtbRoutingModule,
  ],
})
export class AucAnnoucementKtbModule {}
