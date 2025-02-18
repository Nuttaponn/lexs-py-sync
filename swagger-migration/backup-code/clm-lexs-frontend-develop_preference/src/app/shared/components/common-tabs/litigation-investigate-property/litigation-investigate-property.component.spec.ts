import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationInvestigatePropertyComponent } from './litigation-investigate-property.component';

describe('LitigationInvestigatePropertyComponent', () => {
  let component: LitigationInvestigatePropertyComponent;
  let fixture: ComponentFixture<LitigationInvestigatePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LitigationInvestigatePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LitigationInvestigatePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
