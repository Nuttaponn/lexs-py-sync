import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-empty',
  templateUrl: './message-empty.component.html',
  styleUrls: ['./message-empty.component.scss'],
})
export class MessageEmptyComponent implements OnInit {
  @Input() message!: string;
  @Input() icon?: string;
  @Input() bgColor?: string = 'bg-white';
  constructor() {}

  ngOnInit(): void {
    if (!!!this.icon) {
      this.icon = 'icon-File';
    }
  }
}
