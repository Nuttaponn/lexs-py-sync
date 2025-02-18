import { Injectable } from '@angular/core';
import {
  AccountDocumentDto,
  AccountDocumentsResponse,
  DocumentDto,
  LitigationCaseCollaterals,
  LitigationCaseControllerService,
  LitigationCaseDocumentsResponse,
  LitigationCaseShortDto,
  SeizureControllerService,
  SeizureLitigationCaseControllerService,
  CollateralsPrepDraftResponse,
  CollateralsResponse,
  LitigationCasePersonsDto,
  LitigationCaseRelatedLGIDDto,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class LitigationCaseService {
  private _listCollaterals: Array<LitigationCaseCollaterals> = [];

  public get listCollaterals(): any {
    return this._listCollaterals;
  }
  public set listCollaterals(value: any) {
    this._listCollaterals = value;
  }

  private _litigationCaseShortDetail!: LitigationCaseShortDto;
  public get litigationCaseShortDetail(): LitigationCaseShortDto {
    return this._litigationCaseShortDetail;
  }
  public set litigationCaseShortDetail(value: LitigationCaseShortDto) {
    this._litigationCaseShortDetail = value;
  }

  private _litigationCaseDocuments!: Array<DocumentDto>;
  public get litigationCaseDocuments(): Array<DocumentDto> {
    return this._litigationCaseDocuments;
  }
  public set litigationCaseDocuments(value: Array<DocumentDto>) {
    this._litigationCaseDocuments = value;
  }

  private _accountDocuments!: Array<AccountDocumentDto>;
  public get accountDocuments(): Array<AccountDocumentDto> {
    return this._accountDocuments;
  }
  public set accountDocuments(value: Array<AccountDocumentDto>) {
    this._accountDocuments = value;
  }

  private _accountDocumentsFormatted!: Array<AccountDocumentDto>;
  public get accountDocumentsFormatted(): Array<AccountDocumentDto> {
    return this._accountDocumentsFormatted;
  }
  public set accountDocumentsFormatted(value: Array<AccountDocumentDto>) {
    this._accountDocumentsFormatted = value;
  }

  private _documentsCollaterals!: CollateralsResponse;
  public get documentsCollaterals(): CollateralsResponse {
    return this._documentsCollaterals;
  }
  public set documentsCollaterals(value: CollateralsResponse) {
    this._documentsCollaterals = value;
  }
  private _litigationCasePersons!: LitigationCasePersonsDto;
  public get litigationCasePersons(): LitigationCasePersonsDto {
    return this._litigationCasePersons;
  }
  public set litigationCasePersons(value: LitigationCasePersonsDto) {
    this._litigationCasePersons = value;
  }

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private seizureControllerService: SeizureControllerService,
    private seizureLitigationCaseControllerService: SeizureLitigationCaseControllerService,
    private litigationCaseControllerService: LitigationCaseControllerService
  ) {}

  async getLitigationCaseShortDetail(id: number): Promise<LitigationCaseShortDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCaseShortDetail(id))
    );
  }

  async getLitigationCaseDocuments(caseId: number): Promise<LitigationCaseDocumentsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCaseDocuments(caseId))
    );
  }

  async getLitigationCaseAccountDocuments(caseId: number): Promise<AccountDocumentsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCaseAccountDocuments(caseId))
    );
  }

  async getLitigationCaseCollaterals(caseId: number): Promise<CollateralsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getLitigationCaseCollaterals(caseId))
    );
  }
  async getLitigationCaseCollateralsSeizurePrepDraft(caseId: number): Promise<CollateralsPrepDraftResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureLitigationCaseControllerService.getLitigationCaseCollateralsSeizurePrepDraft(caseId))
    );
  }

  async getCollateralAppraisal(caseId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.seizureControllerService.getCollateralAppraisal(caseId))
    );
  }

  async getLitigationCasePersons(caseId: number): Promise<LitigationCasePersonsDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCasePersons(caseId))
    );
  }

  async getLitigationCaseRelatedLGIDList(litigationCaseId: number): Promise<LitigationCaseRelatedLGIDDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCaseRelatedLGIDList(litigationCaseId))
    );
  }

}
