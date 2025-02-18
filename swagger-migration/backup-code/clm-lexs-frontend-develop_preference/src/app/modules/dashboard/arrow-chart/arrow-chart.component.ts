import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-arrow-chart',
  templateUrl: './arrow-chart.component.html',
  styleUrls: ['./arrow-chart.component.scss'],
})
export class ArrowChartComponent implements OnInit {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = [];
  @Input() chartId: string = 'arrow-chart';

  @Output() arrowClick = new EventEmitter<number>();

  percentages: number[] = [];
  totals: number[] = [];

  midSectionHasEndLabel: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const sum = this.data.reduce((a, b) => a + b);
    this.data.reduce((a, b, i) => (this.totals[i] = a + b), 0);

    this.data.forEach(dataPoint => {
      this.percentages.push((dataPoint / sum) * 100);
    });

    if (this.percentages[0] > 50) this.midSectionHasEndLabel = true;

    // reverse to draw last part of the chart first to fix z-index issues
    this.data.reverse();
    this.colors.reverse();
    this.labels.reverse();
    this.totals.reverse();
    this.percentages.reverse();
  }

  onArrowClick(index: number, event: any) {
    event.stopPropagation();
    this.arrowClick.emit(this.data.length - index - 1);
  }
}
