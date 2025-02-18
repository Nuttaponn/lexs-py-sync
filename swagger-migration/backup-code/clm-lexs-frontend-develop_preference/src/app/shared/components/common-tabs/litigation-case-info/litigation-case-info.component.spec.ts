import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationCaseInfoComponent } from './litigation-case-info.component';

describe('LitigationCaseInfoComponent', () => {
  let component: LitigationCaseInfoComponent;
  let fixture: ComponentFixture<LitigationCaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LitigationCaseInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LitigationCaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
