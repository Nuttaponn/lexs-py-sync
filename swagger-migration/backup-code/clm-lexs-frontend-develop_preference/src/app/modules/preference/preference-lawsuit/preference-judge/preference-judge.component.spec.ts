import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceJudgeComponent } from './preference-judge.component';

describe('PreferenceJudgeComponent', () => {
  let component: PreferenceJudgeComponent;
  let fixture: ComponentFixture<PreferenceJudgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceJudgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceJudgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
