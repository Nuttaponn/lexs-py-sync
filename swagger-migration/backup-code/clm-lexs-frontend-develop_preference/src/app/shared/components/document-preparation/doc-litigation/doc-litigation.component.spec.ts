import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { MessageEmptyComponent } from '../../message-empty/message-empty.component';

import { DocLitigationComponent } from './doc-litigation.component';

describe('DocLitigationComponent', () => {
  let component: DocLitigationComponent;
  let fixture: ComponentFixture<DocLitigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocLitigationComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocLitigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
