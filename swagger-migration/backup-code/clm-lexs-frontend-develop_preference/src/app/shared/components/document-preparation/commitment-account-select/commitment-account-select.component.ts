import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { DocumentAccountService } from '../document-account.service';
import { DocumentService } from '../document.service';
import { DisplayCommitment } from '../interface/document';

@Component({
  selector: 'app-commitment-account-select',
  templateUrl: './commitment-account-select.component.html',
  styleUrls: ['./commitment-account-select.component.scss'],
})
export class CommitmentAccountSelectComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private defermentService: DefermentService
  ) {}

  selection = new SelectionModel<DisplayCommitment>(true);
  error = {
    hasSelect: false,
  };
  accountColumns = ['checkbox', 'accountNumber', 'accountTypeDesc', 'accountName'];

  ngOnInit(): void {
    if (!!this.data?.uploadFor && this.data?.uploadFor === 'DEFERMENT') {
      // if deferement, select selected commitment accounts by default
      this.data?.element.commitmentAccounts.forEach((accountNo: string) => {
        const acc = this.data?.accounts?.find((acc: DisplayCommitment) => acc.accountNumber === accountNo);
        this.selection.select(acc);
      });
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.data?.accounts?.length;
  }
  selectCommitment(element: DisplayCommitment) {
    this.selection.toggle(element);
  }
  selectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.data?.accounts?.forEach((e: any) => {
        this.selection.select(e);
      });
    }
  }

  async openDoc() {
    let res = await this.documentService.getDocument(this.data?.element.imageId!, this.data?.element.imageSource);
    this.documentService.openPdf(res, this.data?.element.imageName);
  }

  save() {
    if (this.selection.selected.length === 0) {
      this.error.hasSelect = true;
      return;
    }
    if (!!this.data?.uploadFor && this.data?.uploadFor === 'DEFERMENT') {
      this.defermentService.updateDocumentCommitmentAccount(
        this.selection.selected.map(a => a.accountNumber!),
        this.data.element
      );
    } else {
      this.documentAccountService.updateDocumentCommitmentAccount(
        this.selection.selected.map(a => a.accountNumber!),
        this.data.element
      );
    }
    this.matDialog.closeAll();
  }
}
