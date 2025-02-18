import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { EditRelatedPersonComponent } from './edit-related-person.component';

describe('EditRelatedPersonComponent', () => {
  let component: EditRelatedPersonComponent;
  let fixture: ComponentFixture<EditRelatedPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRelatedPersonComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRelatedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
