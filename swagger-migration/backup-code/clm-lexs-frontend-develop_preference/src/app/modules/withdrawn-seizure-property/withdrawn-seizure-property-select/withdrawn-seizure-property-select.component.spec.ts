import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertySelectComponent } from './withdrawn-seizure-property-select.component';

describe('WithdrawnSeizurePropertySelectComponent', () => {
  let component: WithdrawnSeizurePropertySelectComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertySelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
