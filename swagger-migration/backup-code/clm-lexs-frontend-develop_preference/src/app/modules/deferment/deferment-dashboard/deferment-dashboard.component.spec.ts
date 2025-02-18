import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentDashboardComponent } from './deferment-dashboard.component';

describe('DefermentDashboardComponent', () => {
  let component: DefermentDashboardComponent;
  let fixture: ComponentFixture<DefermentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
