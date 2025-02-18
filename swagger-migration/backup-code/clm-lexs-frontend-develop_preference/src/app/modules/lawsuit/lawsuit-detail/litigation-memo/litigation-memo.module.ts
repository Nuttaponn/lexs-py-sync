import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AddNoteDialogComponent } from './add-note-dialog/add-note-dialog.component';
import { LitigationMemoRoutingModule } from './litigation-memo-routing.module';
import { LitigationMemoComponent } from './litigation-memo.component';

@NgModule({
  declarations: [LitigationMemoComponent, AddNoteDialogComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, LitigationMemoRoutingModule],
  exports: [LitigationMemoComponent],
})
export class LitigationMemoModule {}
