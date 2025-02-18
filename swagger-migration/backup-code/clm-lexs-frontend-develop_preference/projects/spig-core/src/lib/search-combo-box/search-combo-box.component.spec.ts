import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComboBoxComponent } from './search-combo-box.component';

describe('SearchComboBoxComponent', () => {
  let component: SearchComboBoxComponent;
  let fixture: ComponentFixture<SearchComboBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComboBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
