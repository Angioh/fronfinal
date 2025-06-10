import { Component } from '@angular/core';
import { RuedasService, Rueda } from './ruedas.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ruedas',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './ruedas.component.html',
  styleUrl: './ruedas.component.css',
})
export class RuedasComponent {
  ruedas: Rueda[] = [];
  filteredRuedas: Rueda[] = [];

  ordenSeleccionado: string = 'nombre';
  ordenDireccion: 'asc' | 'desc' = 'asc';
  cargando = false;
  filtroMarca = '';

  constructor(private ruedasService: RuedasService) {}

  ngOnInit(): void {
    this.fetchRuedas();
  }

  private fetchRuedas() {
    this.cargando = true;
    this.ruedasService
      .getAll()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (data) => (this.ruedas = data),
        error: (err) => console.error('Error al cargar ruedas:', err),
      });
  }


  aplicarFiltros(): void {
    this.filteredRuedas = this.ruedas.filter(
      (tabla) =>
        !this.filtroMarca ||
        tabla.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarRuedas();

  }

  limpiarFiltros() {
    this.filtroMarca = 'Todos';
    this.filteredRuedas = this.ruedas;
  }



  ordenarRuedas(): void {

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


  this.ruedas.sort(comparator);

  if (this.filteredRuedas?.length) {
    this.filteredRuedas.sort(comparator);
  }
  }
  get marcasUnicas(): string[] {

    return Array.from(
      new Set(
        this.ruedas
          .map(t => t.marca || '')      
          .filter(m => m.trim().length) 
      )
    );
  }
}
