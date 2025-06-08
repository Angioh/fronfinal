import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rueda {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  diametro:number;
  dureza:number;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class RuedasService {
private apiUrl = 'https://backend-d2i9.onrender.com/ruedas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rueda[]> {
    return this.http.get<Rueda[]>(this.apiUrl);
  }
  getRuedaById(id: string): Observable<Rueda> {
  return this.http.get<Rueda>(`${this.apiUrl}/${id}`);
}
create(data: Partial<Rueda>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Rueda>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }

}
