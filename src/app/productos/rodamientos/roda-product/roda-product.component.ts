import { Component, OnInit } from '@angular/core';
import { RodamientosService } from '../rodamientos.service';
import { ActivatedRoute } from '@angular/router';
import { CarritoService,Producto } from '../../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roda-product',
  templateUrl: './roda-product.component.html',
  styleUrls: ['./roda-product.component.css'],
  imports: [RouterModule, CommonModule] 
})
export class RodaProductComponent implements OnInit {
  roda: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false;  

  constructor(
    private route: ActivatedRoute,
    private rodamientosService: RodamientosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;  // <-- empezamos a cargar
    this.rodamientosService.getRodamientoById(id)
      .pipe(
        finalize(() => this.cargando = false)  // siempre desactiva al acabar
      )
      .subscribe({
        next: data => {
          this.roda = data;
          const max = Math.min(5, this.roda?.cantidad || 0);
          this.cantidadesDisponibles = Array.from({ length: max }, (_, i) => i + 1);
        },
        error: err => {
          console.error('Error al cargar producto', err);
        }
      });
  }

  agregarAlCarrito(producto: any): void {
    const prod: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      tipo:'rodamiento'
    };
    this.carritoService.addProduct(prod);
  }
}

