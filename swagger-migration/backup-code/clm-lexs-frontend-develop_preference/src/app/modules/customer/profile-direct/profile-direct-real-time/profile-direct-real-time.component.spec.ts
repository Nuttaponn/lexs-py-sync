import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDirectRealTimeComponent } from './profile-direct-real-time.component';

describe('ProfileDirectRealTimeComponent', () => {
  let component: ProfileDirectRealTimeComponent;
  let fixture: ComponentFixture<ProfileDirectRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDirectRealTimeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDirectRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
