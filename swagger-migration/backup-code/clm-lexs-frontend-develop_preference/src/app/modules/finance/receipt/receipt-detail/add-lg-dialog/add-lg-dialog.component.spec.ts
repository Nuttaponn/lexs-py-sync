import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLgDialogComponent } from './add-lg-dialog.component';

describe('AddLgDialogComponent', () => {
  let component: AddLgDialogComponent;
  let fixture: ComponentFixture<AddLgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLgDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
