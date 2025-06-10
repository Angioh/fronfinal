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
      ordenDireccion: 'asc' | 'desc' = 'asc';
    cargando = false; 
    filtroMarca = '';

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
 this.filteredLijas = this.lijas.filter(
      (lija) =>
        !this.filtroMarca ||
        lija.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase())
    );

    this.ordenarLijas();

}

limpiarFiltros() {
    this.filtroMarca = 'Todos';
    this.filteredLijas = this.lijas;
  }



ordenarLijas(): void {

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


  this.lijas.sort(comparator);


  if (this.filteredLijas?.length) {
    this.filteredLijas.sort(comparator);
  }
}
get marcasUnicas(): string[] {

    return Array.from(
      new Set(
        this.lijas
          .map(t => t.marca || '')      
          .filter(m => m.trim().length) 
      )
    );
  }
}
