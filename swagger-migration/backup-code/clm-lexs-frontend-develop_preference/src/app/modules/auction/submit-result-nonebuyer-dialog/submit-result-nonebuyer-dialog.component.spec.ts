import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitResultNonebuyerDialogComponent } from './submit-result-nonebuyer-dialog.component';

describe('SubmitResultNonebuyerDialogComponent', () => {
  let component: SubmitResultNonebuyerDialogComponent;
  let fixture: ComponentFixture<SubmitResultNonebuyerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitResultNonebuyerDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitResultNonebuyerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
