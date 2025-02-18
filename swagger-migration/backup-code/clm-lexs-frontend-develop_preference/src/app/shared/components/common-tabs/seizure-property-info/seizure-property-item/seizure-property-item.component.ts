import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-seizure-property-item',
  templateUrl: './seizure-property-item.component.html',
  styleUrls: ['./seizure-property-item.component.scss'],
})
export class SeizurePropertyItemComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() total: any;

  @Output() onViewDetailClick = new EventEmitter();

  public items: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.items = this.data
      .sort((a: any, b: any) => a.seizureId - b.seizureId)
      .map((it, i) => {
        return {
          ...it,
          order: i + 1,
        };
      });
    this.items = this.items.sort((a, b) => b.order - a.order);
  }

  onViewDetail(details: any) {
    this.onViewDetailClick.emit(details);
  }
}
