import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoService, CarritoItem } from '../services/carrito.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  imports: [RouterLink, FormsModule, CommonModule]
})
export class CarritoComponent implements OnInit, OnDestroy {
  carritoVisible = false;
  carritoItems: CarritoItem[] = [];
  private carritoSub!: Subscription;
  private visSub!: Subscription;

  constructor(private carritoService: CarritoService) {
    this.visSub = this.carritoService.carritoVisible$.subscribe(visible => {
      this.carritoVisible = visible;
    });
    this.carritoService.cerrarCarrito();
  }

  ngOnInit(): void {
    this.carritoSub = this.carritoService.carrito$.subscribe(items => {
      this.carritoItems = items;
    });
  }

  ngOnDestroy(): void {
    this.carritoSub.unsubscribe();
    this.visSub.unsubscribe();
  }

  toggleCarrito(): void {
    this.carritoVisible
      ? this.carritoService.cerrarCarrito()
      : this.carritoService.abrirCarrito();
  }

  removeFromCart(item: CarritoItem): void {
    this.carritoService.removeProduct(item);
  }

  onCantidadChange(item: CarritoItem, cantidad: number): void {
    this.carritoService.updateQuantity(item, cantidad);
  }

  get total(): number {
    return this.carritoService.getTotal();
  }

  get totalUnidades(): number {
    return this.carritoService.numItemsCarrito();
  }

  finalizarCompra(): void {
    console.log('Finalizando compra con:', this.carritoItems);
    this.carritoService.cerrarCarrito();
  }

  trackByTipoId(index: number, item: CarritoItem): string {
    return `${item.tipo}-${item.id}`;
  }
}
