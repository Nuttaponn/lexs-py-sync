import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingInfoSeizureListComponent } from './processing-info-seizure-list.component';

describe('ProcessingInfoSeizureListComponent', () => {
  let component: ProcessingInfoSeizureListComponent;
  let fixture: ComponentFixture<ProcessingInfoSeizureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessingInfoSeizureListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingInfoSeizureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
