import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { StockCertificationComponent } from './stock-certification.component';

describe('StockCertificationComponent', () => {
  let component: StockCertificationComponent;
  let fixture: ComponentFixture<StockCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockCertificationComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
