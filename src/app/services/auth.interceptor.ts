import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private PUBLIC_URLS = ['/auth/login', '/auth/register'];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si la URL corresponde a login o register, pasar sin añadir header
    const urlPath = new URL(req.url).pathname;
    if (this.PUBLIC_URLS.some(path => urlPath.startsWith(path))) {
      return next.handle(req);
    }

    // Si hay token en localStorage, clonamos la petición y le añadimos Authorization
    const token = localStorage.getItem('token');
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    // Si no hay token, enviamos la petición sin modificar
    return next.handle(req);
  }
}
