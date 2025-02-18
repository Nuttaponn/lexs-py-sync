import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizurePropertyViewComponent } from './seizure-property-view.component';

describe('SeizurePropertyViewComponent', () => {
  let component: SeizurePropertyViewComponent;
  let fixture: ComponentFixture<SeizurePropertyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizurePropertyViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizurePropertyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
