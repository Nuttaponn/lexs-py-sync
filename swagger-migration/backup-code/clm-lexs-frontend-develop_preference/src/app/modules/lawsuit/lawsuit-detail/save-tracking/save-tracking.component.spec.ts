import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { SaveTrackingComponent } from './save-tracking.component';

describe('SaveTrackingComponent', () => {
  let component: SaveTrackingComponent;
  let fixture: ComponentFixture<SaveTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveTrackingComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
