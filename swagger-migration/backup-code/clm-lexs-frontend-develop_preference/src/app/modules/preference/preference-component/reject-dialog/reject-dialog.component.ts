import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  templateUrl: './reject-dialog.component.html',
  styleUrl: './reject-dialog.component.scss'
})
export class RejectDialogComponent {

  isSuccess : boolean = false;
  rejectTo: string = '';
  maxlength: number = 500;
  public reason: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.maxLength(this.maxlength),
  ]);

  get returnData() {
    return {
      isSuccess: this.isSuccess,
      rejectReason: this.reason.value,
    };
  }

  constructor() { }

  dataContext(data: any) {
    this.isSuccess = false;
    this.rejectTo = data.rejectTo;
  }

  public async onClose() {
    if (this.reason.valid) {
      this.isSuccess = true;
      return true;
    }
    this.reason.markAllAsTouched();
    return false;
  }

}
