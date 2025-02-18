import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { IUploadMultiFile } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  CourtDto,
  LitigationCaseAllegationDto,
  LitigationCasePersonDto,
  LitigationDocumentDto,
  NameValuePair,
} from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
@Component({
  selector: 'app-indictment-detail',
  templateUrl: './indictment-detail.component.html',
  styleUrls: ['./indictment-detail.component.scss'],
})
export class IndictmentDetailComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  public personsColumns: string[] = ['select', 'name', 'relation', 'identificationNo'];
  public persons: LitigationCasePersonDto[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public document: LitigationDocumentDto[] = [];
  public documentUpload: IUploadMultiFile[] = [];
  public accountsColumn: string[] = [
    'accountNo',
    'debtType',
    'totalDebt',
    'principleLawsuit',
    'interestLawsuit',
    'interestRate',
    'tdr',
  ];
  public accounts: any[] = [];
  public selection = new SelectionModel<any>(true, []);
  public court: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.LABEL_COURT',
  };
  public courtOptions: NameValuePair[] = [];
  public courtCtrl: UntypedFormControl = new UntypedFormControl();
  public allegation: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.INDICTMENT.CHARGE_OFFENSE',
  };
  public allegationOptions: NameValuePair[] = [];
  public allegationCtrl: UntypedFormControl = new UntypedFormControl();
  public isOpened: boolean = true;

  public isViewMode: boolean = false;

  public customerId = '';
  public litigationId = '';

  public currentDate: Date = new Date();
  public maxDate: Date = new Date();

  @Input() dataForm!: UntypedFormGroup;
  @Input() approverId: string = '';
  @Input() forceViewMode!: boolean;

  @Output() selectPersons = new EventEmitter<any>();
  constructor(
    private masterDataService: MasterDataService,
    private sessionService: SessionService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 13);
  }

  async ngOnInit() {
    const _owner = this.taskService.taskOwner;
    // viewMode is true when not owner task AND task not approved yet.
    this.isViewMode =
      (!!_owner &&
      this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) &&
      !this.approverId
        ? false
        : true) || this.forceViewMode;

    let courtObject: CourtDto = this.masterDataService.advanceOptions.court || {};
    this.courtOptions = courtObject.court || [];
    this.persons = [...this.dataForm.get('persons')?.value];
    this.document = [...this.dataForm.get('litigationDocuments')?.value];
    this.documentUpload = (this.document as any[]).map((m, index) => {
      // m.removeDocument = this.isViewMode ? false : true; // remark check in upload-multi-file component icon-Bin section
      m.uploadDate = this.document[index].documentDate;

      m.documentTemplateId = this.document[index].documentTemplateId;
      m.documentTemplate = this.document[index].documentTemplate;
      m.imageId = this.document[index].imageId;
      m.isUpload = false;
      m.removeDocument = true;
      m.uploadRequired = !this.document[index].documentTemplate?.optional;
      m.viewOnly = this.isViewMode;
      m.active = true;
      return m;
    });
    this.customerId = this.lawsuitService.currentLitigation.customerId || '';
    this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    this.accounts = [...this.dataForm.get('litigationCaseAccounts')?.value];

    const caseTypeCode = this.dataForm.get('caseType')?.value.code;
    const listAllegation = await this.masterDataService.allegation(caseTypeCode);
    this.allegationOptions = listAllegation.allegations || [];

    this.loadSelectedCheckBox();

    // if "allegationsObj" & "litigationCaseAllegations" are string or number then convert to array of object
    const litigationValue = this.dataForm.get('litigationCaseAllegations')?.value;
    const allegationsValue = this.dataForm.get('allegationsObj')?.value;

    if (
      ['string', 'number'].includes(typeof litigationValue) &&
      ['string', 'number'].includes(typeof allegationsValue)
    ) {
      this.onSelectAllegations(litigationValue.toString());
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    this.selectPersons.emit(this.selection.selected);

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.identificationNo ?? '' + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = this.persons.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.persons);
  }

  getAllegation(value: string) {
    return this.allegationOptions.find(item => item.value === value);
  }

  loadSelectedCheckBox() {
    let selectedRow = this.persons.filter(element => element.checked === true);
    this.selection.select(...selectedRow);
    this.selectPersons.emit(this.selection.selected);
  }

  getControl(name: string) {
    return this.dataForm.get(name);
  }

  onSelectAllegations(event: string) {
    const arr = this.getAllegation(event);
    const allegation: Array<LitigationCaseAllegationDto> = [
      {
        code: arr?.value,
        litigationCaseId: this.dataForm.get('id')?.value,
        name: arr?.name,
      },
    ];
    this.dataForm.get('allegationsObj')?.setValue([...allegation]);
    this.dataForm.get('allegationsObj')?.updateValueAndValidity();
  }

  onSelectCourt(event: any) {
    const courtObj = this.courtOptions.find(item => item.value === event);
    const courtArr = courtObj?.name ? courtObj?.name.split('-') : '';
    const courtName = courtArr.length > 0 ? courtArr[1] : '';
    this.dataForm.get('courtName')?.setValue(courtName);
    this.dataForm.get('courtName')?.updateValueAndValidity();
  }
}
