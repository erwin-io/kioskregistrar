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
import { ColumnDefinition, MemberTableColumn } from 'src/app/shared/utility/table';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { DataTableComponent } from 'src/app/shared/data-table/data-table.component';
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
  verifiedTab = true;
  currentMemberCode:string;
  error:string;
  dataSource = new MatTableDataSource<MemberTableColumn>();
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { memberId: "DESC"  };
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
  @ViewChild('dataTable', { static: true}) dataTable: DataTableComponent;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.dataSource = new MatTableDataSource([]);
      this.verifiedTab = this.route.snapshot.data["verified"];
      if(this.route.snapshot.data) {
        this.pageAccess = {
          ...this.pageAccess,
          ...this.route.snapshot.data["access"]
        };
      }
    }

  get selectedUser() {
    return !this.verifiedTab ? this.dataTable.dataSource.data.filter(x=>x.selected) : [];
  }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    this.currentMemberCode = profile && profile["memberCode"];
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
    const { apiNotation } = this.appConfig.config.tableColumns.membersVerified.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getUsers()
  }

  async headerChange(event) {
    console.log(event);
  }

  async rowControlChange(event) {
    console.log(event);
  }

  async getUsers(){
    try{
      this.isLoading = true;
      await this.userService.getMemberByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      }, this.verifiedTab)
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              memberCode: d.memberCode,
              fullName: `${d.firstName} ${d.lastName}`,
              courseTaken: d.courseTaken,
              email: d.email,
              mobileNumber: d.mobileNumber,
              birthDate: d.birthDate,
              address: d.address,
              isAlumni: d.isAlumni,
              url: `/admin/members/${d.memberCode}`,
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

  onApproveSelected() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Approve selected member?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;

    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        const memberCodes = this.selectedUser.map(x=>x.memberCode);
        let res = await this.userService.approveMember({ memberCodes }).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/admin/members/view/un-verified/'], { replaceUrl: true});
          this.getUsers();
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
