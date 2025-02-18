import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnoucementKtbFinishedComponent } from './auc-annoucement-ktb-finished.component';

describe('AucAnnoucementKtbFinishedComponent', () => {
  let component: AucAnnoucementKtbFinishedComponent;
  let fixture: ComponentFixture<AucAnnoucementKtbFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnoucementKtbFinishedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnoucementKtbFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
