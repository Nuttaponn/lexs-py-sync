import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { LandInfoComponent } from './land-info.component';

describe('LandInfoComponent', () => {
  let component: LandInfoComponent;
  let fixture: ComponentFixture<LandInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandInfoComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
