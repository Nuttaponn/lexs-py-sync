import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnoucementKtbComponent } from './auc-annoucement-ktb.component';

describe('AucAnnoucementKtbComponent', () => {
  let component: AucAnnoucementKtbComponent;
  let fixture: ComponentFixture<AucAnnoucementKtbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnoucementKtbComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnoucementKtbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
