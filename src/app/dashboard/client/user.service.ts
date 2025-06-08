import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export interface ClienteProfile {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://backend-d2i9.onrender.com'; // Ajusta a tu URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(id: number): Observable<ClienteProfile> {
    const token = this.authService.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ClienteProfile>(
      `${this.apiUrl}/users/${id}`,
      { headers }
    );
  }

  updateProfile(
    id: number,
    data: Partial<ClienteProfile> & { password?: string }
  ): Observable<ClienteProfile> {
    const token = this.authService.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Ahora usamos PATCH en lugar de PUT
    return this.http.patch<ClienteProfile>(
      `${this.apiUrl}/users/${id}`,
      data,
      { headers }
    );
  }
}
