import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablasService,Tabla } from './tablas.service';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tablas',
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.css'
})
export class TablasComponent {
tablas: Tabla[] = [];
filteredTablas: Tabla[] = [];
    visibleCount = 2;
    incremento = 5;
    ordenSeleccionado: string = 'nombre'
  cargando = false;  // <-- bandera del spinner

    filtroPrecioMax= 0.00;
    filtroMarca = '';
    filtroMinPrecio: any;

  constructor(private tablasService: TablasService) {}

  ngOnInit(): void {
    this.fetchTablas();
  }

  private fetchTablas() {
    this.cargando = true;
    this.tablasService.getAll().pipe(
            finalize(() => this.cargando = false)  // siempre desactiva al acabar
          )
          .subscribe({
      next: (data) => (this.tablas = data),
      error: (err) => console.error('Error al cargar tablas:', err),
    });
  }

   aplicarFiltros(): void {
  this.filteredTablas = this.tablas.filter((tabla) => {
    const cumpleMarca =
      !this.filtroMarca || tabla.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());

    const cumpleMinPrecio =
      !this.filtroMinPrecio || tabla.precio >= this.filtroMinPrecio;


    return cumpleMarca &&  cumpleMinPrecio ;
  });
  this.ordenarTablas();
  this.visibleCount = 2; 
}

limpiarFiltros() {
    this.filtroPrecioMax = 0.00;
    this.filtroMarca = '';
    this.filteredTablas = this.tablas;
  }

  verMas(): void {
  this.visibleCount = Math.min(this.visibleCount + this.incremento, this.tablas.length);
}


ordenarTablas(): void {
  const campo = this.ordenSeleccionado;

  this.filteredTablas.sort((a: any, b: any) => {
    if (campo === 'precio') {
      return a.precio - b.precio;
    }

    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';

    return valorA.localeCompare(valorB);
  });
}
}
