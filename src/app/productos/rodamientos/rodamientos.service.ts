import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Rodamiento{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  imagen_url: string;
  imagen_url2: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class RodamientosService {
private apiUrl = 'https://backend-d2i9.onrender.com/rodamientos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rodamiento[]> {
    return this.http.get<Rodamiento[]>(this.apiUrl);
  }
    getRodamientoById(id: string): Observable<Rodamiento> {
    return this.http.get<Rodamiento>(`${this.apiUrl}/${id}`);
  }
create(data: Partial<Rodamiento>) { return this.http.post(this.apiUrl, data); }
update(id: number, data: Partial<Rodamiento>) { return this.http.patch(`${this.apiUrl}/${id}`, data); }
delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }


}
