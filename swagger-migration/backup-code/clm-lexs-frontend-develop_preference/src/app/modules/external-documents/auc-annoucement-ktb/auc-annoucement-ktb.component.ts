import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ExternalDocumentsService } from '../external-documents.service';

@Component({
  selector: 'app-auc-annoucement-ktb',
  templateUrl: './auc-annoucement-ktb.component.html',
  styleUrls: ['./auc-annoucement-ktb.component.scss'],
})
export class AucAnnoucementKtbComponent {
  public tabIndex = 0;

  constructor(
    public externalService: ExternalDocumentsService
  ) {
    if (this.externalService.announceKtbTab > 0) {
      this.onTabChanged({ index: this.externalService.announceKtbTab } as MatTabChangeEvent);
      this.externalService.announceKtbTab = 0; // set back to default
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.externalService.announceKtbTab = this.tabIndex;
  }
}
