import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartV2Component } from './doughnut-chart-v2.component';

describe('DoughnutChartV2Component', () => {
  let component: DoughnutChartV2Component;
  let fixture: ComponentFixture<DoughnutChartV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoughnutChartV2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutChartV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
