import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { IDialogStep } from '../dialog.model';

@Component({
  selector: 'spig-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialog_body', { read: ViewContainerRef, static: false })
  vcRef!: ViewContainerRef;
  componentRef!: ComponentRef<any>;

  contentCssClasses = {};

  @ViewChild('stepperDialog') stepperDialog!: MatStepper;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.contentCssClasses && Array.isArray(this.data.contentCssClasses)) {
      this.contentCssClasses = this.data.contentCssClasses;
    }
    console.log('data', this.data);
  }

  ngAfterViewInit() {
    if (this.data.component) {
      // const factory = this.resolver.resolveComponentFactory(this.data.component); // no need factory for Angular 13
      this.componentRef = this.vcRef.createComponent(this.data.component);

      // Handles context data that from dialog/parent component
      if (this.data.context && this.componentRef.instance.dataContext) {
        this.componentRef.instance.dataContext.call(this.componentRef.instance, this.data.context);
      }

      this.cdr.detectChanges();
      if (!this.stepperDialog) return;

      if(this.data?.steps?.length > 0) {
        const _steps: IDialogStep[] = this.data.steps
        const _lastActive = _steps.find((item: IDialogStep) => item.active);
        this.stepperDialog.selectedIndex = _lastActive?.index || 0
      } else {
        this.stepperDialog.selectedIndex = 0
      }

    }
  }

  async rightButtonClicked() {
    if (!!!this.componentRef || !!!this.componentRef.instance.onClose || (await this.componentRef.instance.onClose())) {
      const returnData = !!!this.componentRef ? true : this.componentRef.instance.returnData;
      this.dialogRef.close(returnData);
    }
  }

  backButtonClicked() {
    this.dialogRef.close({ isBack: true });
  }

  leftButtonClicked() {
    this.data.cancelEvent ? this.dialogRef.close({ isCancel: true }) : this.dialogRef.close();
  }

  async optionButtonClicked() {
    if (
      !!!this.componentRef ||
      !!!this.componentRef.instance.onOptionClicked ||
      (await this.componentRef.instance.onOptionClicked())
    ) {
      const returnOptionData = !!!this.componentRef
        ? { isOption: true }
        : this.componentRef.instance.returnOptionData || { isOption: true };
      this.dialogRef.close(returnOptionData);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
