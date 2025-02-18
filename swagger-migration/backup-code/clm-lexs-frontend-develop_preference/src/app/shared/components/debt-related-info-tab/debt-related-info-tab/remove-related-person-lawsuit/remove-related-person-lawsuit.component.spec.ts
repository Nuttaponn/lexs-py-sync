import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRelatedPersonLawsuitComponent } from './remove-related-person-lawsuit.component';

describe('RemoveRelatedPersonLawsuitComponent', () => {
  let component: RemoveRelatedPersonLawsuitComponent;
  let fixture: ComponentFixture<RemoveRelatedPersonLawsuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveRelatedPersonLawsuitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRelatedPersonLawsuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
