import { Component, OnInit } from '@angular/core';
import { DetailsHeader } from '@app/modules/auction/auction.const';
import { IUploadMultiFile, IUploadMultiInfo, taskCode } from '@app/shared/models';
import { TaskService } from '@app/modules/task/services/task.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { SeizurePropertyService } from '../seizure-property.service';
import { relationMapper } from '@app/modules/customer/customer.constant';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { NonPledgePropertiesInfoProcessingDoc } from '@lexs/lexs-client';

@Component({
  selector: 'app-non-pledge-properties-document',
  templateUrl: './non-pledge-properties-document.component.html',
  styleUrls: ['./non-pledge-properties-document.component.scss'],
})
export class NonPledgePropertiesDocumentComponent implements OnInit {
  public processingDocument: any = [];
  public display: Array<any> = ['documentName', 'uploadDate'];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public taskCode!: taskCode;

  private tooltipLEXSD002Title = 'เอกสารบุคคลธรรมดา';
  private tooltipLEXSD002Content = '1.สำเนาบัตรประชาชน/passport<br>2.สำเนาทะเบียนบ้าน<br>3.สำเนาใบทะเบียนสมรส';
  private tooltipLEXSD001Title = 'เอกสารนิติบุคคล';
  private tooltipLEXSD001Content =
    '1.หนังสือรับรองการจดทะเบียนเป็นนิติบุคคล<br>2.สำเนาบัตรประชาชน/passport  ของผู้มีอำนาจลงนาม';

  constructor(
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private seizurePropertyService: SeizurePropertyService
  ) {}

  ngOnInit(): void {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
    };
    this.prepareData();
  }

  prepareData() {
    let processingDocument = this.seizurePropertyService?.seizureDTO?.processingDocument || [];
    let document: { [key: string]: Array<any> } = this.groupBy(processingDocument, 'relation', 'documentType');
    let processing: IUploadMultiFile;
    let count: number = 0;
    let expand = true; //[taskCode.R2E05_08_3A, taskCode.R2E05_07_2A,taskCode.R2E05_09_4].includes(this.taskCode);

    for (const i in document) {
      let details: DetailsHeader[] = [];
      let title = 'ลำดับที่ ';
      let documents = document[i].map((m: any) => {
        m.documentDate = m.uploadTimestamp;
        const isTooltipDoc = [
          DOC_TEMPLATE.LEXSD002,
          DOC_TEMPLATE.LEXSD002_1,
          DOC_TEMPLATE.LEXSD002_2,
          DOC_TEMPLATE.LEXSD001,
        ].includes(m.documentTemplate?.documentTemplateId || '');
        let toolTipTitle = '';
        let toolTipContent = '';
        if ([DOC_TEMPLATE.LEXSD001].includes(m.documentTemplate?.documentTemplateId || '')) {
          toolTipTitle = this.tooltipLEXSD001Title;
          toolTipContent = this.tooltipLEXSD001Content;
        } else if (
          [DOC_TEMPLATE.LEXSD002_1, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD002].includes(
            m.documentTemplate?.documentTemplateId || ''
          )
        ) {
          toolTipTitle = this.tooltipLEXSD002Title;
          toolTipContent = this.tooltipLEXSD002Content;
        }
        return {
          ...m,
          tooltip: isTooltipDoc,
          paramsMsg: [{ title: toolTipTitle, content: toolTipContent }],
          documentTemplateId: m.documentTemplate?.documentTemplateId,
        };
      });

      const switchKeys = i.split('_');
      switchKeys.pop();
      const _key = switchKeys.join('_');
      switch (_key) {
        case 'ACCOUNT':
          count++;
          processing = {
            ...document[i][0],
            title: title + count,
            details: [
              {
                name: '',
                value: 'เอกสารบัญชี',
              },
            ],
            documents: documents,
            expand: expand,
          };
          this.processingDocument.push(processing);
          break;
        case 'CASE':
          count++;
          processing = {
            ...document[i][0],
            details: [
              {
                name: '',
                value: 'เอกสารเกี่ยวกับการดำเนินคดี',
              },
            ],
            documents: documents,
            title: title + count,
            expand: expand,
          };
          this.processingDocument.push(processing);
          break;
        case 'CO_BORROWER':
        case 'MAIN_BORROWER':
        case 'GUARANTOR':
        case 'COLLATERAL_OWNER':
        case 'MAIN_BORROWER_HEIR':
        case 'CO_BORROWER_HEIR':
        case 'GUARANTOR_HEIR':
        case 'MAIN_BORROWER_TRUSTEE':
        case 'CO_BORROWER_TRUSTEE':
        case 'GUARANTOR_TRUSTEE':
        case 'STAND_IN_PAYER':
        case 'DEBT_ACCEPTOR':
        case 'DEBT_ACCEPT_SIGNER':
        case 'CO_DEFENDANT':
          count++;
          const isDisplayCif = ['CO_BORROWER', 'MAIN_BORROWER', 'GUARANTOR'].includes(i);
          details = [
            {
              name: isDisplayCif ? 'CIF No.' : 'เลขประจำตัวประชาชน/\nเลขประจำตัวผู้เสียภาษี',
              value: isDisplayCif ? document[i][0]?.cifNo : document[i][0]?.taxId,
            },
            {
              name: 'ชื่อ-นามสกุล',
              value: document[i][0]?.name,
            },
            {
              name: 'สถานะจำเลย',
              value: relationMapper.get(document[i][0]?.relation),
            },
          ];
          processing = {
            ...document[i][0],
            details: details,
            documents: documents,
            title: title + count,
            expand: expand,
          };
          this.processingDocument.push(processing);
          break;

        default:
          break;
      }
    }
  }

  groupBy(objArray: any[], property: string, secondProp: string) {
    return objArray.reduce((acc, cur) => {
      const cifNo = cur['cifNo'] || cur['taxId'];
      let key = '';
      let key2 = '';
      if (cur[property]) {
        key = `${cur[property]}_${cifNo}`;
      } else if (cur[secondProp]) {
        key2 = `${cur[secondProp]}_${cifNo}`;
      }
      if (key) {
        if (!acc[key]) acc[key] = [];
        acc[key].push(cur);
      } else if (!key && key2) {
        if (!acc[key2]) acc[key2] = [];
        acc[key2].push(cur);
      }
      return acc;
    }, {});
  }
}
