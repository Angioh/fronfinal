// src/app/components/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../services/pedido.service';
import { PedidoResponse } from '../pedido/pedido.model';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  pedidos: PedidoResponse[] = [];
  loading = false;
  error = '';

  constructor(
    private pedidoService: PedidoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.user;
    if (!user) {
      this.error = 'Debes iniciar sesión para ver tus pedidos.';
      return;
    }

    this.loading = true;
    this.pedidoService.getPedidosByUser(user.id).subscribe({
      next: all => {
        // Filtramos aquí todos los pedidos que tengan este userId
        this.pedidos = all.filter(p => p.userId === user.id);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudieron cargar tus pedidos.';
        this.loading = false;
      }
    });
  }
}
