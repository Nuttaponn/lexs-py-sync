import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementMatchComponent } from './auc-announement-match.component';

describe('AucAnnounementMatchComponent', () => {
  let component: AucAnnounementMatchComponent;
  let fixture: ComponentFixture<AucAnnounementMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnounementMatchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnounementMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
