import { CommonModule, DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ReceiptDetailKcorpComponent } from './receipt-detail-kcorp/receipt-detail-kcorp.component';
import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './receipt.component';
import { ReferenceNoDetailComponent } from './reference-no-detail/reference-no-detail.component';

@NgModule({
  declarations: [ReceiptComponent, ReceiptDetailKcorpComponent, ReferenceNoDetailComponent],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
  ],
  providers: [DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReceiptModule {}
