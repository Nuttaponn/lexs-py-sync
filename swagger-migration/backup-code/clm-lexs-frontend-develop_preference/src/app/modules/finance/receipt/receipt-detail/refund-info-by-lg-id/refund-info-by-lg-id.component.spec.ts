import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundInfoByLgIdComponent } from './refund-info-by-lg-id.component';

describe('RefundInfoByLgIdComponent', () => {
  let component: RefundInfoByLgIdComponent;
  let fixture: ComponentFixture<RefundInfoByLgIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundInfoByLgIdComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundInfoByLgIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
