import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefendantTableComponent } from './defendant-table.component';

describe('DefendantTableComponent', () => {
  let component: DefendantTableComponent;
  let fixture: ComponentFixture<DefendantTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefendantTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefendantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
