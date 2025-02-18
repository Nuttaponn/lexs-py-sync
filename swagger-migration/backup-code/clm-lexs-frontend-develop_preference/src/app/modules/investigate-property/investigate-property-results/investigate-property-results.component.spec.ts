import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyResultsComponent } from './investigate-property-results.component';

describe('InvestigatePropertyResultsComponent', () => {
  let component: InvestigatePropertyResultsComponent;
  let fixture: ComponentFixture<InvestigatePropertyResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
