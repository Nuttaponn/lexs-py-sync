import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizureAddPropertyDialogComponent } from './withdrawn-seizure-add-property-dialog.component';

describe('WithdrawnSeizureAddPropertyDialogComponent', () => {
  let component: WithdrawnSeizureAddPropertyDialogComponent;
  let fixture: ComponentFixture<WithdrawnSeizureAddPropertyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizureAddPropertyDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizureAddPropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
