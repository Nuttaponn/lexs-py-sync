import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareLawsuitComponent } from './prepare-lawsuit.component';

describe('PrepareLawsuitComponent', () => {
  let component: PrepareLawsuitComponent;
  let fixture: ComponentFixture<PrepareLawsuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepareLawsuitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareLawsuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
