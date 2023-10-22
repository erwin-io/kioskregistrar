import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MemberAuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let canActivate = false;
    const profile = this.storageService.getLoginProfile();
    if(!profile) {
      this.router.navigate(['auth/member']);
    }
    if(profile.user && profile.user.userId && profile.user.userType.toUpperCase() ==="MEMBER") {
      canActivate = true;
    } else {
      this.router.navigate(['admin']);
    }
    return canActivate;
  }

}
