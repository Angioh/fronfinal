import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RodamientosService } from '../rodamientos.service';
import { ActivatedRoute } from '@angular/router';
import { CarritoService, Producto } from '../../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roda-product',
  templateUrl: './roda-product.component.html',
  styleUrls: ['./roda-product.component.css'],
  imports: [RouterModule, CommonModule]
})
export class RodaProductComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomImg', { static: false }) zoomImg!: ElementRef<HTMLImageElement>;

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

    this.cargando = true;
    this.rodamientosService.getRodamientoById(id)
      .pipe(finalize(() => this.cargando = false))
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

  ngAfterViewInit() {
    // nada extra por ahora
  }

  onImageHover(e: MouseEvent) {
    const imgEl = this.zoomImg.nativeElement;
    const rect = imgEl.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    imgEl.style.transformOrigin = `${xPct}% ${yPct}%`;
    imgEl.style.transform = 'scale(1.5)';
  }

  onImageLeave() {
    const imgEl = this.zoomImg.nativeElement;
    imgEl.style.transform = 'scale(1)';
  }

  agregarAlCarrito(producto: any): void {
    const prod: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      tipo: 'rodamiento'
    };
    this.carritoService.addProduct(prod);
  }
}
