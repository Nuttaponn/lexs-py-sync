import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-submit-cancel-matching-dialog',
  templateUrl: './submit-cancel-matching-dialog.component.html',
  styleUrls: ['./submit-cancel-matching-dialog.component.scss'],
})
export class SubmitCancelMatchingDialogComponent {
  public messageBanner = 'SUBMIT_CANCEL_MATCH_DIALOG.COMMON_MSG_BANNER';
  public reason: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  public isSuccess = false;
  public isReProcess = false;
  constructor(private logger: LoggerService) {}

  dataContext(data: any) {
    this.logger.info('dataContext SubmitCancelMatchingDialogComponent', data);
    this.isReProcess = data.isReProcess;
    if (this.isReProcess) {
      this.messageBanner =
        'เมื่อเปลี่ยนสถานะแล้ว ใบประกาศที่ถูกระงับการดำเนินการ จะถูกนำกลับมาดำเนินการใหม่อีกครั้ง<br>คุณต้องการยืนยันการเปลี่ยนสถานะใช่หรือไม่?';
    }
  }

  public async onClose(): Promise<boolean> {
    this.logger.info('onClose SubmitCancelMatchingDialogComponent');
    this.reason.markAllAsTouched();
    if (this.reason.valid) {
      this.isSuccess = true;
      return true;
    } else {
      this.isSuccess = false;
      return false;
    }
  }

  get returnData() {
    return {
      isSuccess: this.isSuccess,
      reason: this.reason.value,
    };
  }
}
