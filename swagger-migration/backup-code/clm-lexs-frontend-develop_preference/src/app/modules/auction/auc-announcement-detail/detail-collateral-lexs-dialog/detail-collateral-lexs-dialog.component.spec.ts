import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCollateralLexsDialogComponent } from './detail-collateral-lexs-dialog.component';

describe('DetailCollateralLexsDialogComponent', () => {
  let component: DetailCollateralLexsDialogComponent;
  let fixture: ComponentFixture<DetailCollateralLexsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCollateralLexsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCollateralLexsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
