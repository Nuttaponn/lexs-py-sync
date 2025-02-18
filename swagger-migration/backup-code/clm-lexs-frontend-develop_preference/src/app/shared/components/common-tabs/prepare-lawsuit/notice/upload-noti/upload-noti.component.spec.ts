import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFileContentComponent } from '@app/shared/components/upload-file-content/upload-file-content.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { UploadNotiComponent } from './upload-noti.component';

describe('UploadNotiComponent', () => {
  let component: UploadNotiComponent;
  let fixture: ComponentFixture<UploadNotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadNotiComponent, UploadFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
