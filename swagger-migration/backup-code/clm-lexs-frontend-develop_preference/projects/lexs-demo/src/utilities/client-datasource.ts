import { DataSource } from "@angular/cdk/collections";
import { PageEvent } from "@angular/material/paginator";
import { BehaviorSubject, combineLatest, merge, Observable, of as observableOf, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { SimplePaginatorComponent } from "../components/simple-paginator/simple-paginator.component";

/** Custom offline data source, any change please refer  https://github.com/angular/components/blob/master/src/material/table/table-data-source.ts */
export class ClientDataSource<T> extends DataSource<T> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  private _renderChangesSubscription: Subscription | null = null;

  /** Used to react to internal changes of the paginator that are made by the data source itself. */
  private readonly _internalPageChanges = new Subject<void>();

  /**
   * Instance of the Pagination component used by the table to control what page of the data is
   * displayed. Page changes emitted by the Pagination will trigger an update to the
   * table's rendered data.
   */
  get paginator(): SimplePaginatorComponent | null {
    return this._paginator;
  }

  set paginator(paginator: SimplePaginatorComponent | null) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }

  private _paginator: SimplePaginatorComponent | null = null;

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }

  set data(data: T[]) {
    this._data.next(data);
    // Normally the `filteredData` is updated by the re-render
    // subscription, but that won't happen if it's inactive.
    if (!this._renderChangesSubscription) {
      this._filterData(data);
    }
  }

  /**
   * Filter term that should be used to filter out objects from the data array. To override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filter(): string {
    return this._filter.value;
  }

  set filter(filter: string) {
    this._filter.next(filter);
    // Normally the `filteredData` is updated by the re-render
    // subscription, but that won't happen if it's inactive.
    if (!this._renderChangesSubscription) {
      this._filterData(this.data);
    }
  }

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<string>('');

  /**
  * The filtered set of data that has been matched by the filter string, or all the data if there
  * is no filter. Useful for knowing the set of data the table represents.
  * For example, a 'selectAll()' function would likely want to select the set of filtered data
  * shown to the user rather than all the data.
  */
  public filteredData: T[] = [];

  constructor(initialData: T[] = []) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this._updateChangeSubscription();
  }

  /**
  * Subscribe to changes that should trigger an update to the table's rendered rows. When the
  * changes occur, process the current state of the filter, sort, and pagination along with
  * the provided base data and send it to the table for rendering.
  */
  private _updateChangeSubscription() {
    const pageChange: Observable<PageEvent | null | void> =
      this._paginator ?
        merge(
          this._paginator.page,
          this._paginator.initialized,
          this._internalPageChanges) as Observable<PageEvent | void>
        : observableOf(null);

    // Initial data
    const dataStream = this._data;

    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([dataStream, this._filter])
      .pipe(map(([data]) => this._filterData(data)));

    // Watch for ordered data or page changes to provide a paged set of data.
    const paginatedData = combineLatest([filteredData, pageChange])
      .pipe(map(([data]) => this._pageData(data)));

    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
  }

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterTermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  private _filterData(data: T[]) {
    // If there is a filter string, filter out data that does not contain it.
    // Each data object is converted to a string using the function defined by filterTermAccessor.
    // May be overridden for customization.
    this.filteredData = (this.filter == null || this.filter === '') ? data :
      data.filter(obj => this.filterPredicate(obj, this.filter));

    if (this.paginator) {
      this._updatePaginator(this.filteredData.length);
    }

    return this.filteredData;
  }

  /**
   * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the paginator's last page. Values are changed in a resolved promise to
   * guard against making property changes within a round of change detection.
   */
  private _updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;

      if (!paginator) {
        return;
      }

      paginator.length = filteredDataLength;

      // If the page index is set beyond the page, reduce it to the last page.
      if (paginator.pageIndex > 1) {
        const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 1;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);

        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;

          // Since the paginator only emits after user-generated changes,
          // we need our own stream so we know to should re-render the data.
          this._internalPageChanges.next();
        }
      }

    });
  }

  /**
   * Returns a paged slice of the provided data array according to the provided Pagination's page
   * index and length. If there is no paginator provided, returns the data array as provided.
   */
  private _pageData(data: T[]): T[] {
    if (!this.paginator) {
      return data;
    }

    const startIndex = (this.paginator.pageIndex - 1) * this.paginator.pageSize;
    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  /**
  * Checks if a data object matches the data source's filter string. By default, each data object
  * is converted to a string of its properties and returns true if the filter has
  * at least one occurrence in that string. By default, the filter string has its whitespace
  * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
  * filter matching.
  * @param data Data object used to check against the filter.
  * @param filter Filter string that has been set on the data source.
  * @returns Whether the filter matches against the data
  */
  public filterPredicate: ((data: T, filter: string) => boolean) = (data: T, filter: string): boolean => {
    // Transform the data into a lowercase string of all property values.
    const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
      // Use an obscure Unicode character to delimit the words in the concatenated string.
      // This avoids matches where the values of two columns combined will match the user's query
      // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
      // that has a very low chance of being typed in by somebody in a text field. This one in
      // particular is "White up-pointing triangle with dot" from
      // https://en.wikipedia.org/wiki/List_of_Unicode_characters
      return currentTerm + (data as { [key: string]: any })[key] + '◬';
    }, '').toLowerCase();

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) != -1;
  }

  connect(): Observable<T[]> {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }

    return this._renderData;
  }

  disconnect(): void {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }
}
