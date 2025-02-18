import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCopyDialogComponent } from './download-copy-dialog.component';

describe('DownloadCopyDialogComponent', () => {
  let component: DownloadCopyDialogComponent;
  let fixture: ComponentFixture<DownloadCopyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadCopyDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
