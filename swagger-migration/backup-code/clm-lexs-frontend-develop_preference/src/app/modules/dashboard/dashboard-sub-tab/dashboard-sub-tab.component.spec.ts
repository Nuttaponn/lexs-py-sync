import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSubTabComponent } from './dashboard-sub-tab.component';

describe('DashboardSubTabComponent', () => {
  let component: DashboardSubTabComponent;
  let fixture: ComponentFixture<DashboardSubTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSubTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
