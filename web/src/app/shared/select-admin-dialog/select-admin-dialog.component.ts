import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { UserService } from 'src/app/services/user.service';
import { AdminTableColumn } from '../utility/table';

export class SelectAdminDialogTableColumn extends AdminTableColumn {
  selected: boolean;
}
@Component({
  selector: 'app-select-admin-dialog',
  templateUrl: './select-admin-dialog.component.html',
  styleUrls: ['./select-admin-dialog.component.scss']
})
export class SelectAdminDialogComponent {
  displayedColumns = ["selected", "fullName" ]
  dataSource = new MatTableDataSource<SelectAdminDialogTableColumn>();
  selected: SelectAdminDialogTableColumn;
  doneSelect = new EventEmitter();
  total = 0;
  pageIndex = 0;
  pageSize = 10
  order = { adminCode: "ASC" } as any;
  filterName = "";
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectAdminDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.init();
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      if(active === "fullName") {
        this.order = { fullName: direction.toUpperCase()}
      }
      this.init();
    });
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "fullName",
        filter: this.filterName,
      },
    ];
    try {
      this.userService.getAdminByAdvanceSearch({
        order: this.order,
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(d=> {
          return {
            adminCode: d.adminCode,
            userName: d.user.userName,
            fullName: d.fullName,
            mobileNumber: d.mobileNumber,
            enable: d.user.accessGranted,
            url: `/admin/admin-access/${d.adminCode}`,
            selected: this.selected?.adminCode === d.adminCode,
          }
        }));
        this.total = res.data.total;
      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectAdminDialogTableColumn) {
    return this.dataSource.data.find(x=>x.adminCode === item.adminCode && x.selected) ? true : false;
  }

  selectionChange(currentSelected: SelectAdminDialogTableColumn, selected) {
    console.log(currentSelected);
    console.log("selected", selected);
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentSelected.adminCode === item.adminCode;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectAdminDialogTableColumn>(items);
    console.log("selected", this.dataSource.data);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.userService.getAdminById(this.selected.adminCode).toPromise();
      this.spinner.hide();
      if(res.success) {
        this.dialogRef.close(res.data);
      } else {
        const error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      }
    } catch(ex) {
      const error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      this.spinner.hide();
    }
  }
}
