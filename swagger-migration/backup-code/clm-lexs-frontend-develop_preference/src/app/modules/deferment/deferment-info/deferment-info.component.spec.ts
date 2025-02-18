import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentInfoComponent } from './deferment-info.component';

describe('DefermentInfoComponent', () => {
  let component: DefermentInfoComponent;
  let fixture: ComponentFixture<DefermentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
