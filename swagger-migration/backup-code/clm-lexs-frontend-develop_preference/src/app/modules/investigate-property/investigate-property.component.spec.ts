import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyComponent } from './investigate-property.component';

describe('InvestigatePropertyComponent', () => {
  let component: InvestigatePropertyComponent;
  let fixture: ComponentFixture<InvestigatePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
