import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { UploadMultiFileContentComponent } from '@app/shared/components/upload-multi-file-content/upload-multi-file-content.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { RouterService } from '@shared/services/router.service';
import { IndictmentDetailComponent } from '../indictment-detail/indictment-detail.component';

import { IndictmentMainComponent } from './indictment-main.component';

describe('IndictmentMainComponent', () => {
  let component: IndictmentMainComponent;
  let fixture: ComponentFixture<IndictmentMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IndictmentMainComponent,
        IndictmentDetailComponent,
        ActionBarComponent,
        UploadMultiFileContentComponent,
      ],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration, UntypedFormBuilder, RouterService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndictmentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
