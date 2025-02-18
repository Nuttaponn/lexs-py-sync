import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(@Inject(SESSION_STORAGE) private sharedStorage: StorageService) {}

  /* For Local storage */
  get<T>(key: string): T {
    return this.sharedStorage.get(key);
  }

  set<T>(key: string, value: T) {
    this.sharedStorage.set(key, value);
  }

  remove<T>(key: string): void {
    this.sharedStorage.remove(key);
  }

  refresh<T>(key: string, value: T) {
    this.sharedStorage.remove(key);
    if (value) {
      this.sharedStorage.set(key, value);
    }
  }

  has(key: string) {
    return this.sharedStorage.has(key);
  }

  clear() {
    return this.sharedStorage.clear();
  }
}
