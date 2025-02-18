import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyResultsTableComponent } from './investigate-property-results-table.component';

describe('InvestigatePropertyResultsTableComponent', () => {
  let component: InvestigatePropertyResultsTableComponent;
  let fixture: ComponentFixture<InvestigatePropertyResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyResultsTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
