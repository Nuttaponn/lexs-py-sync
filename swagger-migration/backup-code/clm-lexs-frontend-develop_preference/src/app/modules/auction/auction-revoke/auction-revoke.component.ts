import { Component, OnInit } from '@angular/core';
import { AuctionLedCardRevokeSaleDialogComponent } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card-revoke-sale-dialog/auction-led-card-revoke-sale-dialog.component';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { DocumentDto } from '@lexs/lexs-client';
import { SimpleSelectOption } from '@spig/core';
import { mockCollaterals } from 'mock/data/auction/auction.mock';
import { AuctionMenu } from '../auction.model';
import { AuctionService } from '../auction.service';
import { DetailsHeader } from '../auction.const';

@Component({
  selector: 'app-auction-revoke',
  templateUrl: './auction-revoke.component.html',
  styleUrls: ['./auction-revoke.component.scss'],
})
export class AuctionRevokeComponent implements OnInit {
  constructor(
    private auctionService: AuctionService,
    private notificationService: NotificationService,
    private documentService: DocumentService
  ) {}

  isEditMode: boolean = false;

  isOpened: boolean = true;
  expandedCollateralDetail: boolean = true;
  expandedCollateralSets: boolean = true;

  documentList1: IUploadMultiFile[] = [];
  documentList2: IUploadMultiFile[] = [];
  documentList3: IUploadMultiFile[] = [];
  appraisalDocuments: DocumentDto[] = [];
  dropdownOptions1: SimpleSelectOption[] = [];
  dropdownOptions2: SimpleSelectOption[] = [];
  dropdownOptions3: SimpleSelectOption[] = [];
  dropdownOptions4: SimpleSelectOption[] = [];

  expandedDocuments: boolean[] = [true, true, true, true];

  documentColumns: string[] = ['documentName', 'uploadDate'];
  appraisalColumns: string[] = ['order', 'documentName', 'collateralId', 'documentNo', 'appraisalDate'];
  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  collaterals: any[] = [];

  collateralSetsHeaderDetail: DetailsHeader[] = [
    {
      name: 'กรอกข้อมูลแล้ว',
      value: '0',
    },
    {
      name: 'รอกรอกข้อมูล',
      value: '0',
    },
  ];

  ngOnInit(): void {
    if ((this.auctionService.auctionMenu = AuctionMenu.REVOKE)) this.isEditMode = true;
    this.collaterals = this.auctionService.selectedCollateralsForRevocation.map((c: any, i: number) => ({
      collateralId: c.collateralId,
      order: i + 1,
      fsubbidnum: c.fsubbidnum,
      revokeReason: c.revokeReason || '',
    }));
    this.countHasReason();

    this.dropdownOptions1 = this.initDropdownOptions(this.documentList1.length);
    this.dropdownOptions2 = this.initDropdownOptions(this.documentList2.length);
    this.dropdownOptions3 = this.initDropdownOptions(this.documentList3.length);
    this.dropdownOptions4 = this.initDropdownOptions(this.appraisalDocuments.length);
  }

  onCollateralChange(event: any[]) {
    this.collaterals = event;
    this.auctionService.selectedCollateralsForRevocation = this.collaterals;
    this.countHasReason();
  }

  countHasReason() {
    let hasReasonCount = 0;
    this.collaterals.forEach(c => {
      if (c.revokeReason && c.revokeReason !== '') hasReasonCount++;
    });
    this.collateralSetsHeaderDetail[0].value = hasReasonCount.toString();
    this.collateralSetsHeaderDetail[1].value = (this.collaterals.length - hasReasonCount).toString();
  }

  get isReasonReady() {
    return this.collaterals.every(c => c.revokeReason && c.revokeReason !== '');
  }

  async onAddCollateralClick() {
    const selectedCollateralIds = this.auctionService.selectedCollateralsForRevocation.map(c => c.collateralId);
    const res = await this.notificationService.showCustomDialog({
      component: AuctionLedCardRevokeSaleDialogComponent,
      title: 'เพิกถอนการขาย: สำนักงานบังคับคดีจังหวัดสมุทรสาคร', // TODO: why specific province?
      iconName: 'icon-Money-Cancel',
      rightButtonLabel: 'ยืนยันเลือกชุดทรัพย์',
      buttonIconName: 'icon-Checkmark-Circle-Regular',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      type: 'normal',
      autoWidth: false,
      context: {
        collaterals: mockCollaterals.filter(c => !selectedCollateralIds.includes(c.collateralId)),
      },
    });
    if (res && res.close) {
      this.auctionService.auctionMenu = AuctionMenu.REVOKE;
      this.auctionService.selectedCollateralsForRevocation =
        this.auctionService.selectedCollateralsForRevocation.concat(res.selected);
      this.collaterals = this.auctionService.selectedCollateralsForRevocation.map((c: any, i: number) => ({
        collateralId: c.collateralId,
        order: i + 1,
        fsubbidnum: c.fsubbidnum,
        revokeReason: c.revokeReason || '',
      }));
      this.countHasReason();
    }
  }

  async onViewDocument(index: number) {
    const fileName = this.appraisalDocuments[index].documentTemplate?.documentName ?? 'doc';
    const response: any =
      !!this.appraisalDocuments[index].imageId &&
      (await this.documentService.getDocument(
        this.appraisalDocuments[index].imageId || '',
        DocumentDto.ImageSourceEnum.Lexs
      ));
    if (!response) return;
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  initDropdownOptions(quantity: number) {
    const options = [];
    for (let i = 0; i < quantity; i++) {
      options.push({
        text: 'รายการ ' + (i + 1),
        value: i,
      });
    }
    return options;
  }
}
