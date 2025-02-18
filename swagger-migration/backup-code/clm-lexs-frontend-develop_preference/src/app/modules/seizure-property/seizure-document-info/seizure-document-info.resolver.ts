import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { PersonInfo } from '@lexs/lexs-client';
import { SeizurePropertyService } from '../seizure-property.service';
@Injectable({
  providedIn: 'root',
})
export class SeizureDocumentInfoResolver {
  public litigationCaseId: string = '';
  public seizureId: string = '';
  private taskCode!: taskCode;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private logger: LoggerService,
    private seizurePropertyService: SeizurePropertyService,
    private documentService: DocumentService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('SeizureDocumentInfoResolver');
    this.documentService.customer = this.taskService.taskDetail;
    let mode = this.seizurePropertyService.mode;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.litigationCaseId =
      route.queryParams['litigationCaseId'] ||
      route.parent?.parent?.data['seizureProperty']['litigationCaseId'] ||
      this.taskService.taskDetail?.litigationCaseId ||
      '';
    this.seizureId = route.parent?.parent?.data['seizureProperty']['seizureId'];

    const caseDocumentsResponse = await this.litigationCaseService.getLitigationCaseDocuments(
      Number(this.litigationCaseId)
    );
    this.litigationCaseService.litigationCaseDocuments = caseDocumentsResponse?.litigationCaseDocuments || [];
    const litigationCasePersonsDto = await this.litigationCaseService.getLitigationCasePersons(
      Number(this.litigationCaseId)
    );

    if (mode === 'EDIT' || this.taskCode === taskCode.R2E05_01_2D) {
      let collateralAppraisal = await this.seizurePropertyService.getCollateralAppraisal(Number(this.litigationCaseId));
      this.seizurePropertyService.docCollateralAppraisal = collateralAppraisal || [];
    }
    // GET /v1/seizure/${seizureId}/documents/collateral-appraisal
    if ([taskCode.R2E05_02_3C, taskCode.R2E05_03_3D, taskCode.R2E05_06_3F].includes(this.taskCode)) {
      let collateralAppraisal = await this.seizurePropertyService.getCollateralAppraisalSeizure(Number(this.seizureId));
      this.seizurePropertyService.docCollateralAppraisal = collateralAppraisal || [];
    }

    let docPerson = await this.seizurePropertyService.getSeizurePrepPerson(Number(this.litigationCaseId));
    this.seizurePropertyService.docmentPerson = docPerson.documents || [];

    if (mode === 'EDIT') {
      if (this.taskCode === taskCode.R2E05_01_2D || mode === 'EDIT') {
        if (this.seizurePropertyService.documentsTitleDeed.length === 0) {
          let data = await this.seizurePropertyService.getSeizurePrepTitleDeed(Number(this.litigationCaseId));
          this.seizurePropertyService.documentsTitleDeed = data.titleDeedDocuments || [];
        }
      }
      if ([taskCode.R2E05_02_3C, taskCode.R2E05_03_3D, taskCode.R2E05_06_3F].includes(this.taskCode)) {
        let data = await this.seizurePropertyService.getSeizureDocumentsTitleDeed(this.seizureId);
        this.seizurePropertyService.seizureDocumentsTitleDeed = data.titleDeedDocuments || [];
      }
    } else if (mode === 'VIEW' && this.taskCode === 'R2E05-01-2D') {
      if (this.seizurePropertyService.documentsTitleDeed.length === 0) {
        let data = await this.seizurePropertyService.getSeizurePrepTitleDeed(Number(this.litigationCaseId));
        this.seizurePropertyService.documentsTitleDeed = data.titleDeedDocuments || [];
      }
    }

    if ([taskCode.R2E05_02_3C, taskCode.R2E05_03_3D, taskCode.R2E05_06_3F].includes(this.taskCode) || mode === 'VIEW') {
      const seizureId = this.taskService.taskDetail.objectId || this.seizureId || '0';
      if ((mode === 'VIEW' && this.taskCode !== taskCode.R2E05_01_2D) || mode === 'EDIT') {
        await this.seizurePropertyService.setSeizureDocumentsTitleDeed(false, seizureId);
      }
      if (this.taskCode === taskCode.R2E05_02_3C) {
        const exceesDocs = await this.seizurePropertyService.getExcessDocuments(seizureId);
        this.seizurePropertyService.excessDocuments = exceesDocs.excessDocuments || [];
      }
    }
    this.setDocumentCustomer(litigationCasePersonsDto);
    return true;
  }

  formatData(data: any): PersonInfo {
    let list = data.map((m: any) => {
      return { ...m.person, relation: m.litigationCaseRelation };
    });
    return list;
  }

  setDocumentCustomer(litigationCasePersonsDto: any) {
    this.documentService.customer = {
      personInfo: {
        persons: this.formatData(litigationCasePersonsDto.litigationCasePersons),
        additionalPersons: [],
      },
      documentInfo: {
        customerDocuments: this.seizurePropertyService.docmentPerson,
      },
    };
  }
}
