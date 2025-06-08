
import { Component } from '@angular/core';
import { RodamientosService, Rodamiento} from './rodamientos.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-rodamientos',
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './rodamientos.component.html',
  styleUrl: './rodamientos.component.css'
})
export class RodamientosComponent {
rodamientos: Rodamiento[] = [];
filteredRodamientos: Rodamiento[] = [];
    visibleCount = 10;
    incremento = 5;
    ordenSeleccionado: string = 'nombre'
     cargando = false;
    filtroPrecioMax= 0.00;
    filtroMarca = '';
    filtroMinPrecio: any;

  constructor(private rodamientosService: RodamientosService) {}

  ngOnInit(): void {
    this.fetchRodamientos();
  }

  private fetchRodamientos() {
    this.cargando = true;
    this.rodamientosService.getAll().pipe(finalize(() => this.cargando = false))
    .subscribe({
      next: (data) => (this.rodamientos = data),
      error: (err) => console.error('Error al cargar rodamientos:', err),
    });
  }

   aplicarFiltros(): void {
  this.filteredRodamientos = this.rodamientos.filter((rodamiento) => {
    const cumpleMarca =
      !this.filtroMarca || rodamiento.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());

    const cumpleMinPrecio =
      !this.filtroMinPrecio || rodamiento.precio >= this.filtroMinPrecio;


    return cumpleMarca &&  cumpleMinPrecio ;
  });
  this.ordenarRodamientos();
  this.visibleCount = 10; 
}

limpiarFiltros() {
    this.filtroPrecioMax = 0.00;
    this.filtroMarca = '';
    this.filteredRodamientos = this.rodamientos;
  }

  verMas(): void {
  this.visibleCount = Math.min(this.visibleCount + this.incremento, this.filteredRodamientos.length);
}


ordenarRodamientos(): void {
  const campo = this.ordenSeleccionado;

  this.filteredRodamientos.sort((a: any, b: any) => {
    if (campo === 'precio') {
      return a.precio - b.precio;
    }

    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';

    return valorA.localeCompare(valorB);
  });
}
}
