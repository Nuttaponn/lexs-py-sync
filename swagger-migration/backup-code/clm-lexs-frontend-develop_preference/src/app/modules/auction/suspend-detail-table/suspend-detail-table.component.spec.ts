import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendDetailTableComponent } from './suspend-detail-table.component';

describe('SuspendDetailTableComponent', () => {
  let component: SuspendDetailTableComponent;
  let fixture: ComponentFixture<SuspendDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspendDetailTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
