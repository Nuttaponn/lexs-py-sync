import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { TaskService } from '@app/modules/task/services/task.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { PersonDto, TitlePair } from '@lexs/lexs-client';
import { RELATION } from '@modules/customer/customer.constant';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-edit-related-person',
  templateUrl: './edit-related-person.component.html',
  styleUrls: ['./edit-related-person.component.scss'],
})
export class EditRelatedPersonComponent implements OnInit {
  public personDto!: PersonDto;
  public personStatusConfig: DropDownConfig = {
    searchPlaceHolder: '',
    labelPlaceHolder: 'สถานะ',
  };
  public personRelationConfig: DropDownConfig = {
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทผู้เกี่ยวข้อง',
  };
  public personTitleConfig: DropDownConfig = {
    displayWith: 'description',
    valueField: 'titleCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'คำนำหน้าชื่อ',
  };
  public personStatusOptions = [
    { text: 'มีชีวิต', value: PersonDto.PersonStatusEnum.Alive },
    { text: 'เสียชีวิต', value: PersonDto.PersonStatusEnum.Death },
    { text: 'ดำเนินกิจการ', value: PersonDto.PersonStatusEnum.Open },
    { text: 'ปิดกิจการ', value: PersonDto.PersonStatusEnum.Close },
  ];
  public personRelationOptions = RELATION;
  public personTitleOptions: Array<TitlePair> = [];
  public personTitleIndividual: Array<TitlePair> = [];
  public personTitleJuristic: Array<TitlePair> = [];
  public actionInput: string = '';
  public taskCode: string = '';
  public deceasePersonName: string = '';
  public personInfoArray: Array<IPersonDto> = []; // สำหรับเช็คเงื่อนไขที่ใช้โชว์ตัวเลือกใน dropdown personRelationOptions

  public deathPersons: SimpleSelectOption[] = [];
  public deathPersonsConfig: DropDownConfig = { labelPlaceHolder: 'ผู้เสียชีวิต' };

  public dataForm!: UntypedFormGroup;

  public isShowDeathDropdown: boolean = true;
  public selectIndividual: boolean = true;

  get fromPersonMatch() {
    return this.dataForm.controls;
  }

  constructor(
    private form: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private taskService: TaskService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setDataForm();
    this.initDropdownPersonRelationOptions();
    this.taskCode = this.taskService.taskDetail?.taskCode || '';
    if (this.taskCode === 'INVESTIGATE_HEIR_OR_TRUSTEE') {
      this.personRelationOptions = RELATION.filter(
        obj => obj.value.includes('_TRUSTEE') || obj.value.includes('_HEIR')
      );
      const taskDetailAttributes = JSON.parse(this.taskService.taskDetail.attributes || '{}');
      const deceasePersonId = taskDetailAttributes?.deceasePersonId;
      const personObj = this.personInfoArray.find(obj => obj.personId === deceasePersonId);
      this.deathPersons = [
        {
          text: personObj?.name,
          value: personObj?.personId || '',
        },
      ] as SimpleSelectOption[];
      this.dataForm.get('deathPerson')?.setValue(personObj?.personId);
    }
  }

