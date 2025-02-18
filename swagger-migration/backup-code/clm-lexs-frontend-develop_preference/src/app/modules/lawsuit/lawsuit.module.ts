import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { updateTrackingStatusComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/update-tracking-status/update-tracking-status.component';
import { UploadNewspaperComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/upload-newspaper/upload-newspaper.component';
import { UploadNotiComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/upload-noti/upload-noti.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ConfirmMergeLgComponent } from './confirm-merge-lg/confirm-merge-lg.component';
import { CloseLgDetailComponent } from './lawsuit-detail/close-lg-detail/close-lg-detail.component';
import { CloseLgComponent } from './lawsuit-detail/close-lg/close-lg.component';
import { SaveTrackingComponent } from './lawsuit-detail/save-tracking/save-tracking.component';
import { EfilingFormComponent } from './lawsuit-detail/suit/efiling-form/efiling-form.component';
import { IndictmentDetailComponent } from './lawsuit-detail/suit/indictment-detail/indictment-detail.component';
import { IndictmentMainComponent } from './lawsuit-detail/suit/indictment-main/indictment-main.component';
import { SuitConfirmBeforeDialogConfirmUploadComponent } from './lawsuit-detail/suit/suit-confirm-before-dialog-confirm-upload/suit-confirm-before-dialog-confirm-upload.component';
import { SuitConfirmDialogUploadComponent } from './lawsuit-detail/suit/suit-confirm-dialog-upload/suit-confirm-dialog-upload.component';
import { SuitDialogUploadComponent } from './lawsuit-detail/suit/suit-dialog-upload/suit-dialog-upload.component';
import { LawsuitRoutingModule } from './lawsuit-routing.module';
import { LawsuitComponent } from './lawsuit/lawsuit.component';
import { ModalAssignLawsuitComponent } from './modal-assign-lawsuit/modal-assign-lawsuit.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';

@NgModule({
  declarations: [
    LawsuitComponent,
    ConfirmMergeLgComponent,
    SaveTrackingComponent,
    ModalAssignLawsuitComponent,
    UploadNotiComponent,
    UploadNewspaperComponent,
    updateTrackingStatusComponent,
    IndictmentDetailComponent,
    IndictmentMainComponent,
    SuitDialogUploadComponent,
    SuitConfirmDialogUploadComponent,
    SuitConfirmBeforeDialogConfirmUploadComponent,
    CloseLgDetailComponent,
    CloseLgComponent,
    EfilingFormComponent,
  ],
  imports: [
    CommonModule,
    LawsuitRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  exports: [
    UploadNotiComponent,
    UploadNewspaperComponent,
    updateTrackingStatusComponent,
    IndictmentDetailComponent,
    CloseLgDetailComponent,
    EfilingFormComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LawsuitModule {}
