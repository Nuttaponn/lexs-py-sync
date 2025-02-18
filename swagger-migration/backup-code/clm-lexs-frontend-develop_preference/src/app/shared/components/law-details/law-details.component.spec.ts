import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawDetailsComponent } from './law-details.component';

describe('LawDetailsComponent', () => {
  let component: LawDetailsComponent;
  let fixture: ComponentFixture<LawDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LawDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
