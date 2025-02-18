import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyMoveDialogComponent } from './withdrawn-seizure-property-move-dialog.component';

describe('WithdrawnSeizurePropertyMoveDialogComponent', () => {
  let component: WithdrawnSeizurePropertyMoveDialogComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyMoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyMoveDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyMoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
