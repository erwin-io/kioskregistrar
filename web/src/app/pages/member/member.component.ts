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
import { Member } from 'src/app/model/member';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { OptionSheetComponent } from 'src/app/shared/option-sheet/option-sheet.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  title = '';
  view: 'mobile' | 'tablet' | 'desktop';
  @ViewChild('userAccountMenuTrigger', {static: false }) userAccountMenuTrigger: MatMenuTrigger;
  profileLoaded = false;
  profile: Member;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private routeService: RouteService,
    private appconfig: AppConfigService,
  ) {
    const profile = this.storageService.getLoginProfile();
    if(!profile || !profile?.user || !profile?.user?.userId) {
      this.router.navigate(['/auth/']);
    }
    this.profile = profile as Member;
    this.onResize();
    this.onScroll();
  }
  ngOnInit(): void {
    this.routeService.data$.subscribe((res: { title: string;}) => {
      this.title = res.title;
    });
  }
  onActivate(event) {
    const title = this.titleService.getTitle();
    this.title = title ? title.replace(this.appconfig.config.appName, "").trim() : title;
    this.onResize();
    this.onScroll();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  openUserAccountMenuSheet() {
    const sheet = this.bottomSheet.open(OptionSheetComponent, {
      closeOnNavigation: true,
      data: { isUserAccount: true },
    });

    sheet.instance.confirmAccount.subscribe(res=> {
      sheet.dismiss();
      this.router.navigate(["/profile"]);
    });
    sheet.instance.confirmLogOut.subscribe(res=> {
      sheet.dismiss();
      this.logOut();
    });
  }

  public logOut() {

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

  profilePicErrorHandler(event) {
    event.target.src = this.getDeafaultProfilePicture();
  }

  getDeafaultProfilePicture() {
    if(this.profile && this.profile.gender?.toUpperCase() === "FEMALE") {
      return '../../../assets/img/person-female.png';
    } else {
      return '../../../assets/img/person.png';
    }
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
