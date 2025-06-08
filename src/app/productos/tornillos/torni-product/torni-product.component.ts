import { Component, OnInit } from '@angular/core';
import { TornillosService } from '../tornillos.service';
import { CarritoService,Producto } from '../../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports:[CommonModule,RouterLink],
  selector: 'app-torni-product',
  templateUrl: './torni-product.component.html',
  styleUrls: ['./torni-product.component.css']
})
export class TorniProductComponent implements OnInit {

  torni: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false; 

  constructor(
    private route: ActivatedRoute,
    private tornillosService: TornillosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;
    this.tornillosService.getTornilloById(id)
      .pipe(
        finalize(() => this.cargando = false)  
      )
      .subscribe({
        next: data => {
          this.torni = data;
          const max = Math.min(5, this.torni?.cantidad || 0);
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
      tipo:'tornillo'
    };
    this.carritoService.addProduct(prod);
  }

}
