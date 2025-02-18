import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizurePropertyItemComponent } from './seizure-property-item.component';

describe('SeizurePropertyItemComponent', () => {
  let component: SeizurePropertyItemComponent;
  let fixture: ComponentFixture<SeizurePropertyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizurePropertyItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizurePropertyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
