import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListDialogComponent } from './document-list-dialog.component';

describe('DocumentListDialogComponent', () => {
  let component: DocumentListDialogComponent;
  let fixture: ComponentFixture<DocumentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentListDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
