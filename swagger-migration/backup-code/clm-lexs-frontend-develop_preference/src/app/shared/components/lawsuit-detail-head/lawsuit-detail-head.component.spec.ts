import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawsuitDetailHeadComponent } from './lawsuit-detail-head.component';

describe('LawsuitDetailHeadComponent', () => {
  let component: LawsuitDetailHeadComponent;
  let fixture: ComponentFixture<LawsuitDetailHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LawsuitDetailHeadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawsuitDetailHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
