import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOADER_OPTIONS, LoaderOption } from './loader-options';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  state: LoaderState = { loading: false, counter: 0 };
  update: BehaviorSubject<LoaderState> = new BehaviorSubject<LoaderState>(this.state);
  defaultMessage!: string;

  constructor(@Optional() @Inject(LOADER_OPTIONS) options: LoaderOption) {
    if (options?.defaultMessage) {
      this.defaultMessage = options?.defaultMessage;
    }
  }

  enterLoad(value?: any) {
    this.state.counter++;
    this.state.loading = true;
    this.state.value = value || this.state.value || this.defaultMessage;
    this.update.next(this.state);
  }

  exitLoad() {
    this.state.counter--;
    if (this.state.counter <= 0) {
      this.state.loading = false;
      this.state.value = null;
    }
    this.update.next(this.state);
  }

  async loading<T>(action: () => Promise<T>, value?: any) {
    try {
      this.enterLoad(value);
      return await action();
    } finally {
      this.exitLoad();
    }
  }
}
export class LoaderState {
  loading: boolean = false;
  counter: number = 0;
  value?: any;
}
