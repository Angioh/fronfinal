import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




export interface Eje {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  anchura:number;
  altura:number;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class EjesService {
private apiUrl = 'https://backend-d2i9.onrender.com/ejes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Eje[]> {
    return this.http.get<Eje[]>(this.apiUrl);
  }
    getEjeById(id: string): Observable<Eje> {
    return this.http.get<Eje>(`${this.apiUrl}/${id}`);
  }

create(data: Partial<Eje>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Eje>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }

}
