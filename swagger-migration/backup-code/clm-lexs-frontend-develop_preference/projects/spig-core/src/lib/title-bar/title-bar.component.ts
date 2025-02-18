import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SubSink } from 'subsink';
import { RoutingDataService } from '../service/routing-data.service';

@Component({
  selector: 'spig-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
})
export class TitleBarComponent implements OnInit, OnDestroy {
  @Input() logo!: boolean; // Show or not show logo
  // Show or not show logo
  @Input() logopos!: string; // 'left' or 'right'
  @Input() menuicon!: boolean; // Show or not show menu icon
  @Input() menuiconpos!: string; // 'left' or 'right'
  @Input() menuiconname!: string; // name of Menu icon (reference in Icon system)
  @Input() menutext!: string;
  @Input() titlebartext!: string;

  // event emitter whe menu icon is clicked
  @Output() menuClick = new EventEmitter<any>();

  private sink = new SubSink();

  titleText!: string;
  opened!: boolean;
  menuData: any;

  constructor(private routingDataService: RoutingDataService) {}

  ngOnInit() {
    this.titleText = '';
    this.sink.add(
      this.routingDataService.change('title').subscribe(it => {
        if (it.title) {
          this.titleText = it.title;
        }
        if (it.menu) {
          this.menuData = it.menu;
        }
      })
    );
  }

  ngOnDestroy() {
    this.sink.unsubscribe();
  }

  onMenuClick() {
    this.opened = !this.opened;
    this.menuClick.emit(this.opened);
  }
}
