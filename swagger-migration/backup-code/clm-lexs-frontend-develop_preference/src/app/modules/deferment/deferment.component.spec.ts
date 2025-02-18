import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentComponent } from './deferment.component';

describe('DefermentComponent', () => {
  let component: DefermentComponent;
  let fixture: ComponentFixture<DefermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
