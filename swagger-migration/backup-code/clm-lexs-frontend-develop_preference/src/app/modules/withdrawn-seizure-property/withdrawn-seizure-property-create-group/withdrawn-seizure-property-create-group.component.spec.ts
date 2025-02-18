import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyCreateGroupComponent } from './withdrawn-seizure-property-create-group.component';

describe('WithdrawnSeizurePropertyCreateGroupComponent', () => {
  let component: WithdrawnSeizurePropertyCreateGroupComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyCreateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyCreateGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyCreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
