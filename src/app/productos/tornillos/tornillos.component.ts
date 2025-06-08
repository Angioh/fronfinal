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
    this.filteredTornillos = this.tornillos.filter((tornillo) => {
      const cumpleMarca =
        !this.filtroMarca || tornillo.marca?.toLowerCase().includes(this.filtroMarca.toLowerCase());
  
      const cumpleMinPrecio =
        !this.filtroMinPrecio || tornillo.precio >= this.filtroMinPrecio;
  
  
      return cumpleMarca &&  cumpleMinPrecio ;
    });
    this.OrdenarTornillos();
    this.visibleCount = 2; 
  }
  
  limpiarFiltros() {
      this.filtroPrecioMax = 0.00;
      this.filtroMarca = '';
      this.filteredTornillos = this.tornillos;
    }
  
    verMas(): void {
    this.visibleCount = Math.min(this.visibleCount + this.incremento, this.tornillos.length);
  }
  
  
  OrdenarTornillos(): void {
    const campo = this.ordenSeleccionado;
  
    this.filteredTornillos.sort((a: any, b: any) => {
      if (campo === 'precio') {
        return a.precio - b.precio;
      }
  
      const valorA = a[campo]?.toString().toLowerCase() || '';
      const valorB = b[campo]?.toString().toLowerCase() || '';
  
      return valorA.localeCompare(valorB);
    });
  }
}
