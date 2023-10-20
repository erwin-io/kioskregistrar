import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
    const user = this.storageService.getLoginUser();
    let canActivate = user && user !== undefined && user.userId && ["ADMIN", "MEMBER"].some(x=>x === user.userType);
    if(!canActivate && next.data && next.data["admin"]) {
      this.router.navigate(['auth/admin']);
    } else if(!canActivate && next.data && !next.data["admin"]) {
      this.router.navigate(['auth/member']);
    } else if(canActivate && user.userType === "ADMIN" && !next.data["admin"]) {
      this.router.navigate(['auth/admin']);
    } else if(canActivate && user.userType === "MEMBER" && next.data["admin"]) {
      this.router.navigate(['auth/member']);
    } else if(!canActivate && !next.data) {
      this.router.navigate(['auth']);
    }
    return canActivate;
  }

}
