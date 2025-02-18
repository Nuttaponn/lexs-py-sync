import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnoucementKTBProcessComponent } from './auc-annoucement-ktb-process.component';

describe('AucAnnoucementKTBProcessComponent', () => {
  let component: AucAnnoucementKTBProcessComponent;
  let fixture: ComponentFixture<AucAnnoucementKTBProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnoucementKTBProcessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnoucementKTBProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
