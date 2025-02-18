import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizureAddContactDialogComponent } from './withdrawn-seizure-add-contact-dialog.component';

describe('WithdrawnSeizureAddContactDialogComponent', () => {
  let component: WithdrawnSeizureAddContactDialogComponent;
  let fixture: ComponentFixture<WithdrawnSeizureAddContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizureAddContactDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizureAddContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
