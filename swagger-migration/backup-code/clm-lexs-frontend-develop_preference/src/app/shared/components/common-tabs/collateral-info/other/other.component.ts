import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  MODE = Mode;

  public configTypes: DropDownConfig = {
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทภาระผู้พัน',
  };
  public configStatus: DropDownConfig = {
    searchPlaceHolder: '',
    labelPlaceHolder: 'สถานะภาระผูกพัน',
  };

  public obligationStatusOption: SimpleSelectOption[] = [
    { text: 'มีผู้เช่า', value: 'HAS_RENT' },
    { text: 'ภาระจำยอม', value: 'SURVITUDE' },
  ];
  public obligationTypeOptions: SimpleSelectOption[] = [
    { text: 'ไม่มี', value: 'NONE' },
    { text: 'จำนอง', value: 'MORTAGE' },
    { text: 'จำนำ', value: 'PAWN' },
    { text: 'ขายฝาก', value: 'CONSIGNMENT' },
    { text: 'เช่าซื้อ', value: 'HIRE_PUECHASE' },
  ];

  expropriatePersonOption = [];

  public isMortgage: boolean = true;
  public isPawn: boolean = true;
  public isSellOnCons: boolean = true;
  public isHirePurch: boolean = true;
  public isHirePurchSeized: boolean = true;

  constructor() {
    if (this.mode == this.MODE.VIEW) {
      this.setDropDown();
    }
  }

  ngOnInit(): void {
    this.setDropDown();
  }

  getControl(name: string) {
    return this.control.get(name);
  }

  setDropDown() {
    let desc = this.obligationTypeOptions.find(f => f.value === this.control.get('obligationType')?.value);
    this.control.get('obligationTypeDesc')?.setValue(desc?.text);

    let data = this.obligationStatusOption.find(f => f.value === this.control.get('obligationStatus')?.value);
    this.control.get('obligationStatusDesc')?.setValue(data?.text);
  }
}
