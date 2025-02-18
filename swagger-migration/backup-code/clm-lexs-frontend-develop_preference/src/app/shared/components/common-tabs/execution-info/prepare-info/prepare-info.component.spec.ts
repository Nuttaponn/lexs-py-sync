import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareInfoComponent } from './prepare-info.component';

describe('PrepareInfoComponent', () => {
  let component: PrepareInfoComponent;
  let fixture: ComponentFixture<PrepareInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepareInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
