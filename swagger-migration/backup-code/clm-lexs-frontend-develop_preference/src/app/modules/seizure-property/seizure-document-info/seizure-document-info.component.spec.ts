import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizureDocumentInfoComponent } from './seizure-document-info.component';

describe('SeizureDocumentInfoComponent', () => {
  let component: SeizureDocumentInfoComponent;
  let fixture: ComponentFixture<SeizureDocumentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizureDocumentInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizureDocumentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
