// src/app/components/order-admin/order-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { PedidoResponse, PedidoEstado } from '../../../pedido/pedido.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-admin.component.html',
  styleUrls: ['./order-admin.component.css'],
})
export class OrderAdminComponent implements OnInit {
  pedidos: PedidoResponse[] = [];
  loading = false;
  error = '';
  estados = Object.values(PedidoEstado);

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos() {
    this.loading = true;
    this.pedidoService.getAllPedidos().subscribe({
      next: (datos) => {
        this.pedidos = datos;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar pedidos.';
        this.loading = false;
      },
    });
  }

  onEstadoChange(id: number, nuevoEstado: PedidoEstado) {
    this.pedidoService.updatePedido(id, nuevoEstado).subscribe({
      next: (updated) => {
        const idx = this.pedidos.findIndex((p) => p.id === id);
        if (idx >= 0) this.pedidos[idx].estado = updated.estado;
      },
      error: () => alert('No se pudo actualizar el estado.'),
    });
  }

  onDelete(id: number) {
    if (!confirm(`¿Seguro que quieres eliminar el pedido #${id}?`)) return;
    this.pedidoService.deletePedido(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((p) => p.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo eliminar el pedido.');
      },
    });
  }
}
