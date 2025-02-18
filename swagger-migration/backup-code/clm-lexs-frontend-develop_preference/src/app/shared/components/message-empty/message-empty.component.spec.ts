import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { MessageEmptyComponent } from './message-empty.component';

describe('MessageEmptyComponent', () => {
  let component: MessageEmptyComponent;
  let fixture: ComponentFixture<MessageEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
