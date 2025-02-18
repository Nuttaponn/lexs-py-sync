import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-doughnut-chart-v2',
  templateUrl: './doughnut-chart-v2.component.html',
  styleUrls: ['./doughnut-chart-v2.component.scss'],
})
export class DoughnutChartV2Component implements OnInit {
  @Input() data: Array<number> = [];
  @Input() labels: Array<string> = [];
  @Input() colors: Array<string> = [];
  @Input() total: number = 0;

  @Output() pieClick = new EventEmitter<number>();
  @Output() totalClick = new EventEmitter<null>();

  constructor() {}

  public clipPaths: Array<string> = [];
  public tooltipPositions: Array<{ x: number; y: number }> = [];
  public isSectionHidden: Array<boolean> = [];

  // public debugPoints: Array<{x: number, y: number}> = []

  public activeLegend: number | undefined = undefined;

  private chartRadius = 240; // maximum possible radius (in pixels)

  ngOnInit(): void {
    this.prepareChart();
  }

  prepareChart() {
    const sum = this.data?.length > 0 ? this.data?.reduce((a, b) => a + b) : 0;
    const percentages = this.data.map(datapoint => (datapoint / sum) * 100);
    percentages.forEach(p => {
      if (p === 0) this.isSectionHidden.push(true);
      else this.isSectionHidden.push(false);
    });
    const cumulativePercentages = this.cumulativeSum(percentages);

    let x1 = 0;
    let y1 = this.chartRadius;

    for (let i = 0; i < cumulativePercentages.length; i++) {
      const cumulativeRad = (cumulativePercentages[i] / 100) * 2 * Math.PI;
      const previousCumulativeRad = i === 0 ? 0 : (cumulativePercentages[i - 1] / 100) * 2 * Math.PI;
      let { x: x2, y: y2 } = this.getIntersectionCoordiateForAngle(cumulativeRad);

      const { x: px1, y: py1 } = this.convertCoodinatesToPercent(x1, y1);
      const { x: px2, y: py2 } = this.convertCoodinatesToPercent(x2, y2);

      // this.debugPoints.push({x: px1, y: py1})
      // this.debugPoints.push({x: px2, y: py2})

      const cornerPoints = this.getCornerPointsForAngle(previousCumulativeRad, cumulativeRad);
      this.clipPaths.push(
        `polygon(50% 50%, ${px1}% ${py1}%, ${cornerPoints.length > 0 ? cornerPoints.join(', ') + ', ' : ''} ${px2}% ${py2}%)`
      );

      const { x: tooltipX, y: tooltipY } = this.getTooltipPosition(previousCumulativeRad, cumulativeRad);
      const { x: tooltipPX, y: tooltipPY } = this.convertCoodinatesToPercent(tooltipX, tooltipY);
      this.tooltipPositions.push({ x: tooltipPX, y: tooltipPY });

      // this.debugPoints.push({x: tooltipPX, y: tooltipPY})

      x1 = x2;
      y1 = y2;
    }
  }

  getCornerPointsForAngle(startTheta: number, endTheta: number) {
    /* 
      Returns rectangular coordinates (in percent) of the corners of the chart
      that are within startTheta and endTheta
    */
    let cornerPoints = [];
    if (Math.PI / 4 > startTheta && Math.PI / 4 < endTheta) {
      cornerPoints.push('100% 0');
    }
    if (Math.PI * 0.75 > startTheta && Math.PI * 0.75 < endTheta) {
      cornerPoints.push('100% 100%');
    }
    if (Math.PI * 1.25 > startTheta && Math.PI * 1.25 < endTheta) {
      cornerPoints.push('0 100%');
    }
    if (Math.PI * 1.75 > startTheta && Math.PI * 1.75 < endTheta) {
      cornerPoints.push('0 0');
    }
    return cornerPoints;
  }

  getIntersectionCoordiateForAngle(theta: number) {
    /* 
      Returns the distance from the point in the center of the chart (a square) to the edge of the chart
      at a given angle, theta.
     */
    let d = 0;
    if (
      (theta >= 0 && theta < Math.PI / 4) ||
      (theta >= (Math.PI * 3) / 4 && theta < (Math.PI * 5) / 4) ||
      theta >= (Math.PI * 7) / 4
    ) {
      d = Math.abs(this.chartRadius / Math.cos(theta));
    } else {
      d = Math.abs(this.chartRadius / Math.sin(theta));
    }
    return this.polarToRetangular(theta, d);
  }

  getTooltipPosition(startTheta: number, endTheta: number) {
    const center = (endTheta - startTheta) / 2;
    const r = this.chartRadius * 0.9;
    return this.polarToRetangular(startTheta + center, r);
  }

  polarToRetangular(theta: number, r: number) {
    return {
      x: r * Math.cos(theta - Math.PI / 2),
      y: -r * Math.sin(theta - Math.PI / 2),
    };
  }

  convertCoodinatesToPercent(x: number, y: number) {
    // coverts the scale of -chartRadius to +chartRadius to 0 to 100
    return {
      x: ((x + this.chartRadius) / (2 * this.chartRadius)) * 100,
      y: ((this.chartRadius - y) / (2 * this.chartRadius)) * 100,
    };
  }

  private cumulativeSum(arr: Array<number>) {
    let cumulativeSumArray = [];
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
      cumulativeSumArray.push(sum);
    }

    return cumulativeSumArray;
  }

  // HOVER EVENTS
  onLegendMouseEnter(index: number) {
    this.activeLegend = index;
  }
  onLegendMouseLeave() {
    this.activeLegend = undefined;
  }

  // CHART CLICK EVENTS
  onTotalClick() {
    this.totalClick.emit();
  }
  onPieClick(index: number) {
    this.pieClick.emit(index);
  }
}
