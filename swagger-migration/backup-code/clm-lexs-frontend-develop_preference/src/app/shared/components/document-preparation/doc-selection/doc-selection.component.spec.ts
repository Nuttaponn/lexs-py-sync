import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { MessageBannerComponent } from '../../message-banner/message-banner.component';
import { MessageEmptyComponent } from '../../message-empty/message-empty.component';

import { DocSelectionComponent } from './doc-selection.component';

describe('DocSelectionComponent', () => {
  let component: DocSelectionComponent;
  let fixture: ComponentFixture<DocSelectionComponent>;

  const mockDocumentTemplate = {
    documentGroup: 'PERSON_LCS',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocSelectionComponent, MessageBannerComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [
        ...UnittestProviders,
        Configuration,
        { provide: MAT_DIALOG_DATA, useValue: { documentTemplate: mockDocumentTemplate } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
