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
  // Rutas públicas donde no añadiremos Authorization
  private readonly PUBLIC_URLS = ['/auth/login', '/auth/register'];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Extraemos solo el path de la URL (por ejemplo '/auth/login')
    const path = new URL(req.url).pathname;

    // 2) Si corresponde a una ruta pública, dejamos pasar la petición sin modificar
    if (this.PUBLIC_URLS.some(publicPath => path.startsWith(publicPath))) {
      return next.handle(req);
    }

    // 3) Obtenemos el token JWT de localStorage
    const token = localStorage.getItem('token');

    // 4) Si existe token, clonamos la petición y añadimos el header Authorization
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    // 5) Si no hay token, se envía la petición original sin Authorization
    return next.handle(req);
  }
}
