import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileDropdownComponent } from './upload-file-dropdown.component';

describe('UploadFileDropdownComponent', () => {
  let component: UploadFileDropdownComponent;
  let fixture: ComponentFixture<UploadFileDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFileDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
