import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnouncementLexsPendingComponent } from './auc-announcement-lexs-pending.component';

describe('AucAnnouncementLexsPendingComponent', () => {
  let component: AucAnnouncementLexsPendingComponent;
  let fixture: ComponentFixture<AucAnnouncementLexsPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnouncementLexsPendingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnouncementLexsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
