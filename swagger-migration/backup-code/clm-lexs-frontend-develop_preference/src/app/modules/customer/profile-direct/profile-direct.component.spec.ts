import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDirectComponent } from './profile-direct.component';

describe('ProfileDirectComponent', () => {
  let component: ProfileDirectComponent;
  let fixture: ComponentFixture<ProfileDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDirectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
