import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionDocumentInfoComponent } from './execution-document-info.component';

describe('ExecutionDocumentInfoComponent', () => {
  let component: ExecutionDocumentInfoComponent;
  let fixture: ComponentFixture<ExecutionDocumentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionDocumentInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionDocumentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
