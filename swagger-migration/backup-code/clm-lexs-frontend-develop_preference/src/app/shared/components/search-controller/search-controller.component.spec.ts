import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { SearchControllerComponent } from './search-controller.component';

describe('SearchControllerComponent', () => {
  let component: SearchControllerComponent;
  let fixture: ComponentFixture<SearchControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchControllerComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
