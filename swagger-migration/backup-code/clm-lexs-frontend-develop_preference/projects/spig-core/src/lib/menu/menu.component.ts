import { Component, OnDestroy, AfterContentInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ViewChildren, QueryList, ContentChildren, HostListener } from '@angular/core';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuService } from './menu.service';

@Component({
  selector: 'spig-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterContentInit {
  @ContentChildren(MenuItemComponent)
  subMenus!: QueryList<MenuItemComponent>;
  @Input() menuicon!: boolean; // Show or not show menu icon
  @Output() select = new EventEmitter<string>();

  constructor(private menuService: MenuService) {}

  ngAfterContentInit() {
    this.subMenus.map((item: MenuItemComponent) => {
      item.select.subscribe(menu => this.onSelectMenu(menu));
    });
  }

  onMenuClose() {
    this.menuService.close();
  }

  onSelectMenu(menu: string) {
    this.select.emit(menu);
    this.menuService.select(menu);
  }

  // ngOnDestroy() {
  //   this.menuService.event.unsubscribe();
  //   this.menuService.state.unsubscribe();
  // }
}
