import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from './loader.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'spig-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  private sink = new SubSink();

  isLoading = false;
  loadingMessage!: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.sink.add(
      this.loaderService.update.subscribe(state => {
        this.isLoading = state.loading;
        this.loadingMessage = state.value;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.sink.unsubscribe();
  }
}
