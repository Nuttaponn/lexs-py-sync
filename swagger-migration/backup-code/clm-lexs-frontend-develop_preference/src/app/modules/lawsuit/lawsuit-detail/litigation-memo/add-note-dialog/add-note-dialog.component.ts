import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Mode } from '@app/shared/models';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss'],
})
export class AddNoteDialogComponent {
  mode = Mode.ADD;

  constructor() {}

  public detailControl: UntypedFormControl = new UntypedFormControl('', Validators.required);

  dataContext(data: any) {
    this.mode = data.mode;

    if (this.mode === Mode.EDIT) {
      this.detailControl.setValue(data.detail ?? '');
    }
  }

  public async onClose(): Promise<boolean> {
    if (this.detailControl.errors) {
      this.detailControl.markAllAsTouched();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    return this.detailControl.value;
  }
}
