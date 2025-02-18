import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantInfoComponent } from './warrant-info.component';

describe('WarrantInfoComponent', () => {
  let component: WarrantInfoComponent;
  let fixture: ComponentFixture<WarrantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarrantInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
