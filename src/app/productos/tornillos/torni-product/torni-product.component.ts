import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TornillosService } from '../tornillos.service';
import { CarritoService, Producto } from '../../../services/carrito.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-torni-product',
  templateUrl: './torni-product.component.html',
  styleUrls: ['./torni-product.component.css']
})
export class TorniProductComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomImg', { static: false }) zoomImg!: ElementRef<HTMLImageElement>;

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
      .pipe(finalize(() => this.cargando = false))
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

  ngAfterViewInit() {
    // nada más por ahora
  }

  onImageHover(e: MouseEvent) {
    const imgEl = this.zoomImg.nativeElement;
    const rect = imgEl.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    imgEl.style.transformOrigin = `${xPct}% ${yPct}%`;
    imgEl.style.transform = 'scale(1.5)';  // escala reducida
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
      tipo: 'tornillo'
    };
    this.carritoService.addProduct(prod);
  }
}
