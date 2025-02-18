import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Mode } from '@app/shared/models';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss'],
})
export class MachineComponent {
  @Input() control!: UntypedFormGroup;
  @Input() mode: string = '';
  MODE = Mode;
  constructor() {}

  getControl(name: string) {
    return this.control.get(name);
  }
}
