import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecreeDetailComponent } from './decree-detail.component';

describe('DecreeDetailComponent', () => {
  let component: DecreeDetailComponent;
  let fixture: ComponentFixture<DecreeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecreeDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecreeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
