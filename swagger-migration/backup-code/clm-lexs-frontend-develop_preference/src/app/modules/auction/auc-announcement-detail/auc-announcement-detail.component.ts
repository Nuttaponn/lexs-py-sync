import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoggerService } from '@app/shared/services/logger.service';
import { AuctionDetails, DocumentDto, InquiryAnnouncesResponse } from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Component({
  selector: 'app-auc-announcement-detail',
  templateUrl: './auc-announcement-detail.component.html',
  styleUrls: ['./auc-announcement-detail.component.scss'],
})
export class AucAnnouncementDetailComponent implements OnInit {
  public isAnnouncement: boolean = false;
  public isViewMode: boolean = true;
  public anouncementDetail: InquiryAnnouncesResponse | undefined;
  public dataAuctionCollaterals: AuctionDetails[] = [];

  auctionCaseTypeCode: string = '';
  constructor(
    private logger: LoggerService,
    public auctionService: AuctionService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.auctionCaseTypeCode  = this.auctionService.auctionCaseTypeCode ?? '';
    this.anouncementDetail = this.auctionService.selectAnouncementDetail;
    this.dataAuctionCollaterals = this.auctionService.auctionCollaterals?.auctionCollaterals || [];
    this.logger.info('[AucAnnouncementDetailComponent][ngOnInit]', this.dataAuctionCollaterals);
    this.auctionService.genaralForm = this.auctionService.getGenaralDeatailForm(this.anouncementDetail);

    if(this.anouncementDetail?.aucStatus && !['COMPLETE', 'NOT_PROCEED'].includes(this.anouncementDetail?.aucStatus)) {
      this.isViewMode = false;
    } else {
      this.isViewMode = true;
    }

    if(this.auctionService.selectAnouncementDetail?.announceDocument && this.auctionService.selectAnouncementDetail?.announceDocument?.length > 0) {
      const _announceDocument = this.auctionService.selectAnouncementDetail?.announceDocument[0];
      this.auctionService.genaralForm.addControl('aucBiddingDocuments', this.fb.control([
        {
          documentDate: '',
          documentId: _announceDocument?.documentId || 0,
          documentTemplate: {
            documentName: 'ประกาศขายทอดตลาด',
            documentTemplateId: DOC_TEMPLATE.LEXSF137,
            optional: false,
          },
          imageSource: DocumentDto.ImageSourceEnum.Lexs,
          imageId: _announceDocument?.imageId || '',
          imageName: 'ประกาศขายทอดตลาด',
          uploadTimestamp: _announceDocument?.uploadTimestamp || '',
          reuploadable: _announceDocument?.reuploadable || false,
          active: true,
          documentTemplateId: DOC_TEMPLATE.LEXSF137,
          uploadRequired: true,
          removeDocument: true
        }
      ]));
    } else {
      this.auctionService.genaralForm.addControl(
        'aucBiddingDocuments',
        this.fb.control([
          {
            documentDate: '',
            documentId: 0,
            active: true,
            documentTemplate: {
              documentName: 'ประกาศขายทอดตลาด',
              documentTemplateId: DOC_TEMPLATE.LEXSF137,
              optional: false,
            },
            documentTemplateId: DOC_TEMPLATE.LEXSF137,
            imageName: 'ประกาศขายทอดตลาด',
            imageSource: DocumentDto.ImageSourceEnum.Lexs,
            uploadRequired: true,
            removeDocument: true
          },
        ])
      );
    }
    this.auctionService.genaralForm.updateValueAndValidity();

  }
}
