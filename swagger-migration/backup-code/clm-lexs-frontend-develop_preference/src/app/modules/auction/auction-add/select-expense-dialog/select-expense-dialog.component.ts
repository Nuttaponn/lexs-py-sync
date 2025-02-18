import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownConfig, NameValuePair } from '@spig/core';
import { NewAuctionService } from '../new-auction.service';
import { Subscription } from 'rxjs';
import { AuctionService } from '../../auction.service';
import { AnnounceValidateResponse, AuctionCreateAnnounceSubmitResponse, AuctionCreateAnnounceSubmitRequest, InquiryAnnouncesResponse, AnnounceValidateRequest } from '@lexs/lexs-client';
import { AuctionMathchingStatus, AuctionStatus, MAIN_ROUTES } from '@app/shared/constant';
import { auctionActionCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { ExternalDocumentsService } from '@app/modules/external-documents/external-documents.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-expense-dialog',
  // standalone: true,
  // imports: [],
  templateUrl: './select-expense-dialog.component.html',
  styleUrl: './select-expense-dialog.component.scss'
})
export class SelectExpenseDialogComponent implements OnInit {
  public defaultConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    // searchPlaceHolder: '',
    // searchWith: 'name',
  };
  public redCaseConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'คดีหมายเลขแดง',
  };
  redCase: NameValuePair[] = [
];
  public courtNameConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ชื่อศาล',
  };
  courtName: NameValuePair[] = [];
  public ledIdConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'สำนักงานบังคับคดี',
  };
  ledId: NameValuePair[] = [];

  // init form
  public newAuctionForm: FormGroup = this.initSearchControl();
  getControl(name: string): AbstractControl | null {
    return this.newAuctionForm?.get(name);
  }

  isShowWarningBanner = true;
  isShowExistingData = false;
  isShowErrorBanner = true;
  private subscriptions = new Subscription();

  public messageBanner = 'AUCTION.MSG_BANNER_SELECT_EXPENSE';
  public messageBannerError = 'AUCTION.MSG_BANNER_SELECT_EXPENSE_ERROR';
  public messageBannerAvailable = 'AUCTION.MSG_BANNER_SELECT_EXPENSE_AVAILABLE';
  constructor(
    private fb: FormBuilder,
    private newAuctionService: NewAuctionService,
    // private searchControllerService: SearchControllerService,
    // private preferenceService: PreferenceService,
    private masterDataService: MasterDataService,
    private auctionService: AuctionService,
    private routerService: RouterService,
    private externalDocumentService: ExternalDocumentsService,
    private dialogRef: MatDialogRef<SelectExpenseDialogComponent>,
    private translateService: TranslateService,
    private notificationService: NotificationService,
  ) {
    // this.addFocusListeners();
  }

  async ngOnInit() {
    await this.initDropdowns();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Unsubscribe all subscriptions when the component is destroyed
  }

  // Adds listeners to remove custom errors on focus or value changes
  addFocusListeners() {
    Object.keys(this.newAuctionForm.controls).forEach((key) => {
      const control = this.newAuctionForm.get(key);

      const sub = control?.valueChanges.subscribe(() => {
        // if (this.isShowExistingData) {
        this.isShowWarningBanner = true;
        this.isShowErrorBanner = false;
        this.isShowExistingData = false;
        // }
        // if (control.hasError('existed')) {
        //   const currentErrors = control.errors;
        //   delete currentErrors?.['existed']; // Remove 'dataExists' error
        //   control.setErrors(Object.keys(currentErrors || {}).length ? currentErrors : null);
        // }

      });

      if (sub) {
        this.subscriptions.add(sub); // Add each subscription to the manager
      }
    });
  }

  initSearchControl() {
    return this.fb.group({
      redCaseNo: ['', Validators.required],
      courtNo: ['', Validators.required],
      ledId: ['', Validators.required],
      aucLot: ['', Validators.required],
      aucSet: [''],
      fbidnum: [''],
    });
  }

  async dataContext(data: any) {
    // may not need
  }

  auctionValidationResponse!: AnnounceValidateResponse;
  auctionCreateAnnounceSubmitResponse!: AuctionCreateAnnounceSubmitResponse;
  isClickRouting = false;
  get returnData() {
    return {
      isExistingData: !this.auctionCreateAnnounceSubmitResponse,
      auctionValidationResponse: this.auctionValidationResponse,
      auctionCreateAnnounceSubmitResponse: this.auctionCreateAnnounceSubmitResponse,
    }
  }
  public async onClose(): Promise<boolean> {
    if (this.isClickRouting) {
      return true;
    }

    if (this.newAuctionForm.invalid) {
      this.newAuctionForm.markAllAsTouched();
      return false;
    }

    // call validate API
    try {
      const req0: AnnounceValidateRequest = {
        redCaseNo: this.getControl('redCaseNo')?.value,
        ledId: this.getControl('ledId')?.value,
        courtNo: this.getControl('courtNo')?.value,
        aucLot: this.getControl('aucLot')?.value,
        aucSet: this.getControl('aucSet')?.value,
        fbidnum: this.getControl('fbidnum')?.value,
      }

      const validateRes: AnnounceValidateResponse = await this.newAuctionService.getValidateAnnounce(req0);
      this.auctionValidationResponse = validateRes;

      //  In case cannot manual pair, if there is aucRef, show info-banner, else show error-banner
      if (!validateRes.validateStatus) {
        this.isShowWarningBanner = false;
        if (validateRes.aucRef) {
          this.isShowExistingData = true;
          this.isShowErrorBanner = false;
        } else {
          this.isShowExistingData = false;
          this.isShowErrorBanner = true;
        }

        return false;
      }

      const matchStatus = AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewCase;
      // const matchStatus: AuctionCreateAnnounceSubmitRequest.MatchStatusEnum =
      //   validateRes.matchingStatus as AuctionCreateAnnounceSubmitRequest.MatchStatusEnum;

      const req: AuctionCreateAnnounceSubmitRequest = {
        headerFlag: AuctionCreateAnnounceSubmitRequest.HeaderFlagEnum.Submit,
        matchStatus,
        caseMatchDetail: {
          redCaseNo: this.getControl('redCaseNo')?.value,
          ledId: this.getControl('ledId')?.value,
          courtNo: this.getControl('courtNo')?.value,
          aucLot: this.getControl('aucLot')?.value,
          aucSet: this.getControl('aucSet')?.value,
          fbidnum: this.getControl('fbidnum')?.value,
        }
      }
      const res: AuctionCreateAnnounceSubmitResponse = await this.newAuctionService.postCreateAnnounceSubmit(
        0, // create mode:: send 0
        req
      );
      this.auctionCreateAnnounceSubmitResponse = res;
      this.notificationService.openSnackbarSuccess(
        this.translateService.instant('MATCHING_PROPERTY.MATCHING_SUCCESS'))
      return true;
    } catch (error) {
      // this.handleErrorForAuction(error);
      return false;
    }
  }

  async onRouteToExistAuctionCase(auctionValidationResponse: AnnounceValidateResponse) {
   if (!auctionValidationResponse) return;

    const res = await this.externalDocumentService.getAuctionAnnounces(
      [
        auctionValidationResponse.aucStatus ?? '',
      ],
      [ auctionValidationResponse.matchingStatus ?? '' ],
      auctionValidationResponse.aucRef
    );

    this.actionClickToViewMode(res[0])
  }

  actionClickToViewMode(data: InquiryAnnouncesResponse) {
    let actionCode = '';
    let mode = '';
    switch (data.matchingStatus) {
      case AuctionMathchingStatus.PENDING_NEW_ANNOUNCE:
      case AuctionMathchingStatus.PENDING_NEW_DEEDGROUP:
      case AuctionMathchingStatus.PENDING_NEW_VALIDATE:
        actionCode = auctionActionCode.PENDING_NEW_DEEDGROUP;
        mode = 'VIEW';
        break
      default:
        /* logic from auc-...-finished
        mode = [AuctionStatus.NPA_SUBMIT, AuctionStatus.ADJUST_SUBMIT, AuctionStatus.PROCEED].includes(
          data.aucStatus as AuctionStatus
        ) || !this.hasSubmitPermission
          ? 'VIEW'
          : 'EDIT';
        */
        mode = 'VIEW';
        actionCode = auctionActionCode.R2E09_2_A
        break;
    }

    this.auctionService.selectAnouncementDetail = data;
    this.routerService.navigateTo(`${MAIN_ROUTES.EXTERNAL_DOCUMENTS}/auction`, {
      litigationId: data.litigationId || '',
      litigationCaseId: data.litigationCaseId || '',
      mode,
      actionCode,
      auctionCaseTypeCode: data?.caseType || '',
    });
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async initDropdowns() {
    const res = await this.auctionService.getAuctionLexsSeizures();

    if (res?.auctionLexsSeizures?.length) {
      this.redCase = this.newAuctionService.mapToNameValuePair(
        res.auctionLexsSeizures, 'redCaseNo', 'redCaseNo');
      // /v1/master-data/court
      // /v1/master-data/led
      // this.courtName = this.newAuctionService.mapToNameValuePair(
      //   res.auctionLexsSeizures, 'civilCourtName', 'civilCourtNo');
      this.courtName = (await this.masterDataService.court(false)).court || [];
      // this.ledId = this.newAuctionService.mapToNameValuePair(
      //   res.auctionLexsSeizures, 'ledName', 'ledId');
      this.ledId =  (await this.masterDataService.led()).leds?.map(l => ({
        name: l.ledName,
        value: l.ledId?.toString(),
      })) || [];
    }
  }
}
