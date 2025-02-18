import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-processing-info-seizure-list',
  templateUrl: './processing-info-seizure-list.component.html',
  styleUrls: ['./processing-info-seizure-list.component.scss'],
})
export class ProcessingInfoSeizureListComponent implements OnInit {
  @Input() seizures!: any;
  @Output() onViewDetailClick = new EventEmitter();

  public columns: string[] = ['order', 'text01', 'text11', 'text02', 'text03', 'text04', 'text05', 'text06'];
  public items: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.items = this.seizures
      .sort((a: any, b: any) => a.seizureId - b.seizureId)
      .map((it: any, i: number) => {
        return {
          ...it,
          order: i + 1,
        };
      });
    this.items = this.items.sort((a: any, b: any) => b.order - a.order);
  }

  onViewDetail(seizureItem: any) {
    this.onViewDetailClick.emit(seizureItem);
  }
}
