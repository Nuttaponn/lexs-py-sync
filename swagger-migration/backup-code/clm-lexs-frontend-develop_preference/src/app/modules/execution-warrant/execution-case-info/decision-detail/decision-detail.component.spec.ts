import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionDetailComponent } from './decision-detail.component';

describe('DecisionDetailComponent', () => {
  let component: DecisionDetailComponent;
  let fixture: ComponentFixture<DecisionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecisionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
