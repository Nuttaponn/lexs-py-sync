import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyDetailComponent } from './investigate-property-detail.component';

describe('InvestigatePropertyDetailComponent', () => {
  let component: InvestigatePropertyDetailComponent;
  let fixture: ComponentFixture<InvestigatePropertyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
