import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tabla{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  color: string;
  tamanho:number;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class TablasService {
private apiUrl = 'https://backend-d2i9.onrender.com/tablas';

 constructor(private http: HttpClient) {}

  getAll(): Observable<Tabla[]> {
    return this.http.get<Tabla[]>(this.apiUrl);
  }
  getTablaById(id: string): Observable<Tabla> {
  return this.http.get<Tabla>(`${this.apiUrl}/${id}`);
}
create(data: Partial<Tabla>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Tabla>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
