import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LijasService,Lija } from './lijas.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-lijas',
  imports: [FormsModule, CommonModule, RouterModule,RouterLink],
  templateUrl: './lijas.component.html',
  styleUrl: './lijas.component.css'
})
export class LijasComponent {
lijas: Lija[] = [];
filteredLijas: Lija[] = [];
    visibleCount = 10;
    incremento = 5;
    ordenSeleccionado: string = 'nombre'
    cargando = false; 
    filtroPrecioMax= 0.00;
    filtroMarca = '';
    filtroMinPrecio: any;

  constructor(private lijasService: LijasService) {}

  ngOnInit(): void {
    this.fetchLijas();
  }

  private fetchLijas() {
    this.cargando = true;
    this.lijasService.getAll().pipe(
                finalize(() => this.cargando = false)  // siempre desactiva al acabar
              ).subscribe({
      next: (data) => (this.lijas = data),
      error: (err) => console.error('Error al cargar lijas:', err),
    });
  }

   aplicarFiltros(): void {
  this.filteredLijas = this.lijas.filter((rodamiento) => {
    const cumpleMarca =
      !this.filtroMarca || rodamiento.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());

    const cumpleMinPrecio =
      !this.filtroMinPrecio || rodamiento.precio >= this.filtroMinPrecio;


    return cumpleMarca &&  cumpleMinPrecio ;
  });
  this.ordenarLijas();
  this.visibleCount = 10; 
}

limpiarFiltros() {
    this.filtroPrecioMax = 0.00;
    this.filtroMarca = '';
    this.filteredLijas = this.lijas;
  }

  verMas(): void {
  this.visibleCount = Math.min(this.visibleCount + this.incremento, this.filteredLijas.length);
}


ordenarLijas(): void {
  const campo = this.ordenSeleccionado;

  this.filteredLijas.sort((a: any, b: any) => {
    if (campo === 'precio') {
      return a.precio - b.precio;
    }

    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';

    return valorA.localeCompare(valorB);
  });
}
}
