import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxDialogTableComponent } from './checkbox-dialog-table.component';

describe('CheckboxDialogTableComponent', () => {
  let component: CheckboxDialogTableComponent;
  let fixture: ComponentFixture<CheckboxDialogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxDialogTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxDialogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
