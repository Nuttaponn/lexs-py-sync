import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUploadInfo, IUploadMultiFile, Mode, TMode } from '@app/shared/models';
import { DefendantDto, DisputeAppealDto } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-dispute-detail',
  templateUrl: './dispute-detail.component.html',
  styleUrls: ['./dispute-detail.component.scss'],
})
export class DisputeDetailComponent implements OnInit {
  constructor(
    private courtService: CourtService,
    private route: ActivatedRoute
  ) {}
  @Input() disputeForm!: UntypedFormGroup;

  isViewMode: boolean = true;
  isEditMode: boolean = false;
  MODE = Mode;

  courtLevel: string = '';

  today = new Date();
  documentColumns: string[] = ['documentName', 'uploadDate'];
  documentUpload: IUploadMultiFile[] = [];
  uploadMultiInfo: IUploadInfo = { cif: '', documentTemplateId: '' };

  disputeDetail: DisputeAppealDto | null = null;

  defendantsData: DefendantDto[] = [];

  ngOnInit() {
    const mode: TMode = this.route.snapshot.queryParams['disputeMode'];
    this.isViewMode = mode === this.MODE.VIEW;
    this.isEditMode = mode === this.MODE.EDIT;

    const disputeBundle = this.courtService.currentDisputeAppealBundle || null;
    this.disputeDetail = disputeBundle ? disputeBundle.disputeAppeal || {} : {};
    this.courtLevel = disputeBundle?.courtVerdicts?.courtLevel || '';

    this.uploadMultiInfo.cif = this.route.snapshot.queryParams['cif'];

    this.defendantsData =
      mode === this.MODE.ADD
        ? this.courtService.initDisputeDefendants(disputeBundle, mode)
        : this.disputeDetail.disputeDefendants || [];
    if (mode !== this.MODE.ADD) {
      this.disputeForm.controls['disputeDefendants'].setValue(this.disputeDetail.disputeDefendants || []);
    }
    this.documentUpload =
      this.disputeDetail.disputeAppealDocuments?.map(doc => ({
        documentId: doc.documentId,
        documentTemplate: doc.documentTemplate,
        documentTemplateId: doc.documentTemplateId,
        imageId: doc.imageId || null,
        uploadRequired: !doc.documentTemplate?.optional,
        removeDocument: !!!this.isViewMode,
        uploadDate: doc.documentDate || '',
        isUpload: false,
        viewOnly: this.isViewMode,
      })) || [];
  }

  onDefendantSelection(event: DefendantDto[]) {
    this.disputeForm.controls['disputeDefendants'].setValue(event);
  }

  requestDeferOptions: any[] = [
    {
      value: true,
      text: 'มี',
    },
    {
      value: false,
      text: 'ไม่มี',
    },
  ];
  requestDeferConfig: DropDownConfig = {
    enableSearch: false,
    labelPlaceHolder: 'จำเลยยื่นคำร้องทุเลาการบังคับคดี',
  };

  uploadFileEvent(event: any) {
    this.documentUpload = event;
    this.disputeForm.controls['disputeAppealDocuments'].setValue(event);
  }
}
