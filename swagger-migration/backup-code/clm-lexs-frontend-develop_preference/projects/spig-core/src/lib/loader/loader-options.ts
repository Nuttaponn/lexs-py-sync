import { InjectionToken } from '@angular/core';

export const LOADER_OPTIONS = new InjectionToken<LoaderOption>('LoaderOptions');

export class LoaderOption {
  defaultMessage?: string;
}
