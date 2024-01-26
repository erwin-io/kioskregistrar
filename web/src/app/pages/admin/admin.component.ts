import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  host: {
    class: "component-wrapper"
  }
})
export class AdminComponent {
  appName = "";
  title = "";
  pageIcon = "";
  loading = false;
  drawerDefaultOpened = false;
  details = false;
  profile: Admin;
  userProfilePicLoaded = false;
  constructor(
    private titleService:Title,
    private authService: AuthService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private routeService: RouteService
    ) {
      const profile = this.storageService.getLoginProfile();
      if(!profile || !profile?.user || !profile?.user?.userId) {
        this.router.navigate(['/auth/admin']);
      }
      this.profile = profile as Admin;
      this.onResize();
      this.routeService.data$.subscribe((res: { title: string; admin: boolean; details: boolean; icon: string }) => {
        this.title = res.title;
        this.details = res.details;
        this.pageIcon = res.icon;
      });
  }
  ngOnInit(): void {
  }

  onActivate(event) {
    this.onResize();
  }

  showMenu(page: string) {
    return this.profile.user && this.profile.user.access.some(x=>x.page.toLowerCase() === page.toLowerCase() && x.view);
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
      const profile = this.storageService.getLoginProfile();
      this.storageService.saveLoginProfile(null);
      this.authService.redirectToPage(profile, true)
      dialogRef.close();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if(window.innerWidth >= 960) {
      this.drawerDefaultOpened = true;
    } else {
      this.drawerDefaultOpened = false;
    }
  }

  profilePicErrorHandler(event) {
    event.target.src = '../../../assets/img/person.png';
  }
}
