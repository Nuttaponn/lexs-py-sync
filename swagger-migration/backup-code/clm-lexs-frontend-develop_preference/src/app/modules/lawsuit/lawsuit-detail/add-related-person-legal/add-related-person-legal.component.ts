import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { RELATION } from '@app/modules/customer/customer.constant';
import { CommonTabsService } from '@app/shared/components/common-tabs/common-tabs.service';
import { DebtRelatedInfoTabService } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.service';
import { IUploadInfo, IUploadMultiFile } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  DocumentRequest,
  PersonDto,
  PersonLitigationInfo,
  PersonLitigationInfoRequest,
  PersonRequest,
  TitlePair,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { LawsuitService } from '../../lawsuit.service';

@Component({
  selector: 'app-add-related-person-legal',
  templateUrl: './add-related-person-legal.component.html',
  styleUrls: ['./add-related-person-legal.component.scss'],
})
export class AddRelatedPersonLegalComponent implements OnInit {
  public personRelationConfig: DropDownConfig = {
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทผู้เกี่ยวข้อง',
  };
  public deathPersonsConfig: DropDownConfig = { labelPlaceHolder: 'ผู้เสียชีวิต' };
  public personTitleConfig: DropDownConfig = {
    displayWith: 'description',
    valueField: 'titleCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'คำนำหน้าชื่อ',
  };
  public personTypeEnum = PersonDto.PersonTypeEnum;
  public personRelationOptions = RELATION;
  public personInfoArray: Array<IPersonDto> = []; // สำหรับเช็คเงื่อนไขที่ใช้โชว์ตัวเลือกใน dropdown personRelationOptions
  public personTitleOptions: Array<TitlePair> = [];
  public personTitleIndividual: Array<TitlePair> = [];
  public personTitleJuristic: Array<TitlePair> = [];
  public deathPersons: SimpleSelectOption[] = [];
  /** for common upload document */
  public docColumn = ['documentName', 'uploadDate'];
  public docs: Array<IUploadMultiFile> = [];
  public uploadInfo: IUploadInfo = { cif: '', documentTemplateId: '', litigationId: '' };

  personLitigationInfo!: PersonLitigationInfo;
  isShowDeathDropdown: boolean = true;

