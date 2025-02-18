import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizurePropertyComponent } from './seizure-property.component';

describe('SeizurePropertyComponent', () => {
  let component: SeizurePropertyComponent;
  let fixture: ComponentFixture<SeizurePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizurePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizurePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
