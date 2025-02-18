import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseLgComponent } from './close-lg.component';

describe('CloseLgComponent', () => {
  let component: CloseLgComponent;
  let fixture: ComponentFixture<CloseLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseLgComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
