import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementCollateralSetDialogComponent } from './auc-announement-collateral-set-dialog.component';

describe('AucAnnounementCollateralSetDialogComponent', () => {
  let component: AucAnnounementCollateralSetDialogComponent;
  let fixture: ComponentFixture<AucAnnounementCollateralSetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnounementCollateralSetDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnounementCollateralSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
