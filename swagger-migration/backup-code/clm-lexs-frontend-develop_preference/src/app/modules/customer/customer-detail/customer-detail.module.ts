import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CustomerDetailRoutingModule } from './customer-detail-routing.module';
import { CustomerDetailComponent } from './customer-detail.component';
import { ModalOnRequestComponent } from './modal-on-request/modal-on-request.component';

@NgModule({
  declarations: [CustomerDetailComponent, ModalOnRequestComponent],
  imports: [CommonModule, CustomerDetailRoutingModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
})
export class CustomerDetailModule {}
