import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { catchError, tap } from 'rxjs/operators';
import { IServices } from './interface/iservices';
import { AppConfigService } from './app-config.service';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { ApiResponse } from '../model/api-response.model';
import { Users } from '../model/users';
import { Admin } from '../model/admin';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IServices {

  isLoggedIn = false;
  redirectUrl: string;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private storageService: StorageService,
    private appconfig: AppConfigService) { }

  login(data: any, userType: "ADMIN" | "MEMBER") : Observable<ApiResponse<Admin | Member>> {
    if(userType === "ADMIN") {
      return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.login.admin, data)
      .pipe(
        tap(_ => this.isLoggedIn = true),
        catchError(this.handleError('login', []))
      );
    } else {
      return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.login.member, data)
      .pipe(
        tap(_ => this.isLoggedIn = true),
        catchError(this.handleError('login', []))
      );
    }
  }

  register(data: any): Observable<ApiResponse<Users>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.registerMember, data)
    .pipe(
      tap(_ => this.log('register')),
      catchError(this.handleError('register', []))
    );
  }

  redirectToPage(profile: Admin | Member, auth: boolean) {
    if (profile && profile !== undefined && profile.user && profile.user.userType === "ADMIN") {
        this.router.navigate([auth ? 'auth/admin' : 'admin'], { replaceUrl: true });
    } else if(profile && profile !== undefined && profile.user.userType === "MEMBER") {
      this.router.navigate([auth ? 'auth/member' : 'member'], { replaceUrl: true,  onSameUrlNavigation: "reload" });
    }
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
