import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReleaseAnnouncementDialogComponent } from './submit-release-announcement-dialog.component';

describe('SubmitReleaseAnnouncementDialogComponent', () => {
  let component: SubmitReleaseAnnouncementDialogComponent;
  let fixture: ComponentFixture<SubmitReleaseAnnouncementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitReleaseAnnouncementDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReleaseAnnouncementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
