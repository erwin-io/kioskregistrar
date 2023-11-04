import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let canActivate = false;
    const profile = this.storageService.getLoginProfile();
    if(!profile) {
      this.router.navigate(['auth/admin']);
    }
    if(!profile.user.access) {
      this.router.navigate(['auth/admin']);
    }
    
    if(next.data["title"] && !["home","dashboard"].some(x=>x === next.data["title"].toLowerCase()) && 
    !profile.user.access.some(x=>x.page.trim().toUpperCase() === next.data["title"].trim().toUpperCase() && x.view)) {
      this.router.navigate(['admin/no-access'], {
        state: {
          "no-access-url": state.url,
          "no-access-page": next.data["title"]
        }
      });
    }
    if(profile.user && profile.user.userId && profile.user.userType.toUpperCase() ==="ADMIN") {
      canActivate = true;
    } else {
      this.router.navigate(['member']);
    }
    if(canActivate && next.data && next.data["title"]) {
      next.data = {
        ...next.data,
        access: profile.user.access && profile.user.access.find(x=>x.page.trim().toUpperCase() === next.data["title"].toString().toUpperCase())
      };
    }
    return canActivate;
  }

}
