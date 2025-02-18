import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelatedPersonLegalComponent } from './add-related-person-legal.component';

describe('AddRelatedPersonLegalComponent', () => {
  let component: AddRelatedPersonLegalComponent;
  let fixture: ComponentFixture<AddRelatedPersonLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRelatedPersonLegalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelatedPersonLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
