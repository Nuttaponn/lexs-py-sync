import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { MachineComponent } from './machine.component';

describe('MachineComponent', () => {
  let component: MachineComponent;
  let fixture: ComponentFixture<MachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
