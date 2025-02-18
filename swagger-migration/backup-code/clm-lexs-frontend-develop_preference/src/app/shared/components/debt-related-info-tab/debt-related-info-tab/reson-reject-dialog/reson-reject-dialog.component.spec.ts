import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResonRejectDialogComponent } from './reson-reject-dialog.component';

describe('ResonRejectDialogComponent', () => {
  let component: ResonRejectDialogComponent;
  let fixture: ComponentFixture<ResonRejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResonRejectDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResonRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
