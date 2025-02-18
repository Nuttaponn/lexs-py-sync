import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtFeeFormComponent } from './court-fee-form.component';

describe('CourtFeeFormComponent', () => {
  let component: CourtFeeFormComponent;
  let fixture: ComponentFixture<CourtFeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtFeeFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtFeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
