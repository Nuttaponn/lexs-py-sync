import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { ActionBar, Mode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CourtDecreeDto, LitigationDocumentDto } from '@lexs/lexs-client';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-decree-detail',
  templateUrl: './decree-detail.component.html',
  styleUrls: ['./decree-detail.component.scss'],
})
export class DecreeDetailComponent implements OnInit {
  constructor(
    private courtService: CourtService,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private sessionService: SessionService
  ) {}

  public MODE = Mode;
  isViewMode = this.route.snapshot.queryParams['mode'] === this.MODE.VIEW;
  index = parseInt(this.route.snapshot.queryParams['index']);

  actionBar: ActionBar = {
    hasCancel: !this.isViewMode,
    hasSave: false,
    hasReject: false,
    hasPrimary: !this.isViewMode,
    primaryIcon: 'icon-save-primary',
  };
  currentDecree: CourtDecreeDto = {
    headerFlag: 'DRAFT',
  };
  documentColumns: string[] = ['documentName', 'uploadDate'];

  dateControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  today = new Date();
  remarksControl: UntypedFormControl = new UntypedFormControl('', []);
  documents: any[] = [];
  documentError: boolean = false;
  uploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  ngOnInit(): void {
    this.currentDecree = this.courtService.currentDecree;
    this.dateControl.setValue(this.currentDecree?.requestDecreeDate);
    this.documents = [
      {
        documentId: 0,
        documentTemplate: this.currentDecree.courtDecreeDocuments?.documentTemplate,
        documentTemplateId: this.currentDecree.courtDecreeDocuments?.documentTemplate?.documentTemplateId,
        imageId: '',
        uploadRequired: true,
        removeDocument: true,
        uploadDate: '',
        isUpload: false,
        viewOnly: this.isViewMode,
      },
    ];
    if (
      this.route.snapshot.queryParams['mode'] === this.MODE.EDIT ||
      this.route.snapshot.queryParams['mode'] === this.MODE.VIEW
    ) {
      this.documents = [
        {
          documentId: this.currentDecree.courtDecreeDocuments?.documentId || 0,
          documentTemplate: this.currentDecree.courtDecreeDocuments?.documentTemplate,
          documentTemplateId: this.currentDecree.courtDecreeDocuments?.documentTemplate?.documentTemplateId,
          imageId: this.currentDecree.courtDecreeDocuments?.imageId || '',
          uploadRequired: true,
          removeDocument: true,
          uploadDate: this.currentDecree.courtDecreeDocuments?.documentDate,
          isUpload: this.currentDecree.courtDecreeDocuments?.imageId ? true : false,
          viewOnly: this.isViewMode,
        },
      ];
      this.remarksControl.setValue(this.currentDecree.remark);
    }
    this.uploadMultiInfo.cif =
      this.taskService.taskDetail?.customerId || this.lawsuitService.currentLitigation?.customerId || '';
    this.uploadMultiInfo.litigationId = this.currentDecree.litigationId || '';
  }

  uploadFileEvent(event: any) {
    this.documents = event;
    if (this.documents[0].imageId && this.documents[0].imageId !== '') this.documentError = false;
  }

  async onBack() {
    if (!this.isViewMode) {
      const res = await this.sessionService.confirmExitWithoutSave();
      if (res) {
        this.routerService.back();
      }
    } else {
      this.routerService.back();
    }
  }

  onCancel() {
    this.onBack();
  }

  async onSubmit() {
    if (this.dateControl.valid && this.documents[0].imageId && this.documents[0].imageId !== '') {
      this.documentError = false;
      const decree: CourtDecreeDto = {
        ...this.currentDecree,
        remark: this.remarksControl.value,
        courtDecreeDocuments: this.documents[0] as unknown as LitigationDocumentDto,
        taskId: this.taskService.taskDetail.id,
        headerFlag: 'DRAFT',
      };
      await this.courtService.updateCourtDecree(decree);
      this.courtService.savedDecree = decree;
      this.routerService.back();
    } else {
      this.dateControl.markAsTouched();
      if (!this.documents[0].imageId || this.documents[0].imageId === '') this.documentError = true;
    }
  }
}