  formGroup!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private notificationService: NotificationService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private lawsuitService: LawsuitService,
    private commonTabsService: CommonTabsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.initDocument();
    await this.initDropdownPersonRelationOptions();
  }

  initForm() {
    this.formGroup = this.fb.group({
      personList: this.fb.array([]),
      reason: [{ value: null, disabled: false }, Validators.required],
      file: [{ value: null, disabled: false }, Validators.required],
    });
    this.addPerson();
    // clear data service
    this.debtRelatedInfoTabService.updatePersonsBlackCase = [];
  }

  initDocument() {
    this.uploadInfo = {
      cif: this.debtRelatedInfoTabService.currentLitigation.customerId || '',
      litigationId: this.debtRelatedInfoTabService.litigationId || '',
      documentTemplateId: '',
    };
  }

  async initDropdownPersonRelationOptions() {
    this.personLitigationInfo = await this.debtRelatedInfoTabService.getAdditionalPersonsRelation(
      this.debtRelatedInfoTabService.litigationId || '',
      'addPersonLitigation'
    );
    // get document
    let documentAdditionalPerson = this.personLitigationInfo?.documentAdditionalPerson as IUploadMultiFile;
    if (documentAdditionalPerson?.documentTemplate)
      documentAdditionalPerson!.documentTemplate!.documentName =
        documentAdditionalPerson?.documentTemplate?.documentName ||
        this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LEGAL.DOC_UPLOAD_NAME');
    this.docs = [documentAdditionalPerson];
    // get death person list
    this.personInfoArray = this.personLitigationInfo?.additionalPersons || [];
    const _deathPersons = this.personInfoArray.filter(item => item.personStatus === PersonDto.PersonStatusEnum.Death);
    this.deathPersons = _deathPersons.map(item => {
      return {
        text: item.name,
        value: item.personId || '',
      } as SimpleSelectOption;
    });
    this.personRelationOptions = [...RELATION];
    // แสดง ผู้รับชำระหนี้แทน STAND_IN_PAYER , จำเลยร่วม CO_DEFENDANT
    const relateArray = [PersonDto.RelationEnum.StandInPayer, PersonDto.RelationEnum.CoDefendant];
    this.personRelationOptions = this.personRelationOptions.filter(personRelation =>
      relateArray.includes(personRelation.value as PersonDto.RelationEnum)
    );

    let personTititleDto = await this.masterDataService.title();
    this.personTitleOptions = personTititleDto.titleList || [];
    this.personTitleIndividual = personTititleDto.titleList?.filter(data => Number(data.titleCode) < 3000) || [];
    this.personTitleJuristic = personTititleDto.titleList?.filter(data => Number(data.titleCode) > 3000) || [];
  }

  getControl(name: string) {
    return this.formGroup.get(name);
  }

  get personList() {
    return this.formGroup.controls['personList'] as UntypedFormArray;
  }

  addPerson() {
    const personForm = this.fb.group({
      personType: [{ value: null, disabled: false }, Validators.required],
      personRelation: [{ value: null, disabled: false }, Validators.required],
      deathPerson: [{ value: null, disabled: false }],
      personTitle: [{ value: 'null', disabled: false }, Validators.required],
      firstName: [{ value: null, disabled: false }, Validators.required],
      lastName: [{ value: null, disabled: false }, Validators.required],
      name: [{ value: null, disabled: false }],
      personCitizen: [{ value: null, disabled: false }],
      personBirthday: [{ value: null, disabled: false }],
    });
    this.personList.push(personForm);
    setTimeout(() => {
      this.personList
        ?.at(this.personList.length - 1)
        ?.get('personTitle')
        ?.patchValue(null);
    }, 100);
  }

  deletePerson(index: number) {
    this.personList.removeAt(index);
  }

  getArrayControl(name: string, index: number): AbstractControl | null {
    return this.personList.at(index).get(name);
  }

  setValidatorFormArray(form: Array<IValidatorFormArray>, index: number) {
    form.forEach(element => {
      const control = this.getArrayControl(element.formName, index);
      control?.setValidators(element.validators);
      control?.updateValueAndValidity();
    });
  }

  clearValidatorFormArray(form: Array<IValidatorFormArray>, index: number) {
    form.forEach(element => {
      const control = this.getArrayControl(element.formName, index);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }

  resetFormArray(form: Array<string>, index: number) {
    form.forEach(element => {
      const control = this.getArrayControl(element, index);
      control?.reset();
    });
  }

  onSelectPersonType(data: string, index: number) {
    this.resetFormArray(['personTitle', 'name', 'firstName', 'lastName'], index);
    if (data === 'JURISTIC') {
      this.personTitleOptions = this.personTitleJuristic;
      this.setValidatorFormArray([{ formName: 'name', validators: [Validators.required] }], index);
      this.clearValidatorFormArray(
        [
          { formName: 'firstName', validators: null },
          { formName: 'lastName', validators: null },
        ],
        index
      );
    } else {
      this.personTitleOptions = this.personTitleIndividual;
      this.clearValidatorFormArray([{ formName: 'name', validators: null }], index);
      this.setValidatorFormArray(
        [
          { formName: 'firstName', validators: [Validators.required] },
          { formName: 'lastName', validators: [Validators.required] },
        ],
        index
      );
    }
  }

  onSelectedRelation(data: string, index: number) {
    if (data) {
      this.getArrayControl('personRelation', index)?.setValue(data);
      /* 10/27/2022
        แก้ไขการแสดง Dropdown ผู้เสียชีวิต เฉพาะกรณี Dropdown ประเภทผู้เกี่ยวข้อง เลือกเป็นกรณีผู้จัดการมรดก หรือ ทายาท
        TRUSTEE || HEIR
      */
      this.isShowDeathDropdown = data.includes('TRUSTEE') || data.includes('HEIR');
    }
  }

  onSelectedTitle(data: string, index: number) {
    if (data) {
      this.getArrayControl('personTitle', index)?.setValue(data);
    }
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    const fileList = event?.filter(e => e.isUpload);
    this.getControl('file')?.patchValue(fileList);
  }

  async onBack(event: any) {
    if (this.formGroup.dirty) {
      const confirm = await this.notificationService.warningDialog(
        'COMMON.EXIT_WITHOUT_SAVE',
        'COMMON.MESSAGE_EXIT',
        'COMMON.EXIT_WITHOUT_SAVE',
        'icon-Reset'
      );
      if (confirm) {
        this.commonTabsService.tabNavigateTo.next(1);
        this.routerService.back();
      }
    } else {
      this.commonTabsService.tabNavigateTo.next(1);
      this.routerService.back();
    }
  }

  mapAdditionalPersons(): Array<PersonRequest> {
    let additionalPersons: Array<PersonRequest> = [];
    this.personList.value.forEach((e: any) => {
      let personRequest: PersonRequest = {
        relation: e.personRelation,
        title: e.personTitle,
        firstName: e.firstName,
        lastName: e.lastName,
        name: this.getFullName(e),
        identificationNo: e.personCitizen,
        birthDate: e.personBirthday,
        personType: e.personType,
        referencePersonId: e.deathPerson,
        updateFlag: PersonRequest.UpdateFlagEnum.A,
      };

      additionalPersons.push(personRequest);
    });
    return additionalPersons;
  }

  getFullName(person: any) {
    let fullName = '';
    const titleList = [...this.personTitleIndividual, ...this.personTitleJuristic];
    const personTitleObj = titleList.find(e => e.titleCode === person?.personTitle);
    if (person?.personType === 'INDIVIDUAL') {
      fullName = `${personTitleObj?.description || ''}${person?.firstName} ${person?.lastName}`;
    } else {
      fullName = `${personTitleObj?.description || ''}${person?.name}`;
    }
    return fullName;
  }

  async onSave() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const fileList: DocumentRequest[] = this.getControl('file')?.value;
    let documents: DocumentRequest = fileList[0];
    documents.updateFlag = DocumentRequest.UpdateFlagEnum.A;
    const request: PersonLitigationInfoRequest = {
      additionalPersons: this.mapAdditionalPersons(),
      documents: documents,
      headerFlag: PersonLitigationInfoRequest.HeaderFlagEnum.Draft,
      litigationId: this.debtRelatedInfoTabService.litigationId,
      reason: this.getControl('reason')?.value,
    };
    try {
      await this.debtRelatedInfoTabService.updateAdditionalPersonsBlackCase(request);
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LEGAL.SNACKBAR_ADD_LEGAL_SAVED')
      );
      // for display dept relate info tab
      await this.lawsuitService.getLitigation(this.debtRelatedInfoTabService.litigationId || '');
      this.debtRelatedInfoTabService.updatePersonsBlackCase = request.additionalPersons as PersonDto[];
      this.commonTabsService.tabNavigateTo.next(1);
      this.routerService.back();
      // check disable button after additional person
      this.lawsuitService.hasAdditionalPerson = true;
    } catch (error) {}
  }
}

interface IValidatorFormArray {
  formName: string;
  validators: ValidatorFn | ValidatorFn[] | null;
}
