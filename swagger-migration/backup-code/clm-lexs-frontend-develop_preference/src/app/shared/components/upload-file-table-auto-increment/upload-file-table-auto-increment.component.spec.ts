import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileTableAutoIncrementComponent } from './upload-file-table-auto-increment.component';

describe('UploadFileTableAutoIncrementComponent', () => {
  let component: UploadFileTableAutoIncrementComponent;
  let fixture: ComponentFixture<UploadFileTableAutoIncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFileTableAutoIncrementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileTableAutoIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
