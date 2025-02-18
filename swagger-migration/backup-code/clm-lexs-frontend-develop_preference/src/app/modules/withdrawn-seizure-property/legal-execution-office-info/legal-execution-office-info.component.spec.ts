import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalExecutionOfficeInfoComponent } from './legal-execution-office-info.component';

describe('LegalExecutionOfficeInfoComponent', () => {
  let component: LegalExecutionOfficeInfoComponent;
  let fixture: ComponentFixture<LegalExecutionOfficeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalExecutionOfficeInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalExecutionOfficeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
