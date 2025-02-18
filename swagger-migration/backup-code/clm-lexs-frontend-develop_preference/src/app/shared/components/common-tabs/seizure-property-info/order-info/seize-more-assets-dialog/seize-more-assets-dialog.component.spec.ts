import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizeMoreAssetsDialogComponent } from './seize-more-assets-dialog.component';

describe('SeizeMoreAssetsDialogComponent', () => {
  let component: SeizeMoreAssetsDialogComponent;
  let fixture: ComponentFixture<SeizeMoreAssetsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizeMoreAssetsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizeMoreAssetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
