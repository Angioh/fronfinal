import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly PUBLIC_URLS = ['/auth/login', '/auth/register'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const path = new URL(req.url).pathname;


    if (this.PUBLIC_URLS.some((publicPath) => path.startsWith(publicPath))) {
      return next.handle(req);
    }

    // Obtenemos el token JWT de localStorage
    const token = localStorage.getItem('token');

    // Si existe token, clonamos la petición y añadimos el header Authorization
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }

    //  Si no hay token, se envía la petición original sin Authorization
    return next.handle(req);
  }
}
