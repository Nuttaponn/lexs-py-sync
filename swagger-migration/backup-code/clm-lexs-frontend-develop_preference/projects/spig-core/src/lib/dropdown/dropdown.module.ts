import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { DropdownComponent } from './dropdown.component';
import { ClassesOptionPipe } from './pipes/classes-option.pipe';
import { IconOptionPipe } from './pipes/icon-option.pipe';
import { ListOptionPipe } from './pipes/list-option.pipe';

@NgModule({
    declarations: [ListOptionPipe, IconOptionPipe, ClassesOptionPipe, DropdownComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatSelectModule,
        ScrollingModule,
        TranslateModule,
        MatSelectInfiniteScrollModule,
        OverlayModule,
    ],
    exports: [DropdownComponent]
})
export class DropdownModule {}
