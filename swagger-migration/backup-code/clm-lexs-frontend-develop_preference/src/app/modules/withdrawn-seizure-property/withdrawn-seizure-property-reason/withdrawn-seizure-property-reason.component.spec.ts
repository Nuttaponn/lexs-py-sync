import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyReasonComponent } from './withdrawn-seizure-property-reason.component';

describe('WithdrawnSeizurePropertyReasonComponent', () => {
  let component: WithdrawnSeizurePropertyReasonComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyReasonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
