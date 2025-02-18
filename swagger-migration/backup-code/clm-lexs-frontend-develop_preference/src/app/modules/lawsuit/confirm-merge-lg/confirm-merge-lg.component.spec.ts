import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { ConfirmMergeLgComponent } from './confirm-merge-lg.component';

describe('ConfirmMergeLgComponent', () => {
  let component: ConfirmMergeLgComponent;
  let fixture: ComponentFixture<ConfirmMergeLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmMergeLgComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMergeLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
