import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelatedPersonLawsuitComponent } from './add-related-person-lawsuit.component';

describe('AddRelatedPersonLawsuitComponent', () => {
  let component: AddRelatedPersonLawsuitComponent;
  let fixture: ComponentFixture<AddRelatedPersonLawsuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRelatedPersonLawsuitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelatedPersonLawsuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
