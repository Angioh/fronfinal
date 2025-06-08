import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService,Producto } from '../../../services/carrito.service';
import { EjesService } from '../ejes.service';
@Component({
  selector: 'app-eje-product',
  templateUrl: './eje-product.component.html',
  styleUrls: ['./eje-product.component.css'],
  imports: [RouterModule, CommonModule,RouterLink]
})
export class EjeProductComponent implements OnInit {
eje: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false; 

  constructor(
    private route: ActivatedRoute,
    private ejesService: EjesService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;
    this.ejesService.getEjeById(id)
      .pipe(
        finalize(() => this.cargando = false)  
      )
      .subscribe({
        next: data => {
          this.eje = data;
          const max = Math.min(5, this.eje?.cantidad || 0);
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
      tipo:'eje'
    };
    this.carritoService.addProduct(prod);
  }

}
