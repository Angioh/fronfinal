
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
    ordenSeleccionado: string = 'nombre'
      ordenDireccion: 'asc' | 'desc' = 'asc';
     cargando = false;

    filtroMarca = '';


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
    this.filteredRodamientos = this.rodamientos.filter(
      (tabla) =>
        !this.filtroMarca ||
        tabla.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarRodamientos();

  }

limpiarFiltros() {
    this.filtroMarca = 'Todos';
    this.filteredRodamientos = this.rodamientos;
  }


ordenarRodamientos(): void {

  const [campo, dir] = this.ordenSeleccionado.split('-');
  const asc = dir === 'asc';

  const comparator = (a: any, b: any): number => {
    if (campo === 'precio') {

      return asc
        ? a.precio - b.precio
        : b.precio - a.precio;
    }

 
    const valorA = (a[campo]?.toString() || '').toLowerCase();
    const valorB = (b[campo]?.toString() || '').toLowerCase();
    return valorA.localeCompare(valorB);
  };


  this.rodamientos.sort(comparator);


  if (this.filteredRodamientos?.length) {
    this.filteredRodamientos.sort(comparator);
  }
}
get marcasUnicas(): string[] {

    return Array.from(
      new Set(
        this.rodamientos
          .map(t => t.marca || '')      
          .filter(m => m.trim().length) 
      )
    );
  }
}
