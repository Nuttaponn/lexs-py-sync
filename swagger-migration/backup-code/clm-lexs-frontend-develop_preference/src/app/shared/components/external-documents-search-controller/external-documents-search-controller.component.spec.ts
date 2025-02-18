import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDocumentsSearchControllerComponent } from './external-documents-search-controller.component';

describe('ExternalDocumentsSearchControllerComponent', () => {
  let component: ExternalDocumentsSearchControllerComponent;
  let fixture: ComponentFixture<ExternalDocumentsSearchControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalDocumentsSearchControllerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDocumentsSearchControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
