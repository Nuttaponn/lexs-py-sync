import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TMode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-auction-detail-lexs-sys-main',
  templateUrl: './auction-detail-lexs-sys-main.component.html',
  styleUrl: './auction-detail-lexs-sys-main.component.scss'
})
export class AuctionDetailLexsSysMainComponent {
  mode: TMode = 'VIEW';
  fsubbidnum!: string;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
  ) {}

  ngOnInit(): void {
    if (!this.fsubbidnum) {
      this.route.queryParams.subscribe(params => {
        this.fsubbidnum = params['fsubbidnum'];
      });
    }
  }

  onBack() {
    this.routerService.back();
  }
}
