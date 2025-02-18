import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DropDownConfig, NameValuePair } from '@spig/core';
import {
  AucAnnouncementKTBSearchConditionRequest,
  ExternalDocumentsSearchTemplate,
} from './external-documents-search-controller.model';
import { MasterDataService } from '@app/shared/services/master-data.service';

@Component({
  selector: 'app-external-documents-search-controller',
  templateUrl: './external-documents-search-controller.component.html',
  styleUrls: ['./external-documents-search-controller.component.scss'],
})
export class ExternalDocumentsSearchControllerComponent implements OnInit {
  @Input() template: ExternalDocumentsSearchTemplate = 'NORMAL';
  @Output() onApplyFilter = new EventEmitter<any>();

  /** search control */
  public searchCtrl!: UntypedFormGroup;

  /** auc annoucement ktb process search */
  public lotConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.LOT',
  };
  @Input() lotOptions: NameValuePair[] = [];

  public setConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.SET',
  };
  @Input() setOptions: NameValuePair[] = [];

  public orderNoConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.NO',
  };
  @Input() orderNoOptions: NameValuePair[] = [];

  public redCaseNoConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.LABEL_RED_CASE_NO',
  };
  @Input() redCaseNoOptions: NameValuePair[] = [];

  public legalExecutionOfficeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.LEGAL_EXECUTION_OFFICE',
  };
  @Input() legalExecutionOfficeOptions: NameValuePair[] = [];

  public statusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.STATUS',
  };
  @Input() statusOptions: NameValuePair[] = [];

  public defendantConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.DEFENDANT',
  };
  @Input() defendantOptions: NameValuePair[] = [];

  public caseTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.CASE_TYPE',
  };
  @Input() caseTypeOptions: NameValuePair[] = [];

  public TABLE_FILTER_KEY = {
    aucLot: 'aucLot',
    aucSet: 'aucSet',
    fbidnum: 'fbidnum',
    redCaseNo: 'redCaseNo',
    lawCourtId: 'ledOriginalName',
    matchingStatus: 'matchingStatusName',
    aucStatusName: 'aucStatusName',
    defendantName: 'defendantName',
    caseType: 'caseType',
  };

  get dynamicStatusKey() {
    return this.template === 'AUC_ANNOUCEMENT_KTB_PROCESS'
      ? this.TABLE_FILTER_KEY.matchingStatus
      : this.TABLE_FILTER_KEY.aucStatusName;
  }

  private _condition!: any;

  constructor(
    private fb: UntypedFormBuilder,
    private masterDataService: MasterDataService,
  ) {}

  async ngOnInit() {
    /** init search control */
    this.searchCtrl = this.initSearchControl(this._condition);

    await this.setCaseTypeOptions();
  }

  async setCaseTypeOptions() {
    let caseType = await this.masterDataService.caseType();
    caseType.caseTypes = caseType.caseTypes?.filter(item => item.value !== '0003')
    this.caseTypeOptions = [
      { name: 'ประเภทคดี', value: 'N/A' },
      ...(caseType?.caseTypes ?? [])
    ];
  }

  async onSelectedOption(_selectedBy?: string) {
    this.onSearch();
    let value = '';
    switch (_selectedBy) {
      case this.TABLE_FILTER_KEY.aucLot:
        value = this.searchCtrl.get('lot')?.value;
        break;
      case this.TABLE_FILTER_KEY.aucSet:
        value = this.searchCtrl.get('set')?.value;
        break;
      case this.TABLE_FILTER_KEY.fbidnum:
        value = this.searchCtrl.get('orderNo')?.value;
        break;
      case this.TABLE_FILTER_KEY.redCaseNo:
        value = this.searchCtrl.get('redCaseNo')?.value;
        break;
      case this.TABLE_FILTER_KEY.lawCourtId:
        value = this.searchCtrl.get('legalExecutionOffice')?.value;
        break;
      case this.TABLE_FILTER_KEY.matchingStatus:
      case this.TABLE_FILTER_KEY.aucStatusName:
        value = this.searchCtrl.get('status')?.value;
        break;
      case this.TABLE_FILTER_KEY.defendantName:
        value = this.searchCtrl.get('defendant')?.value;
        break;
      case this.TABLE_FILTER_KEY.caseType:
        value = this.searchCtrl.get('caseType')?.value;
        break;
      default:
        break;
    }
    const dataFilter = { filter: _selectedBy, value: value, rawValue: this.searchCtrl.getRawValue() };
    this.onApplyFilter.emit(dataFilter);
  }

  onSearch() {
    this.searchCtrl.markAllAsTouched();
    this.searchCtrl.updateValueAndValidity();
  }

  initSearchControl(condition?: AucAnnouncementKTBSearchConditionRequest) {
    return this.fb.group({
      lot: (condition as AucAnnouncementKTBSearchConditionRequest)?.lot || 'N/A',
      set: (condition as AucAnnouncementKTBSearchConditionRequest)?.set || 'N/A',
      orderNo: (condition as AucAnnouncementKTBSearchConditionRequest)?.orderNo || 'N/A',
      redCaseNo: (condition as AucAnnouncementKTBSearchConditionRequest)?.redCaseNo || 'N/A',
      legalExecutionOffice: (condition as AucAnnouncementKTBSearchConditionRequest)?.legalExecutionOffice || 'N/A',
      status: (condition as AucAnnouncementKTBSearchConditionRequest)?.status || 'N/A',
      defendant: (condition as AucAnnouncementKTBSearchConditionRequest)?.defendant || 'N/A',
      caseType: (condition as AucAnnouncementKTBSearchConditionRequest)?.caseType || 'N/A',
    });
  }
}
