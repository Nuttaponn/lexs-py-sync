import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { LitigationDetailDto, MeLexsUserDto, NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import moment from 'moment';

@Component({
  selector: 'app-save-tracking',
  templateUrl: './save-tracking.component.html',
  styleUrls: ['./save-tracking.component.scss'],
})
export class SaveTrackingComponent {
  public ddlstatus: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.TRACKING_STATUS',
  };

  public remarksControl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public statusControl: UntypedFormControl = new UntypedFormControl(undefined, Validators.required);
  constructor() {}

  public followUpStatuses!: Array<NameValuePair>;
  public litigationDetail!: LitigationDetailDto;
  public currentUser!: MeLexsUserDto;

  followupDate: string = moment().toString();

  dataContext(data: any) {
    this.followUpStatuses = data.followUpStatuses;
    this.litigationDetail = data.litigationDetail;
    this.currentUser = data.currentUser;
  }

  public async onClose(): Promise<boolean> {
    if (this.remarksControl.errors || this.statusControl.errors) {
      this.remarksControl.markAllAsTouched();
      this.statusControl.markAllAsTouched();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    return {
      remarks: this.remarksControl.value,
      followupStatus: this.statusControl.value,
      followupDate: this.followupDate,
    };
  }
}
