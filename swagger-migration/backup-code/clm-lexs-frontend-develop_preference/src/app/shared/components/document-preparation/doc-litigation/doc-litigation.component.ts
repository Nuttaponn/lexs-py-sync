import { AfterViewChecked, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DocumentDto } from '@lexs/lexs-client';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-doc-litigation',
  templateUrl: './doc-litigation.component.html',
  styleUrls: ['./doc-litigation.component.scss'],
})
export class DocLitigationComponent implements AfterViewChecked, OnInit {
  @Input() title: string = '';
  @Input() forAsset: boolean = false;
  @Input() readyForAsset: boolean = false;
  @ViewChildren(MatTable) table!: QueryList<any>;
  public docLitigationColumns: string[] = ['index', 'documentName', 'litigationId', 'documentDate', 'imageName'];
  isShow: any = false;
  @Input() documents: Array<DocumentDto> = [];

  constructor(private documentService: DocumentService) {}
  ngOnInit(): void {
    if (this.forAsset) {
      this.docLitigationColumns = ['index', 'documentName', 'storeOrganization', 'ownOrganization', 'imageName'];
    }
  }

  expandPanel() {
    this.isShow = !this.isShow;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  async openDoc(ele: any) {
    let res = await this.documentService.getDocument(ele.imageId, ele.imageSource);

    if (res) {
      this.documentService.openPdf(res, ele.imageName);
    }
  }
}
