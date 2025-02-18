import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitEfilingCivilComponent } from './suit-efiling-civil.component';

describe('SuitEfilingCivilComponent', () => {
  let component: SuitEfilingCivilComponent;
  let fixture: ComponentFixture<SuitEfilingCivilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitEfilingCivilComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitEfilingCivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
