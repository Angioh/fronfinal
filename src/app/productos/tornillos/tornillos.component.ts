import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TornillosService,Tornillo } from './tornillos.service';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tornillos',
  imports: [FormsModule,RouterModule, CommonModule],
  templateUrl: './tornillos.component.html',
  styleUrl: './tornillos.component.css'
})
export class TornillosComponent {

  tornillos: Tornillo[] = [];
  filteredTornillos: Tornillo[] = [];
      visibleCount = 2;
      incremento = 5;
      ordenSeleccionado: string = 'nombre'
      ordenDireccion: 'asc' | 'desc' = 'asc';
      cargando = false;
      filtroPrecioMax= 0.00;
      filtroMarca = '';
      filtroMinPrecio: any;
  
    constructor(private tornillosService: TornillosService) {}
  
    ngOnInit(): void {
      this.fetchTablas();
    }
  
    private fetchTablas() {
      this.cargando = true;
      this.tornillosService.getAll().pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (data) => (this.tornillos = data),
        error: (err) => console.error('Error al cargar tornillos:', err),
      });
    }
  
  aplicarFiltros(): void {
    this.filteredTornillos = this.tornillos.filter(
      (tabla) =>
        !this.filtroMarca ||
        tabla.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarTornillos();

  }
  
  limpiarFiltros() {
      this.filtroMarca = 'Todos';
      this.filteredTornillos = this.tornillos;
    }
  

  
ordenarTornillos(): void {
  // Separamos campo y dirección del valor seleccionado
  const [campo, dir] = this.ordenSeleccionado.split('-');
  const asc = dir === 'asc';

  const comparator = (a: any, b: any): number => {
    if (campo === 'precio') {
      // Numérico, invertimos según asc/desc
      return asc
        ? a.precio - b.precio
        : b.precio - a.precio;
    }

    // Para strings (p.ej. nombre), siempre usamos ascendente: localeCompare
    const valorA = (a[campo]?.toString() || '').toLowerCase();
    const valorB = (b[campo]?.toString() || '').toLowerCase();
    // Si quisieras soportar desc en nombre, podrías usar `asc ? cmp : -cmp`
    return valorA.localeCompare(valorB);
  };

  // Ordena el array completo
  this.tornillos.sort(comparator);

  // Y si hay filtrado, ordena también el filtrado
  if (this.filteredTornillos?.length) {
    this.filteredTornillos.sort(comparator);
  }
}
get marcasUnicas(): string[] {

    return Array.from(
      new Set(
        this.tornillos
          .map(t => t.marca || '')      
          .filter(m => m.trim().length) 
      )
    );
  }
}
