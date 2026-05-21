import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // If the request is for a local file or already has a full URL, don't change it
  if (req.url.startsWith('http') || req.url.startsWith('assets')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
  });

  return next(apiReq);
};
