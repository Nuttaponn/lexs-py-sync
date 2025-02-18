import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorComponent } from './paginator.component';

@NgModule({
    declarations: [PaginatorComponent],
    imports: [CommonModule, MatIconModule, TranslateModule],
    exports: [PaginatorComponent]
})
export class PaginatorModule {}
