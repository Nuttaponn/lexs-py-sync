import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizureUploadDialogComponent } from './seizure-upload-dialog.component';

describe('SeizureUploadDialogComponent', () => {
  let component: SeizureUploadDialogComponent;
  let fixture: ComponentFixture<SeizureUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizureUploadDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizureUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
