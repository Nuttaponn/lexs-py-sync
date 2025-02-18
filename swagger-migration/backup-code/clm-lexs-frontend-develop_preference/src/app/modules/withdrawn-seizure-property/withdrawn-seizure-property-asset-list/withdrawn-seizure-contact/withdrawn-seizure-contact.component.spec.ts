import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizureContactComponent } from './withdrawn-seizure-contact.component';

describe('WithdrawnSeizureContactComponent', () => {
  let component: WithdrawnSeizureContactComponent;
  let fixture: ComponentFixture<WithdrawnSeizureContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizureContactComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizureContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
