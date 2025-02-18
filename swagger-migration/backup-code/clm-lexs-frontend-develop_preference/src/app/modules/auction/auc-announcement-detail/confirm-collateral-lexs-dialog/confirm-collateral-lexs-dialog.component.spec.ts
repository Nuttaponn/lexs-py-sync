import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCollateralLexsDialogComponent } from './confirm-collateral-lexs-dialog.component';

describe('ConfirmCollateralLexsDialogComponent', () => {
  let component: ConfirmCollateralLexsDialogComponent;
  let fixture: ComponentFixture<ConfirmCollateralLexsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCollateralLexsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCollateralLexsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
