import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ContactConfig, IPersonContact } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Contacts, PersonForLitigationCaseDto } from '@lexs/lexs-client';
import { DropDownConfig, NameIconValueOption } from '@spig/core';

interface NameIconPersonOption extends NameIconValueOption {
  personId?: string;
}

@Component({
  selector: 'app-withdrawn-seizure-contact',
  templateUrl: './withdrawn-seizure-contact.component.html',
  styleUrls: ['./withdrawn-seizure-contact.component.scss'],
})
export class WithdrawnSeizureContactComponent implements OnInit {
  @Input() public contactConfig: ContactConfig = {};
  @Input() public contactFormGroup: UntypedFormGroup = this.initDefaultForm();
  @Input() public contactTypeOptions: PersonForLitigationCaseDto[] = [];
  @Input() public tableDataSource: Contacts[] = [];
  @Input() public lgPersonColumn: string[] = [];
  @Input() public dropdownControl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  @Input() public excludesOption: string[] = [];
  @Input() public defaultSelect: IPersonContact = {};

  @Output() onUpdateSelectContact = new EventEmitter<any>();
  @Output() onAddMoreContact = new EventEmitter<any>();
  @Output() onEditContact = new EventEmitter<any>();
  @Output() onDeleteContact = new EventEmitter<any>();

  private DROPDOWN_ACTION_TYPE: string = 'ACTION_ADD';
  public isContactOpened: boolean = true;
  public isAddNewContact = false;
  public isUpdated = true;

  public dropdownConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'personId',
    labelPlaceHolder: 'เลือกชื่อผู้ติดต่อ',
  };

  public actionAddOptions: NameIconPersonOption = {
    personId: this.DROPDOWN_ACTION_TYPE,
    name: 'เพิ่มผู้ติดต่อใหม่',
    nameClasses: 'fill-blue',
    icon: 'icon-Plus',
    value: this.DROPDOWN_ACTION_TYPE,
  };

  public personDataSource = new MatTableDataSource<IPersonContact>([]);

  get isEditMode() {
    return this.contactConfig.mode === 'EDIT';
  }

  get isAddMode() {
    return this.contactConfig.mode === 'ADD';
  }

  constructor(
    private fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.info('ngOnInit WithdrawnSeizureContactComponent', this.tableDataSource);
    if (this.excludesOption && this.excludesOption.length > 0) {
      this.contactTypeOptions = this.contactTypeOptions.filter(
        op => !this.excludesOption.includes(op.personId || '') || op.personId === this.defaultSelect?.personId
      );
    }
    const findAddAction = this.contactTypeOptions.find(op => op.personId === this.DROPDOWN_ACTION_TYPE);
    if (!findAddAction) {
      this.contactTypeOptions.push(this.actionAddOptions);
    }
    if (this.contactConfig?.hasAction === false) {
      this.lgPersonColumn = this.lgPersonColumn.filter(d => d !== 'actions');
    }

    this.setDefaultValueBySelect();

    // Mapping table data
    if (this.tableDataSource.length > 0) {
      this.personDataSource.data = this.tableDataSource.map((it, index) => {
        return <IPersonContact>{
          no: '' + (index + 1),
          name: `${it.firstName} ${it.lastName}`,
          firstName: it.firstName,
          lastName: it.lastName,
          isMainContact: it.isMainContact,
          identificationNo: it.identificationNo || '',
          telephoneNo: it.telephoneNo || '',
          personId: it.personId,
        };
      });
    }
  }

  onSelectedOption(data: any) {
    console.log('onSelectedOption WithdrawnSeizureContactComponent', data);

    if (data === this.DROPDOWN_ACTION_TYPE) {
      if (this.isAddNewContact === false) {
        this.contactFormGroup.reset();
      }
      this.isAddNewContact = true;
    } else {
      this.isAddNewContact = false;
      this.onUpdateSelectContact.emit(data);
    }
  }

  initDefaultForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: [null, Validators.required],
      tel: [null, [Validators.required, Validators.minLength(10)]],
    });
  }

  saveContact() {
    this.contactFormGroup.markAllAsTouched();
    if (this.isEditMode && this.contactFormGroup.valid) {
      console.log(this.contactFormGroup.getRawValue());
      const current = new Date();
      const timestamp = current.getTime();
      const contactData: PersonForLitigationCaseDto = {
        firstName: this.contactFormGroup.get('firstName')?.value,
        lastName: this.contactFormGroup.get('lastName')?.value,
        personId: `CONTACT_${timestamp}`,
        name: `${this.contactFormGroup.get('firstName')?.value} ${this.contactFormGroup.get('lastName')?.value}`,
        telephoneNo: this.contactFormGroup.get('tel')?.value,
      };
      this.contactTypeOptions.splice(this.contactTypeOptions.length - 2, 0, contactData);
      this.dropdownControl.setValue(contactData.personId);
      this.isUpdated = false;
      this.isAddNewContact = false;
      this.contactFormGroup.reset();
      this.onUpdateSelectContact.emit(contactData.personId);
      this.notificationService.openSnackbarSuccess('เพิ่มผู้ติดต่อสำเร็จ');
      setTimeout(() => {
        this.isUpdated = true;
      });
    } else {
    }
  }

  addMoreContact() {
    this.onAddMoreContact.emit();
  }

  deleteContact(element: any) {
    this.onDeleteContact.emit(element);
  }

  editContact(element: any) {
    this.onEditContact.emit(element);
  }

  cancelAdd() {
    this.isAddNewContact = false;
    this.contactFormGroup.reset();
    this.dropdownControl.reset();
  }

  private setDefaultValueBySelect() {
    if (!this.defaultSelect) return;

    if (this.defaultSelect.personId?.startsWith('CONTACT_')) {
      this.contactFormGroup.get('firstName')?.setValue(this.defaultSelect.firstName);
      this.contactFormGroup.get('lastName')?.setValue(this.defaultSelect.lastName);
      this.contactFormGroup.get('tel')?.setValue(this.defaultSelect.telephoneNo);
      this.dropdownControl.setValue(this.DROPDOWN_ACTION_TYPE);
      this.isAddNewContact = true;
    } else {
      this.dropdownControl.setValue(this.defaultSelect.personId);
      this.isAddNewContact = false;
    }
  }
}
