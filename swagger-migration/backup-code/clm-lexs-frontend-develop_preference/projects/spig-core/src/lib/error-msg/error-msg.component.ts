import { AfterViewChecked, ChangeDetectorRef, Component, Inject, Input, OnChanges } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { FORM_CONTROL_INVALID_MSG_OPTIONS, FormControlInvalidMsgOptions } from './form-control-invalid-msg-options';

@Component({
  selector: 'spig-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss'],
})
export class ErrorMsgComponent implements AfterViewChecked, OnChanges {
  @Input() control: UntypedFormControl | AbstractControl | null = null;
  @Input() showIcon: boolean = false;
  @Input() customErrorMsg?: string;
  msgOptions!: FormControlInvalidMsgOptions[];

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(FORM_CONTROL_INVALID_MSG_OPTIONS) invalidMsgOptions: FormControlInvalidMsgOptions[]
  ) {
    invalidMsgOptions = FormControlInvalidMsgOptions.applyDefault(invalidMsgOptions);
    this.msgOptions = invalidMsgOptions;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes?: any): void {
    if (changes['control']) {
      this.control = changes['control'].currentValue;
    }
    if (changes['showIcon']) {
      this.showIcon = changes['showIcon'].currentValue;
    }
  }

  get touched() {
    return this.control && this.control.touched;
  }

  get errors() {
    return this.control ? this.control.errors || null : null;
  }
}
