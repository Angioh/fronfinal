// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TablasService, Tabla } from '../../productos/tablas/tablas.service';
import { LijasService, Lija } from '../../productos/lijas/lijas.service';
import { RuedasService, Rueda } from '../../productos/ruedas/ruedas.service';
import {
  RodamientosService,
  Rodamiento,
} from '../../productos/rodamientos/rodamientos.service';
import { EjesService, Eje } from '../../productos/ejes/ejes.service';
import {
  TornillosService,
  Tornillo,
} from '../../productos/tornillos/tornillos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class AdminComponent implements OnInit {
  // --- configuración de tipos dinámicos ---
  tipos = [
    { key: 'tablas', label: 'Tablas' },
    { key: 'lijas', label: 'Lijas' },
    { key: 'ruedas', label: 'Ruedas' },
    { key: 'rodamientos', label: 'Rodamientos' },
    { key: 'ejes', label: 'Ejes' },
    { key: 'tornillos', label: 'Tornillos' },
  ];
  config: Record<
    string,
    {
      service: any;
      columns: {
        key: string;
        label: string;
        type: 'text' | 'number' | 'image';
      }[];
    }
  > = {};

  selectedTipo = this.tipos[0].key;
  items: any[] = [];
  columns: { key: string; label: string; type: 'text' | 'number' | 'image' }[] =
    [];

  cargando = false;
  error: string | null = null;

  // --- modales genéricos ---
  showCreateModal = false;
  newItem: any = {};

  showEditModal = false;
  editItem: any = null;
  editIndex: number | null = null;

  showConfirmModal = false;
  deleteItem: any = null;
  deleteIndex: number | null = null;

  constructor(
    private auth: AuthService,
    private tablasService: TablasService,
    private lijasService: LijasService,
    private ruedasService: RuedasService,
    private rodamientosService: RodamientosService,
    private ejesService: EjesService,
    private tornillosService: TornillosService
  ) {
    // Inicializar configuración
    this.config = {
      tablas: {
        service: this.tablasService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'color', label: 'Color', type: 'text' },
          { key: 'tamanho', label: 'Tamaño', type: 'number' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
      lijas: {
        service: this.lijasService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'color', label: 'Color', type: 'text' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
      ruedas: {
        service: this.ruedasService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'diametro', label: 'Diámetro', type: 'number' },
          { key: 'dureza', label: 'Dureza', type: 'number' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
      rodamientos: {
        service: this.rodamientosService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
      ejes: {
        service: this.ejesService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'anchura', label: 'Anchura', type: 'number' },
          { key: 'altura', label: 'Altura', type: 'number' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
      tornillos: {
        service: this.tornillosService,
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'descripcion', label: 'Descripción', type: 'text' },
          { key: 'precio', label: 'Precio', type: 'number' },
          { key: 'marca', label: 'Marca', type: 'text' },
          { key: 'tamanho', label: 'Tamaño', type: 'number' },
          { key: 'cantidad', label: 'Cantidad', type: 'number' },
          { key: 'imagen_url', label: 'Imagen', type: 'image' },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.loadTipo(this.selectedTipo);
  }

  /** Label del tipo seleccionado */
  get selectedLabel(): string {
    const t = this.tipos.find((x) => x.key === this.selectedTipo);
    return t ? t.label : '';
  }

  logout() {
    this.auth.logout();
  }

  loadTipo(tipo: string) {
    this.selectedTipo = tipo;
    const cfg = this.config[tipo];
    this.columns = cfg.columns;
    this.cargando = true;
    this.error = null;
    this.items = [];
    cfg.service.getAll().subscribe({
      next: (data: any[]) => {
        this.items = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar ' + tipo;
        this.cargando = false;
      },
    });
  }

  // Crear
  openCreateModal() {
    this.newItem = {};
    this.showCreateModal = true;
  }
  confirmCreate() {
    this.newItem.imagen_url2 = 'imagen2';
    const svc = this.config[this.selectedTipo].service;
    svc.create(this.newItem).subscribe({
      next: (created: any) => {
        this.items.unshift(created);
        this.showCreateModal = false;
      },
      error: () => {
        alert('No se pudo crear.');
        this.showCreateModal = false;
      },
    });
  }
  cancelCreate() {
    this.showCreateModal = false;
  }

  // Editar
  openEditModal(item: any, i: number) {
    this.editItem = { ...item };
    this.editIndex = i;
    this.showEditModal = true;
  }
  confirmEdit() {
    const svc = this.config[this.selectedTipo].service;
    svc.update(this.editItem.id, this.editItem).subscribe({
      next: () => {
        this.items[this.editIndex!] = this.editItem;
        this.showEditModal = false;
      },
      error: () => {
        alert('No se pudo actualizar.');
        this.showEditModal = false;
      },
    });
  }
  cancelEdit() {
    this.showEditModal = false;
  }

  // Eliminar
  openDeleteModal(item: any, i: number) {
    this.deleteItem = item;
    this.deleteIndex = i;
    this.showConfirmModal = true;
  }
  confirmDelete() {
    const svc = this.config[this.selectedTipo].service;
    svc.delete(this.deleteItem.id).subscribe({
      next: () => {
        this.items.splice(this.deleteIndex!, 1);
        this.showConfirmModal = false;
      },
      error: () => {
        alert('No se pudo eliminar.');
        this.showConfirmModal = false;
      },
    });
  }
  cancelDelete() {
    this.showConfirmModal = false;
  }
}
