import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundInfoKcorpComponent } from './refund-info-kcorp.component';

describe('RefundInfoKcorpComponent', () => {
  let component: RefundInfoKcorpComponent;
  let fixture: ComponentFixture<RefundInfoKcorpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundInfoKcorpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundInfoKcorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
