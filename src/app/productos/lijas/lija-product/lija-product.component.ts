import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class LijaProductComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomImg', { static: false }) zoomImg!: ElementRef<HTMLImageElement>;

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
      .pipe(finalize(() => this.cargando = false))
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
      tipo: 'lija'
    };
    this.carritoService.addProduct(prod);
  }
}
