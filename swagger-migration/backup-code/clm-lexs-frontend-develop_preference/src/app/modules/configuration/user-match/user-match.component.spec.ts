import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { UserMatchComponent } from './user-match.component';

describe('UserMatchComponent', () => {
  let component: UserMatchComponent;
  let fixture: ComponentFixture<UserMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMatchComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
