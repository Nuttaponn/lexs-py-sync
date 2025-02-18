import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { SpigShareModule } from '../spig-share.module';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [MenuComponent, MenuItemComponent],
  imports: [CommonModule, SpigShareModule],
  exports: [MenuComponent, MenuItemComponent],
})
export class SidenavModule {}
