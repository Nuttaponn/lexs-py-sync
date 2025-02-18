import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatePropertyDocumentsListComponent } from './investigate-property-documents-list.component';

describe('InvestigatePropertyDocumentsListComponent', () => {
  let component: InvestigatePropertyDocumentsListComponent;
  let fixture: ComponentFixture<InvestigatePropertyDocumentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigatePropertyDocumentsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatePropertyDocumentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
