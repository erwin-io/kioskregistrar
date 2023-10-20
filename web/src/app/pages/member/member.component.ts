import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

const titlePrefix = "SIATON MARKET STALL RENTALS";
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit, AfterViewInit {
  title = '';
  layout = 'main';
  loading = false;
  @ViewChild('header', {static: false}) header: ElementRef<HTMLDivElement>;
  sticky;
  constructor(
    private titleService:Title,
    private authService: AuthService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private spinner: SpinnerVisibilityService,
    private router: Router
    ) {
      this.setupTitleListener();
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.sticky = this.header.nativeElement.offsetTop > document.getElementById("top-header").clientHeight ? document.getElementById("top-header").clientHeight : this.header.nativeElement.offsetTop;
  }
  onActivate(event) {
    // window.scroll(0,0);

    if(this.header && this.sticky) {
      window.scroll({ 
              top: this.sticky > window.pageYOffset ? window.pageYOffset : this.sticky, 
              left: 0, 
              behavior: 'smooth' 
       });
    }
 
  }
  private setupTitleListener() {
    this.router.events.pipe(filter(e => e instanceof ResolveEnd)).subscribe((e: any) => {
      const { data } = this.getDeepestChildSnapshot(e.state.root);
      if(data?.['title']){
        this.title = data['title'];
        this.layout = data['layout'];
        this.titleService.setTitle(`${this.title} ${titlePrefix}`);
      }
      this.navigationInterceptor(e);
    });
  }
  
  getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild) {
      deepestChild = deepestChild.firstChild
    };
    return deepestChild || snapshot
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.spinner.show();
    }
    if (event instanceof NavigationEnd) {
      this.spinner.hide();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.spinner.hide();
    }
    if (event instanceof NavigationError) {
      this.spinner.hide();
    }
  }

  signOut() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to logout?';
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
    dialogRef.componentInstance.conFirm.subscribe(async (confirmed: any) => {
      // subscribe
      this.onScroll = null;
      const user = this.storageService.getLoginUser();
      this.storageService.saveLoginUser(null);
      this.authService.redirectUser(user, true)
      dialogRef.close();
    });
  }
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (this.sticky && window.pageYOffset > this.sticky) {
      this.header.nativeElement.classList.add("sticky");
    } else {
      this.header.nativeElement.classList.remove("sticky");
    }
  }
}