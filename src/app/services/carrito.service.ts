import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  tipo: string;
}

// Nuevo: un ítem de carrito incluye la cantidad
export interface CarritoItem extends Producto {
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService implements OnDestroy {
  // STREAM de visibilidad
  private carritoVisible = new BehaviorSubject<boolean>(false);
  carritoVisible$ = this.carritoVisible.asObservable();

  // STREAM de items: ahora CarritoItem[]
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);
  carrito$: Observable<CarritoItem[]> = this.carritoSubject.asObservable();

  private userId: string | number | null = null;
  private storageKey = 'mi_app_carrito';

  private authSub: Subscription;
  private saveSub: Subscription;

  constructor(private auth: AuthService) {
    // 1) Sync carrito con localStorage al cambiar usuario
    this.authSub = this.auth.currentUser$.subscribe((user) => {
      if (user?.id != null) {
        this.userId = user.id;
        this.storageKey = `mi_app_carrito_${this.userId}`;
        const data = localStorage.getItem(this.storageKey);
        this.carritoSubject.next(data ? JSON.parse(data) : []);
      } else {
        this.userId = null;
        this.storageKey = 'mi_app_carrito';
        this.carritoSubject.next([]);
      }
    });

    // 2) Persiste cambios en el carrito (si hay userId)
    this.saveSub = this.carritoSubject.subscribe((items) => {
      if (this.userId != null) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.saveSub.unsubscribe();
  }

  // Visibilidad
  abrirCarrito() {
    this.carritoVisible.next(true);
  }

  cerrarCarrito() {
    this.carritoVisible.next(false);
  }

  addProduct(producto: Producto): void {
    const items = [...this.carritoSubject.value];

    const existing = items.find(
      (i) => i.id === producto.id && i.tipo === producto.tipo
    );
    if (existing) {
      existing.cantidad++;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }
    this.carritoSubject.next(items);
  }

removeProduct(item: CarritoItem): void {
  const items = this.carritoSubject.value
    .filter(i => !(i.id === item.id && i.tipo === item.tipo));

  this.carritoSubject.next(items);
}

  // Actualizar cantidad (si es menor a 1, elimina el ítem)
  updateQuantity(item: CarritoItem, cantidad: number): void {
    const items = [...this.carritoSubject.value];
    const target = items.find((i) => i.id === item.id);
    if (!target) return;
    if (cantidad < 1) {
      // quitar si baja de 1
      this.removeProduct(target);
    } else {
      target.cantidad = cantidad;
      this.carritoSubject.next(items);
    }
  }

  // Vaciar carrito
  clearCart(): void {
    this.carritoSubject.next([]);
    if (this.userId != null) {
      localStorage.removeItem(this.storageKey);
    }
  }

  // Auxiliares
  getItems(): CarritoItem[] {
    return this.carritoSubject.value;
  }

  // Número total de unidades
  numItemsCarrito(): number {
    return this.carritoSubject.value.reduce((sum, i) => sum + i.cantidad, 0);
  }

  // Total en euros
  getTotal(): number {
    return this.carritoSubject.value.reduce(
      (sum, i) => sum + i.precio * i.cantidad,
      0
    );
  }
}
