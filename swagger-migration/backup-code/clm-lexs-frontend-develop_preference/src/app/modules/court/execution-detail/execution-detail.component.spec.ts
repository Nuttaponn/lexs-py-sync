import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionDetailComponent } from './execution-detail.component';

describe('ExecutionDetailComponent', () => {
  let component: ExecutionDetailComponent;
  let fixture: ComponentFixture<ExecutionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
