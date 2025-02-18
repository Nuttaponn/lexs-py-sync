import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuctionControllerService, AuctionLexsSeizureDto, DocumentDto, NameValuePair, CreateAnnounceResponse, DeedGroupMatchDetail, DeedMatchDetail, AnnounceValidateRequest, AuctionCreateAnnounceSubmitResponse, AuctionCreateAnnounceSubmitRequest, UploadTrackingRequest, AnnounceMatchDetail, AnnounceMatchDetailRes, DeedMatchDetailRes } from '@lexs/lexs-client';
import { LoggerService } from '@app/shared/services/logger.service';
import { AuctionService } from '../auction.service';
import { DeedMatchDetailEtx } from '../auction.model';
import { NotificationService } from '@app/shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class NewAuctionService {
  public createAnnounceResponse: CreateAnnounceResponse | undefined = undefined; // main-data

  // auctionCreateAnnounceSubmitRequest: AuctionCreateAnnounceSubmitRequest | undefined = undefined;

  // aucRef: Number = -1;
  private generalDetailForm!: FormGroup;
  private deedMatchDetailForm!: FormGroup;
  private deedGroupMatchDetailForm!: FormGroup;
  get generalDetailFormGroup() {
    return this.generalDetailForm;
  }
  get deedMatchDetailFormGroup() {
    return this.deedMatchDetailForm;
  }
  get deedGroupMatchDetailFormGroup() {
    return this.deedGroupMatchDetailForm
  }
  // get matchStatus() {
  //   return this.createAnnounceResponse?.matchStatus;
  // }
  private matchStatusSubject = new BehaviorSubject<string | undefined>(undefined);
  public matchStatus$ = this.matchStatusSubject.asObservable();
  private currentMatchStatus: string | undefined = undefined;

  get aucRef() {
    return this.createAnnounceResponse?.aucRef ?? 0;
  }

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private fb: FormBuilder,
    private auctionControllerService: AuctionControllerService,
    private logger: LoggerService,
    private auctionService: AuctionService,
    private notificationService: NotificationService,
  ) {}

  async setNewAuctionServiceData() {
    this.clearData();

    const detail = this.auctionService.selectAnouncementDetail;
    // const response = await this.auctionService.getAuctionCollateral(Number(detail?.aucRef));
    const response = await this.getCreateAnnounce(Number(detail?.aucRef));
    this.createAnnounceResponse = response;

    this.createAnnounceResponse.matchStatus = this.createAnnounceResponse.matchStatus;

    // Notify subscribers, eg. AucManualAnnouncementStepperComponent
    this.matchStatusSubject.next(this.createAnnounceResponse.matchStatus);
    // Use the current value directly after updating it
    this.currentMatchStatus = this.matchStatusSubject.getValue();
    this.logger.info('setNewAuctionServiceData :: matchStatus', this.currentMatchStatus);

    this.generateForms(response);
  }

  manualSetMatchStatus(status: AuctionCreateAnnounceSubmitRequest.MatchStatusEnum) {
    this.matchStatusSubject.next(status);
    this.currentMatchStatus = this.matchStatusSubject.getValue();
  }

  clearData() {
    this.createAnnounceResponse = undefined;
    // this.auctionCreateAnnounceSubmitRequest = undefined;
    // this.aucRef = -1;
    this.matchStatusSubject.next(undefined); // Reset matchStatus
    this.currentMatchStatus = undefined;
    this.deedMatchDetailForm?.reset();
    this.deedGroupMatchDetailForm?.reset();
    this.generalDetailForm?.reset();
  }

  public generateForms(data: CreateAnnounceResponse) {
    // step1
    this.generalDetailForm = this.getGenaralDetailForm(data);
    this.logger.info('step1: generalDetailForm', this.generalDetailForm.value)

    this.deedMatchDetailForm = this.generateDeedMatchDetailForm(data?.deedMatchDetail || []);
    this.logger.info('step1: deedMatchDetailForm', this.deedMatchDetailForm.value)

    // step2
    this.deedGroupMatchDetailForm = this.generateDeedGroupMatchDetailForm(data?.deedGroupMatchDetail || []);
    this.logger.info('step2: deedGroupMatchDetailForm', this.deedGroupMatchDetailForm.value)
  }

  public isFormsDirty(status: AuctionCreateAnnounceSubmitRequest.MatchStatusEnum) {
    switch (status) {
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce:
        return this.generalDetailForm.dirty || this.deedMatchDetailForm.dirty;
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup:
        return this.deedGroupMatchDetailForm.dirty;
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewValidate:
        return false;
      default:
        return false;
    }
  }

  public setFormsToPristine() {
    this.generalDetailForm.markAsPristine();
    this.deedMatchDetailForm.markAsPristine();
    this.deedGroupMatchDetailForm.markAsPristine();
  }

  validateForms() {
    switch (this.currentMatchStatus) {
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce:
        // console.log(this.deedMatchDetailFormGroup.value)
        this.generalDetailFormGroup.markAllAsTouched();
        this.deedMatchDetailFormGroup.markAllAsTouched();
        const isDocumentValid = this.generalDetailFormGroup.value.aucBiddingDocuments
          .filter((doc: DocumentDto) => doc.documentTemplate?.optional === false)
          .every((doc: DocumentDto) => doc.imageId)
        if (!isDocumentValid) {
          this.generalDetailForm.get('aucBiddingDocuments')?.setValue(
            this.generalDetailForm.get('aucBiddingDocuments')?.value.map((doc: DocumentDto) => {
              return {
                ...doc,
                isSubmited: true, // !doc.documentTemplate?.optional && !doc.imageId,
              }
            })
          );
        }
        return this.generalDetailFormGroup.valid && this.deedMatchDetailFormGroup.valid && isDocumentValid;
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup:
        this.deedGroupMatchDetailFormGroup.markAllAsTouched();
        return this.deedGroupMatchDetailFormGroup.valid;
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewValidate:
        return this.deedGroupMatchDetailFormGroup.valid;
      default:
        return false;
    }
  }

  getAuctionCreateAnnounceSubmitRequest(headerFlag: AuctionCreateAnnounceSubmitRequest.HeaderFlagEnum, ): AuctionCreateAnnounceSubmitRequest {
    let req: AuctionCreateAnnounceSubmitRequest = {
      headerFlag,
      matchStatus: this.currentMatchStatus as AuctionCreateAnnounceSubmitRequest.MatchStatusEnum,
      caseMatchDetail: {
        // caseType: this.createAnnounceResponse?.caseMatchDetail?.caseType,
        aucLot: this.generalDetailFormGroup?.value?.aucLot,
        aucSet: this.generalDetailFormGroup?.value?.aucSet,
        fbidnum: this.generalDetailFormGroup?.value?.fbidnum,
      },
      /*
      announceMatchDetail: {
        isExhibition: this.generalDetailFormGroup?.value?.isExhibition,
        saleChannel: this.generalDetailFormGroup?.value?.saleChannel,
        saleLocation1: this.generalDetailFormGroup?.value?.saleLocation1,
        saleTime1: this.generalDetailFormGroup?.value?.saleTime1,
        saleLocation2: this.generalDetailFormGroup?.value?.saleLocation2,
        saleTime2: this.generalDetailFormGroup?.value?.saleTime2,
        bidDates: this.generalDetailFormGroup?.value?.dataDateList,
      },
      deedMatchDetail:
        this.deedMatchDetailFormGroup.value.deedMatchDetails.map(
          (deed: DeedMatchDetailRes) => {
            return {
              fsubbidnum: deed.fsubbidnum,
              occupant: deed.occupant,
              remark: deed.remark,
              isExclude: deed.isExclude,
              ledName: deed.ledName,
            }
          })
      ,
      deedGroupMatchDetail: [
        ...this.deedGroupMatchDetailFormGroup.value.deedGroupMatchDetails
      ]
      */
    }

    switch (this.currentMatchStatus) {
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce:
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup:
        req = {
          ...req,
          announceMatchDetail: {
            isExhibition: this.generalDetailFormGroup?.value?.isExhibition,
            saleChannel: this.generalDetailFormGroup?.value?.saleChannel,
            saleLocation1: this.generalDetailFormGroup?.value?.saleLocation1,
            saleTime1: this.generalDetailFormGroup?.value?.saleTime1,
            saleLocation2: this.generalDetailFormGroup?.value?.saleLocation2,
            saleTime2: this.generalDetailFormGroup?.value?.saleTime2,
            bidDates: this.generalDetailFormGroup?.value?.dataDateList
              .filter((data: { bidDate: string }) => data.bidDate), // fixed LEX2-46454: just filter out empty date
          },
          deedMatchDetail:
            this.deedMatchDetailFormGroup.value.deedMatchDetails.map(
              (deed: DeedMatchDetailRes) => {
                return {
                  collateralId: deed.collateralId,
                  fsubbidnum: deed.fsubbidnum,
                  occupant: deed.occupant,
                  remark: deed.remark,
                  isExclude: deed.isExclude,
                  ledName: deed.ledName,
                }
              }
            ).filter((deed: DeedMatchDetailEtx) => !deed.isExclude),
          deedGroupMatchDetail: [
            ...this.deedGroupMatchDetailFormGroup.value.deedGroupMatchDetails
          ]
        }
        break;
      case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewValidate:
        break
    }

    return req;
  }
  // ######################## forms for step 1 ########################
  private getGenaralDetailForm(data: CreateAnnounceResponse) {
    const announceMatchDetailRes: AnnounceMatchDetailRes = data?.announceMatchDetail || {};

    return this.fb.group({
      // announceDate: data?.announceDate,
      // announceDocument: [data?.announceDocument],
      // aucLedSeq: data.aucLedSeq,
      aucLot: data?.caseMatchDetail?.aucLot || '',
      aucRef: data?.aucRef || '',
      aucSet: data?.caseMatchDetail?.aucSet || '',
      // aucStatus: data.aucStatus,
      // aucStatusName: data.aucStatusName,
      // auctionMatchingLogs: [data.auctionMatchingLogs],
      // defendantName: data.defendantName,
      fbidnum: data?.caseMatchDetail?.fbidnum || '',
      // inputDate: data.inputDate,
      // isExhibit: data.isExhibit,
      // lawCourtId: data.lawCourtId,
      // lawCourtName: data.lawCourtName,
      // ledId: data.ledId,
      // ledName: data.ledName,
      // litigationCaseId: data.litigationCaseId,
      // litigationId: data.litigationId,
      // matchingStatus: data.matchingStatus,
      // matchingStatusName: data.matchingStatusName,
      // plaintiffName: data.plaintiffName,
      // redCaseNo: data.redCaseNo,
      saleChannel: [data?.announceMatchDetail?.saleChannel || 'ขายแบบธรรมดา', Validators.required],
      isExhibition: [data?.announceMatchDetail?.isExhibition ?? false, Validators.required],
      saleLocation1: data?.announceMatchDetail?.saleLocation1 || '',
      saleTime1: data?.announceMatchDetail?.saleTime1 || '',
      saleLocation2: data?.announceMatchDetail?.saleLocation2 || '',
      saleTime2: data?.announceMatchDetail?.saleTime2 || '',
      dataDateList:
        (data?.announceMatchDetail?.bidDates?.length ?? 0) > 0 ?
        this.fb.array(
          data?.announceMatchDetail?.bidDates?.map(bidDate =>
            this.fb.group({
              bidDate: [bidDate.bidDate, Validators.required],
              number: [bidDate.number, Validators.required],
            })
          ) || []
        ) :
        // FIY incoming sprint, this will be 3 atleast plus add and remove button.
        //      for now, hardcode 6, if BE doesn't provide 'bidDates' data.
        this.fb.array([
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [1, Validators.required],
            }
          ),
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [2, Validators.required],
            }
          ),
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [3, Validators.required],
            }
          ),
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [4, Validators.required],
            }
          ),
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [5, Validators.required],
            }
          ),
          this.fb.group(
            {
              bidDate: ['', Validators.required],
              number: [6, Validators.required],
            }
          ),
        ]),
      aucBiddingDocuments:
      // data?.announceMatchDetail?.aucBiddingDocuments ?
      // [data?.announceMatchDetail?.aucBiddingDocuments] :

      [
        // {
        //   documentDate: '',
        //   documentId: 0,
        //   active: true,
        //   documentTemplate: {
        //     documentName: 'ประกาศขายทอดตลาด',
        //     documentTemplateId: DOC_TEMPLATE.LEXSF052,
        //     optional: false,
        //   },
        //   documentTemplateId: DOC_TEMPLATE.LEXSF052,
        //   imageName: 'ประกาศขายทอดตลาด',
        //   imageSource: DocumentDto.ImageSourceEnum.Lexs,
        //   uploadRequired: true,
        // },
        [{
          documentDate: announceMatchDetailRes?.document?.uploadTimestamp,
          documentId: announceMatchDetailRes?.document?.documentId,
          active: true,
          documentTemplate: {
            documentName: announceMatchDetailRes?.document?.documentTemplate?.documentName,
            documentTemplateId: announceMatchDetailRes?.document?.documentTemplate?.documentTemplateId,
            optional: announceMatchDetailRes?.document?.documentTemplate?.optional,
          },
          documentTemplateId: announceMatchDetailRes?.document?.documentTemplate?.documentTemplateId,
          imageName: announceMatchDetailRes?.document?.imageName,
          imageId: announceMatchDetailRes?.document?.imageId,
          uploadRequired: !announceMatchDetailRes?.document?.documentTemplate?.optional,
          isSubmited: false,
        }]
      ],
    });
  }

  private generateDeedMatchDetailForm(data: AnnounceMatchDetailRes[]) {
    return this.fb.group({
      deedMatchDetails: this.fb.array(
        data.map(deed => this.generateDeedMatchDetailFormGroup(deed)
    )),
    })
  }
  private generateDeedMatchDetailFormGroup(data: DeedMatchDetailRes) {
    const fg = this.fb.group({
      collateralId: [data.collateralId || null, Validators.required],
      fsubbidnum: [data.fsubbidnum, Validators.required],
      occupant: [data.occupant || null, Validators.required],
      remark: [data.remark || null],
      isExclude: [data.isExclude || false],



      assettypedesc: [data.collateralTypeDesc || null], // ประเภททรัพย์
      collateralSubTypeDesc: [data.collateralSubTypeDesc || null], // ประเภททรัพย์ย่อย
      collateralDocNo: [data.documentNo || null], // เลขที่เอกสารสิทธิ์
      // ledOriginalDeedno: [data.ledOriginalDeedno || data.collateralDocNo || null],
      assetDetail: [data.description || null], // รายละเอียดทรัพย์
      redCaseNo: [data.redCaseNo || null], // คดีหมายเลขแดง
      saletypedesc: [ /*data.saletypedesc ||*/ null], // วิธีการขาย
      debtname: [data.obligationBy || null], // ผู้รับจำนอง
      ownername: [data.ownerFullName || null], // ชื่อผู้ถือกรรมสิทธิ์
      plaintiffname: [data.plaintiffName || null], // โจทก์
      lexsDefendant: [data.defendant || null], // จำเลย
      ledName: [data.ledName || null], // สำนักงานบังคับคดี
    })
    /*
    fg.controls['assettypedesc'].disable();
    fg.controls['landtype'].disable();
    fg.controls['collateralDocNo'].disable();
    fg.controls['assetDetail'].disable();
    fg.controls['redCaseNo'].disable();
    fg.controls['saletypedesc'].disable();
    fg.controls['debtname'].disable();
    fg.controls['ownername'].disable();
    fg.controls['plaintiffname'].disable();
    fg.controls['lexsDefendant'].disable();
    fg.controls['ledOriginalName'].disable();
    fg.controls['ledName'].disable();
    */
    return fg
  }

  // ######################## forms for step 2 ########################
  public generateDeedGroupMatchDetailForm(data: DeedGroupMatchDetail[]) {
    return this.fb.group({
      deedGroupMatchDetails: this.fb.array(
        data.map(deed => this.generateDeedGroupMatchDetailFormGroup(deed)
      )),
    })
  }
  private generateDeedGroupMatchDetailFormGroup(data: DeedGroupMatchDetail) {
    return this.fb.group({
      fsubbidnum: [data.fsubbidnum],
      totalDeeds: [data.totalDeeds],
      saleTypeDesc: [data.saleTypeDesc || null, Validators.required],
      reservefund: [data.reservefund || null],
      reservefund1: [data.reservefund1 || null, Validators.required],
      assetPrice2: [data.assetPrice2 || null],
      assetPrice3: [data.assetPrice3 || null, Validators.required],
      assetPrice4: [data.assetPrice4 || null],
      assetPrice5: [data.assetPrice5 || null],
    })
  }
  // ##################################################################

  public updateValidators(row: AbstractControl, controlNames: string[], add: boolean): void {
    controlNames.forEach((controlName) => {
      const control = row.get(controlName);
      if (!control) return;

      if (add) {
        control.addValidators(Validators.required);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    });
  }

  async getValidateAnnounce(req: AnnounceValidateRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(
        this.auctionControllerService.getValidateAnnounce(req)
      )
    );
  }

  async getCreateAnnounce(aucRef: number): Promise<CreateAnnounceResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getCreateAnnounce(aucRef)),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  async postCreateAnnounceSubmit(aucRef: number, request: AuctionCreateAnnounceSubmitRequest): Promise<AuctionCreateAnnounceSubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(
        this.auctionControllerService.submitCreateAnnounce(aucRef, request)
      ),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  // Helper to map and remove duplicates
  public mapToNameValuePair(
    data: AuctionLexsSeizureDto[],
    nameKey: keyof AuctionLexsSeizureDto,
    valueKey: keyof AuctionLexsSeizureDto
  ): NameValuePair[] {
    const uniqueMap = new Map<string, NameValuePair>();

    data.forEach((item) => {
      const name = item[nameKey]?.toString() || '';
      const value = item[valueKey]?.toString() || '';
      if (name && value) {
        uniqueMap.set(value, { name, value });
      }
    });

    return Array.from(uniqueMap.values());
  }

  documentUpload(aucRef: number, documentTemplateId: string, documentGroup: string, file?: Blob) {
    return this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(
        this.auctionControllerService.documentUpload(aucRef, documentTemplateId, documentGroup, file)
      )
    );
  }
}
