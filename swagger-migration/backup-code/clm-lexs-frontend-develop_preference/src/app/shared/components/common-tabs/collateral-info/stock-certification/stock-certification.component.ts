import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';

@Component({
  selector: 'app-stock-certification',
  templateUrl: './stock-certification.component.html',
  styleUrls: ['./stock-certification.component.scss'],
})
export class StockCertificationComponent {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  MODE = Mode;

  constructor() {}

  getControl(name: string) {
    return this.control.get(name);
  }
}
