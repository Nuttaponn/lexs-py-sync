import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAssetsComponent } from './expense-assets.component';

describe('ExpenseAssetsComponent', () => {
  let component: ExpenseAssetsComponent;
  let fixture: ComponentFixture<ExpenseAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseAssetsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
