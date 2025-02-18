import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizurePropertyInfoComponent } from './seizure-property-info.component';

describe('SeizurePropertyInfoComponent', () => {
  let component: SeizurePropertyInfoComponent;
  let fixture: ComponentFixture<SeizurePropertyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizurePropertyInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizurePropertyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
