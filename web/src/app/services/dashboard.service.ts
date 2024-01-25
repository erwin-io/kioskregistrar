import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../model/api-response.model';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getMemberDashboard(memberId): Observable<ApiResponse<{ pending: { total: number; prio: any }, toPay: { total: number; prio: any },toComplete: { total: number; prio: any },processing: { total: number; prio: any }}>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getMemberDashboard + memberId)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  getSummaryMemberUsers(): Observable<ApiResponse<{ verified: number; unVerified: number}>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getSummaryMemberUsers)
    .pipe(
      tap(_ => this.log('dashboard')),
      catchError(this.handleError('dashboard', []))
    );
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
