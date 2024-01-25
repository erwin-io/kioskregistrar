import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from './member-document-request.module'
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/request.service';
import { Request } from 'src/app/model/request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { Member } from 'src/app/model/member';
import { MemberDocumentRequestDetailsComponent } from './member-document-request-details/member-document-request-details.component';
import { NewMemberDocumentRequestComponent } from './new-member-document-request/new-member-document-request.component';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-member-document-request',
  templateUrl: './member-document-request.component.html',
  styleUrls: ['./member-document-request.component.scss']
})
export class MemberDocumentRequestComponent implements OnInit, AfterViewInit {
  selectedTabIndex = 0;
  isLoading = {
    pending: 0,
    'topay': 0,
    processing: 0,
    'tocomplete': 0
  }
  pageIndex = {
    pending: 0,
    'topay': 0,
    processing: 0,
    'tocomplete': 0
  };
  pageSize = {
    pending: 10,
    'topay': 10,
    processing: 10,
    'tocomplete': 10
  };
  total = {
    pending: 0,
    'topay': 0,
    processing: 0,
    'tocomplete': 0
  };
  order = {
    pending: { requestId: "DESC" },
    'topay': { requestId: "DESC" },
    processing: { requestId: "DESC" },
    'tocomplete': { requestId: "DESC" }
  };
  data = {
    pending: [] as Request[],
    'topay': [] as Request[],
    processing: [] as Request[],
    'tocomplete': [] as Request[]
  }
  error;
  currentUser: Member;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private requestService: RequestService,
    private storageService: StorageService,
    private titleService: Title,
    public appConfig: AppConfigService,
    private location: Location) {
    this.selectedTabIndex = this.route.snapshot.data && this.route.snapshot.data["tab"];
    const user = this.storageService.getLoginProfile();
    this.currentUser = user as Member;
  }
  async ngAfterViewInit() {
    this.initTable("pending", true);
    this.initTable("topay", true);
    this.initTable("processing", true);
    this.initTable("tocomplete", true);
  }
  ngOnInit() {
  }

  onTabChanged(event) {
    const route = routes.find(x=>x.data["tab"] === event.index && x.path !== "");
    if(route) {
      // this.router.navigate([`/member/document-request/${route.path}`]);
      this.location.replaceState(`/member/document-request/${route.path}`)
      this.titleService.setTitle(`${route.data["title"]} | ${this.appConfig.config.appName}`);
    }
  }

  async initTable(table: string, refresh = false){
    try{
      this.isLoading[table] = true;
      await this.requestService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: [{
          apiNotation: "requestedBy.memberId",
          filter: this.currentUser.memberId,
          type: "precise"
        },
        {
          apiNotation: "requestStatus",
          filter: table.toUpperCase(),
        }
      ],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          if(refresh) {
            this.data[table] = res.data.results;
          } else {
            res.data.results.forEach(x=> {
              if(this.data[table].some((r:Request)=>r.requestId.toString() !== x.requestId.toString())) {
                this.data[table].push(x);
              }
            });
          }
          this.total[table] = res.data ? res.data.total : 0;
          this.isLoading[table] = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading[table] = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading[table] = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading[table] = false;
    }

  }

  openDetailsDialog(details: Request) {
    const dialogRef = this.dialog.open(MemberDocumentRequestDetailsComponent, {
      width: '100%',
      panelClass: 'member-request-details-dialog',
    });
    dialogRef.componentInstance.requestDetails = details;
    dialogRef.componentInstance.descriptionChanged.subscribe(res=> {
      console.log(res);
      if(this.data[details.requestStatus.toLowerCase()].find((x:Request)=>x.requestNo === details.requestNo)) {
        this.data[details.requestStatus.toLowerCase()].find((x:Request)=>x.requestNo === details.requestNo).description = res;
      }
    })
  }

  onNewRequest() {
    const dialogRef = this.dialog.open(NewMemberDocumentRequestComponent, {
      width: '720px',
      disableClose: true,
      panelClass: "form-dialog"
    });
    dialogRef.componentInstance.newRequestAdded.subscribe(res=> {
      console.log(res);
      this.pageIndex["pending"] = 0;
      this.pageSize["pending"] = 0;
      this.initTable("pending", true);
    })
  }
}
