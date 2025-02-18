import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { DocumentHeaderComponent } from '@shared/components/document-preparation/document-header/document-header.component';
import { MessageEmptyComponent } from '../../message-empty/message-empty.component';

import { DocumentAccountComponent } from './document-account.component';

describe('DocumentAccountComponent', () => {
  let component: DocumentAccountComponent;
  let fixture: ComponentFixture<DocumentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentAccountComponent, DocumentHeaderComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
