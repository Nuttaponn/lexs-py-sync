import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizureResultDetailComponent } from './seizure-result-detail.component';

describe('SeizureResultDetailComponent', () => {
  let component: SeizureResultDetailComponent;
  let fixture: ComponentFixture<SeizureResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizureResultDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizureResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
