import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionCaseInfoComponent } from './execution-case-info.component';

describe('ExecutionCaseInfoComponent', () => {
  let component: ExecutionCaseInfoComponent;
  let fixture: ComponentFixture<ExecutionCaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionCaseInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionCaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
