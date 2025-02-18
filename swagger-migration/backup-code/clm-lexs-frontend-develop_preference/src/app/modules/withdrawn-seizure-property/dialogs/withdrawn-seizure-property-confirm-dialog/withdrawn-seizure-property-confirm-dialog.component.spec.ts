import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyConfirmDialogComponent } from './withdrawn-seizure-property-confirm-dialog.component';

describe('WithdrawnSeizurePropertyConfirmDialogComponent', () => {
  let component: WithdrawnSeizurePropertyConfirmDialogComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyConfirmDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
