import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Title } from '@angular/platform-browser';
import {
  Router,
  ResolveEnd,
  ActivatedRouteSnapshot,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { OptionSheetComponent } from 'src/app/shared/option-sheet/option-sheet.component';

const titlePrefix = 'SIATON MARKET STALL RENTALS';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  title = '';
  view: 'mobile' | 'tablet' | 'desktop';
  @ViewChild('userAccountMenuTrigger', {static: false }) userAccountMenuTrigger: MatMenuTrigger;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {
    this.onResize();
    this.onScroll();
    this.setupTitleListener();
  }
  ngOnInit(): void {}
  onActivate(event) {
    const title = this.titleService.getTitle();
    this.title = title ? title.replace(titlePrefix, "").trim() : title;
    this.onResize();
    this.onScroll();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  private setupTitleListener() {
    this.router.events
      .pipe(filter((e) => e instanceof ResolveEnd))
      .subscribe((e: any) => {
        const { data } = this.getDeepestChildSnapshot(e.state.root);
        if (data?.['title']) {
          this.title = data['title'];
          this.titleService.setTitle(`${this.title} ${titlePrefix}`);
        }
        this.navigationInterceptor(e);
      });
  }

  getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild) {
      deepestChild = deepestChild.firstChild;
    }
    return deepestChild || snapshot;
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
  
  openUserAccountMenuSheet() {
    const sheet = this.bottomSheet.open(OptionSheetComponent, {
      closeOnNavigation: true, 
      data: { isUserAccount: true },
    });
    sheet.instance.confirmLogOut.subscribe(res=> {
      sheet.dismiss();
      this.logOut();
    });
  }

  public logOut() {
    // const dialogData = new AlertDialogModel();
    // dialogData.title = 'Confirm';
    // dialogData.message = 'Are you sure you want to logout?';
    // dialogData.confirmButton = {
    //   visible: true,
    //   text: 'yes',
    //   color: 'primary',
    // };
    // dialogData.dismissButton = {
    //   visible: true,
    //   text: 'cancel',
    // };
    // const dialogRef = this.dialog.open(AlertDialogComponent, {
    //   maxWidth: '400px',
    //   closeOnNavigation: true,
    // });

    // dialogRef.componentInstance.alertDialogConfig = dialogData;
    // dialogRef.componentInstance.conFirm.subscribe(async (confirmed: any) => {
    //   // subscribe
    //   const profile = this.storageService.getLoginProfile();
    //   this.storageService.saveLoginProfile(null);
    //   this.authService.redirectToPage(profile, true);
    //   dialogRef.close();
    // });

    
    const sheet = this.bottomSheet.open(OptionSheetComponent, {
      closeOnNavigation: true, 
      data: { isConfirmYesNoCancel: true },
    });
    sheet.instance.confirmYesNoCancel.subscribe(res=> {
      if(res && res.toString().toLowerCase() === "yes") {
        const profile = this.storageService.getLoginProfile();
        this.storageService.saveLoginProfile(null);
        this.authService.redirectToPage(profile, true);
        this.bottomSheet.dismiss();
      } else {
        this.bottomSheet.dismiss();
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if(window.innerWidth <= 480 ) {
      this.view = "mobile";
      if(this.userAccountMenuTrigger) this.userAccountMenuTrigger.closeMenu();
    } else if(window.innerWidth >= 481 && window.innerWidth <= 600) {
      this.view = "tablet";
      if(this.userAccountMenuTrigger) this.userAccountMenuTrigger.closeMenu();
    } else {
      if(this.bottomSheet) this.bottomSheet.dismiss();
      this.view = "desktop";
    }
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event?) {}
}