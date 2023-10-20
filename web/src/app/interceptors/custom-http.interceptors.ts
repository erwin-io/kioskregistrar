import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

     constructor(private spinner: SpinnerVisibilityService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();

        return next.handle(req)
             .pipe(tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.spinner.hide();
                    }
                }, (error) => {
                    this.spinner.hide();
                }));
    }
}