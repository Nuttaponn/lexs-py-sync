import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ILinkTooltip, ITooltip } from '../../models';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  @Input() icon: string[] = ['icon-Information', 'icon-Info-Filled'];
  @Input() iconClass: Array<string> | string = ['icon-small', 'fill-blue'];
  @Input() params: Array<ITooltip> | undefined;
  @Input() hyperlink!: ILinkTooltip;
  @Input() isDeferment: boolean = false;
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left';
  @Output() contentEmitter = new EventEmitter<any>();
  public positionPairs!: ConnectionPositionPair[];
  public isOpen = false;

  constructor() {}

  ngOnInit(): void {
    switch (this.position) {
      case 'top-right':
        this.positionPairs = [
          new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
          new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
        ];
        break;
      case 'bottom-left':
        this.positionPairs = [
          new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
          new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
        ];
        break;
      case 'bottom-right':
        this.positionPairs = [
          new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
          new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
        ];
        break;
      default:
        this.positionPairs = [
          new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
          new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
        ];
        break;
    }
    this.positionPairs[0].offsetX = 16;
    this.positionPairs[0].offsetY = 16;
    this.positionPairs[1].offsetX = 16;
    !this.isDeferment && (this.iconClass = `${this.iconClass} ${'ml-8'}`);
    this.iconClass = this.iconClass?.toString().replace(/,/g, ' ');
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleIcon() {
    this.isOpen = true;
  }

  onClickContent(item: any) {
    this.contentEmitter.emit(item);
  }
}
