import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyCommandComponent } from './investigate-property-command.component';

describe('InvestigatePropertyCommandComponent', () => {
  let component: InvestigatePropertyCommandComponent;
  let fixture: ComponentFixture<InvestigatePropertyCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyCommandComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
