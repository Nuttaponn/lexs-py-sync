import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMatchingComponent } from './configuration-matching.component';

describe('ConfigurationMatchingComponent', () => {
  let component: ConfigurationMatchingComponent;
  let fixture: ComponentFixture<ConfigurationMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationMatchingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
