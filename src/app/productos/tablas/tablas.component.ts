import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablasService, Tabla } from './tablas.service';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tablas',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './tablas.component.html',
  styleUrl: './tablas.component.css',
})
export class TablasComponent {
  tablas: Tabla[] = [];
  filteredTablas: Tabla[] = [];

  ordenSeleccionado: string = 'nombre';
  ordenDireccion: 'asc' | 'desc' = 'asc';
  cargando = false;
  filtroMarca = '';

  constructor(private tablasService: TablasService) {}

  ngOnInit(): void {
    this.fetchTablas();
  }

  private fetchTablas() {
    this.cargando = true;
    this.tablasService
      .getAll()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (data) => (this.tablas = data),
        error: (err) => console.error('Error al cargar tablas:', err),
      });
  }

  aplicarFiltros(): void {
    this.filteredTablas = this.tablas.filter(
      (tabla) =>
        !this.filtroMarca ||
        tabla.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarTablas();
  }

  limpiarFiltros() {
    this.filtroMarca = 'Todos';
    this.filteredTablas = this.tablas;
  }

  ordenarTablas(): void {
    const [campo, dir] = this.ordenSeleccionado.split('-');
    const asc = dir === 'asc';

    const comparator = (a: any, b: any): number => {
      if (campo === 'precio') {
        return asc ? a.precio - b.precio : b.precio - a.precio;
      }

      const valorA = (a[campo]?.toString() || '').toLowerCase();
      const valorB = (b[campo]?.toString() || '').toLowerCase();
      return valorA.localeCompare(valorB);
    };

    this.tablas.sort(comparator);

    if (this.filteredTablas?.length) {
      this.filteredTablas.sort(comparator);
    }
  }

  get marcasUnicas(): string[] {
    return Array.from(
      new Set(
        this.tablas.map((t) => t.marca || '').filter((m) => m.trim().length)
      )
    );
  }
}
