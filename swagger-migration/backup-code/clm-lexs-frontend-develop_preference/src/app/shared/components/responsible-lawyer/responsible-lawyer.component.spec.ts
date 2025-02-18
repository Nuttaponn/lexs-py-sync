import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleLawyerComponent } from './responsible-lawyer.component';

describe('ResponsibleLawyerComponent', () => {
  let component: ResponsibleLawyerComponent;
  let fixture: ComponentFixture<ResponsibleLawyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsibleLawyerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
