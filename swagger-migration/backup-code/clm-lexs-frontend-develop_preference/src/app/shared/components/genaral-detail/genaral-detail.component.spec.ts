import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenaralDetailComponent } from './genaral-detail.component';

describe('GenaralDetailComponent', () => {
  let component: GenaralDetailComponent;
  let fixture: ComponentFixture<GenaralDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenaralDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenaralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
