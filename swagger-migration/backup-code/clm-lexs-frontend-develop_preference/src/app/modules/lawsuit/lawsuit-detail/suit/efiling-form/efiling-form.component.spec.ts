import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfilingFormComponent } from './efiling-form.component';

describe('EfilingFormComponent', () => {
  let component: EfilingFormComponent;
  let fixture: ComponentFixture<EfilingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EfilingFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EfilingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
