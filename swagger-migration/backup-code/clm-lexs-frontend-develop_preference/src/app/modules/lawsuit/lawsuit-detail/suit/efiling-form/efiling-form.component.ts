import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { IUploadMultiFile, IUploadMultiInfo, statusCode, taskCode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationCaseDto,
  LitigationCasePersonDto,
  LitigationCaseSubCaseDocumentsDto,
  LitigationCaseSubCaseDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, NameValuePair } from '@spig/core';
import { SubSink } from 'subsink';
import { SuitService } from '../suit.service';
@Component({
  selector: 'app-efiling-form',
  templateUrl: './efiling-form.component.html',
  styleUrls: ['./efiling-form.component.scss'],
})
export class EfilingFormComponent implements OnInit, AfterViewInit, OnDestroy {
  actionBar = this.setActionBar();

  /* ################### INITIAL INPUTS ######################### */
  litigationCaseDto!: LitigationCaseDto;
  litigationCaseSubCaseDto!: LitigationCaseSubCaseDto;
  litigationCaseSubCaseDocuments!: LitigationCaseSubCaseDocumentsDto[];
  litigationId: string | null = null;

  /* attr for person-table */
  public persons: LitigationCasePersonDto[] = [];
  public personSelection = new SelectionModel<string>(true, []);
  public personsColumns: string[] = ['select', 'name', 'relation', 'identificationNo'];
  isPersonShowSelection: boolean = false;

  /* attr for custom upload-table */
  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public docColumn = ['documentName', 'uploadDate'];
  convertedDocs: IUploadMultiFile[] = [];
  outputIUploadMultiFile!: IUploadMultiFile[];

  /* taskCode กับ statusCode ใช้สำหรับใช้เป็นเงื่อนไข แต่ละ Designed UI เท่านั้น */
  public statusCode!: statusCode | null;
  public taskCode!: taskCode | null;

  // public caseId!: number;
  // public subCaseId!: number | null;

  dataCourtLevel!: LitigationCaseDto.CourtLevelEnum;
  dataAppealSide!: LitigationCaseDto.AppealSideEnum;

  isViewMode: boolean = false;
  isDocViewMode: boolean = false;
  isViewModePart1: boolean = false;
  isViewModeContent4: boolean = false;
  courtOrderTextContent4 = '';
  isViewModeContent5: boolean = false;
  courtTextContent5 = '';
  suspensExecutionTextContent5 = '';
  /* ############################################################ */

