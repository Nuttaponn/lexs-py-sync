import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseLgDetailComponent } from './close-lg-detail.component';

describe('CloseLgDetailComponent', () => {
  let component: CloseLgDetailComponent;
  let fixture: ComponentFixture<CloseLgDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseLgDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseLgDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
