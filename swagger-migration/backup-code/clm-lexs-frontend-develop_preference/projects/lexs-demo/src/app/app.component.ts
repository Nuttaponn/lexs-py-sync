import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '../components/simple-paginator/simple-paginator.component';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  table = new MatTableDataSource([])
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  title = 'lexs-demo';
  icons = [
    "icon-Save-Multiple-Filled"
    , "icon-Save-Multiple"
    , "icon-rd-Party"
    , "icon-court"
    , "icon-notify"
    , "icon-verify-doc"
    , "icon-corner"
    , "icon-Activity"
    , "icon-add"
    , "icon-Archive"
    , "icon-Arrow-Forward"
    , "icon-Arrow-Swap"
    , "icon-Arrow-Sync"
    , "icon-Search-Doc"
    , "icon-Arrow-Upload"
    , "icon-Arrow-Download"
    , "icon-Arrow-Down"
    , "icon-Arrow-Left"
    , "icon-Arrow-Right"
    , "icon-Arrow-Up"
    , "icon-Arrow-Revert"
    , "icon-Bin"
    , "icon-Book-Add"
    , "icon-Book-Arrow-Clockwise"
    , "icon-Building-Court"
    , "icon-Building-Retail-Money"
    , "icon-Channel"
    , "icon-Check"
    , "icon-Checkmark-Circle-Regular"
    , "icon-Cross"
    , "icon-Customer"
    , "icon-Date"
    , "icon-Direction-Down"
    , "icon-Direction-Left"
    , "icon-Direction-Right"
    , "icon-Direction-Up"
    , "icon-Dismiss-Circle"
    , "icon-Dismiss-Square"
    , "icon-Check-Square"
    , "icon-Document-Add"
    , "icon-Document-Bullet-List"
    , "icon-Document-Text"
    , "icon-Download"
    , "icon-Edit"
    , "icon-Email"
    , "icon-Error"
    , "icon-Exit"
    , "icon-Expand"
    , "icon-View"
    , "icon-File"
    , "icon-Filter"
    , "icon-Finance"
    , "icon-Flash"
    , "icon-hide"
    , "icon-hide-show"
    , "icon-Home-Dashboard"
    , "icon-Home-Person"
    , "icon-Info-Filled"
    , "icon-Information"
    , "icon-License"
    , "icon-List"
    , "icon-Mail-Edit"
    , "icon-Menu-Burger"
    , "icon-Merge"
    , "icon-Money-Hand"
    , "icon-Money"
    , "icon-News"
    , "icon-Note-Edit"
    , "icon-Notepad"
    , "icon-Option"
    , "icon-Pause"
    , "icon-Person-Arrow-Right"
    , "icon-Person-Board"
    , "icon-Person-Call"
    , "icon-Person-Swap"
    , "icon-Plus"
    , "icon-Product-Selected"
    , "icon-Record-Stop"
    , "icon-Reset"
    , "icon-save-primary"
    , "icon-Search"
    , "icon-Selected"
    , "icon-Send"
    , "icon-setting"
    , "icon-Slide-Hide"
    , "icon-Asset"
    , "icon-Doc-circle"
    , "icon-Sorting"
    , "icon-Stack-Arrow-Forward"
    , "icon-Stack"
    , "icon-Task-List"
    , "icon-user-add"
    , "icon-User"
    , "icon-Warning"
    , "icon-Window-Multiple"
    , "icon-Window"
    , "icon-Mark"
    , "icon-Dismiss-Fill"
    , "icon-Notebook"
    , "icon-Account-Circle"
    , "icon-Receipt"
    , "icon-Drafts"
    , "icon-Checklist"
    , "icon-Add-Document"
    , "icon-Broom"
    , "icon-Dashboard"
    , "icon-Asset-nobg"
    , "icon-Info-Orange"
    , "icon-Info-Green"
    , "icon-Dash-Circle"
    , "icon-Check-Square-Free-Fill"
  ]

  onPaging(page: PageEvent) {
    console.log(page)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table.filter = filterValue.trim().toLowerCase();

    if (this.table.paginator) {
      this.table.paginator.firstPage();
    }
  }
}
