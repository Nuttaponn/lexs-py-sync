import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public state = new Subject<boolean>();
  public event = new Subject<string>();

  constructor() {}

  open() {
    this.state.next(true);
  }

  close() {
    this.state.next(false);
  }

  select(menu: string) {
    this.event.next(menu);
  }
}
