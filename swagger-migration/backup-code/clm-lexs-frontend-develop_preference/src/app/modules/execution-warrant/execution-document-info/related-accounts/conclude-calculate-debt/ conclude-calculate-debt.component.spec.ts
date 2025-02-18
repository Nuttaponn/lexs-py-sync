import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcludeCalculateDebtComponent } from './conclude-calculate-debt.component';

describe('CalculateDebtDetailComponent', () => {
  let component: ConcludeCalculateDebtComponent;
  let fixture: ComponentFixture<ConcludeCalculateDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcludeCalculateDebtComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcludeCalculateDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
