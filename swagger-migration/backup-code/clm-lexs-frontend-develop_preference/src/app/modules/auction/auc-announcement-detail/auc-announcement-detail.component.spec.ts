import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnouncementDetailComponent } from './auc-announcement-detail.component';

describe('AucAnnouncementDetailComponent', () => {
  let component: AucAnnouncementDetailComponent;
  let fixture: ComponentFixture<AucAnnouncementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnouncementDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnouncementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
