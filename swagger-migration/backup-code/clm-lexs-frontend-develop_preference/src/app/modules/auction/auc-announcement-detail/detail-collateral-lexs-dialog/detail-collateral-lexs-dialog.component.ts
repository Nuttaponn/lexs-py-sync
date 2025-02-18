import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-detail-collateral-lexs-dialog',
  templateUrl: './detail-collateral-lexs-dialog.component.html',
  styleUrl: './detail-collateral-lexs-dialog.component.scss'
})
export class DetailCollateralLexsDialogComponent {

  public messageBanner = 'กรุณาระบุ ชุดทรัพย์ และ ประเภทกรรมสิทธิ์';
  public dataSource: Array<any> = [];
  public displayedColumns: string[] = ['index', 'collateralGroup', 'collateralType', 'subCollateralType', 'documentNumber', 'collateralDetails', 'redCase', 'salesMethod', 'mortgagee', 'ownerName', 'accuser', 'defendant', 'proprietaryType', 'ledName', 'remark'];
  public occupantTypeConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    displayWith:'name',
    labelPlaceHolder: 'ประเภทกรรมสิทธิ์',
  };
  public occupantOptions = [];
  placetext = 'จำนวน'
  public dataConfirm : any;
  public form!: FormGroup;
  public isSubmited: boolean = false;
  constructor(private fb: FormBuilder) {}

  dataContext(data: any) {
    this.dataSource = data.dataSelected;
    this.occupantOptions = data.occupantOptions;
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
    return this.dataSource.map((item) =>
      this.fb.group({
        collateralId: [item.collateralId],
        lexsCollateralTypeDesc: [item.lexsCollateralTypeDesc],
        lexsCollateralSubTypeDesc: [item.lexsCollateralSubTypeDesc],
        lexsDocumentNo: [item.lexsDocumentNo],
        lexsCollateralsDescription: [item.lexsCollateralsDescription],
        lexsRedCaseNo: [item.lexsRedCaseNo],
        salesMethod: [item.salesMethod],
        assetObligationBy: [item.assetObligationBy],
        lexsOwnerFullName: [item.lexsOwnerFullName],
        lexsPlaintiffName: [item.lexsPlaintiffName],
        lexsDefendant: [item.lexsDefendant[0]?.name],
        ledName: [item.ledName],
        colGroup: ['', Validators.required],
        proprietaryType: ['ประเภทกรรมสิทธิ์', Validators.required],
        remark: ['']
      })
    );
  }

  onSelectedProprietaryType(data: string, index: number) {
    console.log("🚀 ~ index:", index)
    console.log("🚀 ~ data:", data)
  }

  async onClose() {
    if(this.rows.invalid) {
      this.isSubmited = true
      return false
    }
    return true
  }

  get returnData() {
    return this.rows;
  }
}
