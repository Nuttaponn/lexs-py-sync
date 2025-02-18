import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigationMemoComponent } from './litigation-memo.component';

describe('LitigationMemoComponent', () => {
  let component: LitigationMemoComponent;
  let fixture: ComponentFixture<LitigationMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LitigationMemoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LitigationMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
