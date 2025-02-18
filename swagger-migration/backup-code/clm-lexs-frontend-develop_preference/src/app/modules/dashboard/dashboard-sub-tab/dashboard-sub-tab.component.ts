import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IDashboardTab } from '../dashboard-tab/dashboard-tab.component';

@Component({
  selector: 'app-dashboard-sub-tab',
  templateUrl: './dashboard-sub-tab.component.html',
  styleUrls: ['./dashboard-sub-tab.component.scss'],
})
export class DashboardSubTabComponent implements OnInit, AfterViewChecked, AfterViewInit {
  constructor() {}

  @ViewChild('scrollWrapper', { static: false }) scrollWrapper!: ElementRef;

  @Input() tabs: IDashboardTab[] = [];
  @Input() currentSubTab: number | null = null;
  @Output()
  subTabChange = new EventEmitter<number | null>();

  enableCarousel: boolean = false;
  isScrollLeftEnd: boolean = false;
  isScrollRightEnd: boolean = false;
  currentScroll: number = 0;

  carousel: Element | undefined = undefined;

  private tabWidth: number = 0;

  ngOnInit(): void {
    if (this.tabs.length > 5) {
      this.enableCarousel = true;
      this.isScrollRightEnd = true;
    }
  }

  ngAfterViewInit(): void {
    this.tabWidth = (this.scrollWrapper.nativeElement.clientWidth * 16) / 100;
    if (this.currentSubTab && this.currentSubTab > 5) {
      // auto-scroll to tab if the tab it is not in screen's bounds
      this.scrollWrapper.nativeElement?.scrollTo({
        left: this.getTabScrollPosition(this.currentSubTab),
      });
    }
  }

  ngAfterViewChecked(): void {
    this.carousel = this.scrollWrapper.nativeElement.children?.[0];
    if (this.tabs.length > 5) {
      if (this.carousel && this.carousel.scrollWidth > this.scrollWrapper.nativeElement.clientWidth)
        this.enableCarousel = true;
      else this.enableCarousel = false;
    }
    this.tabWidth = (this.scrollWrapper.nativeElement.clientWidth * 16) / 100;
  }

  tabChange(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.subTabChange.emit(index);
  }

  getTabScrollPosition(tabIndex: number) {
    return (
      (tabIndex - 3) * (this.tabWidth + 16) -
      16 -
      this.tabWidth -
      (this.scrollWrapper.nativeElement.clientWidth % (this.tabWidth + 16)) +
      24
    );
  }

  onScroll() {
    const scrollAmount = this.scrollWrapper.nativeElement.scrollLeft;
    if (
      this.carousel &&
      this.scrollWrapper &&
      Math.abs(this.carousel?.scrollWidth - this.scrollWrapper.nativeElement.clientWidth - scrollAmount) < 1
    ) {
      this.isScrollLeftEnd = true;
    } else {
      this.isScrollLeftEnd = false;
    }
    if (scrollAmount === 0) this.isScrollRightEnd = true;
    else this.isScrollRightEnd = false;

    this.currentScroll = scrollAmount;
  }

  onNext() {
    const currentFirstTab = Math.ceil(this.currentScroll / (this.tabWidth + 16));
    const scrollTo = (currentFirstTab + 3) * (this.tabWidth + 16) - 16 + 24;
    if (scrollTo > this.carousel!.scrollWidth) {
      this.scrollWrapper.nativeElement?.scrollBy({
        left: this.carousel!.scrollWidth - this.scrollWrapper.nativeElement.clientWidth,
        behavior: 'smooth',
      });
    } else {
      this.scrollWrapper.nativeElement?.scrollBy({
        left: scrollTo - this.currentScroll,
        behavior: 'smooth',
      });
    }
  }

  onPrev() {
    const currentLastTab = Math.floor(
      (this.currentScroll + this.scrollWrapper.nativeElement.clientWidth) / (this.tabWidth + 16)
    );
    const scrollTo = this.getTabScrollPosition(currentLastTab - 4);
    if (this.currentScroll - scrollTo < 0) {
      this.scrollWrapper.nativeElement?.scrollBy({
        left: -this.currentScroll,
        behavior: 'smooth',
      });
    } else {
      this.scrollWrapper.nativeElement?.scrollBy({
        left: scrollTo - this.currentScroll,
        behavior: 'smooth',
      });
    }
  }
}
