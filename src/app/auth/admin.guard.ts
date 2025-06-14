
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const role = this.auth.role; 
    if (role === 'admin') {
      return true;
    }
    return this.router.createUrlTree(['/cliente/dashboard']);
  }
}
