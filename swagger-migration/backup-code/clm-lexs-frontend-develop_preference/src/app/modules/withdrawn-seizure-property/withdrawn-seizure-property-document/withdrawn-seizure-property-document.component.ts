import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { IUploadMultiFile, BlobType, FileType, IUploadMultiInfo, WithDrawnSeizureConfig } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { LitigationCasePersonDto, SuspendAuctionDocumentRequest } from '@lexs/lexs-client';
import {
  WithdrawAssetColumns,
  WithdrawnCollateralColumns,
  WithdrawnPersonColumns,
} from '../withdrawn-seizure-property-select/withdrawn-seizure-property-select.model';
import { WithdrawnSeizureViewModel } from '../withdrawn-seizure-property.model';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { Utils } from '@app/shared/utils';

@Component({
  selector: 'app-withdrawn-seizure-property-document',
  templateUrl: './withdrawn-seizure-property-document.component.html',
  styleUrls: ['./withdrawn-seizure-property-document.component.scss'],
})
export class WithdrawnSeizurePropertyDocumentComponent implements OnInit {
  public messageBanner1 = 'WITHDRAWN_SEIZURE_PROPERTY.COLLATERAL.DOCUMENT_TITLE_BANNER';
  public messageBanner2 =
    'กรุณาเตรียมสำเนาบัตรประชาชนของเจ้าของกรรมสิทธิ์ หรือ เอกสารรับรองนิติบุคคลฉบับรับรองสำเนาถูกต้อง เพื่อส่งให้กับทนายความ';
  public messageReturnBaner = `กรุณาตรวจสอบและอัปเดตข้อมูลการถอนยึดทรัพย์ และกด “เสร็จสิ้น” เพื่อดำเนินการต่อ<br>เหตุผลในการขอแก้ไข: `;
  public returnReason = '';
  public messageBannerDownload = `กรุณาดาวน์โหลด “<span class="bold">เอกสารยินยอมให้โจทก์แถลงงดการขาย</span>” เพื่อให้เจ้าของกรรมสิทธิ์ลงนาม`;
  public downloadBtn = `<span class="bold">ดาวน์โหลดเอกสารยินยอมให้โจทก์แถลงงดการขาย<span>`;

  public persons: LitigationCasePersonDto[] = [];
  public assetColumns: string[] = WithdrawAssetColumns;
  public collateralColumns: string[] = WithdrawnCollateralColumns;
  public lgPersonColumn: string[] = WithdrawnPersonColumns;

  public propertyDataSources: WithdrawnSeizureViewModel[] = [];
  public contactDataSources: WithdrawnSeizureViewModel[] = [];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public tableConfig: WithDrawnSeizureConfig = {
    propertyConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: false,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: false,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawnCollateralColumns,
      hasUploadDocument: true,
      hasTitleTotal: true,
    },
    assetConfig: {
      mode: 'VIEW',
      hasHeaderTitle: true,
      hasAction: false,
      hasViewContact: true,
      hasEditContact: false,
      hasAdd: false,
      hasDelete: false,
      hasSelect: false,
      hasEdit: false,
      hasTitle: true,
      titleText: '',
      hasGroupDelete: false,
      tableColumns: WithdrawAssetColumns,
      hasUploadDocument: true,
      hasTitleTotal: true,
    },
    contactConfig: {
      hasAction: false,
      hasAdd: false,
      hasDelete: false,
      hasEdit: false,
      hasTitle: true,
      layout: 'row',
    },
  };

  constructor(
    private logger: LoggerService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private lawsuitService: LawsuitService
  ) {}

  ngOnInit(): void {
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
    };
    this.returnReason = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.rejectReason || '';
    this.getCollateralTable();
  }

  getCollateralTable() {
    this.logger.info(
      'getCollateralTable WithdrawnSeizurePropertyDocumentComponent',
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse
    );
    this.withdrawnSeizurePropertyService.clearWithdrawnSeizureUploadForm();
    this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.reset();
    this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
      let groupName = '';
      let groupId = '';
      if (item.contacts && item.contacts.length > 0) {
        const mainContact = item.contacts.find((it, i) => it.isMainContact === true || i == 0);
        groupName = `${mainContact?.firstName} ${mainContact?.lastName}`;
        groupId = item.withdrawSeizuresGroupId?.toString() || mainContact?.personId || '';
      }
      if ((item.collaterals && item.collaterals?.length > 0) || (item.assets && item.assets?.length > 0)) {
        this.propertyDataSources.push({
          groupName: groupName,
          groupId: groupId,
          collaterals: [...(item?.collaterals || [])],
          contactPersons: [...(item?.contacts || [])],
          asset: [...(item?.assets || [])],
          consentDocuments: [...(item?.consentDocuments || [])],
        });
      }
      if (item.consentDocuments && item.consentDocuments?.length > 0) {
        item.consentDocuments.forEach(doc => {
          this.withdrawnSeizurePropertyService.addFileValidateControl(!!doc?.document?.imageId);
        });
      }
    });
  }

  async downLoadForm() {
    this.logger.info('downLoadForm WithdrawnSeizurePropertySelectComponent');
    const collaterals = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.flatMap(
      item => item.collaterals
    );
    const payload: SuspendAuctionDocumentRequest = {
      suspendAuctionCollateralDtos: collaterals?.map((data: any) => {
        return {
          ledId: data.ledId,
          collateralId: data?.collateralId,
        };
      }),
      customerId:
        this.litigationCaseService?.litigationCaseShortDetail?.cifNo ||
        this.lawsuitService?.currentLitigation?.customerId,
      documentDownloadState: SuspendAuctionDocumentRequest.DocumentDownloadStateEnum.WithdrawSeizure,
      withdrawSeizureId: this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureId,
    };
    const response = await this.withdrawnSeizurePropertyService.downloadSuspendAuctionTemplate(payload);
    Utils.saveAsStrToBlobFile(response, 'เอกสารยินยอมให้โจทก์แถลงงดการขาย' + FileType.DOCX_SHEET, BlobType.DOCX_SHEET);
  }

  getControls(index: number) {
    return (this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.get('files') as UntypedFormArray).controls[
      index
    ] as UntypedFormGroup;
  }

  getControlsAsset(index: number) {
    return (this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.get('filesAsset') as UntypedFormArray)
      .controls[index] as UntypedFormGroup;
  }
  uploadFileEvent(e: IUploadMultiFile[], group: WithdrawnSeizureViewModel) {
    this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.markAsTouched();
    console.log('e', e);
    console.log(
      'this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups',
      this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups
    );
    this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.withdrawSeizureGroups?.forEach(item => {
      const mainContact = item.contacts?.find((it, i) => it.isMainContact === true || i == 0);
      const groupName = `${mainContact?.firstName} ${mainContact?.lastName}`;
      if (group?.groupName.trim() === groupName.trim()) {
        let listdata: any = [];
        item.consentDocuments?.forEach(x => {
          let data: any = e.find(p => p.attributes?.id === x.id);
          if (data) {
            x = {
              ...x,
              document: {
                imageId: data.imageId,
              },
              id: data.attributes?.id,
              collList: data.attributes?.collateralIds,
              uploadSessionId: data.imageId,
            };
            listdata.push(x);
          }
        });
        let idList = listdata.map((v: any) => v.id);
        let existList = item.consentDocuments?.filter(item => !idList.includes(item.id)) || [];
        item.consentDocuments = [...existList, ...listdata];
        console.log('item.consentDocuments', item.consentDocuments);
      }
    });
  }
}
