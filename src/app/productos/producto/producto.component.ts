import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablasService } from './../tablas/tablas.service';
import { CarritoService, Producto } from '../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [RouterModule]  
})
export class ProductoComponent implements OnInit {
  producto: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false;  // <-- bandera del spinner

  constructor(
    private route: ActivatedRoute,
    private tablasService: TablasService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;  // <-- empezamos a cargar
    this.tablasService.getTablaById(id)
      .pipe(
        finalize(() => this.cargando = false)  // siempre desactiva al acabar
      )
      .subscribe({
        next: data => {
          this.producto = data;
          const max = Math.min(5, this.producto?.cantidad || 0);
          this.cantidadesDisponibles = Array.from({ length: max }, (_, i) => i + 1);
        },
        error: err => {
          console.error('Error al cargar producto', err);
          // aquí podrías mostrar un mensaje de error si quieres
        }
      });
  }

  agregarAlCarrito(producto: any): void {
    const prod: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      tipo:'tabla'
    };
    this.carritoService.addProduct(prod);
  }
}
