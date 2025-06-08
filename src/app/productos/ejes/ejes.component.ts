import { Component,OnInit } from '@angular/core';
import { EjesService, Eje} from './ejes.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-ejes',
  imports: [FormsModule,RouterLink],
  templateUrl: './ejes.component.html',
  styleUrl: './ejes.component.css'
})
export class EjesComponent {
ejes: Eje[] = [];
filteredEjes: Eje[] = [];
    visibleCount = 10;
    incremento = 5;
    ordenSeleccionado: string = 'nombre'
    cargando = false;
    filtroPrecioMax= 0.00;
    filtroMarca = '';
    filtroMinPrecio: any;

  constructor(private ejesService: EjesService) {}

  ngOnInit(): void {
    this.fetchEjes();
  }

  private fetchEjes() {
    this.cargando = true;
    this.ejesService.getAll().pipe(
      finalize(() => this.cargando = false) 
    ).subscribe({
      next: (data) => (this.ejes = data),
      error: (err) => console.error('Error al cargar ejes:', err),
    });
  }

   aplicarFiltros(): void {
  this.filteredEjes = this.ejes.filter((eje) => {
    const cumpleMarca =
      !this.filtroMarca || eje.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());

    const cumpleMinPrecio =
      !this.filtroMinPrecio || eje.precio >= this.filtroMinPrecio;


    return cumpleMarca &&  cumpleMinPrecio ;
  });
  this.ordenarEjes();
  this.visibleCount = 10; 
}

limpiarFiltros() {
    this.filtroPrecioMax = 0.00;
    this.filtroMarca = '';
    this.filteredEjes = this.ejes;
  }

  verMas(): void {
  this.visibleCount = Math.min(this.visibleCount + this.incremento, this.filteredEjes.length);
}


ordenarEjes(): void {
  const campo = this.ordenSeleccionado;

  this.filteredEjes.sort((a: any, b: any) => {
    if (campo === 'precio') {
      return a.precio - b.precio;
    }

    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';

    return valorA.localeCompare(valorB);
  });
}
}
