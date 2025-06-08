import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userLogin = false;
  nombre = '';
  usuarioRole: string | null = null;

  // Nueva propiedad para el número de ítems
  carritoCount = 0;

  private userSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Suscripción al usuario
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.userLogin = !!user;
      this.nombre = user?.nombre || '';
      this.usuarioRole = user?.role || null;
    });

    // Suscripción al carrito
    this.cartSub = this.carritoService.carrito$.subscribe(items => {
      this.carritoCount = items.length;
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  abrirCarrito() {
    this.carritoService.abrirCarrito();
  }

  cerrarSesion() {
    this.authService.logout();
  }

  get dashboardRoute(): string {
    return this.usuarioRole === 'admin'
      ? '/administrador/dashboard'
      : '/cliente/dashboard';
  }
}
