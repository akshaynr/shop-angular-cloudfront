import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error) => {
          const url = new URL(request.url);
          console.log('Error:', error);
          console.log('StatusCode:', error.statusCode);
          switch(error.status){
            case 401: 
              this.notificationService.showError('User not Authorized', 0);
              break;
            case 403:
              this.notificationService.showError('Forbidden', 0);
              break;
            case 500:
              this.notificationService.showError('Internal Server Error', 0);
              break;
            case 0: 
              this.notificationService.showError('Internet issue', 0);
              break;
            default:
              this.notificationService.showError(
                `Request to "${url.pathname}" failed. Check the console for the details`,
                0
              );
          }
        },
      })
    );
  }
}
