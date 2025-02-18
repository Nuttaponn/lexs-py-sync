import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsContactsInfoComponent } from './assets-contacts-info.component';

describe('AssetsContactsInfoComponent', () => {
  let component: AssetsContactsInfoComponent;
  let fixture: ComponentFixture<AssetsContactsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsContactsInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsContactsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
