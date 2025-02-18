import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactConfig, IPersonContact } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { PersonForLitigationCaseDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-withdrawn-seizure-add-contact-dialog',
  templateUrl: './withdrawn-seizure-add-contact-dialog.component.html',
  styleUrls: ['./withdrawn-seizure-add-contact-dialog.component.scss'],
})
export class WithdrawnSeizureAddContactDialogComponent {
  public contactTypeOptions: PersonForLitigationCaseDto[] = [];
  public contactPersons: PersonForLitigationCaseDto[] = [];
  public lgPersonColumn: string[] = [];
  public selectContactCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  public control: UntypedFormGroup = this.initForm();
  public contactConfigEdit: ContactConfig = {
    hasHeaderTitle: false,
    hasAction: false,
    hasAdd: false,
    hasDelete: false,
    hasEdit: false,
    hasTitle: true,
    mode: 'ADD',
  };
  public excludeItems: string[] = [];

  private saveData: PersonForLitigationCaseDto = {};
  public defaultSelect: IPersonContact = {};

  constructor(
    private fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  initForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: [null, Validators.required],
      tel: [null, [Validators.required, Validators.minLength(10)]],
    });
  }

  dataContext(data: any) {
    console.log('dataContext WithdrawnSeizureAddPropertyDialogComponent', data);
    this.contactPersons = data.contactPersons;
    this.contactTypeOptions = data.contactTypeOptions;
    this.lgPersonColumn = data.lgPersonColumn;
    this.excludeItems = data.currentSelectPersons;
    this.defaultSelect = data.defaultSelect;
  }

  public async onClose(): Promise<boolean> {
    console.log('onClose WithdrawnSeizureAddPropertyDialogComponent', this.selectContactCtrl.value);
    if (this.selectContactCtrl.value === 'ACTION_ADD') {
      return this.saveContact();
    } else {
      return this.saveContactFromList();
    }
  }

  get returnData() {
    return {
      saveData: this.saveData,
    };
  }

  saveContact() {
    this.control.markAllAsTouched();
    this.selectContactCtrl.markAllAsTouched();
    if (this.control.valid && this.selectContactCtrl.valid) {
      const current = new Date();
      const timestamp = current.getTime();
      const contactData: PersonForLitigationCaseDto = {
        firstName: this.control.get('firstName')?.value,
        lastName: this.control.get('lastName')?.value,
        name: `${this.control.get('firstName')?.value} ${this.control.get('lastName')?.value}`,
        personId: `CONTACT_${timestamp}`,
        telephoneNo: this.control.get('tel')?.value,
        relation: '',
      };
      this.saveData = contactData;
      this.notificationService.openSnackbarSuccess(
        this.translate.instant(
          `WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.${
            !this.defaultSelect ? 'GROUP_ADD_NEW_SUCCESS' : 'CONTACT_EDIT_SUCCESS2'
          }`
        )
      );
      return true;
    } else {
      return false;
    }
  }

  saveContactFromList() {
    this.selectContactCtrl.markAllAsTouched();
    this.control.markAllAsTouched();
    if (this.selectContactCtrl.valid) {
      const dataValue = this.contactTypeOptions.find(d => d.personId === this.selectContactCtrl.value);
      if (dataValue) {
        const contactData: PersonForLitigationCaseDto = {
          firstName: dataValue?.firstName,
          lastName: dataValue?.lastName,
          name: `${dataValue?.firstName} ${dataValue?.lastName}`,
          personId: dataValue?.personId,
          telephoneNo: dataValue.telephoneNo,
          relation: dataValue.relation,
          identificationNo: dataValue.identificationNo,
        };
        this.saveData = contactData;
        this.notificationService.openSnackbarSuccess(
          this.translate.instant(
            `WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.${
              !this.defaultSelect ? 'GROUP_ADD_NEW_SUCCESS' : 'CONTACT_EDIT_SUCCESS'
            }`
          )
        );
      }
      return true;
    } else {
      return false;
    }
  }
}
