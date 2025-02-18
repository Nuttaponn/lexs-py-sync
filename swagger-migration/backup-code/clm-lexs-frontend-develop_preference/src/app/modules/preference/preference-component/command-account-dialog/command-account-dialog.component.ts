import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { InquiryAccountResponse, CustomerDto } from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { PreferenceService } from '../../preference.service';
import { ScenarioPreferenceEnum } from '../../preference.model';

@Component({
  selector: 'app-command-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  templateUrl: './command-account-dialog.component.html',
  styleUrl: './command-account-dialog.component.scss'
})
export class CommandAccountDialogComponent {
  // isChanged: boolean = false; TODO: handle selectedRows is changed or not

  constructor(
    private preferenceService: PreferenceService,
  ) {

  }

  public accountColumns = [
    'select',
    'no',
    'accountNo',
    'billNo',
    'dpd',
    'cfinalStage',
    'marketCode',
    'totalAmount',
    'prescriptionDate',
    'bookingCode',
    'responseBranchCode',
    'tdrInfo',
    'litigationId',
    'litigationStatus',
  ];

  public accountTableDataSource: InquiryAccountResponse[] = [];

  // Selection model for managing selection
  public selection = new SelectionModel<any>(true, []);

  public async onClose(): Promise<boolean> {
    return this.selection.selected.length > 0;
  }

  get currentScenario(){
    return this.preferenceService.currentScenario;
  }

  get returnData() {
    return {
      selectedAccounts: this.selection.selected,
      allAccounts: this.accountTableDataSource
    }
  }

  async dataContext(data: any) {
    // data.selectedCustomer

    if (data.selectedCustomer?.cifNo) {
      const selectedCustomer: CustomerDto = data.selectedCustomer;
      const preferenceGroupNo = this.preferenceService.preferenceDetail.preferenceGroupNo;

      let mode: 'ADD' | 'VIEW' | 'EDIT' = 'VIEW';
      if(this.currentScenario === ScenarioPreferenceEnum.SCENARIO1){
        mode = 'ADD';
      }else if(this.currentScenario === ScenarioPreferenceEnum.SCENARIO3){
        mode = 'EDIT';
      }
      this.accountTableDataSource = await this.preferenceService.inquiryAccount(mode, data.selectedCustomer.cifNo, preferenceGroupNo);

      if (data.selectedAccounts) {
        const selectedAccounts: InquiryAccountResponse[] = data.selectedAccounts;

        //  map selected accounts to accountTableDataSource
        this.selection.clear();
        selectedAccounts.forEach((account) => {
          const index = this.accountTableDataSource.findIndex((acc) => acc.accountNo === account.accountNo);
          if (index !== -1) {
            this.selection.select(this.accountTableDataSource[index]);
          }
        });
      }
    }
  }
  // Toggle row selection
  toggleRowSelection(row: any): void {
    this.selection.toggle(row);
  }

  // Check if all rows are selected
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.accountTableDataSource.length;
    return numSelected === numRows;
  }

  // Select or deselect all rows
  selectAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.accountTableDataSource);
    }
  }
}
