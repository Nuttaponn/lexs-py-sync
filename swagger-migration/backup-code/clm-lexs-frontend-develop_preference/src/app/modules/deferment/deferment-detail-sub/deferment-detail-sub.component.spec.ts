import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentDetailSubComponent } from './deferment-detail-sub.component';

describe('DefermentDetailSubComponent', () => {
  let component: DefermentDetailSubComponent;
  let fixture: ComponentFixture<DefermentDetailSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentDetailSubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentDetailSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
