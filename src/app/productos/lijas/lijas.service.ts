import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lija {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  color: string;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class LijasService {

private apiUrl = 'https://backend-d2i9.onrender.com/lijas';

constructor(private http: HttpClient) {}

  getAll(): Observable<Lija[]> {
    return this.http.get<Lija[]>(this.apiUrl);
  }
    getLijaById(id: string): Observable<Lija> {
    return this.http.get<Lija>(`${this.apiUrl}/${id}`);
  }

create(data: Partial<Lija>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Lija>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
