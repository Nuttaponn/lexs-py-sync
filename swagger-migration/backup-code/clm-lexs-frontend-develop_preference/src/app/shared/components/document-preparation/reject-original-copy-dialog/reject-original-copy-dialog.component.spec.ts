import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectOriginalCopyDialogComponent } from './reject-original-copy-dialog.component';

describe('RejectOriginalCopyDialogComponent', () => {
  let component: RejectOriginalCopyDialogComponent;
  let fixture: ComponentFixture<RejectOriginalCopyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectOriginalCopyDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectOriginalCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
