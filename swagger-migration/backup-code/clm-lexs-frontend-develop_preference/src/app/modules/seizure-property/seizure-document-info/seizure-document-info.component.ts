import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { ReadyFor } from '@app/shared/components/document-preparation/interface/document';
import { CommonDocumentConfig, Mode, RelationTypes, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import {
  CollateralAppraisalDocumentDto,
  DocumentDto,
  Documents,
  ExcessDocument,
  GenerateCoverPageRequest,
  GetSeizurePrepTitleDeedDraftResponse,
  MeLexsUserDto,
  PostExcessDocumentRequest,
  RejectCoverPageGenerateRequest,
  RejectedReasonDto,
  RelatedCollateral,
  SeizureAmdCoverPageRequest,
} from '@lexs/lexs-client';
import { SeizurePropertyService } from '../seizure-property.service';
import { RejectedReasonDtoExtend, TitleDeedDocumentExtend } from './seizure-document-info.constant';

@Component({
  selector: 'app-seizure-document-info',
  templateUrl: './seizure-document-info.component.html',
  styleUrls: ['./seizure-document-info.component.scss'],
})
export class SeizureDocumentInfoComponent implements OnInit {
  public lgDocuments: DocumentDto[] = [];
  public isOpened = true;
  public isOpened1 = true;
  public MODE = Mode;
  public displayColl: Array<any> = [];
  public documentsTitleDeed: any = [];
  public personDocs = [];
  public documentsCollateralAppraisal: CollateralAppraisalDocumentDto[] = [];
  public mode: string = '';
  public taskCode!: taskCode;

  public actionOnScreen = {
    canDownload: false,
    canDownloadReturnOriginal: false,
    canSeeReceived: false,
    canRejectOriginal: false,
    canSeeSubMenu: false,
    canSeeExcessDoc: false,
  };
  public displayPerson: Array<any> = ['id', 'documentName', 'storeOrganization', 'copy'];
  public personConfig: CommonDocumentConfig = {
    title: 'ผู้กู้หลัก',
    isMain: false,
    forAsset: true,
    msgNotFound: 'ไม่มีรายการ',
  };
  public titleDeedConfig: CommonDocumentConfig = {
    title: 'เอกสารสิทธิ์',
    isMain: true,
    selectAll: false,
    showDropdown: true,
    forAsset: true,
    selectText: 'เลือกส่งทั้งหมด',
    requireMultipleRows: true,
    msgNotFound: 'ไม่มีรายการเอกสารสิทธิ์ที่เกี่ยวข้อง',
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
    canShowIcon: false,
    documentNumber: 0,
    totalDocuments: 0,
  };
  public readyForCollateral: ReadyFor = {
    readyForAsset: true,
  };
  public readyForLitigation: ReadyFor = {
    readyForAsset: true,
  };
  public readyForTitleDeed: ReadyFor = {
    readyForAsset: false,
  };
  public reportConfig: CommonDocumentConfig = {
    title: 'รายงานตรวจสภาพและประเมินราคา',
    isMain: true,
    canShowIcon: false,
    showDropdown: true,
    selectText: 'เลือกส่งทั้งหมด',
    forAsset: true,
    msgNotFound: 'ไม่มีเอกสารรายงานตรวจสภาพและประเมินราคาที่เกี่ยวข้อง',
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
  };
  public displayReport: Array<any> = ['id', 'documentName', 'collateralNo', 'collateralId', 'collateralDate', 'copy'];
  public displayOverDocs: string[] = ['index', 'documentName', 'pageCount', 'submittedTimestamp', 'action'];
  public currentUser!: MeLexsUserDto;

  private seizureId!: string;
  private litigationCaseId!: string;
  public selectedTitleDeed: GetSeizurePrepTitleDeedDraftResponse = {};
  public currentDocPerson: Array<RelationTypes> = [];
  public documentsApprovalDraft: Array<Documents> = [];
  public collateralIdList!: string[];
  public alreadyInit = false;

  constructor(
    private litigationCaseService: LitigationCaseService,
    public seizurePropertyService: SeizurePropertyService,
    private taskService: TaskService,
    private router: ActivatedRoute,
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private sessionService: SessionService
  ) {}

  get viewCollateralAppraisal() {
    return (
      this.seizurePropertyService.docCollateralAppraisal
        .flatMap(i => i.relatedCollateral as RelatedCollateral)
        .flatMap(i => i.collateralId as string) || []
    );
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    await this.initData();
    this.initPropOnScreen();
    this.getDisplayedColumns();
    this.seizurePropertyService.checkDocumentIsReady();
    this.alreadyInit = true;
  }

  get isOwnerTask() {
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  async initData() {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.litigationCaseId =
      this.taskService.taskDetail.litigationCaseId ||
      this.router.parent?.parent?.snapshot.paramMap.get('litigationCaseId') ||
      '';
    this.mode = this.taskCode ? '' : this.seizurePropertyService.mode;
    this.seizureId = this.taskService.taskDetail.objectId || '';
    this.collateralIdList = this.litigationCaseService.listCollaterals;
    if (
      (this.taskCode === taskCode.R2E05_01_2D && this.collateralIdList.length > 0) ||
      this.taskCode === taskCode.R2E05_03_3D ||
      this.taskCode === taskCode.R2E05_06_3F
    ) {
      this.selectedTitleDeed = await this.seizurePropertyService.getSeizurePrepTitleDeedDraft(
        Number(this.litigationCaseId)
      );
      if (this.taskCode === taskCode.R2E05_03_3D || this.taskCode === taskCode.R2E05_06_3F) {
        this.documentsTitleDeed = this.prepareData(this.seizurePropertyService.seizureDocumentsTitleDeed, 'TITLEDEED');
      } else {
        this.documentsTitleDeed = this.prepareData(this.seizurePropertyService.documentsTitleDeed, 'TITLEDEED');
      }
    } else if (this.taskCode === taskCode.R2E05_02_3C) {
      let docApprove = await this.seizurePropertyService.getDocumentsApprovalDraft(Number(this.seizureId));
      this.documentsApprovalDraft = docApprove.documents || [];
      this.documentsTitleDeed = this.prepareData(this.seizurePropertyService.seizureDocumentsTitleDeed, 'TITLEDEED');
      this.excessDocuments = this.seizurePropertyService.excessDocuments || [];
    } else if (this.mode === 'VIEW' || this.mode === 'EDIT' || this.taskCode === taskCode.R2E05_06_3F) {
      this.documentsTitleDeed = this.prepareData(this.seizurePropertyService.documentsTitleDeed, 'TITLEDEED');
      if (this.mode === 'VIEW' || this.mode === 'EDIT') {
        this.excessDocuments = this.seizurePropertyService.excessDocuments || [];
      }
    } else {
      this.documentsTitleDeed = this.prepareData(this.seizurePropertyService.seizureDocumentsTitleDeed, 'TITLEDEED');
    }
    this.lgDocuments = this.prepareData(this.litigationCaseService.litigationCaseDocuments, 'LITIGATION');
    if (this.mode === 'EDIT') {
      this.documentsCollateralAppraisal =
        this.collateralIdList.length > 0
          ? this.prepareData(this.seizurePropertyService.docCollateralAppraisal, 'COLLATERAL')
          : [];
    } else {
      this.documentsCollateralAppraisal = this.prepareData(
        this.seizurePropertyService.docCollateralAppraisal,
        'COLLATERAL'
      );
    }
    this.documentService.currentDocPerson = this.documentService.getDocumentPerson();
    this.currentDocPerson = this.documentService.currentDocPerson;
    this.onEvent(this.documentsTitleDeed, true);
    this.seizurePropertyService.docCollateralAppraisal = this.documentsCollateralAppraisal;
  }

  get excessDocuments(): Array<ExcessDocument> {
    return this.seizurePropertyService.excessDocuments || [];
  }
  set excessDocuments(val: Array<ExcessDocument>) {
    this.seizurePropertyService.excessDocuments = val;
  }

  initPropOnScreen() {
    if (this.isOwnerTask || this.mode === 'VIEW' || this.mode === 'EDIT') {
      switch (this.taskCode) {
        case taskCode.R2E05_01_2D:
          this.actionOnScreen.canDownload = true;
          this.actionOnScreen.canSeeReceived = true;
          this.titleDeedConfig.selectAll = this.mode === 'EDIT';
          this.titleDeedConfig.documentNumber = this.documentsTitleDeed.filter(
            (m: TitleDeedDocumentExtend) =>
              m.sent ||
              m.sendMethod === 'TRIGGER_DIMS' ||
              m.sendMethod === 'AT_KLAW' ||
              (m.sendMethod === 'AMD_MANUAL' && m.sendStatus)
          )?.length;
          this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
            (e: TitleDeedDocumentExtend) => e.sendMethod === 'TRIGGER_DIMS' || e.sendMethod === 'AT_KLAW'
          );

          break;
        case taskCode.R2E05_02_3C:
          this.actionOnScreen.canDownloadReturnOriginal = true;
          this.actionOnScreen.canRejectOriginal = true;
          this.actionOnScreen.canSeeSubMenu = true;
          this.actionOnScreen.canSeeExcessDoc = true && this.excessDocuments?.length > 0;
          this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
            (e: TitleDeedDocumentExtend) => e.sendMethod === 'TRIGGER_DIMS' || e.sendMethod === 'AT_KLAW'
          );

          break;
        case taskCode.R2E05_03_3D:
          this.actionOnScreen.canDownload = true;
          this.actionOnScreen.canSeeReceived = true;
          this.titleDeedConfig.selectAll = this.mode === 'EDIT';
          this.titleDeedConfig.documentNumber = this.documentsTitleDeed.filter(
            (m: TitleDeedDocumentExtend) =>
              m.sent ||
              m.sendMethod === 'TRIGGER_DIMS' ||
              m.sendMethod === 'AT_KLAW' ||
              (m.sendMethod === 'AMD_MANUAL' && m.sendStatus)
          )?.length;
          this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
            (e: TitleDeedDocumentExtend) => e.sent || e.sendMethod === 'TRIGGER_DIMS' || e.sendMethod === 'AT_KLAW'
          );

          break;
        case taskCode.R2E05_06_3F:
          this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
            (e: TitleDeedDocumentExtend) => e.approvedStatus
          );
          break;
        default:
          this.titleDeedConfig.selectAll = false;
          if (this.mode === 'VIEW') {
            this.actionOnScreen.canDownload = true;
            if (!this.seizurePropertyService.hasTaskSubmit) {
              this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
                (e: TitleDeedDocumentExtend) => e.sendStatus
              );
            } else {
              this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
                (e: TitleDeedDocumentExtend) => e.approveStatus
              );
            }
          } else if (this.mode === 'EDIT') {
            this.actionOnScreen.canDownload = true;
            this.actionOnScreen.canSeeReceived = true;
            this.titleDeedConfig.selectAll = this.mode === 'EDIT';
            this.titleDeedConfig.documentNumber = this.documentsTitleDeed.filter(
              (m: TitleDeedDocumentExtend) => m.sent || m.sendMethod === 'TRIGGER_DIMS' || m.sendMethod === 'AT_KLAW'
            )?.length;
            this.readyForTitleDeed.readyForAsset = this.documentsTitleDeed?.every(
              (e: TitleDeedDocumentExtend) => e.sendMethod === 'TRIGGER_DIMS' || e.sendMethod === 'AT_KLAW'
            );
          }
          break;
      }
    } else {
      this.actionOnScreen.canDownload = false;
      this.actionOnScreen.canSeeReceived = false;
    }
  }

  getDisplayedColumns() {
    let columnDefinitions = [
      { def: 'id', hide: true },
      { def: 'documentName', hide: true },
      {
        def: 'collateralNo',
        hide:
          this.taskCode === taskCode.R2E05_02_3C ||
          this.taskCode === taskCode.R2E05_01_2D ||
          this.taskCode === taskCode.R2E05_03_3D ||
          this.mode === 'EDIT' ||
          this.mode === 'VIEW' ||
          this.taskCode === taskCode.R2E05_06_3F,
      },
      { def: 'collateralId', hide: true },
      {
        def: 'dimHolderCostCenter',
        hide:
          this.taskCode === taskCode.R2E05_01_2D ||
          this.taskCode === taskCode.R2E05_02_3C ||
          this.taskCode === taskCode.R2E05_03_3D ||
          this.mode === 'EDIT' ||
          this.taskCode === taskCode.R2E05_06_3F,
      },
      { def: 'copy', hide: true },
      {
        def: 'hasOriginalCopy',
        hide:
          this.taskCode === taskCode.R2E05_01_2D ||
          this.taskCode === taskCode.R2E05_03_3D ||
          this.mode === 'VIEW' ||
          this.mode === 'EDIT' ||
          this.taskCode === taskCode.R2E05_06_3F,
      },
      { def: 'received', hide: this.taskCode === taskCode.R2E05_02_3C },
      { def: 'rejectOriginalReceived', hide: this.taskCode === taskCode.R2E05_02_3C },
      {
        def: 'sent',
        hide: this.taskCode === taskCode.R2E05_01_2D || this.taskCode === taskCode.R2E05_03_3D || this.mode === 'EDIT',
      },
      { def: 'save', hide: this.taskCode === taskCode.R2E05_02_3C },
      { def: 'statusSent', hide: this.mode === 'VIEW' || this.taskCode === taskCode.R2E05_06_3F },
      { def: 'statusReceive', hide: this.mode === 'VIEW' || this.taskCode === taskCode.R2E05_06_3F },
    ];

    this.displayColl = columnDefinitions.filter((cd: any) => cd.hide).map((cd: any) => cd.def);
    if (!this.isOwnerTask && this.taskCode) {
      this.displayColl = this.displayColl.filter(it => it !== 'sent');
      if (this.taskCode === taskCode.R2E05_02_3C) {
        this.displayColl = this.displayColl.filter(it => !['received', 'rejectOriginalReceived', 'save'].includes(it));
      }
    }
  }

  get seizurePropertyMode() {
    return this.seizurePropertyService.mode;
  }

  get documentsTitleDeedUpdate() {
    let data = this.prepareData(this.seizurePropertyService.seizureDocumentsTitleDeed, 'TITLEDEED');
    return data;
  }

  onEvent(list?: any, fromDraft?: boolean) {
    if (!!!fromDraft) {
      this.seizurePropertyService.hasEdit = true;
    }
    switch (this.taskCode) {
      case taskCode.R2E05_01_2D:
        let allCheck = list.every((e: TitleDeedDocumentExtend) => e.sent || e.sendStatus || e.sendMethod === 'AT_KLAW');
        this.updateReadyForMain(allCheck);
        if (!fromDraft) {
          this.seizurePropertyService.documentsTitleDeed = list;
        }

        break;
      case taskCode.R2E05_02_3C:
        let allApprove = list.every((e: TitleDeedDocumentExtend) => e.approve || e.approvedStatus);
        this.updateReadyForMain(allApprove);
        if (!fromDraft) this.seizurePropertyService.seizureDocumentsTitleDeed = list;
        break;
      case taskCode.R2E05_03_3D:
        let allSent = list.every((e: TitleDeedDocumentExtend) => e.sent || e.sendStatus);
        this.updateReadyForMain(allSent);
        if (!fromDraft) {
          let amdDoc = list.filter(
            (f: TitleDeedDocumentExtend) => f?.approvedStatus === false && f.sendMethod === 'AMD_MANUAL'
          );
          this.seizurePropertyService.seizureDocumentsTitleDeed = amdDoc;
        }

        break;

      default:
        if (this.mode === 'EDIT') {
          let allCheck = list.every(
            (e: TitleDeedDocumentExtend) => e.sent || e.sendStatus || e.sendMethod === 'AT_KLAW'
          );
          this.updateReadyForMain(allCheck);
          if (!fromDraft) {
            this.seizurePropertyService.documentsTitleDeed = list;
          }
        }
        break;
    }
    this.seizurePropertyService.checkDocumentIsReady();
  }

  updateReadyForMain(ready: boolean) {
    this.readyForTitleDeed.readyForAsset = ready;
    this.readyForTitleDeed.readyForLitigation = ready;
    this.readyForTitleDeed.readyForNotice = ready;
    this.readyForTitleDeed.readyForDoc = ready;
  }

  updateReadyForCol(ready: boolean) {
    this.readyForCollateral.readyForAsset = ready;
    this.readyForCollateral.readyForLitigation = ready;
    this.readyForCollateral.readyForNotice = ready;
    this.readyForCollateral.readyForDoc = ready;
  }

  prepareData(data: any[], type?: string): any {
    let arr: any[] = [];
    if (type === 'TITLEDEED' || type === 'COLLATERAL' || this.mode === 'EDIT') {
      if (this.taskCode === taskCode.R2E05_01_2D || this.mode === 'EDIT') {
        arr = data?.filter(
          f =>
            this.collateralIdList?.includes(f?.relatedCollateral?.collateralId) ||
            this.selectedTitleDeed.selectedDocumentIdList?.includes(f?.relatedCollateral?.collateralId)
        );
      } else {
        arr = data;
      }
    } else {
      if (type === 'LITIGATION' || type === 'TITLEDEED') {
        if (this.mode === 'EDIT') {
          arr = data?.filter(
            f =>
              this.collateralIdList?.includes(f?.relatedCollateral?.collateralId) ||
              this.selectedTitleDeed.selectedDocumentIdList?.includes(f?.relatedCollateral?.collateralId)
          );
        } else {
          arr = data;
        }
      } else {
        // type is COLLATERAL and mode is ''
        if (this.taskCode === taskCode.R2E05_01_2D) {
          if (this.selectedTitleDeed.selectedDocumentIdList?.length === 0) {
            arr = data?.filter(
              f =>
                this.collateralIdList?.includes(f?.relatedCollateral?.collateralId) ||
                this.selectedTitleDeed.selectedDocumentIdList?.includes(f?.relatedCollateral?.collateralId)
            );
          } else {
            arr = data?.filter(f => this.collateralIdList?.includes(f?.relatedCollateral?.collateralId));
          }
        } else {
          arr =
            this.mode === 'VIEW'
              ? data?.filter(f => this.viewCollateralAppraisal?.includes(f?.relatedCollateral?.collateralId))
              : data;
        }
      }
    }
    if (type === 'LITIGATION') {
      this.readyForLitigation.readyForAsset = data && data.length > 0 ? data.every(r => r.imageId) : false;
    }
    if (type === 'COLLATERAL') {
      let collReady = data && data.length > 0 ? data.every(r => r.imageId) : false;
      this.updateReadyForCol(collReady);
    }

    const result =
      arr?.map((m: TitleDeedDocumentExtend, idx: number) => {
        if (!!m.sendStatus && !!m.approvedStatus) {
          m.readyForAsset = true;
        } else {
          m.readyForAsset =
            m.sendMethod === 'AT_KLAW' || (m?.sendMethod === 'AMD_MANUAL' && m.sendStatus && m.approvedStatus);
        }
        m.index = idx + 1;
        m.documentTemplate = {
          ...m.documentTemplate,
          forAsset: true,
        };
        if (type === 'COLLATERAL' || type === 'LITIGATION') {
          m.readyForAsset = !!m.imageId;
        }
        if (type === 'TITLEDEED' && this.taskCode === taskCode.R2E05_06_3F) {
          m.readyForAsset = m.approvedStatus;
        }

        if (
          this.taskCode === taskCode.R2E05_01_2D ||
          this.mode === 'EDIT' ||
          (this.taskCode === taskCode.R2E05_03_3D && type === 'TITLEDEED')
        ) {
          m.sent =
            m.sent ||
            this.selectedTitleDeed.selectedDocumentIdList?.some(s => s === m?.relatedCollateral?.collateralId) ||
            false;
          if (m.sent) {
            m.readyForAsset = true;
          }
        }
        if (this.taskCode === taskCode.R2E05_03_3D && type === 'TITLEDEED') {
          m.expanded = true;
        }
        if (this.taskCode === taskCode.R2E05_02_3C && type === 'TITLEDEED') {
          let doc = this.documentsApprovalDraft?.find(
            s => s.documentId === m?.documentId && (s.approve || s.approve === false)
          );
          m.expanded = false;
          if (doc && m.approvedStatus === false) {
            if (doc?.approve) {
              m.approve = true;
              m.readyForAsset = true;
            }
            if (doc?.approve === false) {
              m.rejectReason = false;
              m.approve = false;
              m.readyForAsset = false;
            }

            m.name = doc?.returningDocumentInfo?.name;
            m.docCount = doc?.returningDocumentInfo?.docCount;
            m.rejectedReasonId = doc?.rejectReason?.reason;
            m.rejectedRemarks = doc?.rejectReason?.remarks;
          }
        }
        if (this.mode === 'VIEW') {
          if (!this.seizurePropertyService.hasTaskSubmit && m.sendStatus) {
            m.readyForAsset = true;
          } else {
            if (m.approveStatus) {
              m.readyForAsset = true;
            }
          }
        }
        return m;
      }) || [];
    console.log('result :: ', result);
    return result;
  }

  expandPanel() {
    this.isOpened = !this.isOpened;
  }

  async download() {
    if (this.taskCode === taskCode.R2E05_03_3D) {
      await this.onDownloadSeizureAmdCoverPage();
    } else {
      let hasDoc = this.documentsTitleDeed.some(
        (m: TitleDeedDocumentExtend) => m.sendMethod === 'AMD_MANUAL' && (m.sent || m.sendStatus)
      );
      if (hasDoc) {
        await this.onDownloadCoverPage();
      } else {
        this.notificationService.alertDialog(
          'ไม่มีเอกสารที่หน่วยงานดูแลลูกหนี้ ที่ต้องทำการเบิก',
          'กรุณาตรวจสอบรายละเอียดอีกครั้งและกดเสร็จสิ้นเพื่อดำเนินการต่อ',
          undefined,
          undefined,
          { iconName: 'icon-Error', iconClass: 'large fill-red icon-medium' }
        );
      }
    }
  }

  async onDownloadSeizureAmdCoverPage() {
    let req: SeizureAmdCoverPageRequest = {
      documentIdList: this.documentsTitleDeed
        .filter((f: TitleDeedDocumentExtend) => f.sent)
        .map((m: TitleDeedDocumentExtend) => m.documentId),
    };
    const response: any = await this.seizurePropertyService.generateSeizureAmdCoverPage(Number(this.seizureId), req);
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, 'รายการเอกสาร' || 'file' + type, type);
  }

  async onDownloadCoverPage() {
    let requestGen: GenerateCoverPageRequest = {
      collateralIdList: this.documentsTitleDeed.map((m: TitleDeedDocumentExtend) => m.relatedCollateral?.collateralId),
    };
    const response: any = await this.seizurePropertyService.postGenerateCoverPage(
      Number(this.litigationCaseId),
      requestGen
    );
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, 'รายการเอกสาร' || 'file' + type, type);
  }

  async rejectOriginalCopy(mode: string, element?: any) {
    this.seizurePropertyService.hasEdit = true;

    let data: RejectedReasonDtoExtend = {
      rejectedDocumentInfo: {
        documentName: element?.name || '',
        pageCount: element?.number || '',
      },
      isSaveButton: mode === 'EDIT',
      mode: mode,
    };
    let btnText = mode === 'EDIT' ? 'บันทึกปฏิเสธรับต้นฉบับเกิน' : 'ปฏิเสธรับต้นฉบับเกิน';
    let confirm = await this.documentService.rejectReasons(data, 'ปฏิเสธรับต้นฉบับเกิน', 'DOC_OVER', btnText);
    if (confirm) {
      let req: PostExcessDocumentRequest = {
        name: confirm?.rejectedDocumentInfo?.documentName,
        number: confirm?.rejectedDocumentInfo?.pageCount?.toString(),
      };
      if (mode === 'ADD') {
        let res = await this.seizurePropertyService.addNewExcessDocuments(Number(this.seizureId), req);
        if (res) {
          this.actionOnScreen.canSeeExcessDoc = true;
          this.excessDocuments = this.excessDocuments.concat([
            {
              name: confirm?.rejectedDocumentInfo?.documentName,
              number: confirm?.rejectedDocumentInfo?.pageCount,
              refId: res.refId,
            },
          ]);
          this.notificationService.openSnackbarSuccess('ปฏิเสธรับต้นฉบับเกินแล้ว');
        }
      }
      if (mode === 'EDIT') {
        let res = await this.seizurePropertyService.updateSeizureExcessDocs(element.refId, Number(this.seizureId), req);
        if (res) {
          element.name = confirm?.rejectedDocumentInfo?.documentName;
          element.number = confirm?.rejectedDocumentInfo?.pageCount;
          element.refId = res.refId;
          this.notificationService.openSnackbarSuccess('บันทึกปฏิเสธรับต้นฉบับเกินแล้ว');
        }
      }
    }
  }

  async downloadReturnOriginalCover() {
    let found = this.documentsTitleDeed.some((s: TitleDeedDocumentExtend) => s.approve === false);
    if (!found) {
      await this.notificationService.alertDialog(
        'ไม่พบการปฏิเสธรับต้นฉบับ',
        'ไม่สามารถดาวน์โหลดใบนำส่งคืนต้นฉบับได้ กรุณาเลือกปฏิเสธรับต้นฉบับก่อนดำเนินการต่อไป'
      );
    } else {
      let docReject = this.documentsTitleDeed.filter((f: TitleDeedDocumentExtend) => f.approve === false);
      let hasReasonNoOriginal =
        docReject.every((s: TitleDeedDocumentExtend) => s.approve === false && s.rejectedReasonId === '2') ||
        (docReject?.length === 0 && this.excessDocuments?.length > 0);
      if (hasReasonNoOriginal) {
        await this.notificationService.alertDialog(
          'ไม่มีรายการนำส่งคืนต้นฉบับ',
          'ไม่มีรายการให้ดาวน์โหลดใบนำส่งคืนต้นฉบับ'
        );
      } else {
        let request: RejectCoverPageGenerateRequest = {
          documents: this.documentsTitleDeed
            .filter((f: any) => f.approve === false && f.rejectedReasonId !== '2')
            .map((m: TitleDeedDocumentExtend) => {
              return {
                approve: m?.approve,
                documentId: m?.documentId,
                rejectReason: {
                  reason: m?.rejectedReasonId,
                  remarks: m?.rejectedRemarks,
                },
                returningDocumentInfo: {
                  docCount: Number(m?.docCount),
                  name: m?.name,
                },
              };
            }),
        };
        const response: any = await this.seizurePropertyService.rejectCoverPageGenerate(
          Number(this.seizureId),
          request
        );
        Utils.saveAsZip(response, 'ใบนำส่งคืนต้นฉบับ');
      }
    }
  }

  async receiveAll() {
    const isContinue = await this.notificationService.warningDialog(
      'ยืนยันรับต้นฉบับทั้งหมด',
      'เอกสารต้นฉบับบางฉบับถูกปฏิเสธรับแล้ว คุณต้องการที่จะดำเนินการ แก้ไขเป็นรับต้นฉบับทั้งหมดต่อใช่หรือไม่?',
      'ยืนยันรับต้นฉบับทั้งหมด'
    );
    if (isContinue) {
      this.seizurePropertyService.hasEdit = true;
      this.readyForTitleDeed.readyForAsset = true;
      this.documentsTitleDeed = this.documentsTitleDeed.map((f: TitleDeedDocumentExtend) => {
        if (f?.approvedStatus === false) {
          f.approve = true;
          f.readyForAsset = true;
        }
        return f;
      });
      this.seizurePropertyService.checkDocumentIsReady();
      this.notificationService.openSnackbarSuccess('เลือกรับต้นฉบับทั้งหมดแล้ว');
    }
  }

  async rejectAll() {
    let data: RejectedReasonDto = {};
    let confirm = (await this.documentService.rejectReasons(
      data,
      'ปฏิเสธรับต้นฉบับทั้งหมด',
      'NORMAL'
    )) as RejectedReasonDto;
    if (confirm) {
      this.seizurePropertyService.hasEdit = true;
      this.readyForTitleDeed.readyForAsset = false;
      this.documentsTitleDeed = this.documentsTitleDeed.map((f: TitleDeedDocumentExtend) => {
        if (f?.approvedStatus === false) {
          f.approve = false;
          f.readyForAsset = false;
          f.rejectReason = false;
          if (confirm) {
            // for re-select
            f.name = confirm.rejectedDocumentInfo?.documentName;
            f.docCount = confirm.rejectedDocumentInfo?.pageCount;
            f.rejectedReasonId = confirm.rejectedReasonId;
            f.rejectedRemarks = confirm.rejectedRemarks;
          }
        }
        return f;
      });
      this.seizurePropertyService.checkDocumentIsReady();
      this.notificationService.openSnackbarSuccess('เลือกปฏิเสธรับต้นฉบับทั้งหมดแล้ว');
    }
  }

  async remove(element: any) {
    this.seizurePropertyService.hasEdit = true;
    const confirm = await this.notificationService.warningDialog(
      'ต้องการลบรายการปฏิเสธต้นฉบับเกิน',
      `ต้องการลบรายเอกสารต้นฉบับเกินหรือไม่
      หากลบรายการปฏิเสธต้นฉบับเกิน จะต้องบันทึกกดรับเอกสารต้นฉบับ`,
      'ยืนยันลบรายการ',
      'icon-Bin',
      'long-button mat-warn'
    );
    if (confirm) {
      await this.seizurePropertyService.deleteExcessDoc(element?.refId || 0, Number(this.seizureId));
      this.excessDocuments = this.excessDocuments.filter(f => f.refId !== element?.refId);
      this.notificationService.openSnackbarSuccess('บันทึกลบปฏิเสธรับต้นฉบับเกินแล้ว');
    }
  }
}
