import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentDetailComponent } from './deferment-detail.component';

describe('DefermentDetailComponent', () => {
  let component: DefermentDetailComponent;
  let fixture: ComponentFixture<DefermentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
