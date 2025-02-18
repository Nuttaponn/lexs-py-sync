import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPledgePropertiesDocumentComponent } from './non-pledge-properties-document.component';

describe('NonPledgePropertiesDocumentComponent', () => {
  let component: NonPledgePropertiesDocumentComponent;
  let fixture: ComponentFixture<NonPledgePropertiesDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NonPledgePropertiesDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonPledgePropertiesDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
