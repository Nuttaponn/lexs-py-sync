import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtVerdictDetailComponent } from './court-verdict-detail.component';

describe('CourtVerdictDetailComponent', () => {
  let component: CourtVerdictDetailComponent;
  let fixture: ComponentFixture<CourtVerdictDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtVerdictDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtVerdictDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
