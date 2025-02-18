import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyDocumentComponent } from './withdrawn-seizure-property-document.component';

describe('WithdrawnSeizurePropertyDocumentComponent', () => {
  let component: WithdrawnSeizurePropertyDocumentComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
