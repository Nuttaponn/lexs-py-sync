import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementMatchDialogComponent } from './auc-announement-match-dialog.component';

describe('AucAnnounementMatchDialogComponent', () => {
  let component: AucAnnounementMatchDialogComponent;
  let fixture: ComponentFixture<AucAnnounementMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AucAnnounementMatchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AucAnnounementMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
