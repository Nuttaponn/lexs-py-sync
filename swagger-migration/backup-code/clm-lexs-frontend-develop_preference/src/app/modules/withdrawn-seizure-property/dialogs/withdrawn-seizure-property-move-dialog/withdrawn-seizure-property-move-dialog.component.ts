import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { LoggerService } from '@app/shared/services/logger.service';
import { SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-withdrawn-seizure-property-move-dialog',
  templateUrl: './withdrawn-seizure-property-move-dialog.component.html',
  styleUrls: ['./withdrawn-seizure-property-move-dialog.component.scss'],
})
export class WithdrawnSeizurePropertyMoveDialogComponent implements OnInit {
  public dropdownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    disableFloatLabel: true,
  };
  public groupTypeOptions: SimpleSelectOption[] = [];
  public defaultSelect!: string;
  public collateralStatus!: string;
  public control: UntypedFormControl = new UntypedFormControl('N/A', Validators.required);
  public targetGroup: string = '';
  public messageBanner = 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.MOVE_UPLOAD_MESSAGE_WARNING';

  constructor(private logger: LoggerService) {}

  public isShowWarning: boolean = false;
  ngOnInit(): void {
    this.control.setValue(this.defaultSelect);
  }

  dataContext(data: any) {
    this.groupTypeOptions = data.groupTypeOptions;
    this.defaultSelect = data.defaultSelect;
    this.collateralStatus = data.collateralStatus;
    this.messageBanner = data.messageBanner;
    this.isShowWarning = data.isShowWarning;
  }

  public async onClose(): Promise<boolean> {
    if (this.control.invalid) return false;
    if (this.control.valid) {
      this.logger.info('WithdrawnSeizurePropertyMoveDialogComponent :: control onClose :: ', this.control.value);
      this.targetGroup = this.control.value;
    }
    return true;
  }

  get returnData() {
    return {
      targetGroup: this.targetGroup,
    };
  }
}
