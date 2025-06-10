import { Component, OnInit } from '@angular/core';
import { EjesService, Eje } from './ejes.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ejes',
  imports: [FormsModule, RouterLink],
  templateUrl: './ejes.component.html',
  styleUrl: './ejes.component.css',
})
export class EjesComponent {
  ejes: Eje[] = [];
  filteredEjes: Eje[] = [];
  ordenSeleccionado: string = 'nombre';
  ordenDireccion: 'asc' | 'desc' = 'asc';
  cargando = false;
  filtroMarca = '';

  constructor(private ejesService: EjesService) {}

  ngOnInit(): void {
    this.fetchEjes();
  }

  private fetchEjes() {
    this.cargando = true;
    this.ejesService
      .getAll()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (data) => (this.ejes = data),
        error: (err) => console.error('Error al cargar ejes:', err),
      });
  }

  aplicarFiltros(): void {
    this.filteredEjes = this.ejes.filter(
      (eje) =>
        !this.filtroMarca ||
        eje.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarEjes();
  }

  limpiarFiltros() {
    this.filtroMarca = 'Todos';
    this.filteredEjes = this.ejes;
  }

  ordenarEjes(): void {
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

    this.ejes.sort(comparator);

    if (this.filteredEjes?.length) {
      this.filteredEjes.sort(comparator);
    }
  }
  get marcasUnicas(): string[] {
    return Array.from(
      new Set(
        this.ejes.map((t) => t.marca || '').filter((m) => m.trim().length)
      )
    );
  }
}
