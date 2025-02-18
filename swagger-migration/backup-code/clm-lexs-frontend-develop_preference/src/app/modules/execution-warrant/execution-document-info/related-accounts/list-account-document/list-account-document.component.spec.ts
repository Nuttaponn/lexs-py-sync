import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAccountDocumentComponent } from './list-account-document.component';

describe('CalculateDebtDetailComponent', () => {
  let component: ListAccountDocumentComponent;
  let fixture: ComponentFixture<ListAccountDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAccountDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccountDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
