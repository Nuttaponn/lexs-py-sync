import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { Mode, TMode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { LitigationMemoInfo, MeLexsUserDto, MemoDto, MemoRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { AddNoteDialogComponent } from './add-note-dialog/add-note-dialog.component';

@Component({
  selector: 'app-litigation-memo',
  templateUrl: './litigation-memo.component.html',
  styleUrls: ['./litigation-memo.component.scss'],
})
export class LitigationMemoComponent implements OnInit {
  private litigationId!: string;
  private customerId!: string;
  public displayedColumns: string[] = ['no', 'memoDetail', 'recorderDetail', 'dates', 'cmd'];
  public displayedNoDataColumns: string[] = ['no', 'memoDetail', 'recorderDetail', 'dates'];

  public searchCtrl: UntypedFormGroup = this.initSearchControl();
  public litigationMemoInfo: LitigationMemoInfo | undefined;

  placeholder = 'LAWSUIT.MEMO.SEARCH_LITIGATION_MEMO';

  currentUser: MeLexsUserDto = {};

  canAddMemo: boolean = false;

  constructor(
    private lawsuitService: LawsuitService,
    public fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    this.customerId = this.lawsuitService.currentLitigation.customerId || '';
    await this.initPage();
  }

  async initPage() {
    this.searchCtrl.get('searchText')?.setValue('');
    this.litigationMemoInfo = await this.inquiryLitigationMemos('');
    this.canAddMemo = this.litigationMemoInfo?.actionButton ?? false;
  }

  initSearchControl() {
    return this.fb.group({
      searchText: ['', Validators.minLength(3)],
    });
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearchFilter();
  }

  async onSearchFilter() {
    if (this.searchCtrl.get('searchText')?.invalid) {
      return;
    }
    await this.inquiryLitigationMemos(this.searchCtrl.get('searchText')?.value || '');
  }

  async inquiryLitigationMemos(searchText: string) {
    return await this.lawsuitService.inquiryLitigationMemos(this.litigationId, searchText);
  }

  async onClickAddMemo() {
    const detailText = await this.openAddNoteDialog(Mode.ADD, null);

    if (!detailText) return;

    // create new object and add
    const memoRequest: MemoRequest = {
      customerId: this.customerId,
      description: detailText,
    };

    try {
      await this.lawsuitService.addLitigationMemo(this.litigationId, memoRequest);
      await this.initPage();
      this.notificationService.openSnackbarSuccess(this.translate.instant('LAWSUIT.MEMO.MEMO_IS_SAVED'));
    } catch (error) {
      console.log('onClickAddMemo Error ::', error);
    }
  }

  async onEditData(index: number, element: MemoDto) {
    const detailText = await this.openAddNoteDialog(Mode.EDIT, element.description ?? '');

    if (!detailText) return;
    const tempEle = { ...element };
    tempEle.description = detailText;
    try {
      await this.lawsuitService.updateLitigationMemo(this.litigationId, (element.id ?? 0).toString(), tempEle);

      if (this.litigationMemoInfo?.memoList) {
        this.litigationMemoInfo.memoList[index].description = detailText;
      }

      this.notificationService.openSnackbarSuccess(this.translate.instant('LAWSUIT.MEMO.MEMO_IS_EDITED'));
    } catch (error) {
      console.log('onEditData Error ::', error);
    }
  }

  async openAddNoteDialog(_mode: TMode, detail: string | null): Promise<string> {
    const myContext = {
      mode: _mode,
      detail,
    };

    const flag = _mode === TMode.ADD ? 'A' : 'U';
    const dialogSetting: DialogOptions = {
      component: AddNoteDialogComponent,
      title: this.translate.instant('UPDATE_FLAG.' + flag) + this.translate.instant('LAWSUIT.LITIGATION_MEMO'),
      iconName: 'icon-Edit',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    const res = await this.notificationService.showCustomDialog(dialogSetting);
    if (!res) return '';

    return res as string;
  }

  async onRemoveData(index: number, element: MemoDto) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'LAWSUIT.MEMO.DELETE_MEMO',
      autoFocus: false,
      contentCssClasses: ['actions-right-full-width'],
      leftButtonClass: 'width-pct-47-button',
    };

    const res = await this.notificationService.confirmRemoveCenterAlignedDialog(
      'LAWSUIT.MEMO.DELETE_MEMO',
      'LAWSUIT.MEMO.DELETE_MEMO_CONTENT',
      optionsDialog
    );

    if (!res) return;

    try {
      // remove element, change table
      await this.lawsuitService.removeLitigationMemo(this.litigationId, (element.id ?? 0).toString(), element);

      if (this.litigationMemoInfo?.memoList) {
        this.litigationMemoInfo?.memoList.splice(index, 1);
        this.litigationMemoInfo.memoList = [...(this.litigationMemoInfo?.memoList || [])];
      }

      this.notificationService.openSnackbarSuccess(this.translate.instant('LAWSUIT.MEMO.MEMO_IS_DELETED'));
    } catch (error) {
      console.log('onRemoveData Error ::', error);
    }
  }
}
