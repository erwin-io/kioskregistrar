import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Access } from 'src/app/model/access';
import { ColumnDefinition, RequestTableColumn } from 'src/app/shared/utility/table';
import { AppConfigService } from 'src/app/services/app-config.service';
import { RequestService } from 'src/app/services/request.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { DataTableComponent } from 'src/app/shared/data-table/data-table.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { QrCodeScannerComponent } from 'src/app/shared/qr-code-scanner/qr-code-scanner.component';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.scss'],
  host: {
    class: "page-component"
  }
})
export class RequestManagementComponent {
  tabIndex = 0;
  reviewer = true;
  requestStatus = {
    pending: "PENDING",
    'to-process': "TOPAY",
    processing: "PROCESSING",
    'tocomplete': "TOCOMPLETE",
    closed: "CLOSED",
  };
  currentUserId:string;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<RequestTableColumn>([]),
    'to-process': new MatTableDataSource<RequestTableColumn>([]),
    processing: new MatTableDataSource<RequestTableColumn>([]),
    'tocomplete': new MatTableDataSource<RequestTableColumn>([]),
    closed: new MatTableDataSource<RequestTableColumn>([]),
  };
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    'to-process': 0,
    processing: 0,
    'tocomplete': 0,
    closed: 0,
  };
  pageSize = {
    pending: 10,
    'to-process': 10,
    processing: 10,
    'tocomplete': 10,
    closed: 10,
  };
  total = {
    pending: 0,
    'to-process': 0,
    processing: 0,
    'tocomplete': 0,
    closed: 0,
  };
  order = {
    pending: { requestId: "DESC" },
    'to-process': { requestId: "DESC" },
    processing: { requestId: "DESC" },
    'tocomplete': { requestId: "DESC" },
    closed: { requestId: "DESC" },
  };
  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    'to-process': [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    processing: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    'tocomplete': [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    closed: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
  };
  tableColumns = {
    pending: this.appConfig.config.tableColumns.request.slice(0),
    'to-process': this.appConfig.config.tableColumns.request.slice(0),
    processing: this.appConfig.config.tableColumns.request.slice(0),
    'tocomplete': this.appConfig.config.tableColumns.request.slice(0),
    closed: this.appConfig.config.tableColumns.request.slice(0),
  };

  assignedAdmin = {}

  pageAccess: Access = {
    view: true,
    modify: false,
  };

  @ViewChild('dataTablePending', { static: true}) dataTablePending: DataTableComponent;
  @ViewChild('dataTableToProcess', { static: true}) dataTableToProcess: DataTableComponent;
  @ViewChild('dataTableProcessing', { static: true}) dataTableProcessing: DataTableComponent;
  @ViewChild('dataTableToComplete', { static: true}) dataTableToComplete: DataTableComponent;
  @ViewChild('dataTableClosed', { static: true}) dataTableClosed: DataTableComponent;

  optionsAllAdmin = [];

  showAll = {
    pending: false,
    'to-process': false,
    processing: false,
    'tocomplete': false,
    closed: false,
  };
  constructor(
    private spinner: SpinnerVisibilityService,
    private titleService: Title,
    private routeService: RouteService,
    private requestService: RequestService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _location: Location,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.reviewer = this.route.snapshot.data["reviewer"];
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        this.pageAccess = {
          ...this.pageAccess,
          ...this.route.snapshot.data["access"]
        };
      }

      const profile = this.storageService.getLoginProfile();
      this.assignedAdmin = {
        pending: profile["adminId"],
        'to-process': profile["adminId"],
        processing: profile["adminId"],
        'tocomplete': profile["adminId"],
        closed: profile["adminId"],
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }


  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  async ngOnInit(): Promise<void> {
    const profile = this.storageService.getLoginProfile();
    this.currentUserId = profile && profile.user.userId;
    let [getAllAdmin] = await Promise.all([
      this.userService.getAllAdmin().toPromise()
    ]);

    this.optionsAllAdmin = getAllAdmin.data;

  }

  ngAfterViewInit() {
    this.initTable("pending");
    this.initTable("to-process");
    this.initTable("processing");
    this.initTable("tocomplete");
    this.initTable("closed");
  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.initTable(table);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.initTable(table);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.tableColumns[table].find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.initTable(table)
  }

  async headerChange(event) {
  }

  async rowControlChange(event) {
  }

  async toggleAssigneeColumn(table, columnDefs, showAll) {
    this.tableColumns[table] = columnDefs.slice(0).map(x=> {
        if(x.name === "assignedAdmin") {
          x.hide = !showAll;
          if(!showAll) {
            x.filterOptions["filter"] = "";
          }
        }
        return x;
      })
      if(showAll) {
        this.assignedAdmin[table] = null;
      } else {
        const profile = this.storageService.getLoginProfile();
        this.assignedAdmin[table] = profile["adminId"];
      }
      this.initTable(table);
  }

  async selectAssigneeChange({ value }, table) {
    this.assignedAdmin[table] = value;
    this.initTable(table);
  }

  async initTable(table: string){
    try{
      let findIndex = this.filter[table].findIndex(x=>x.apiNotation === 'requestStatus');
      if(findIndex >= 0) {
        this.filter[findIndex] = {
          apiNotation: 'requestStatus',
          // eslint-disable-next-line max-len
          filter: table.toLowerCase() === "to-process" ? "TOPAY" : table.toUpperCase(),
          name: 'requestStatus',
          type: 'precise'
        };
      } else {
        this.filter[table].push({
          apiNotation: 'requestStatus',
          // eslint-disable-next-line max-len
          filter: table.toLowerCase() === "to-process" ? "TOPAY" : table.toUpperCase(),
          name: 'requestStatus',
          type: 'precise'
        });
      }
      this.isLoading = true;
      this.spinner.show();
      await this.requestService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table],
        assignedAdminId: this.assignedAdmin[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              requestId: d.requestId,
              requestNo: d.requestNo,
              dateRequested: d.dateRequested?.toString(),
              requestedBy: d.requestedBy?.fullName,
              dateAssigned: d.dateAssigned?.toString(),
              datePaid: d.datePaid?.toString(),
              dateProcessStarted: d.dateProcessStarted?.toString(),
              dateProcessEnd: d.dateProcessEnd?.toString(),
              assignedAdminId: d.assignedAdmin?.adminId.toString(),
              assignedAdmin: d.assignedAdmin?.fullName,
              requestType: d.requestType.name,
              requestedByProfile: d.requestedBy?.user?.profileFile ? d.requestedBy?.user?.profileFile?.url : d.requestedBy.gender.toUpperCase() === "FEMALE" ? './assets/img/person-female.png' : './assets/img/person.png',
              url: `/admin/request-management/details/${d.requestNo}`
             } as RequestTableColumn
          });
          this.total[table] = res.data ? res.data.total : 0;
          this.dataSource[table] = new MatTableDataSource(data);
          this.isLoading = false;
          this.spinner.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.spinner.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.spinner.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.spinner.hide();
    }

  }


  onSelectedTabChange({ index }, redirect = true) {
    let table, hiddenColumn = [];
    if(index === 1) {
      if(redirect) {
        this._location.go("/admin/request-management/to-process");
      }
      this.titleService.setTitle(`To process | ${this.appConfig.config.appName}`);
      this.routeService.changeData({ title: "Processing", admin: true, details: false, icon: "assignment_turned_in" });
      table = 'to-process';
      hiddenColumn = ["dateProcessStarted", "dateProcessEnd"];
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/admin/request-management/processing");
      }
      this.titleService.setTitle(`Processing | ${this.appConfig.config.appName}`);
      this.routeService.changeData({ title: "Processing", admin: true, details: false, icon: "assignment_turned_in" });
      table = 'processing';
      hiddenColumn = ["dateProcessEnd", "dateCompleted"];
    } else if(index === 3) {
      if(redirect) {
        this._location.go("/admin/request-management/tocomplete");
      }
      this.titleService.setTitle(`To complete | ${this.appConfig.config.appName}`);
      this.routeService.changeData({ title: "To complete", admin: true, details: false, icon: "assignment_turned_in" });
      hiddenColumn = ["dateCompleted"];
      table = 'tocomplete';
    } else if(index === 4) {
      if(redirect) {
        this._location.go("/admin/request-management/closed");
      }
      this.titleService.setTitle(`Closed | ${this.appConfig.config.appName}`);
      this.routeService.changeData({ title: "Closed", admin: true, details: false, icon: "assignment_turned_in" });
      table = 'closed';
    } else {
      if(redirect) {
        this._location.go("/admin/request-management/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
      this.routeService.changeData({ title: "Pending", admin: true, details: false, icon: "assignment_turned_in" });
      table = 'pending';
      hiddenColumn = ["dateAssigned", "datePaid", "dateProcessStarted", "dateProcessEnd", "dateCompleted", "assignedAdmin"]
    }
    this.tableColumns[table] = this.tableColumns[table].map((x:ColumnDefinition)=> {
        if(x.name === "assignedAdmin") {
          x.hide = !this.showAll[table];
          if(this.showAll[table]) {
            x.filterOptions["filter"] = "";
          }
        } else {
          if(hiddenColumn.includes(x.name)) {
            x.hide = true;
          } else {
            x.hide = false;
          }
        }
        return x;
      });
      if(this.showAll[table]) {
        this.assignedAdmin[table] = null;
      } else {
        const profile = this.storageService.getLoginProfile();
        this.assignedAdmin[table] = profile["adminId"];
      }
  }

  openSacannerDialog() {
    const dialogRef = this.dialog.open(QrCodeScannerComponent, {
      width: '780px',
      panelClass: 'scanner-dialog'
    });
    dialogRef.componentInstance.scanComplete.subscribe(res=> {
      const requestNo = res;
      this.spinner.show();
      this.isLoading = true;
      try {
        this.requestService.getById(requestNo).subscribe(res=> {
          if (res.success) {
            this.router.navigate(["/admin/request-management/details/" + requestNo]);
            dialogRef.close();
          } else {
            dialogRef.componentInstance.scannerData.message = "Invalid QR Code or QR Code was not a request number.";
            this.snackBar.open("Invalid QR Code or QR Code was not a request number.", 'close', {
              panelClass: ['style-error'],
            });
          }
          this.isLoading = false;
          this.spinner.hide();
        }, ()=> {
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open("Invalid QR Code or QR Code was not a request number.", 'close', {
            panelClass: ['style-error'],
          });
          this.isLoading = false;
          this.spinner.hide();
          dialogRef.componentInstance.scannerData.message = "Invalid QR Code or QR Code was not a request number.";
        });
      } catch(ex) {
        this.isLoading = false;
        this.spinner.hide();
        dialogRef.componentInstance.scannerData.message = "Error scanning, please try again";
      }
    })
  }
}

