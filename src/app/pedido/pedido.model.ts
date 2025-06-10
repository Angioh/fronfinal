export interface PedidoItem {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  tipo: string;
  cantidad: number;
}

export interface Pedido {
  direccion: string;
  telefono: string;
  cantidad: number;
  nombre_user: string;
  userId: number;
  items: PedidoItem[];
}
export enum PedidoEstado {
  RECIBIDO = 'recibido',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
}
export interface PedidoResponse {
  id: number;
  direccion: string;
  telefono: string;
  estado: PedidoEstado;
  cantidad: number;
  nombre_user: string;
  userId: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  items: Array<{
    id: number;
    productoId: number;
    nombre: string;
    precio: number;
    imagen_url: string;
    tipo: string;
    cantidad: number;
  }>;
}
