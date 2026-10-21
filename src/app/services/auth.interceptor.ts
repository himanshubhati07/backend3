import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toast = inject(ToastService);

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  let clonedReq = req;

  // Attach auth token if it exists
  if (token) {
    const parsedToken = JSON.parse(token);
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${parsedToken.token || token}`,
      },
    });
  }

  // Prepend API URL for relative paths
  if (req.url.startsWith('/')) {
    clonedReq = clonedReq.clone({
      url: environment.apiUrl + req.url,
    });
  }

  return next(clonedReq).pipe(
    catchError(err => {
      // Show error toast on failed request
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An error occurred. Please try again.';
      toast.error(errorMessage);
      return throwError(() => err);
    })
  );
};
