import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionWarrantComponent } from './execution-warrant.component';

describe('ExecutionWarrantComponent', () => {
  let component: ExecutionWarrantComponent;
  let fixture: ComponentFixture<ExecutionWarrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionWarrantComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionWarrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
