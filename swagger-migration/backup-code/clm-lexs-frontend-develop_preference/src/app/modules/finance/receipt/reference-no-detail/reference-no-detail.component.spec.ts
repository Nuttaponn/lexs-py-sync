import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceNoDetailComponent } from './reference-no-detail.component';

describe('ReferenceNoDetailComponent', () => {
  let component: ReferenceNoDetailComponent;
  let fixture: ComponentFixture<ReferenceNoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceNoDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceNoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
