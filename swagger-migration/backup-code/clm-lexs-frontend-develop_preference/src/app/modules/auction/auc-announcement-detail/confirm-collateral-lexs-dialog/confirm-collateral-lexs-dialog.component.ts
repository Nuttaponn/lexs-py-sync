import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NameValuePair, AuctionDeedInfoMatchRequest } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { saleTypeDescOptions } from '../../auction.const';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-confirm-collateral-lexs-dialog',
  templateUrl: './confirm-collateral-lexs-dialog.component.html',
  styleUrl: './confirm-collateral-lexs-dialog.component.scss'
})
export class ConfirmCollateralLexsDialogComponent {

  public messageBanner = 'AUCTION.MSG_BANNER_AUC_COLLATERAL_LEXS_SAVE';
  private aucRef!: number;
  private deedGroupNo!: string;
  public dataSource: Array<any> = [];
  public displayedColumns: string[] = ['index', 'collateralGroup', 'numberOfCollateral', 'salesMethod', 'outsiderCollateralPrice', 'substituteCollateralPrice', 'specialistCollateralPrice', 'officerExCollateralPrice', 'officerCtCollateralPrice', 'officerEsCollateralPrice'];

  public form!: FormGroup;

  public saleTypeDescConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'วิธีการขาย',
  };
  public saleTypeDescOptions: NameValuePair[] = saleTypeDescOptions;

  constructor(private fb: FormBuilder, private auctionService: AuctionService) { }

  dataContext(data: any) {
    this.dataSource = data.dataSelected,
    this.aucRef = data.aucRef
    this.deedGroupNo = data.deedGroupNo
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      rows: this.fb.array(this.getInitialRows())
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  private getInitialRows() {
    console.log('this.dataSource ===> getInitialRows', this.dataSource)
    return this.dataSource.map(item =>
      this.fb.group({
        collateralId: [item.collateralId],
        numberOfCollateral: [item.numberOfCollateral],
        ledName: [item.ledName],
        lexsCollateralTypeDesc: [item.lexsCollateralTypeDesc],
        lexsCollateralSubTypeDesc: [item.lexsCollateralSubTypeDesc],
        lexsCollateralsDescription: [item.lexsCollateralsDescription],
        lexsDefendant: [item.lexsDefendant],
        lexsDocumentNo: [item.lexsDocumentNo],
        lexsOwnerFullName: [item.lexsOwnerFullName],
        lexsPlaintiffName: [item.lexsPlaintiffName],
        proprietaryType: [item.proprietaryType],
        remark: [item.remark],
        assetObligationBy: [item.assetObligationBy],
        colGroup: [item.colGroup],
        lexsRedCaseNo: [item.lexsRedCaseNo],
        saleTypeDesc: [item.saleTypeDesc, Validators.required],
        reserveFund: [item.reserveFund],
        reserveFund1: [item.reserveFund1, Validators.required],
        assetPrice2: [item.assetPrice2],
        assetPrice3: [item.assetPrice3],
        assetPrice4: [item.assetPrice4],
        assetPrice5: [item.assetPrice5],
        isView: [item.isView]
      })
    );
  }

  async onSubmitAddCollateral() {
    const getFormValue = this.form.get('rows')?.getRawValue()
    const aucRef = this.aucRef;
    const auctionDeedInfoMatchRequest: AuctionDeedInfoMatchRequest = {
      collateralGroups: getFormValue.map((item: any) => {
        return {
          deedGroupNo: this.deedGroupNo,
          saleTypeDesc: item.saleTypeDesc,
          reserveFund: Number(item.reserveFund),
          reserveFund1: Number(item.reserveFund1),
          assetPrice2: Number(item.assetPrice2),
          assetPrice3: Number(item.assetPrice3),
          assetPrice4: Number(item.assetPrice4),
          assetPrice5: Number(item.assetPrice5),
          collaterals: [
            {
              collateralId: item.collateralId,
              assetId: 0,
              occupant: item.proprietaryType,
              remark: item.remark
            }
          ]
        }
      })
    }
    const result = await this.auctionService.postDeedInfoMatch(aucRef, auctionDeedInfoMatchRequest)
    console.log("🚀 ~ result:", result)
  }

  async onClose() {
    if (this.form.get('rows')?.invalid) {
      return false
    }
    await this.onSubmitAddCollateral()
    return true
  }

  get returnData() {
    return this.rows;
  }
}
