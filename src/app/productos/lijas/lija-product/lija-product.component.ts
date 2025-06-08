import { Component, OnInit } from '@angular/core';
import { CarritoService, Producto } from '../../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LijasService } from '../lijas.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lija-product',
  templateUrl: './lija-product.component.html',
  styleUrls: ['./lija-product.component.css'],
  imports: [RouterModule, CommonModule] 
})
export class LijaProductComponent implements OnInit {
  lija: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false; 

  constructor(
    private route: ActivatedRoute,
    private lijasService: LijasService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;
    this.lijasService.getLijaById(id)
      .pipe(
        finalize(() => this.cargando = false)  
      )
      .subscribe({
        next: data => {
          this.lija = data;
          const max = Math.min(5, this.lija?.cantidad || 0);
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
      tipo:'lija'
    };
    this.carritoService.addProduct(prod);
  }

}
