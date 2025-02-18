import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { IUploadMultiFile, IUploadMultiInfo, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { RouterService } from '@app/shared/services/router.service';
import { AucBiddingDeedGroup, AucBiddingDocument, LatestPublicAuctionBiddingResponse } from '@lexs/lexs-client';
import { TableAuctionModel, columnNameType } from '../auction.model';
import { AuctionService } from '../auction.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';

@Component({
  selector: 'app-auction-result-info',
  templateUrl: './auction-result-info.component.html',
  styleUrls: ['./auction-result-info.component.scss'],
})
export class AuctionResultInfoComponent implements OnInit {
  public mode = 'EDIT';
  public isUpdated = true;
  public collaterals: Array<AucBiddingDeedGroup> = [];
  public taskCode!: taskCode;
  public litigationCaseId: string = '';
  public auctionBidingInfo: LatestPublicAuctionBiddingResponse | undefined;
  public documentUpload: IUploadMultiFile[] = [];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public auctionSubmitResultForm!: UntypedFormGroup;

  get displayProcessingDocument() {
    return [taskCode.R2E09_04_01_11].includes(this.taskCode);
  }
  get displayGroupCollateralList() {
    return [taskCode.R2E09_05_01_12A, taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  get isOwnerTask() {
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }
  public tableColumns: TableAuctionModel[] = [
    {
      colName: columnNameType.selection,
      hideCol: false,
    },
    {
      colName: columnNameType.orderNumber,
      hideCol: false,
    },
    {
      colName: columnNameType.fsubbidnum,
      hideCol: false,
      isHyperlink: true,
      hyperlinkKey: 'view_group',
    },
    {
      colName: columnNameType.resolution,
      hideCol: false,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.resolution,
    },
    {
      colName: columnNameType.saletypedesc,
      hideCol: false,
    },
    {
      colName: columnNameType.maxPrice,
      hideCol: false,
      isNumber: true,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.maxPrice,
    },
    {
      colName: columnNameType.minPrice,
      hideCol: false,
      isNumber: true,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.minPrice,
    },
    {
      colName: columnNameType.totalAppraisalValue,
      hideCol: false,
      isNumber: true,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.totalAppraisalValue,
    },
    {
      colName: columnNameType.effectiveDateTo,
      hideCol: false,
      isDate: true,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.effectiveDateTo,
    },
    {
      colName: columnNameType.npaResolutionDocument,
      hideCol: false,
      isHyperlink: true,
      hasSubValue: true,
      mainValue: columnNameType.npaResolutionSummary,
      subValue: columnNameType.npaResolutionDocument,
      hyperlinkKey: 'view_doc',
    },
    {
      colName: columnNameType.action,
      hideCol: false,
    },
  ];
  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private auctionService: AuctionService,
    private litigationCaseService: LitigationCaseService,
    private notificationService: NotificationService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
    this.initData();
    this.forceView();
  }

  private forceView() {
    if (!this.isOwnerTask || !this.auctionService.hasSubmitPermission) {
      this.mode = 'VIEW';
    }
  }

  private initData() {
    this.auctionBidingInfo = this.auctionService.auctionBidingInfoResponse;
    this.collaterals = this.auctionBidingInfo?.aucBiddingDeedGroups || [];
    this.initUploadDocument();
    this.subscribeAttendAuctionFlag();
  }

  private subscribeAttendAuctionFlag() {
    this.auctionSubmitResultForm?.get('attendAuctionFlag')?.valueChanges.subscribe(async val => {
      console.log('AuctionResultInfoComponent', val);
      if (val === true) {
        const processingFiles = this.auctionService?.auctionSubmitResultForm?.getRawValue();
        const soldDocument = processingFiles?.aucBiddingDocuments?.find(
          (it: IUploadMultiFile) => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF138
        ) as IUploadMultiFile;
        if (!soldDocument.imageId) {
          this.notificationService.alertDialog(
            'ไม่สามารถระบุหมายเหตุทนายความไปดูแลการขายได้',
            `เนื่องจากยังไม่ได้อัปโหลดเอกสาร “รายงานการขาย“<br/>กรุณาอัปโหลดเอกสารก่อนเลือก checkbox`,
            'รับทราบ',
            ''
          );
          this.auctionSubmitResultForm?.get('attendAuctionFlag')?.setValue(false);
        }
      }
    });
  }

  submitAuctionResult(data?: any) {
    this.auctionService.auctionBidingInfoCollateralSelected = data;
    const destination = this.auctionService.routeCorrection('auction-detail');
    this.routerService.navigateTo(destination, {
      hideContentHeader: true,
      aucRef: this.auctionBidingInfo?.aucRef,
      deedGroupId: data.deedGroupId,
      mode: data.action !== 'UPDATE' || this.mode === 'VIEW' ? 'VIEW' : 'EDIT',
      itemActionCode: data.action,
    });
  }

  initUploadDocument() {
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
      auctionBiddingId: this.taskService.taskDetail.objectId,
    };
    const responseUploadDoc = this.auctionBidingInfo?.aucBiddingDocuments || [];
    this.documentUpload = responseUploadDoc?.map(it => {
      return {
        documentTemplate: it.documentTemplate,
        documentTemplateId: it.documentTemplate?.documentTemplateId?.toString(),
        imageId: it.imageId,
        uploadDate: it.uploadTimestamp,
        uploadRequired: !it?.documentTemplate?.optional,
        indexOnly: true,
        active: it?.reuploadable === false ? it?.reuploadable : true,
        removeDocument: true,
      } as IUploadMultiFile;
    });
    this.auctionService.auctionSubmitResultForm = this.auctionService.getAuctionSubmitResultForm(
      this.documentUpload,
      this.auctionBidingInfo?.attendAuctionFlag
    );
    this.auctionSubmitResultForm = this.auctionService.auctionSubmitResultForm;
  }

  async updateData(e: any) {
    const aucBiddingId = this.taskService.taskDetail?.objectId || '';
    const response = await this.auctionService.getAuctionBidingInfo(aucBiddingId);
    this.auctionService.auctionBidingInfoResponse = response || {};
    this.initData();
    this.isUpdated = false;
    setTimeout(() => {
      this.isUpdated = true;
    });
  }

  async uploadFileEvent($event: IUploadMultiFile[] | null) {
    const originalFile137 = this.auctionService.auctionBidingInfoResponse?.aucBiddingDocuments?.find(
      it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF137
    );
    const originalFile138 = this.auctionService.auctionBidingInfoResponse?.aucBiddingDocuments?.find(
      it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF138
    );
    const newFile137 = $event?.find(it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF137);
    const newFile138 = $event?.find(it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF138);
    const aucBiddingId = this.taskService.taskDetail.objectId || '';
    if (originalFile137?.imageId && !newFile137?.imageId) {
      // TODO delete file 137
      await this.auctionService.postDeleteBiddingsDocumentsUpload(
        aucBiddingId,
        newFile137?.documentTemplate?.documentGroup || '',
        newFile137?.documentTemplate?.documentTemplateId || ''
      );
    }
    if (originalFile138?.imageId && !newFile138?.imageId) {
      // TODO delete file 138
      await this.auctionService.postDeleteBiddingsDocumentsUpload(
        aucBiddingId,
        newFile138?.documentTemplate?.documentGroup || '',
        newFile138?.documentTemplate?.documentTemplateId || ''
      );
    }
    this.documentUpload = $event || [];
    this.auctionService.auctionSubmitResultForm = this.auctionService.getAuctionSubmitResultForm(
      this.documentUpload,
      false
    );
    this.auctionSubmitResultForm = this.auctionService.auctionSubmitResultForm;
    this.subscribeAttendAuctionFlag();
    const mappingBackDocument =
      $event?.map(it => {
        return {
          ...it,
          uploadTimestamp: it.uploadDate,
        } as AucBiddingDocument;
      }) || [];
    this.auctionService.auctionBidingInfoResponse = {
      ...this.auctionService.auctionBidingInfoResponse,
      aucBiddingDocuments: mappingBackDocument,
    };
  }
}
