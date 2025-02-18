import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiUserMatchDialogComponent } from './multi-user-match-dialog.component';

describe('MultiUserMatchDialogComponent', () => {
  let component: MultiUserMatchDialogComponent;
  let fixture: ComponentFixture<MultiUserMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiUserMatchDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiUserMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
