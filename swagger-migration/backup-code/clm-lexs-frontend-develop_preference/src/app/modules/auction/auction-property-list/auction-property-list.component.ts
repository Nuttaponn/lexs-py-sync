import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auction-property-list',
  templateUrl: './auction-property-list.component.html',
  styleUrls: ['./auction-property-list.component.scss'],
})
export class AuctionPropertyListComponent {
  @Input() isOpened: boolean = true;
  @Input() litigationId!: string;
  @Input() dataForm!: any;

  constructor() {}
}
