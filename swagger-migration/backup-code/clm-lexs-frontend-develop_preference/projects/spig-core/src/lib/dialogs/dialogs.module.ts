import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpigIconModule } from '../spig-icon.module';
import { DialogComponent } from './dialog/dialog.component';
import { FlashBannerComponent } from './flash-banner/flash-banner.component';

import { PortalModule } from '@angular/cdk/portal';
import { PipeModule } from '../pipe/pipe.module';
import { SpigShareModule } from '../spig-share.module';
import { ExpandDialogComponent } from './expand-dialog/expand-dialog.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [FlashBannerComponent, DialogComponent, ExpandDialogComponent],
    imports: [CommonModule, TranslateModule, SpigShareModule, SpigIconModule, PortalModule, PipeModule, NgxMaskDirective, NgxMaskPipe],
    providers: [provideNgxMask()]
})
export class DialogsModule {}
