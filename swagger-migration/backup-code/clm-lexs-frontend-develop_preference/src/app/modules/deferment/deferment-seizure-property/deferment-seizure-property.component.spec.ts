import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentSeizurePropertyComponent } from './deferment-seizure-property.component';

describe('DefermentSeizurePropertyComponent', () => {
  let component: DefermentSeizurePropertyComponent;
  let fixture: ComponentFixture<DefermentSeizurePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentSeizurePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentSeizurePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
