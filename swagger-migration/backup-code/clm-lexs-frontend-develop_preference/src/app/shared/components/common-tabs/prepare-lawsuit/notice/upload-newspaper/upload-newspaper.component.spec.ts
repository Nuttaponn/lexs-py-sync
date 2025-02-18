import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFileContentComponent } from '@app/shared/components/upload-file-content/upload-file-content.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { UploadNewspaperComponent } from './upload-newspaper.component';

describe('UploadNewspaperComponent', () => {
  let component: UploadNewspaperComponent;
  let fixture: ComponentFixture<UploadNewspaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadNewspaperComponent, UploadFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewspaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
