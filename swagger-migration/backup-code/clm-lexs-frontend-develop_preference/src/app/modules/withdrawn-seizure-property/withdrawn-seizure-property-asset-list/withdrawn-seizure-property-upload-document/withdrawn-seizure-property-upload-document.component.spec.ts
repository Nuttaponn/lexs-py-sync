import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyUploadDocumentComponent } from './withdrawn-seizure-property-upload-document.component';

describe('WithdrawnSeizurePropertyUploadDocumentComponent', () => {
  let component: WithdrawnSeizurePropertyUploadDocumentComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyUploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyUploadDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
