import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Request } from '../model/request';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number,
    assignedAdminId: string,
  },
  requestStatus: string,
  ): Observable<ApiResponse<{ results: Request[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.getByAdvanceSearch + requestStatus,
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  getById(requestNo: string): Observable<ApiResponse<Request>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.getById + requestNo)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  create(params: any): Observable<ApiResponse<Request>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.create,
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  updateDescription(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateDescription + requestNo + "/updateDescription",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  assignRequest(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateStatus + requestNo + "/assignRequest",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  payRequest(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateStatus + requestNo + "/payRequest",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  completeRequest(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateStatus + requestNo + "/completeRequest",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  markAsToComplete(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateStatus + requestNo + "/markAsToComplete",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
  }

  closeRequest(requestNo: string, params: any): Observable<ApiResponse<Request>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.request.updateStatus + requestNo + "/closeRequest",
      params)
    .pipe(
      tap(_ => this.log('request')),
      catchError(this.handleError('request', []))
    );
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
