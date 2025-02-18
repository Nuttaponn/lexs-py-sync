import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent implements AfterViewInit {
  constructor() {}

  @Input() chartId: string = 'bar-chart';
  @Input() labels: Array<string> = [];
  @Input() datasets: Array<any> = [];
  @Input() ticks: number = 4;
  @Input() hideTooltipForDataPoints: { dataIndex: number; datasetIndex: number }[] = [];

  @Input() isDefermentChart: boolean = false;

  @Output() barClick = new EventEmitter<{ index: number; datasetIndex: number }>();

  tooltipMapper(label: string) {
    switch (label) {
      case 'IN_SLA':
        return 'ลูกหนี้ที่ยังไม่เกิน SLA';
      case 'OUT_OF_SLA':
        return 'ลูกหนี้ที่เกิน SLA';
      case 'NONE_DEFER':
        return 'ไม่มีการชะลอดำเนินคดี';
      case 'DEFER_PROSECUTION_APPROVED':
        return 'อนุมัติดำเนินคดี';
      case 'DEFER_ALREADY_NOTICE':
        return 'ยื่นบอกกล่าว';
      case 'NONE_DEFER_EXEC':
        return 'ไม่มีการชะลอบังคับคดี';
      case 'DEFER_EXEC_WRIT_OF':
        return 'ก่อนออกหมายบังคับคดี';
      case 'DEFER_EXEC_SEIZURE':
        return 'อยู่ระหว่างยึดทรัพย์';
      case 'DEFER_EXEC_AUCTION':
        return 'อยู่ระหว่างขายทอดตลาด';
      case 'DEFER_EXEC_OTHER':
        return 'อื่นๆ';
      default:
        return null;
    }
  }

  ngAfterViewInit(): void {
    this.createBarChart(this.chartId, this.hideTooltipForDataPoints, this.isDefermentChart);
  }

  createBarChart(
    chartId: string,
    hideTooltipForDataPoints: { dataIndex: number; datasetIndex: number }[],
    isDefermentChart: boolean
  ) {
    const chart = new Chart(chartId, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        layout: {
          padding: {
            bottom: 120,
            left: 32,
            top: 24,
          },
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          // @ts-ignore
          barChart: {
            chartId: this.chartId,
          },
          tooltip: {
            enabled: false,
            position: 'average',
            filter: tooltipItem => {
              if (isDefermentChart) {
                if (tooltipItem.dataIndex !== 0 && tooltipItem.datasetIndex !== tooltipItem.dataIndex) {
                  return false;
                }
                return true;
              }

              if (
                hideTooltipForDataPoints &&
                hideTooltipForDataPoints.findIndex(
                  d => d.dataIndex === tooltipItem.dataIndex && d.datasetIndex === tooltipItem.datasetIndex
                ) >= 0
              )
                return false;
              return true;
            },
            external: this.externalTooltipHandler,
          },
        },
        scales: {
          x: {
            stacked: true,
            display: false,
          },
          y: {
            stacked: true,
            display: false,
            ticks: {
              maxTicksLimit: this.ticks,
            },
          },
        },
        onClick: (point: any, event: any) => {
          if (event?.[0]) {
            if (this.isDefermentChart) {
              if (event[0].index !== 0) {
                this.barClick.emit({
                  index: event[0].index,
                  datasetIndex: event[0].index,
                });
                return;
              }
            }
            this.barClick.emit({
              index: event[0].index,
              datasetIndex: event[0].datasetIndex,
            });
          }
        },
        onHover: (point: any, event: any) => {
          if (event.length > 0) point.native.target.style.cursor = 'pointer';
          else point.native.target.style.cursor = 'initial';
        },
      },
      plugins: [this.barChartPlugin],
    });
  }

  getOrCreateTooltip = (chart: Chart) => {
    let tooltipEl = chart.canvas.parentNode?.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = '#F9FCFF';
      tooltipEl.style.borderRadius = '8px';
      tooltipEl.style.color = '#121212';
      tooltipEl.style.opacity = '1';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.16)';

      const table = document.createElement('table');
      table.style.margin = '0px';

      tooltipEl.appendChild(table);
      chart.canvas.parentNode?.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context: any) => {
    // Tooltip Element
    const { chart, tooltip } = context;

    if (!tooltip.dataPoints?.[0]) return;

    const tooltipEl = this.getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLine = this.tooltipMapper(tooltip.dataPoints?.[0]?.dataset.label) || tooltip.title?.join('');
      const bodyLine = tooltip.dataPoints?.[0].raw;

      const tableHead = document.createElement('thead');

      const titleTr = document.createElement('tr');
      titleTr.style.borderWidth = '0';

      const titleTh = document.createElement('th');
      titleTh.style.borderWidth = '0';
      titleTh.style.textAlign = 'left';
      titleTh.style.color = '#121212B2';
      titleTh.style.fontFamily = 'KrungthaiFastRegular';
      titleTh.style.fontSize = '16px';
      const text = document.createTextNode(titleLine);

      titleTh.appendChild(text);
      titleTr.appendChild(titleTh);
      tableHead.appendChild(titleTr);

      const tableBody = document.createElement('tbody');
      const bodyTr = document.createElement('tr');
      bodyTr.style.borderWidth = '0';
      const bodyTd = document.createElement('td');
      bodyTd.style.borderWidth = '0';
      bodyTd.style.textAlign = 'left';
      bodyTd.style.color = '#121212';
      bodyTd.style.fontFamily = 'KrungthaiFastBold';
      bodyTd.style.fontSize = '16px';
      const bodyText = document.createTextNode(bodyLine);

      bodyTd.appendChild(bodyText);
      bodyTr.appendChild(bodyTd);
      tableBody.appendChild(bodyTr);

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot?.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot?.appendChild(tableHead);
      tableRoot?.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  barChartPlugin = {
    id: 'barChart',
    beforeDraw(chart: Chart, args: any, options: any) {
      // Draw Scale
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      const canvasWidthString = chart.canvas.style.width; // returns width + 'px'
      const canvasWidth = parseInt(canvasWidthString.slice(0, canvasWidthString.length - 2));

      const yAxis = chart.scales['y'];
      const max = yAxis.max;

      const SCALE_COUNT = yAxis.ticks.length;
      const interval = max / (SCALE_COUNT - 1);

      for (let c = 0; c < SCALE_COUNT; c++) {
        let y = height - (c / max) * height * interval;

        if (c === 0) ctx.strokeStyle = '#12121280';
        else ctx.strokeStyle = '#1212121A';
        ctx.beginPath();
        ctx.lineWidth = 1;
        // 0.5 px offset to avoid anti-aliasing from the browser
        ctx.moveTo(0.5, y + 0.5 + 24);
        ctx.lineTo(canvasWidth + 0.5, y + 0.5 + 24);
        ctx.stroke();

        // scale label
        ctx.font = '14px KrungthaiFastRegular';
        ctx.fillStyle = '#121212B2';
        const valueWidth = ctx.measureText(yAxis.ticks[c].value.toString()).width;
        // 40 = text padding, needs to be greater than 40 if max > 5 digit number
        ctx.fillText(yAxis.ticks[c].value.toString(), 40 - valueWidth, y + 18);
      }
    },
    afterDraw(chart: Chart, args: any, options: any) {
      // Labels
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      let datasetArray: number[][] = [];
      chart.data.datasets.forEach((dataset, i) => {
        // @ts-ignore
        datasetArray.push(dataset.data);
      });

      let summedData: number[] = [];
      let length = chart.data?.datasets?.[0]?.data?.length;
      summedData = new Array(length);
      for (let i = 0; i < length; ++i) summedData[i] = 0;
      datasetArray.forEach(data => {
        for (let i = 0; i < data.length; i++) {
          summedData[i] = summedData[i] + data[i];
        }
      });

      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((dataPoint, j) => {
          // draw once (despite having multiple datasets)
          if (i === 0) {
            // center of a bar
            const { x, y } = dataPoint.tooltipPosition(true);

            ctx.font = '16px KrungthaiFastBold';
            ctx.fillStyle = '#121212';

            // @ts-ignore
            const valueWidth = ctx.measureText(summedData[j] as string).width;
            ctx.fillText(summedData[j].toString(), x - valueWidth / 2, height + 52);

            ctx.font = '16px KrungthaiFastRegular';
            const lines = (chart.data.labels?.[j] as string).split('\n');
            lines.forEach((line, i) => {
              // @ts-ignore
              const labelWidth = ctx.measureText(line as string).width;
              // @ts-ignore
              ctx.fillText(line, x - labelWidth / 2, height + 78 + i * 22);
            });
          }
        });
      });
    },
  };
}
