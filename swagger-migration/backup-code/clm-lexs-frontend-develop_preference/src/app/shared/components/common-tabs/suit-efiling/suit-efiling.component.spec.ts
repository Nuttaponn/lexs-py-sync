import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitEfilingComponent } from './suit-efiling.component';

describe('SuitEfilingComponent', () => {
  let component: SuitEfilingComponent;
  let fixture: ComponentFixture<SuitEfilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitEfilingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitEfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
