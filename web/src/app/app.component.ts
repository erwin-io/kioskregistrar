import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { RouteService } from './services/route.service';
import { AppConfigService } from './services/app-config.service';
import { PusherService } from './services/pusher.service';
import { StorageService } from './services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public spinkit = Spinkit;
  grantNotif = false;
  title;
  constructor(
    private titleService:Title,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private snackBar:MatSnackBar,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private pusher: PusherService,
    private routeService: RouteService) {
      if(this.storageService.getLoginProfile()?.user?.userId) {
        const { userId } = this.storageService.getLoginProfile()?.user;
        const channel = this.pusher.init(userId);
        channel.bind('notifAdded', ({ userId, title, description }) => {
          if(this.grantNotif) {
            const notify = new Notification(title, {
              body: description,
              icon: '../assets/img/banner.png'
            });
          }
          else {
            this.snackBar.open(title);
          }
        });
      }
      if (!window.Notification) {
        console.log('Browser does not support notifications.')
      } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
          // show notification here
          this.grantNotif = true;
        } else {
          // request permission from the user
          Notification.requestPermission()
            .then(function (p) {
              if (p === 'granted') {
                // show notification here
              } else {
                console.log('User blocked notifications.')
              }
            })
            .catch(function (err) {
              console.error(err)
            })
        }
      }
      this.setupTitleListener();
  }
  private setupTitleListener() {
    this.router.events.pipe(filter(e => e instanceof ResolveEnd)).subscribe((e: any) => {
      const { data } = this.getDeepestChildSnapshot(e.state.root);
      this.routeService.changeData(data);
      if(data?.['title']){
        this.title = data['title'];
        this.titleService.setTitle(`${this.title} | ${this.appconfig.config.appName}`);
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
}
