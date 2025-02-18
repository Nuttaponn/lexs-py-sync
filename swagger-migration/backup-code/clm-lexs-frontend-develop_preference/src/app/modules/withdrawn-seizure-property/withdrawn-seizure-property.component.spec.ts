import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyComponent } from './withdrawn-seizure-property.component';

describe('WithdrawnSeizurePropertyComponent', () => {
  let component: WithdrawnSeizurePropertyComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
