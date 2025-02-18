import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilCaseInfoComponent } from './civil-case-info.component';

describe('CivilCaseInfoComponent', () => {
  let component: CivilCaseInfoComponent;
  let fixture: ComponentFixture<CivilCaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CivilCaseInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilCaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
