import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedAccountsComponent } from './related-accounts.component';
describe('RelatedAccountsComponent', () => {
  let component: RelatedAccountsComponent;
  let fixture: ComponentFixture<RelatedAccountsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedAccountsComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
