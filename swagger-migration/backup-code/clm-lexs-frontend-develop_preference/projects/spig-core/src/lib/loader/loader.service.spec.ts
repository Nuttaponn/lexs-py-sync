import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should enter/exit loading', () => {
    const service: LoaderService = TestBed.get(LoaderService);
    expect(service).toBeTruthy();
    expect(service.state.loading).toBeFalsy();
    expect(service.state.counter).toEqual(0);

    service.enterLoad('foo');
    expect(service.state.loading).toBeTruthy();
    expect(service.state.counter).toEqual(1);
    expect(service.state.value).toEqual('foo');

    service.enterLoad();
    expect(service.state.loading).toBeTruthy();
    expect(service.state.counter).toEqual(2);
    expect(service.state.value).toEqual('foo');

    service.exitLoad();
    expect(service.state.loading).toBeTruthy();
    expect(service.state.counter).toEqual(1);
    expect(service.state.value).toEqual('foo');

    service.exitLoad();
    expect(service.state.loading).toBeFalsy();
    expect(service.state.counter).toEqual(0);

    service.enterLoad();
    service.enterLoad();
    expect(service.state.loading).toBeTruthy();
    expect(service.state.counter).toEqual(2);
  });
});
