import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://backend-d2i9.onrender.com'; // Cambia por tu URL
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

constructor(private http: HttpClient, private router: Router) {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    this.currentUserSubject.next(JSON.parse(storedUser));
  }
}

  login(email: string, password: string) {
  return this.http.post<{ access_token: string }>(`${this.api}/auth/login`, { email, password }).pipe(
    tap(res => {
      localStorage.setItem('token', res.access_token);
    }),
    switchMap(() => this.getProfile())
  );
}

getProfile() {
  return this.http.get(`${this.api}/auth/profile`).pipe(
    tap(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    })
  );
}

  register(nombre:string,apellido:string,email: string, password: string, role = 'cliente',) {
    return this.http.post(`${this.api}/auth/register`, { nombre,apellido,email, password, role });
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  // GETTERS que ya tenías:
  get token() {
    return localStorage.getItem('token');
  }

  get user() {
    return this.currentUserSubject.value;
  }

   updateCurrentUser(updatedUser: any): void {
    // 1) Guardamos en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // 2) Emitimos el nuevo valor en el BehaviorSubject
    this.currentUserSubject.next(updatedUser);
  }

  get role() {
    return this.user?.role;
  }
}
