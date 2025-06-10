import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoResponse } from '../pedido/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API_URL = 'https://backend-d2i9.onrender.com/pedidos';

  constructor(private http: HttpClient) {}

  crearPedido(pedido: Pedido): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.API_URL, pedido);
  }

  getPedidosByUser(userId: number): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.API_URL}?userId=${userId}`);
  }

  getAllPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.API_URL);
  }
  getUltimoPedido(): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API_URL}/ultimo`);
  }

  updatePedido(
    id: number,
    estado: PedidoResponse['estado']
  ): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.API_URL}/${id}`, { estado });
  }

  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
