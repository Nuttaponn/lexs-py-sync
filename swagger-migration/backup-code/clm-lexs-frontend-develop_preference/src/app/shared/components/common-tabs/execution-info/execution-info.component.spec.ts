import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionInfoComponent } from './execution-info.component';

describe('ExecutionInfoComponent', () => {
  let component: ExecutionInfoComponent;
  let fixture: ComponentFixture<ExecutionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
