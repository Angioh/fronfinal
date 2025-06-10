import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TablasService, Tabla } from '../productos/tablas/tablas.service';
import { RuedasService, Rueda } from '../productos/ruedas/ruedas.service';

@Component({
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('cardCarouselTablas', { static: true })
  tablasCarousel!: ElementRef<HTMLElement>;

  @ViewChild('cardCarouselRuedas', { static: true })
  ruedasCarousel!: ElementRef<HTMLElement>;

  tablas: Tabla[] = [];
  ruedas: Rueda[] = [];

  // índices separados para tablas y ruedas
  tablaIndex = 0;
  ruedaIndex = 0;

  errorMessage = '';

  constructor(
    private tablasService: TablasService,
    private ruedasService: RuedasService
  ) {}

  ngOnInit(): void {
    this.loadTablas();
    this.loadRuedas();
  }

  // --- controles para tablas ---
  prevSlideT() {
    this.tablaIndex =
      (this.tablaIndex + this.tablasToShow - 1) % this.tablasToShow;
    this.scrollTablas();
  }

  nextSlideT() {
    this.tablaIndex = (this.tablaIndex + 1) % this.tablasToShow;
    this.scrollTablas();
  }

  get tablasToShow() {
    return Math.min(6, this.tablas.length);
  }

  private scrollTablas() {
    const container = this.tablasCarousel.nativeElement;
    const card = container.children[this.tablaIndex] as HTMLElement;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }

  // --- controles para ruedas ---
  prevSlideR() {
    this.ruedaIndex =
      (this.ruedaIndex + this.ruedasToShow - 1) % this.ruedasToShow;
    this.scrollRuedas();
  }

  nextSlideR() {
    this.ruedaIndex = (this.ruedaIndex + 1) % this.ruedasToShow;
    this.scrollRuedas();
  }

  get ruedasToShow() {
    return Math.min(6, this.ruedas.length);
  }

  private scrollRuedas() {
    const container = this.ruedasCarousel.nativeElement;
    const card = container.children[this.ruedaIndex] as HTMLElement;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }

  // --- carga de datos ---
  private loadTablas(): void {
    this.tablasService.getAll().subscribe({
      next: (data: Tabla[]) => (this.tablas = data),
      error: (err) => {
        console.error('Error cargando tablas', err);
        this.errorMessage = 'No se pudieron cargar las tablas.';
      }
    });
  }

  private loadRuedas(): void {
    this.ruedasService.getAll().subscribe({
      next: (data: Rueda[]) => (this.ruedas = data),
      error: (err) => {
        console.error('Error cargando ruedas', err);
        this.errorMessage = 'No se pudieron cargar las ruedas.';
      }
    });
  }

  // --- trackBy para *ngFor ---
  trackById(index: number, item: Tabla | Rueda) {
    return item.id;
  }
}
