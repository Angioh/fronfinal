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
  visibleCount = 10;
  incremento = 5;
  ordenSeleccionado: string = 'nombre';
  cargando = false;
  filtroPrecioMax = 0.0;
  filtroMarca = '';
  filtroMinPrecio: any;

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
    this.filteredRuedas = this.ruedas.filter((rueda) => {
      const cumpleMarca =
        !this.filtroMarca ||
        rueda.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());
      const cumpleMinPrecio =
        !this.filtroMinPrecio || rueda.precio >= this.filtroMinPrecio;

      return cumpleMarca && cumpleMinPrecio;
    });
    this.ordenarRuedas();
    this.visibleCount = 10;
  }

  limpiarFiltros() {
    this.filtroPrecioMax = 0.0;
    this.filtroMarca = '';
    this.filteredRuedas = this.ruedas;
  }

  verMas(): void {
    this.visibleCount = Math.min(
      this.visibleCount + this.incremento,
      this.filteredRuedas.length
    );
  }

  ordenarRuedas(): void {
    const campo = this.ordenSeleccionado;

    this.filteredRuedas.sort((a: any, b: any) => {
      if (campo === 'precio') {
        return a.precio - b.precio;
      }

      const valorA = a[campo]?.toString().toLowerCase() || '';
      const valorB = b[campo]?.toString().toLowerCase() || '';

      return valorA.localeCompare(valorB);
    });
  }
}
