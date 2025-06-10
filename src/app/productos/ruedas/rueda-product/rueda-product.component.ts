import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CarritoService, Producto } from '../../../services/carrito.service';
import { ActivatedRoute } from '@angular/router';
import { RuedasService } from '../ruedas.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-rueda-product',
  templateUrl: './rueda-product.component.html',
  styleUrls: ['./rueda-product.component.css']
})
export class RuedaProductComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomImg', { static: false }) zoomImg!: ElementRef<HTMLImageElement>;

  rueda: any;
  cargando = false;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private ruedasService: RuedasService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true;
    this.ruedasService.getRuedaById(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: data => {
          this.rueda = data;
          const max = Math.min(5, this.rueda?.cantidad || 0);
          this.cantidadesDisponibles = Array.from({ length: max }, (_, i) => i + 1);
        },
        error: err => console.error('Error al cargar producto', err)
      });
  }

  ngAfterViewInit() {}

  onImageHover(e: MouseEvent) {
    const imgEl = this.zoomImg.nativeElement;
    const rect = imgEl.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    imgEl.style.transformOrigin = `${xPct}% ${yPct}%`;
    imgEl.style.transform = 'scale(1.5)';  // Escala reducida para no cubrir tanto
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
      tipo: 'rueda'
    };
    this.carritoService.addProduct(prod);
  }
}
