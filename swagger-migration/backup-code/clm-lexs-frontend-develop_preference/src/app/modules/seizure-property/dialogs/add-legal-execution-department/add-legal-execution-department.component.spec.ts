import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLegalExecutionDepartmentComponent } from './add-legal-execution-department.component';

describe('AddLegalExecutionDepartmentComponent', () => {
  let component: AddLegalExecutionDepartmentComponent;
  let fixture: ComponentFixture<AddLegalExecutionDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLegalExecutionDepartmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLegalExecutionDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
