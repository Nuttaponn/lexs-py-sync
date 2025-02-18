import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingInfoComponent } from './processing-info.component';

describe('ProcessingInfoComponent', () => {
  let component: ProcessingInfoComponent;
  let fixture: ComponentFixture<ProcessingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessingInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
