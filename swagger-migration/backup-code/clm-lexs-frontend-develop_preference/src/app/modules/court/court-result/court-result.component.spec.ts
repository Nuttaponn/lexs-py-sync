import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtResultComponent } from './court-result.component';

describe('CourtResultComponent', () => {
  let component: CourtResultComponent;
  let fixture: ComponentFixture<CourtResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
