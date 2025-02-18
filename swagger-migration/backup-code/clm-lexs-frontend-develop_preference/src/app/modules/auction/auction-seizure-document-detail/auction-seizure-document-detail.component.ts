import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { ActionBar, ITabNav, IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import { ConveyanceDeedGroupDocument, NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { ConveyanceDocumentUploadResponseExtend } from '../auction.const';
import { AuctionService } from '../auction.service';
import { AuctionMenu } from '../auction.model';

interface ActionBarMeta extends ActionBar {
  hasEditButton?: boolean;
  editButtonText?: string;
  editButtonIcon?: string;
  cancelButtonIcon?: string;
}

@Component({
  selector: 'app-auction-seizure-document-detail',
  templateUrl: './auction-seizure-document-detail.component.html',
  styleUrls: ['./auction-seizure-document-detail.component.scss'],
})
export class AuctionSeizureDocumentDetailComponent implements OnInit {
  @ViewChild('stepperAuc') stepperAuc!: MatStepper;
  public isOpened = true;
  public setOptions: any[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public setConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'รายการชุดทรัพย์',
    isMultiple: true,
  };
  public documentUpload: IUploadMultiFile[] = [];
  public isUploadReadOnly: boolean = false;
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public actionBar: ActionBarMeta = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };
  public tabIndex = 0;
  public statusName: string = '';
  public statusCode: string = '';
  public isSteperTask: boolean = true;
  public title: string = '';
  public assetCtr: UntypedFormControl = new UntypedFormControl([], Validators.required);
  public requireDoc: UntypedFormControl = new UntypedFormControl('', Validators.requiredTrue);
  public isSubmitted = false;
  private titleMapper = new Map<string, string>([['STEP1', 'บันทึกรายละเอียดการซื้อทรัพย์']]);
  public messageBanner!: string | undefined;
  private msgBannerMapper = new Map<string, string>([
    ['STEP1', 'กรุณากรอกรายละเอียดและอัปโหลดเอกสารบัญชีส่วนได้ใช้แทน และกดปุ่ม “ดำเนินการต่อ”'],
    ['STEP2', 'กรุณาอัปโหลดหนังสือโอนกรรมสิทธิ์สำหรับชุดทรัพย์ที่เกี่ยวข้อง และกดปุ่ม “บันทึกเสร็จสิ้น”'],
  ]);
  public steps: ITabNav[] = [
    {
      index: 0,
      label: 'บันทึกรายละเอียดเอกสาร',
      prefix: '',
      path: 'withdrawn-info-step',
      fullPath: '',
    },
    {
      index: 1,
      label: 'อัปโหลดหนังสือโอนกรรมสิทธิ์',
      prefix: '',
      path: 'assets-contacts-info-step',
      fullPath: '',
    },
  ];
  public accessPermissions = this.sessionService.accessPermissions();
  public hasSubmitPermission = false;
  public hasEdit: boolean = false;
  public hasEditStp2: boolean = false;
  public relatedDeedGroupIDs: string[] = [];
  constructor(
    private routerService: RouterService,
    private taskService: TaskService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private lawsuitService: LawsuitService,
    private auctionService: AuctionService
  ) {}

  get isOwnerTask() {
    return (
      true ||
      this.sessionService.isOwnerTask(this.taskService.taskOwner, this.taskService.taskDetail.enableTaskSupportRole)
    );
  }

  get isEditor() {
    return true || ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
  }

  initPermission() {}

  ngOnInit(): void {
    this.messageBanner = this.msgBannerMapper.get('STEP1');
    this.title = this.titleMapper.get('STEP1') || '';
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail.customerId || this.lawsuitService.currentLitigation.customerId || 'xxx',
      litigationId:
        this.taskService.taskDetail.litigationId || this.lawsuitService.currentLitigation.litigationId || 'xx',
    };
    this.initPermission();
    this.initActionBar();
    this.initData();
  }

  initData() {
    const conveyanceDocumentUpload = this.auctionService
      ?.conveyanceDocumentUploads as ConveyanceDocumentUploadResponseExtend;
    console.log(conveyanceDocumentUpload.conveyanceUploadDocuments);

    const conveyanceUploadDocuments = conveyanceDocumentUpload?.conveyanceUploadDocuments || [];
    for (let index = 0; index < conveyanceUploadDocuments?.length; index++) {
      const doc = conveyanceUploadDocuments[index] as any;

      if (doc?.document?.imageId === '' || doc?.document?.imageId === undefined) {
        this.documentUpload.push({
          active: true,
          uploadDate: '',
          ...doc.document,
          imageId: '',
          isUpload: false,
          removeDocument: true,
          uploadRequired: true,
          documentTemplateId: doc?.document?.documentTemplate?.documentTemplateId,
        });
      }
    }

    const conveyanceDeedGroupDocuments = conveyanceDocumentUpload?.conveyanceDeedGroupDocuments || [];
    const allowDeedGroupId = conveyanceDocumentUpload.allowDeedGroupId;
    for (let index = 0; index < conveyanceDeedGroupDocuments?.length; index++) {
      const doc = conveyanceDeedGroupDocuments[index] as ConveyanceDeedGroupDocument;
      if (doc.deedGroupId && allowDeedGroupId?.includes(doc.deedGroupId)) {
        this.setOptions.push({
          value: doc.fsubbidnum,
          name: 'ชุดทรัพย์ที่ ' + doc.fsubbidnum,
          deedGroupId: doc.deedGroupId,
        });
      }
    }
  }

  initActionBar() {
    if (this.isOwnerTask && this.isEditor) {
      this.actionBar = {
        hasSave: false,
        hasPrimary: true,
        primaryIcon: 'icon-Direction-Right',
        primaryText: 'ดำเนินการต่อ',
        hasCancel: false,
        hasReject: true,
        hasBack: true,
        backText: 'กลับไปหน้ารายละเอียดคดีความ',
      };
    } else {
      this.actionBar = {
        hasSave: false,
        hasPrimary: false,
        hasCancel: false,
        hasReject: false,
      };
    }
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.routerService.navigateTo(item.fullPath, { mode: '' });
  }

  async onBack() {
    if (this.hasEdit) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.auctionService.conveyanceDocumentUploads = Utils.deepClone(
          this.auctionService.conveyanceDocumentUploadsTemp
        );
        this.backToAuctionDetail();
        return true;
      }
    } else {
      this.backToAuctionDetail();
    }
    return false;
  }

  backToAuctionDetail() {
    this.auctionService.relatedDeedGroupIDs = [];
    this.auctionService.aucRef = this.auctionService.conveyanceDocumentUploads.publicAuctionAnnounce?.aucRef || 0;
    this.auctionService.auctionMenu = AuctionMenu.UPLOAD_DOC;
    this.routerService.back();
  }

  markAllAsTouched() {
    this.assetCtr.markAllAsTouched();
    this.assetCtr.updateValueAndValidity();
    this.requireDoc.markAllAsTouched();
    this.requireDoc.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.stepperAuc.selectedIndex === 0) {
      this.messageBanner = this.msgBannerMapper.get('STEP2');
      this.setSecoundStep();
    } else {
      this.isSubmitted = true;
      if (this.validateDoc()) {
        const confirm = await this.notificationService.warningDialog(
          'บันทึกเสร็จสิ้น',
          'กรุณาตรวจสอบความถูกต้อง หลังจากกดปุ่ม “ยืนยัน” ข้อมูลดังกล่าวจะไม่สามารถกลับมาแก้ไขได้',
          'ยืนยัน',
          'icon-save-primary'
        );
        if (confirm) {
          this.auctionService.conveyanceDocumentUploads.type = 'completed';
          this.auctionService.aucRef = this.auctionService.conveyanceDocumentUploads.publicAuctionAnnounce?.aucRef || 0;
          this.auctionService.auctionMenu = AuctionMenu.UPLOAD_DOC;
          this.notificationService.openSnackbarSuccess('บันทึกรายละเอียดการซื้อทรัพย์แล้ว');
          this.routerService.back();
        }
      }
    }
  }

  selectOption() {
    this.hasEdit = true;
    let obj: any = this.auctionService.conveyanceDocumentUploads.conveyanceUploadDocuments?.find(
      (f: any) =>
        f.document?.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF147 &&
        (f.document.documentId === 0 || f.document.documentId === undefined)
    );
    const selected = this.assetCtr?.value?.filter((f: NameValuePair) => f.value);
    if (obj) {
      obj.relatedDeedGroupIDs = selected.map((m: any) => m.deedGroupId);
    }
    this.relatedDeedGroupIDs = selected.map((m: NameValuePair) => m.value);
    this.auctionService.relatedDeedGroupIDs = obj.relatedDeedGroupIDs;
  }
  validateDoc() {
    let retValue = true;
    let data = this.auctionService.conveyanceDocumentUploads.conveyanceDeedGroupDocuments || [];
    for (let i = 0; i < data?.length; i++) {
      const titleDeed =
        data[i].conveyanceDeedGroupUploadDocuments?.filter((f: any) =>
          this.relatedDeedGroupIDs.includes(f.fsubbidnum)
        ) || [];
      for (let j = 0; j < titleDeed.length; j++) {
        const dt = titleDeed[j] as IUploadMultiFile;
        if (dt.uploadRequired) {
          if (!dt.imageId) {
            retValue = false;
          }
        }
      }
    }
    return retValue;
  }

  documents = [];
  dataSource: any = [];

  uploadFileEvent(list: IUploadMultiFile[] | null) {
    this.hasEdit = true;
    this.dataSource = list;
    const required = list && list.length > 0 && list.filter(f => f.uploadRequired).every(r => r.imageId);
    this.requireDoc.setValue(required);
    this.auctionService?.conveyanceDocumentUploads?.conveyanceUploadDocuments?.map((m: any) => {
      let obj =
        list &&
        list.find(
          (s: any) => s.documentTemplate.documentTemplateId === m.document?.documentTemplate?.documentTemplateId
        );
      if (obj && !!!m.document.imageId) {
        m.document.imageId = obj.imageId;
        m.document.uploadTimestamp = obj.documentDate;
      }
      return m;
    });
  }
  async cancel() {
    if (this.hasEditStp2) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.setFirstStep();
      }
    } else {
      this.setFirstStep();
    }
  }

  async setFirstStep() {
    this.actionBar = {
      hasSave: false,
      hasPrimary: true,
      primaryIcon: 'icon-Direction-Right',
      primaryText: 'ดำเนินการต่อ',
      hasCancel: false,
      hasReject: true,
      hasBack: true,
      backText: 'กลับไปหน้ารายละเอียดคดีความ',
    };
    this.isOpened = true;
    this.isUploadReadOnly = false;
    if (this.stepperAuc) {
      this.stepperAuc.selectedIndex = 0;
    }
  }
  async setSecoundStep() {
    this.markAllAsTouched();
    if (this.assetCtr.valid && this.requireDoc.valid) {
      this.stepperAuc.selectedIndex = 1;
      this.actionBar = {
        ...this.actionBar,
        hasCancel: true,
        primaryText: 'บันทึกเสร็จสิ้น',
        cancelText: 'กลับไปขั้นตอนก่อนหน้า',
        cancelButtonIcon: 'icon-Direction-Left',
        primaryIcon: 'icon-Selected',
        hasEdit: false,
      };
      this.isOpened = !this.isOpened;
      this.isUploadReadOnly = true;
    }
  }

  onStepChange(e: StepperSelectionEvent) {
    switch (e.selectedIndex) {
      case 0:
        // this.setFirstStep()
        break;
      case 1:
        // this.setSecoundStep()
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  handleRoutingFromCreatePage() {}

  initStepper() {}

  onStepperClick(i: number) {
    this.logger.info('onStepperClick', i);
  }

  onEdit() {
    this.stepperAuc.selectedIndex = 0;
  }

  uploadDoc(docs: any) {
    this.hasEdit = true;
    this.hasEditStp2 = true;
    this.documents = docs;
  }
}
