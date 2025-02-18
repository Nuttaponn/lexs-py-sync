import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'spig-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  public isSubMenuOpened: boolean = false;

  constructor() {}

  @Input() name!: string;
  @Output() select = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  onSelect() {
    event?.stopPropagation();
    this.select.emit(this.name);
  }

  public toggleSubMenuOpen() {
    this.isSubMenuOpened = !this.isSubMenuOpened;
  }
}