  async initDropdownPersonRelationOptions() {
    /*
      ข้อมูลที่ให้เลือก
      ผู้จัดการมรดกของผู้กู้หลัก -> เฉพาะกรณีผู้กู้หลักเสียชีวิต -> cond1 -> 1st if
      ผู้จัดการมรดกของผู้กู้ร่วม -> เฉพาะกรณีมีผู้กู้ร่วมและผู้กู้ร่วมเสียชีวิต -> cond2 -> 2nd if
      ผู้จัดการมรดกของผู้ค้ำประกัน -> เฉพาะกรณีมีผู้ค้ำประกันและผู้ค้ำประกันเสียชีวิต -> cond3 -> 3rd if
      ทายาทผู้มีสิทธิ์รับมรดก -> เฉพาะกรณีผู้กู้หลักเสียชีวิต หรือ มีผู้กู้ร่วมและผู้กู้ร่วมเสียชีวิต หรือ มีผู้ค้ำประกันและผู้ค้ำประกันเสียชีวิต -> cond1 && cond2 && cond3 -> 4th if
    */
    this.personRelationOptions = [...RELATION];
    this.logger.info('personInfoArray :: ', this.personInfoArray);
    const findMainBorrower = this.personInfoArray?.find(
      personInfo => personInfo.relation === PersonDto.RelationEnum.MainBorrower
    );
    const filterOutMainBorrower: boolean = !!findMainBorrower
      ? findMainBorrower.personStatus !== PersonDto.PersonStatusEnum.Death
      : false;

    const _filterCoBorrower = this.personInfoArray.filter(i => i.relation === PersonDto.RelationEnum.CoBorrower);
    const _someCoBorrowerDeath = _filterCoBorrower.some(
      personInfo => personInfo.personStatus === PersonDto.PersonStatusEnum.Death
    );

    const _filterGuarantor = this.personInfoArray.filter(i => i.relation === PersonDto.RelationEnum.Guarantor);
    const _someGuarantorDeath = _filterGuarantor.some(
      personInfo => personInfo.personStatus === PersonDto.PersonStatusEnum.Death
    );

    const _filterCollateralOwner = this.personInfoArray.filter(
      i => i.relation === PersonDto.RelationEnum.CollateralOwner
    );
    const _someCollateralOwnerDeath = _filterCollateralOwner.some(
      personInfo => personInfo.personStatus === PersonDto.PersonStatusEnum.Death
    );

    /* ถ้าไม่เข้าเงื่อนไขให้ filter ทิ้ง */
    if (filterOutMainBorrower) {
      this.personRelationOptions = this.personRelationOptions.filter(
        personRelation => personRelation.value !== 'MAIN_BORROWER_TRUSTEE'
      );
    }
    if (!_someCoBorrowerDeath) {
      this.personRelationOptions = this.personRelationOptions.filter(
        personRelation => personRelation.value !== 'CO_BORROWER_TRUSTEE'
      );
    }
    if (!(_someGuarantorDeath || _someCollateralOwnerDeath)) {
      this.personRelationOptions = this.personRelationOptions.filter(
        personRelation => personRelation.value !== 'GUARANTOR_TRUSTEE'
      );
    }

    const findBorrower = !!this.personRelationOptions.find(it =>
      ['MAIN_BORROWER_TRUSTEE', 'CO_BORROWER_TRUSTEE', 'GUARANTOR_TRUSTEE'].includes(it.value)
    );
    if (!findBorrower) {
      this.personRelationOptions = this.personRelationOptions.filter(
        personRelation => personRelation.value !== 'MAIN_BORROWER_HEIR'
      );
    }

    let personTititleDto = await this.masterDataService.title();
    this.personTitleOptions = [];
    this.personTitleIndividual = personTititleDto.titleList?.filter(data => Number(data.titleCode) < 3000) || [];
    this.personTitleJuristic = personTititleDto.titleList?.filter(data => Number(data.titleCode) > 3000) || [];

    if (this.personDto?.personType === PersonDto.PersonTypeEnum.Juristic) {
      this.personTitleOptions = this.personTitleJuristic;
    } else if (this.personDto?.personType === PersonDto.PersonTypeEnum.Individual) {
      this.personTitleOptions = this.personTitleIndividual;
    }
  }

  initForm() {
    this.dataForm = this.form.group({
      personStatus: [''],
      personRelation: ['', Validators.required],
      personTitle: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      name: ['', Validators.required],
      personCitizen: ['', Validators.required],
      personBirthday: ['', Validators.required],
      personType: ['', Validators.required],
      deathPerson: [''],
    });
  }

  setDataForm() {
    if (this.personDto) {
      this.fromPersonMatch['personStatus'].setValue(this.personDto.personStatus);
      this.fromPersonMatch['personRelation'].setValue(this.personDto.relation);
      this.fromPersonMatch['personTitle'].setValue(this.personDto.title);
      this.fromPersonMatch['firstName'].setValue(this.personDto.firstName);
      this.fromPersonMatch['lastName'].setValue(this.personDto.lastName);
      this.fromPersonMatch['name'].setValue(this.personDto.name);
      this.fromPersonMatch['personCitizen'].setValue(this.personDto.identificationNo);
      this.fromPersonMatch['personBirthday'].setValue(this.personDto.birthDate);
      this.fromPersonMatch['personType'].setValue(this.personDto.personType);

      this.onSelectedRelation(String(this.personDto.relation));
      this.onSelectPersonType(String(this.personDto.personType));

      if (this.actionInput === PersonDto.UpdateFlagEnum.U) {
        this.dataForm.get('deathPerson')?.setValue(this.personDto.referencePersonId);
      }
    }
  }

