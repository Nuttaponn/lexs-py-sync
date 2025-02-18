import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { UploadMultiFileContentComponent } from './upload-multi-file-content.component';

describe('UploadMultiFileContentComponent', () => {
  let component: UploadMultiFileContentComponent;
  let fixture: ComponentFixture<UploadMultiFileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadMultiFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMultiFileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
