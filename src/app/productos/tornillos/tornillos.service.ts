import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tornillo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  tamanho: number;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class TornillosService {
private apiUrl = 'https://backend-d2i9.onrender.com/tornillos';

constructor(private http: HttpClient) {}

 getAll(): Observable<Tornillo[]> {
    return this.http.get<Tornillo[]>(this.apiUrl);
  }
  getTornilloById(id: string): Observable<Tornillo> {
  return this.http.get<Tornillo>(`${this.apiUrl}/${id}`);
}
create(data: Partial<Tornillo>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Tornillo>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
