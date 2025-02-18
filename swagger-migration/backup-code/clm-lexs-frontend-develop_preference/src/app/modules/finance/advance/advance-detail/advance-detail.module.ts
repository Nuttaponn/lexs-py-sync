import { CommonModule, DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AdvanceDetailPaymentComponent } from '../advance-detail-payment/advance-detail-payment.component';
import { AdvanceDetailRoutingModule } from './advance-detail-routing.module';
import { AdvanceDetailComponent } from './advance-detail.component';

@NgModule({
  declarations: [AdvanceDetailComponent, AdvanceDetailPaymentComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    AdvanceDetailRoutingModule,
  ],
  exports: [AdvanceDetailComponent, AdvanceDetailPaymentComponent],
  providers: [DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdvanceDetailModule {}
