import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
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
export class ProductoComponent implements OnInit,AfterViewInit {
 @ViewChild('zoomImg', { static: false }) zoomImg!: ElementRef<HTMLImageElement>;

  producto: any;
  cantidadSeleccionada = 1;
  cantidadesDisponibles: number[] = [];
  cargando = false; 

  constructor(
    private route: ActivatedRoute,
    private tablasService: TablasService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando = true; 
    this.tablasService.getTablaById(id)
      .pipe(
        finalize(() => this.cargando = false)  
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

    ngAfterViewInit() {

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
      tipo:'tabla'
    };
    this.carritoService.addProduct(prod);
  }
}
