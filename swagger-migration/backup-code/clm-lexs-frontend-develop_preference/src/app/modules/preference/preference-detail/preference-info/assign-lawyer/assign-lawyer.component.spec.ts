import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLawyerComponent } from './assign-lawyer.component';

describe('AssignLawyerComponent', () => {
  let component: AssignLawyerComponent;
  let fixture: ComponentFixture<AssignLawyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignLawyerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
