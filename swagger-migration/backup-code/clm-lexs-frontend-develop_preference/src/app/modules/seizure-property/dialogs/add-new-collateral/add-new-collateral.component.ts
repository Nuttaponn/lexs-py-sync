import { coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { coerceString } from '@app/shared/utils';
import { SeizureCollateralInfo } from '@lexs/lexs-client';
import { CustomDialogContent } from '@spig/core';
import { CollateralColumns, ICollateralMTable, NonMortgageColumns } from '../../models';
import { IUploadMultiFile } from '@app/shared/models';
import { DocumentListDialogComponent } from '@app/shared/components/common-dialogs/document-list-dialog/document-list-dialog.component';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-add-new-collateral',
  templateUrl: './add-new-collateral.component.html',
  styleUrls: ['./add-new-collateral.component.scss'],
})
export class AddNewCollateralComponent implements CustomDialogContent {
  public pageIndex: number = 1;
  public collateral: SeizureCollateralInfo[] = [];
  public dataSource = new MatTableDataSource<ICollateralMTable>([]);
  public collateralColumn = CollateralColumns.slice(0, CollateralColumns.length - 1);
  public selection = new SelectionModel<ICollateralMTable>(true, []);
  public isNonMortgage: boolean = false;

  constructor(private notificationService: NotificationService) {
    // Add select column to be able to select the collateral
    this.collateralColumn = ['select'].concat(this.collateralColumn);
  }

  get returnData() {
    return this.selection.selected;
  }

  dataContext(data: { unMappedCollateral: any; isNonMortgage: boolean }): void {
    this.collateral = <SeizureCollateralInfo[]>data.unMappedCollateral;
    this.isNonMortgage = data.isNonMortgage;
    if (this.isNonMortgage) {
      this.collateralColumn = ['select'].concat(NonMortgageColumns.slice(0, CollateralColumns.length - 1));
      this.dataSource.data = this.collateral.map((row, index) => {
        return {
          orderNumber: '' + (index + 1),
          collateralId: coerceString(row.assetId),
          collateralTypeDesc: coerceString(row.assetTypeDesc),
          collateralSubTypeDesc: coerceString(row.assetSubTypeDesc),
          documentNo: coerceString(row.documentNo),
          collateralDetails: coerceString(row.collateralDetails),
          ownerId: coerceString(row.ownerFullName),
          collateralType: coerceString(row.assetType),
          seizureStatus: coerceString(row.seizureStatus),
          totalAppraisalValue: coerceString(coerceNumberProperty(row.totalAppraisalValue)),
          collateralCmsStatus: coerceString(row.collateralCmsStatus).toUpperCase(),
          collateralCaseLexsStatus: coerceString(row.collateralCaseLexStatus),
          assentRlsStatus: row.assentRlsStatus,
          obligationStatus: row.obligationStatus,
          assetDocuments: row.assetDocuments,
          assetType: row.assetType,
          action: {
            deletable: false,
            editable: false,
            viewable: true,
          },
        };
      });
    } else {
      this.collateralColumn = ['select'].concat(this.collateralColumn);
      this.dataSource.data = this.collateral.map((row, index) => {
        return {
          orderNumber: '' + (index + 1),
          collateralId: coerceString(row.collateralId),
          collateralTypeDesc: coerceString(row.collateralTypeDesc),
          collateralSubTypeDesc: coerceString(row.collateralSubTypeDesc),
          documentNo: coerceString(row.documentNo),
          collateralDetails: coerceString(row.collateralDetails),
          ownerId: coerceString(row.ownerFullName),
          collateralType: coerceString(row.collateralType),
          seizureStatus: coerceString(row.seizureStatus),
          totalAppraisalValue: coerceString(coerceNumberProperty(row.totalAppraisalValue)),
          collateralCmsStatus: coerceString(row.collateralCmsStatus).toUpperCase(),
          collateralCaseLexsStatus: coerceString(row.collateralCaseLexStatus),
          action: {
            deletable: false,
            editable: false,
            viewable: true,
          },
        };
      });
    }

    this.dataSource.filteredData = this.dataSource.data.slice(0, 10);
  }

  onSelect(row?: ICollateralMTable) {
    return row ? this.selection.toggle(row) : null;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICollateralMTable): string {
    if (!row) return '';
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderNumber + 1}`;
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.dataSource.filteredData = this.dataSource.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  async onClickAssetDocuments(element: any) {
    const documentList: IUploadMultiFile[] = (element.assetDocuments ?? []).map((dto: any) => {
      return {
        ...dto,
        uploadDate: dto.uploadTimestamp,
      } as IUploadMultiFile;
    });

    const context = {
      documentList,
    };
    await this.notificationService.showCustomDialog({
      component: DocumentListDialogComponent,
      type: 'large',
      iconName: 'icon-Document-Text',
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.DOCUMENT_LIST',
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
      autoWidth: false,
    });
  }

  // Selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.filteredData);
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.filteredData.length;
  }
}
