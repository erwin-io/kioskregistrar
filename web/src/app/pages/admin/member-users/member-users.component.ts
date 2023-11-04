import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Access } from 'src/app/model/access';
import { ColumnDefinition, MemberTableColumn } from 'src/app/model/table';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';

@Component({
  selector: 'app-member-users',
  templateUrl: './member-users.component.html',
  styleUrls: ['./member-users.component.scss'],
  host: {
    class: "page-component"
  }
})
export class MemberUsersComponent {
  currentUserId:string;
  error:string;
  dataSource = new MatTableDataSource<MemberTableColumn>();
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { user: { userId: "DESC" } };
  filter: { 
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[] = [];

  pageAccess: Access = {
    view: true,
    modify: false,
  };
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.dataSource = new MatTableDataSource([]);
      if(this.route.snapshot.data) {
        this.pageAccess = {
          ...this.pageAccess,
          ...this.route.snapshot.data["access"]
        };
      }
    }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    this.currentUserId = profile && profile.user.userId;
  }

  ngAfterViewInit() {
    this.getUsers();
  }

  filterChange(event: { 
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getUsers();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getUsers();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.members.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getUsers()
  }

  async getUsers(){
    try{
      this.isLoading = true;
      await this.userService.getMemberByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              fullName: `${d.firstName} ${d.lastName}`,
              courseTaken: d.courseTaken,
              email: d.email,
              mobileNumber: d.mobileNumber,
              birthDate: d.birthDate,
              address: d.address,
              isAlumni: d.isAlumni,
              url: `/admin/members/${d.user.userId}`,
            } as MemberTableColumn
          });
          this.total = res.data.total;
          this.dataSource = new MatTableDataSource(data);
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }

  }
}
