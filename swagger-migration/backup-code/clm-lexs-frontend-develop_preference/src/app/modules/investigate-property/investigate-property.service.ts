import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import {
  AssetInvestigationControllerService,
  AssetInvestigationDocument,
  AssetInvestigationLitigationCaseCreateInfoResponse,
  AssetInvestigationLitigationInfoResponse,
  AssetInvestigationPersons,
  AssetInvestigationSaveRequest,
} from '@lexs/lexs-client';
import { TaskService } from '@modules/task/services/task.service';
import { lastValueFrom } from 'rxjs';
import { taskCode } from '@app/shared/models';
import { DOC_TEMPLATE, ERROR_CODE } from '@app/shared/constant';

@Injectable({
  providedIn: 'root',
})
export class InvestigatePropertyService {
  actionCode!: string;
  taskCode?: string;
  ledId!: string;
  actionType!: string;
  aucRef!: number;
  mode!: string;
  litigationId!: string | number;
  litigationCaseId!: string | number;
  taskLedName!: string | number;
  hasSubmitPermission = false;
  litigationCaseSeqNo!: string;

  assetInvestigationCreateInfo!: AssetInvestigationLitigationCaseCreateInfoResponse;
  assetInvestigationInfo!: AssetInvestigationLitigationInfoResponse;

  constructor(
    private fb: UntypedFormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private taskService: TaskService,
    private assetInvestigationControllerService: AssetInvestigationControllerService
  ) {}

  clearData(): void {
    // this.assetInvestigationCreateInfo = {}
    this.taskCode = '' as taskCode;
    this.assetInvestigationInfo = {};
    this.taskService.clearData();
    this.assetInvestigationForm?.reset();
  }

  async postAssetInvestigationSave(
    litigationCaseId: number,
    assetInvestigationSaveRequest: AssetInvestigationSaveRequest,
    assetInvestigationId?: number
  ) {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.assetInvestigationControllerService.postAssetInvestigationSave(
            litigationCaseId,
            assetInvestigationSaveRequest,
            assetInvestigationId
          )
        ),
      {
        showDialogForSpecificCodes: [ERROR_CODE.EAI007, ERROR_CODE.EAI004],
        notShowAsSnackBar: true,
      }
    );
  }

  async postAssetInvestigationSubmit(assetInvestigationId: number) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.assetInvestigationControllerService.postAssetInvestigationSubmit(assetInvestigationId)),
      {
        showDialogForSpecificCodes: [ERROR_CODE.EAI007, ERROR_CODE.EAI004],
        notShowAsSnackBar: true,
      }
    );
  }

  async postAssetInvestigationCancel(assetInvestigationId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.assetInvestigationControllerService.postAssetInvestigationCancel(assetInvestigationId))
    );
  }

  async getAssetInvestigationLitigationInfo(assetInvestigationId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.assetInvestigationControllerService.getAssetInvestigationLitigationInfo(assetInvestigationId))
    );
  }

  async getAssetInvestigationLitigationCreateInfo(assetInvestigationId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.assetInvestigationControllerService.getAssetInvestigationLitigationCreateInfo(assetInvestigationId)
      )
    );
  }

  public assetInvestigationForm!: UntypedFormGroup;
  getAssetInvestigationForm(data?: any) {
    if (data) {
      const persons: any[] = data.persons || [];
      const deathPersons = persons
        .filter(it => it.personStatus === 'DEATH')
        .sort((a, b) => a.personSeqNo - b.personSeqNo);
      const alivePersons = persons
        .filter(it => it.personStatus !== 'DEATH')
        .sort((a, b) => a.personSeqNo - b.personSeqNo);
      const newListPersons = [...alivePersons, ...deathPersons];
      return this.fb.group({
        reasonCode: [data?.reasonCode || '', Validators.required],
        reasonDesc: [data?.reasonDesc || ''],
        remark: [data?.remark || '', data?.reasonCode === '6' ? Validators.required : null],
        assetInvestigationId: [data?.assetInvestigationId],
        litigationDocuments: [data?.litigationDocuments],
        persons: this.getPersonsForm(newListPersons),
      });
    } else {
      return this.fb.group({
        reasonCode: ['', Validators.required],
        reasonDesc: [],
        remark: [''],
        assetInvestigationId: [null],
        litigationDocuments: [],
        persons: [],
      });
    }
  }

  getPersonsForm(persons: Array<AssetInvestigationPersons>) {
    let arrayCtrl = this.fb.array([]);
    if (persons.length > 0) {
      for (let index = 0; index < persons.length; index++) {
        const element = persons[index];
        arrayCtrl.push(
          this.fb.group({
            activeFlag: [element.activeFlag],
            cifNo: [element.cifNo],
            name: [element.name],
            orderedRecentlyFlag: [element.orderedRecentlyFlag],
            personDocuments: this.getPersonsDocumentForm(element.personDocuments || [], element.personStatus),
            personId: [element.personId],
            personSeqNo: [element.personSeqNo],
            personStatus: [element.personStatus],
            relatedLitigations: [element.relatedLitigations],
            relation: [element.relation],
            taxNo: [element.taxNo],
          })
        );
      }
    }
    return arrayCtrl;
  }

  getPersonsDocumentForm(document: Array<AssetInvestigationDocument>, personStatus: any) {
    let arrayCtrl = this.fb.array([]);
    if (document.length > 0) {
      const hasLEXSD002_1 =
        document.filter(
          it =>
            [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD001, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
              it.documentTemplate?.documentTemplateId || ''
            ) && it.originalDocument === true
        ).length > 0;
      if (hasLEXSD002_1) {
        document = document.filter(
          it =>
            !(
              [DOC_TEMPLATE.LEXSD002, DOC_TEMPLATE.LEXSD001, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002_1].includes(
                it.documentTemplate?.documentTemplateId || ''
              ) && it.originalDocument !== true
            )
        );
      }
      for (let index = 0; index < document.length; index++) {
        const element = document[index];
        arrayCtrl.push(
          this.fb.group({
            documentId: [element.documentId],
            documentSeqNo: [element.documentSeqNo],
            documentTemplate: [element.documentTemplate],
            imageId: [element.imageId],
            imageName: [element.imageName],
            imageSource: [element.imageSource],
            originalDocument: [element.originalDocument],
            uploadTimestamp: [element.uploadTimestamp],
          })
        );
      }
      if (personStatus !== 'DEATH') {
        arrayCtrl.addValidators(this.uploadedDocumentValidator());
      }
    }
    return arrayCtrl;
  }
  uploadedDocumentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value as AssetInvestigationDocument[];
      console.log(files);
      if (!!files && files.length > 0) {
        const hasNonUploadMandatoryFile = files.filter(it => !it.documentTemplate?.optional && !it.imageId);
        if (hasNonUploadMandatoryFile.length > 0) {
          return { uploadedDocumentCompletedError: true };
        } else {
          return null;
        }
      }
      return null;
    };
  }
}
