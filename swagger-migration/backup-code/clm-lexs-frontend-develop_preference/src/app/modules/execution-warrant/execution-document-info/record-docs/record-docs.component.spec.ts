import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDocsComponent } from './record-docs.component';

describe('RecordDocsComponent', () => {
  let component: RecordDocsComponent;
  let fixture: ComponentFixture<RecordDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordDocsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
