import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralInfoComponent } from './collateral-info.component';

describe('CollateralInfoComponent', () => {
  let component: CollateralInfoComponent;
  let fixture: ComponentFixture<CollateralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollateralInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