  /* ################ Dropdown ################## */
  public court: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.LABEL_COURT',
  };
  public courtOptions: NameValuePair[] = [];

  // รับ/ไม่รับ
  public courtOrderConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.SUIT.SUIT_EFILING.TITILE.SUPREME_COURT_ORDER',
  };
  courtOrderList!: NameValuePair[];

  // อนุญาต/ไม่อนุญาต
  public suspensExecutionConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.SUIT_EFILING_FORM.SUSPENS_EXECUTION_LABEL',
  };
  suspensExecutionList!: NameValuePair[];
  /* ############## END Dropdown ################ */

  /* ############# params tools ################## */
  private subs = new SubSink();

  /* form attrs */
  dataForm: UntypedFormGroup = this.suitService.generateEfilingForm(
    this.litigationCaseDto,
    this.litigationCaseSubCaseDto
  );
  courtList: Array<NameValuePair> = [];
  getControl(name: string) {
    return this.dataForm.get(name);
  }

  currentDate = new Date();
  maxSubmitDate = this.currentDate;

  onCaseDateChange(value: any) {
    this.maxSubmitDate = new Date(value);
    this.dataForm.get('submitDate')?.setValue(value);
  }

  isFromRefLink!: boolean;

  constructor(
    private suitService: SuitService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private cd: ChangeDetectorRef,
    private routerService: RouterService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.isFromRefLink = JSON.parse(value['isFromRefLink'] || 'false');
      })
    );
  }

  async ngOnInit(): Promise<void> {
    this.dataForm = this.suitService.generateEfilingForm(this.litigationCaseDto);
    try {
      this.courtList = (await this.masterDataService.court()).court || [];
      this.courtOrderList = (await this.masterDataService.courtOrder()).courtOrder || [];
      this.suspensExecutionList = (await this.masterDataService.suspensExecution()).suspensExecution || [];
    } catch (error) {
      console.log('efiling-form onInit error', error);
    }

    this.initPage();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setActionBar() {
    return {
      disabledBackButton: false,
      hasCancelButton: !this.isViewMode,
      disabledCancelButton: false,
      showNavBarInformation: true,
      hasPrimaryButton: !this.isViewMode,
      primaryButtonText:
        'LAWSUIT.SUIT_EFILING_FORM.ACTION_SUBMIT_BTN.' + this.dataAppealSide + '_' + this.dataCourtLevel,
      primaryButtonIcon: 'icon-save-primary',
      hasEditButton: false,
      editButtonText: '',
      hasDeleteButton: false,
      deleteButtonText: '',
      deleteButtonIcon: '',
      deleteButtonPositive: false,
    };
  }

  private convertSubCaseDocsToDocs(litigationCaseSubCaseDocument: LitigationCaseSubCaseDocumentsDto): IUploadMultiFile {
    return {
      // documentTemplate: doc.documentTemplate,
      // isUpload: this.isViewMode,
      // viewOnly: true,
      // uploadRequired: !this.isViewMode ? !!!doc.documentTemplate?.optional : false,
      // removeDocument: true
      documentTemplateId: litigationCaseSubCaseDocument.documentTemplateId,
      documentTemplate: litigationCaseSubCaseDocument.documentTemplate,
      imageId: litigationCaseSubCaseDocument.imageId,
      uploadDate: litigationCaseSubCaseDocument.documentDate,
      isUpload: false, //this.isDocViewMode
      removeDocument: true,
      // isSubContract: false,
      uploadRequired: !litigationCaseSubCaseDocument.documentTemplate?.optional,
    };
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    console.log('onUploadFileEvent ::', event);
    if (!event) return;
    this.outputIUploadMultiFile = event;
    // this.litigationCaseSubCaseDocuments.find(dto => dto.documentTemplate?.documentName === event.docu);
  }

  initPage() {
    this.litigationCaseDto = this.suitService.litigationCaseDetail;
    this.uploadMultiInfo = {
      cif: this.taskService?.taskDetail?.customerId || this.lawsuitService?.currentLitigation?.customerId || '',
      taskId: this.taskService?.taskDetail?.id?.toString(),
      litigationId: this.litigationCaseDto?.litigationId,
    };

    this.persons = this.litigationCaseDto?.persons ?? [];
    this.personSelection.select(...(this.litigationCaseDto.persons?.map(dto => dto.personId ?? '') ?? []));

    // this.litigationCaseSubCaseDto = this.litigationCaseDto?.litigationCaseSubCase?.find(dto => dto.id === this.subCaseId) ?? {};
    this.litigationCaseSubCaseDto =
      this.litigationCaseDto?.litigationCaseSubCase?.find(dto => dto.statusSubCase !== 'FINISH') ?? {};
    this.litigationCaseSubCaseDocuments = this.litigationCaseSubCaseDto?.litigationCaseSubCaseDocuments ?? [];
    /* taskCode กับ statusCode ใช้สำหรับใช้เป็นเงื่อนไข แต่ละ Designed UI เท่านั้น */
    this.statusCode = this.suitService.statusCodeFromTask as statusCode | null;
    this.taskCode = this.suitService.taskCodeFromTask;

    this.dataCourtLevel = this.litigationCaseDto?.courtLevel ?? 'CIVIL'; /* default is not right but sobeit */
    this.dataAppealSide = this.litigationCaseDto?.appealSide ?? 'BANK'; /* default is not right but sobeit */

    if (this.isFromRefLink) {
      /* block: for set data (mode: View) */
      if (this.litigationCaseDto?.litigationCaseSubCase) {
        this.litigationCaseSubCaseDto = this.litigationCaseDto?.litigationCaseSubCase[0] || {};
        this.dataCourtLevel = this.litigationCaseSubCaseDto.courtLevel ?? 'CIVIL';
        this.litigationCaseSubCaseDocuments = this.litigationCaseSubCaseDto?.litigationCaseSubCaseDocuments ?? [];
      }
      this.statusCode = null;
      this.taskCode = null;
    }

    this.convertedDocs = (this.litigationCaseSubCaseDocuments ?? []).map(dto => this.convertSubCaseDocsToDocs(dto));

    this.isViewMode = !this.statusCode || !this.taskCode;
    this.isDocViewMode =
      (this.taskCode === 'RECORD_OF_SUPREME_COURT' && this.statusCode === 'AWAITING') ||
      (this.taskCode === 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE' && this.statusCode === 'PENDING') ||
      this.isViewMode;
    this.isPersonShowSelection = this.statusCode === 'IN_PROGRESS' && this.taskCode === 'RECORD_OF_SUPREME_COURT';

    this.dataForm = this.suitService.generateEfilingForm(
      { ...this.litigationCaseDto },
      { ...this.litigationCaseSubCaseDto }
    );

    /* content 3 */
    this.isViewModePart1 = !(
      this.taskCode === 'RECORD_OF_APPEAL' ||
      (this.taskCode === 'RECORD_OF_SUPREME_COURT' && this.statusCode !== 'AWAITING')
    );

    /* content 4 */
    // โชว์กล่องมัั้ย
    this.isViewModeContent4 =
      this.dataAppealSide === 'BANK' &&
      this.dataCourtLevel === 'SUPREME' &&
      !(this.statusCode === 'PENDING' && this.taskCode === 'RECORD_OF_SUPREME_COURT');
    if (this.isViewModeContent4) {
      let res = this.courtOrderList.find(courtDto => courtDto.value === this.litigationCaseSubCaseDto.courtOrder);
      this.courtOrderTextContent4 = res ? `${res?.name}` : '-';
    }
    /* content 5 */
    this.isViewModeContent5 = this.isViewModePart1;
    if (this.isViewModeContent5) {
      let res = this.courtList.find(courtDto => courtDto.value === this.litigationCaseSubCaseDto.courtCode);
      this.courtTextContent5 = res ? `${res?.name}` : '-';
      res = this.suspensExecutionList.find(dto => dto.value === this.litigationCaseSubCaseDto.respiteCase);
      this.suspensExecutionTextContent5 = res ? `${res?.name}` : '-';
    }

    this.actionBar = this.setActionBar();
    this.litigationId = !this.statusCode ? (this.litigationCaseDto?.litigationId ?? null) : null;
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit ::');
    if (!!this.dataForm) this.dataForm.markAsPristine();
    this.cd.detectChanges();
  }

  formIsValid() {
    // check validate persons
    if (this.isPersonShowSelection && this.persons?.length > 0 && this.personSelection.selected.length < 1)
      return false;

    // check validate documents
    console.log('validate documents ::');
    if (!this.isDocViewMode) {
      // ถ้า docs ของเก่า(litigationCaseSubCaseDocuments) มีตัวนึงที่ไม่มี imageId -> ไปเช็ค outputIUploadMultiFile imageId ว่ามาครบมั้ย
      if (
        !!this.litigationCaseSubCaseDocuments.find(
          dto => (dto.imageId ?? '') === '' && dto?.documentTemplate?.optional === false
        )
      ) {
        if (!this.outputIUploadMultiFile) return false;
        if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
          return false;
        }
      } else {
        // ถ้า docs ของเก่า(litigationCaseSubCaseDocuments) imageId ทุกตัว -> ไปเช็ค outputIUploadMultiFile imageId ว่าเป็น null หรือ imageId ครบ
        if (!!this.outputIUploadMultiFile) {
          if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
            return false;
          }
        }
      }
    }

    // form
    let caseDate = this.dataForm.get('caseDate')?.valid;
    let capitalAmount = this.dataForm.get('capitalAmount')?.valid;
    let courtCode = this.dataForm.get('courtCode')?.valid;
    let courtOrder = this.dataForm.get('courtOrder')?.valid;
    let submitDate = this.dataForm.get('submitDate')?.valid;
    let courtOrderDate = this.dataForm.get('courtOrderDate')?.valid;
    let respiteCase = this.dataForm.get('respiteCase')?.valid;
    switch (this.taskCode) {
      case 'RECORD_OF_APPEAL':
        switch (this.statusCode) {
          case 'PENDING':
            return caseDate && capitalAmount && courtCode;
          case 'IN_PROGRESS':
            return (
              caseDate && capitalAmount && courtCode && (!this.litigationCaseSubCaseDto.requestDefer || respiteCase)
            );
        }
        break;
      case 'RECORD_OF_SUPREME_COURT':
        switch (this.statusCode) {
          case 'PENDING':
            return caseDate && capitalAmount && submitDate && courtCode;
          case 'IN_PROGRESS':
            return (
              caseDate && capitalAmount && courtCode && (!this.litigationCaseSubCaseDto.requestDefer || respiteCase)
            );
          case 'AWAITING':
            return courtOrderDate && courtOrder;
        }
        break;
    }
    return false;
  }

  async save() {
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();

    if (this.formIsValid()) {
      this.dataForm.markAsPristine();
      /* set fields */
      if (this.dataForm.get('caseDate')?.valid)
        this.litigationCaseSubCaseDto.caseDate = this.dataForm.get('caseDate')?.value;
      if (this.dataForm.get('capitalAmount')?.valid)
        this.litigationCaseSubCaseDto.capitalAmount = this.dataForm.get('capitalAmount')?.value;
      if (this.dataForm.get('courtCode')?.valid)
        this.litigationCaseSubCaseDto.courtCode = this.dataForm.get('courtCode')?.value;
      if (this.dataForm.get('courtOrder')?.valid)
        this.litigationCaseSubCaseDto.courtOrder = this.dataForm.get('courtOrder')?.value;
      if (this.dataForm.get('submitDate')?.valid)
        this.litigationCaseSubCaseDto.submitDate = this.dataForm.get('submitDate')?.value;
      if (this.dataForm.get('courtOrderDate')?.valid)
        this.litigationCaseSubCaseDto.courtOrderDate = this.dataForm.get('courtOrderDate')?.value;
      if (this.dataForm.get('reason')?.valid) this.litigationCaseSubCaseDto.reason = this.dataForm.get('reason')?.value;
      if (this.dataForm.get('respiteCase')?.valid)
        this.litigationCaseSubCaseDto.respiteCase = this.dataForm.get('respiteCase')?.value;
      /* set documents */
      if (
        !this.isDocViewMode &&
        (this.litigationCaseSubCaseDocuments?.length ?? 0) > 0 &&
        !!this.litigationCaseSubCaseDocuments.find(dto => dto.imageId ?? '' === '')
      ) {
        for (let i in this.outputIUploadMultiFile) {
          this.litigationCaseSubCaseDocuments[i] = {
            ...this.litigationCaseSubCaseDocuments[i],
            imageId: this.outputIUploadMultiFile[i].imageId ?? '',
          };
        }
        this.litigationCaseSubCaseDto.litigationCaseSubCaseDocuments = [...this.litigationCaseSubCaseDocuments];
      }
      /* set persons */
      const selectedPersonDtos = this.persons?.filter(dto =>
        this.personSelection.selected.includes(dto.personId ?? '')
      ) ?? [...(this.persons ?? [])];

      this.suitService.updateLitigationCaseDetail = {
        ...this.litigationCaseDto,
        persons: selectedPersonDtos,
        litigationCaseSubCase: [this.litigationCaseSubCaseDto],
      };

      this.isSuccessForm = true;

      this.suitService.hasEdit = true;

      console.log('updateLitigationCaseDetail after save ::', this.suitService.updateLitigationCaseDetail);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant(`LAWSUIT.SUIT_EFILING_FORM.SUCCESS_MSG_SAVE.${this.statusCode}_${this.taskCode}`)}`
      );
      this.back();
    }
  }

  cancel() {
    this.back();
  }

  back() {
    this.routerService.back();
  }

  isSuccessForm: boolean = false;
  async canDeactivate() {
    if (
      this.isSuccessForm ||
      (!!!this.dataForm.dirty &&
        !this.outputIUploadMultiFile &&
        this.personSelection.selected.length === this.persons?.length)
    ) {
      return true;
    }
    return await this.sessionService.confirmExitWithoutSave();
  }

  /* Logic: person table selection */
  isAllpersonSelected() {
    const numSelected = this.personSelection.selected.length;
    let numRows = this.persons.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllpersonSelected()) {
      this.personSelection.clear();
      return;
    }
    this.personSelection.select(...this.persons.map(dto => dto.personId ?? ''));
  }
}
