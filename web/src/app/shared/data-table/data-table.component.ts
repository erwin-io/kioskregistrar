import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ColumnDefinition } from 'src/app/model/table';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],

})
export class DataTableComponent {
  @Input() isLoading: any;
  @Input() dataSource = new MatTableDataSource<any>();
  @Input() columnDefs: ColumnDefinition[] = [];
  @Input() total = 0;
  displayedColumns: string[];
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() pageChange = new EventEmitter();
  @Output() sortChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();
  @Output() headerControlChange = new EventEmitter();
  @Output() rowControlChange = new EventEmitter();

  dateFromDefault = new Date();
  dateToDefault = new Date();
  constructor() {
  }

  booleanHeaderControlValue(name: string, checkBoxType: "all" | "indeterminate") {
    if(checkBoxType === "all") {
      const all = this.dataSource.data.filter(x=>x[name] === true);
      if(all) {
        return all.length === this.dataSource.data.length;
      } else {
        return false;
      }
    } else  {
      const all = this.dataSource.data.filter(x=>x[name] === true);
      if(all) {
        return all.length !== this.dataSource.data.length ? this.dataSource.data.some(x=>x[name] === true) : false;
      } else {
        return false;
      }
    }
  }
  ngAfterViewInit() {
    this.displayedColumns = this.columnDefs.map((def) => def.name);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageChange.emit({ pageIndex, pageSize })
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      this.sortChange.emit({ active, direction });
    });


  }

  filterTable() {
    const filter = this.columnDefs
    .filter((x: any)=>x.filter && !x.controls && (!x.name|| x.name !== ""))
    .map((x: any)=> { return {
      apiNotation: x.apiNotation,
      filter: x.filter,
      name: x.name,
      type: x.filterOptions && x.filterOptions.type ? x.filterOptions.type : "text"
    }});
    this.filterChange.emit(filter);
  }

  formatDateRange(from, to) {
    from = from && from !== "" ? moment(from).format("YYYY-MM-DD") : "";
    to = to && to !== "" ? moment(to).format("YYYY-MM-DD") : "";
    return `${from},${to}`;
  }

  booleanHeaderControlChange(name: string, value: boolean) {
    this.dataSource.data.forEach(x=> {
      if(x[name] !== undefined || x[name] !== null) {
        x[name] = value;
      }
    });
    if(name && name !== "") {
      this.headerControlChange.emit(this.dataSource.data);
    }
  }

  booleanRowControlChange() {
    this.rowControlChange.emit(this.dataSource.data);
  }
}