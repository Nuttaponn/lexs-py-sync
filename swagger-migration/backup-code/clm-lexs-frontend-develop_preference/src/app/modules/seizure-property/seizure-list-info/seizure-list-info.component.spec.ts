import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizureListInfoComponent } from './seizure-list-info.component';

describe('SeizureListInfoComponent', () => {
  let component: SeizureListInfoComponent;
  let fixture: ComponentFixture<SeizureListInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizureListInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizureListInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
