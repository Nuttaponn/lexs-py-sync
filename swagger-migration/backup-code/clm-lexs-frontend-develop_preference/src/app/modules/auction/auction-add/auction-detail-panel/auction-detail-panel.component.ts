import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auction-detail-panel',
  templateUrl: './auction-detail-panel.component.html',
  styleUrl: './auction-detail-panel.component.scss'
})
export class AuctionDetailPanelComponent implements OnInit {
  @Input() isOpened: boolean = true;
  @Input() title: string = '';
  ngOnInit(): void {
  }
}

