/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SeizureUploadDialogService } from './seizure-upload-dialog.service';

describe('Service: SeizureUploadDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeizureUploadDialogService],
    });
  });

  it('should ...', inject([SeizureUploadDialogService], (service: SeizureUploadDialogService) => {
    expect(service).toBeTruthy();
  }));
});
