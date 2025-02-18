import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { NewspaperComponent } from './newspaper.component';

describe('NewspaperComponent', () => {
  let component: NewspaperComponent;
  let fixture: ComponentFixture<NewspaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewspaperComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewspaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
