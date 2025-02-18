import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEditAnnouncementDialogComponent } from './submit-edit-announcement-dialog.component';

describe('SubmitEditAnnouncementDialogComponent', () => {
  let component: SubmitEditAnnouncementDialogComponent;
  let fixture: ComponentFixture<SubmitEditAnnouncementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitEditAnnouncementDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitEditAnnouncementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