  onSelectedRelation(data: string) {
    if (data) {
      this.dataForm.get('personRelation')?.setValue(data);

      /* 10/27/2022
        แก้ไขการแสดง Dropdown ผู้เสียชีวิต เฉพาะกรณี Dropdown ประเภทผู้เกี่ยวข้อง เลือกเป็นกรณีผู้จัดการมรดก หรือ ทายาท
        TRUSTEE || HEIR
      */
      this.isShowDeathDropdown = data.includes('TRUSTEE') || data.includes('HEIR');
      if (this.isShowDeathDropdown) {
        this.dataForm.get('deathPerson')?.setValidators([Validators.required]);
        this.dataForm.get('deathPerson')?.updateValueAndValidity();
      } else {
        this.dataForm.get('deathPerson')?.clearValidators();
        this.dataForm.get('deathPerson')?.updateValueAndValidity();
        this.dataForm.get('deathPerson')?.setValue('');
      }
    }
  }

  onSelectPersonType(data: string) {
    if (data === PersonDto.PersonTypeEnum.Juristic) {
      this.personTitleOptions = this.personTitleJuristic;
      this.selectIndividual = false;
      this.dataForm.get('name')?.setValidators([Validators.required]);
      this.dataForm.get('name')?.updateValueAndValidity();
      this.dataForm.get('firstName')?.clearValidators();
      this.dataForm.get('firstName')?.updateValueAndValidity();
      this.dataForm.get('lastName')?.clearValidators();
      this.dataForm.get('lastName')?.updateValueAndValidity();
    } else {
      this.personTitleOptions = this.personTitleIndividual;
      this.selectIndividual = true;
      this.dataForm.get('name')?.clearValidators();
      this.dataForm.get('name')?.updateValueAndValidity();
      this.dataForm.get('firstName')?.setValidators([Validators.required]);
      this.dataForm.get('firstName')?.updateValueAndValidity();
      this.dataForm.get('lastName')?.setValidators([Validators.required]);
      this.dataForm.get('lastName')?.updateValueAndValidity();
    }

    //clear personTitle when switch personType
    if (this.personTitleOptions.length > 0) {
      const personTitleForm = this.dataForm.get('personTitle')?.value;
      const personTitleCode = this.personTitleOptions.find(obj => obj.titleCode == personTitleForm);
      if (personTitleCode === undefined || !personTitleCode) {
        this.fromPersonMatch['personTitle'].setValue('');
      }
    }
  }

  onSelectedTitle(data: string) {
    if (data) {
      this.dataForm.get('personTitle')?.setValue(data);
    }
  }

  getFormControl(name: string): any {
    return this.dataForm.get(name);
  }

  public dathlist = [];
  dataContext(data: any) {
    this.personDto = data.personDto;
    this.actionInput = data.actionInput;
    this.personInfoArray = data.personInfoArray;
    const _deathPersons = this.personInfoArray.filter(item => item.personStatus === PersonDto.PersonStatusEnum.Death);
    this.deathPersons = _deathPersons.map(item => {
      return {
        text: item.name,
        value: item.personId || '',
      } as SimpleSelectOption;
    });
  }

  getFullName() {
    const dataForm = this.dataForm.value;
    if (dataForm?.personType === PersonDto.PersonTypeEnum.Individual) {
      const personTitleObj = this.personTitleIndividual.find(e => e.titleCode === dataForm?.personTitle);
      return `${personTitleObj?.description || ''}${dataForm?.firstName} ${dataForm?.lastName}`;
    } else {
      const personTitleObj = this.personTitleJuristic.find(e => e.titleCode === dataForm?.personTitle);
      return `${personTitleObj?.description || ''}${dataForm?.name}`;
    }
  }

  get returnData() {
    return {
      personDto: {
        personStatus: this.dataForm.get('personStatus')?.value,
        relation: this.dataForm.get('personRelation')?.value,
        title: this.dataForm.get('personTitle')?.value,
        firstName: this.dataForm.get('firstName')?.value,
        lastName: this.dataForm.get('lastName')?.value,
        name: this.getFullName(),
        identificationNo: this.dataForm.get('personCitizen')?.value,
        birthDate: this.dataForm.get('personBirthday')?.value,
        personType: this.dataForm.get('personType')?.value,
        updateFlag: this.actionInput,
        personId: this.personDto?.personId || '',
        referencePersonId: this.dataForm.get('deathPerson')?.value,
      },
    };
  }

  public async onClose(): Promise<boolean> {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      return false;
    } else {
      return true;
    }
  }
}
