import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map, switchMap, catchError, of as observableOf, pipe } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Access } from 'src/app/model/access';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { AdminTableColumn } from 'src/app/model/table';

@Component({
  selector: 'app-admin-access',
  templateUrl: './admin-access.component.html',
  styleUrls: ['./admin-access.component.scss'],
  host: {
    class: "page-component"
  }
})
export class AdminAccessComponent implements OnInit {
  currentUserId:string;
  error:string;
  dataSource = new MatTableDataSource<AdminTableColumn>();
  displayedColumns = [];
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
    const { apiNotation } = this.appConfig.config.tableColumns.admin.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getUsers()
  }

  async getUsers(){
    try{
      this.isLoading = true;
      await this.userService.getAdminByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              userId: d.user.userId,
              userName: d.user.userName,
              fullName: `${d.firstName} ${d.lastName}`,
              mobileNumber: d.mobileNumber,
              enable: d.user.accessGranted,
              url: `/admin/admin-access/${d.user.userId}`,
            } as AdminTableColumn
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

  toggleEnable(userId:string, enable: boolean){
    const newValue = enable ? false : true;
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = newValue ? 'Enable user?' : 'Disable user?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color:'primary'
    }
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel'
    }
    const dialogRef = this.dialog.open(AlertDialogComponent, {
        maxWidth: '400px',
        closeOnNavigation: true
    })
    dialogRef.componentInstance.alertDialogConfig = dialogData;

    try{

      dialogRef.componentInstance.conFirm.subscribe((data: any) => {
        this.isProcessing = true;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        dialogRef.componentInstance.alertDialogConfig.message = 'Please wait...';
        this.userService.toggleGrantAccess({ userId, enable: newValue})
          .subscribe(async res => {
            if (res.success) {
              this.getUsers();
              this.snackBar.open(newValue ? 'User enabled!' : 'User disabled!', 'close', {panelClass: ['style-success']});
              this.isProcessing = false;
              dialogRef.componentInstance.isProcessing = this.isProcessing;
              dialogRef.close();
            } else {
              this.isProcessing = false;
              dialogRef.componentInstance.isProcessing = this.isProcessing;
              this.error = Array.isArray(res.message) ? res.message[0] : res.message;
              this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
              dialogRef.close();
            }
          }, async (err) => {
            this.isProcessing = false;
            dialogRef.componentInstance.isProcessing = this.isProcessing;
            this.error = Array.isArray(err.message) ? err.message[0] : err.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
            dialogRef.close();
          });
    });
    } catch (e){
      this.isProcessing = false;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      dialogRef.close();
    }
  }
}
