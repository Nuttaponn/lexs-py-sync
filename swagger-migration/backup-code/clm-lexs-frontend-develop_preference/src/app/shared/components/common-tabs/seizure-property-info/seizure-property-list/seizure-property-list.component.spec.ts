import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizurePropertyListComponent } from './seizure-property-list.component';

describe('SeizurePropertyListComponent', () => {
  let component: SeizurePropertyListComponent;
  let fixture: ComponentFixture<SeizurePropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizurePropertyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizurePropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
