import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnReasonComponent } from './withdrawn-reason.component';

describe('WithdrawnReasonComponent', () => {
  let component: WithdrawnReasonComponent;
  let fixture: ComponentFixture<WithdrawnReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnReasonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
