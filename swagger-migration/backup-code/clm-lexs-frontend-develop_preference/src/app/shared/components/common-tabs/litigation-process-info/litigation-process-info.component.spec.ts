import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationProcessInfoComponent } from './litigation-process-info.component';

describe('LitigationProcessInfoComponent', () => {
  let component: LitigationProcessInfoComponent;
  let fixture: ComponentFixture<LitigationProcessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LitigationProcessInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LitigationProcessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
