import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCollateralComponent } from './detail-collateral.component';

describe('DetailCollateralComponent', () => {
  let component: DetailCollateralComponent;
  let fixture: ComponentFixture<DetailCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
