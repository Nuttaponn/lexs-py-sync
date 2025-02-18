import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionRevokeComponent } from './auction-revoke.component';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { AuctionRevokeTableComponent } from './auction-revoke-table/auction-revoke-table.component';

@NgModule({
  declarations: [AuctionRevokeComponent, AuctionRevokeTableComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    DocumentPreparationModule,
  ],
  exports: [AuctionRevokeComponent],
})
export class AuctionRevokeModule {}
