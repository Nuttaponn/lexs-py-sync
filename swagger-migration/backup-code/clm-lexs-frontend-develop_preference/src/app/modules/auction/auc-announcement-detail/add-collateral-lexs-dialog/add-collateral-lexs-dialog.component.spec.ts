import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollateralLexsDialogComponent } from './add-collateral-lexs-dialog.component';

describe('AddCollateralLexsDialogComponent', () => {
  let component: AddCollateralLexsDialogComponent;
  let fixture: ComponentFixture<AddCollateralLexsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollateralLexsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCollateralLexsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
