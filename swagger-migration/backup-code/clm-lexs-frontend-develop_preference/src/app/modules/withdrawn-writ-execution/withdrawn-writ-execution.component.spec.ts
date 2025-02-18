import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnWritExecutionComponent } from './withdrawn-writ-execution.component';

describe('WithdrawnWritExecutionComponent', () => {
  let component: WithdrawnWritExecutionComponent;
  let fixture: ComponentFixture<WithdrawnWritExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnWritExecutionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnWritExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
