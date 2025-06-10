import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import type {
  StripeElementsOptions,
  StripeCardElementOptions,
} from '@stripe/stripe-js';
import { CarritoService, CarritoItem } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';
import { ValidacionesPropias } from './validaciones-propias';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InvoiceService, InvoiceData } from '../services/invoice.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../pedido/pedido.model';

declare const bootstrap: any;

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    StripeCardComponent,
  ],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements AfterViewInit, OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  paymentForm: FormGroup;
  elementsOptions: StripeElementsOptions = { locale: 'es' };
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: false,
    style: { base: { fontSize: '16px' } },
  };

  carritoItems: CarritoItem[] = [];
  total = 0;
  loading = false;

  modalInstance!: any;
  modalTitle = '';
  modalMessage = '';

  provincias: { [key: number]: string } = { /* ... provincias ... */ };

  private currentUserId!: number;

  constructor(
    private fb: FormBuilder,
    public carritoService: CarritoService,
    private stripeService: StripeService,
    private http: HttpClient,
    private auth: AuthService,
    private invoiceSvc: InvoiceService,
    private pedidoService: PedidoService
  ) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(15), ValidacionesPropias.esLetra]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, ValidacionesPropias.esNum, ValidacionesPropias.esTelef, Validators.minLength(9)]],
      direccion: ['', [Validators.required, ValidacionesPropias.esLetra, Validators.minLength(10)]],
      codigoPostal: ['', [Validators.required, ValidacionesPropias.esNum, Validators.minLength(5), ValidacionesPropias.cPostalExiste]],
      provincia: ['', [Validators.required]],
    });

    this.carritoService.carrito$.subscribe(items => {
      this.carritoItems = items;
      this.total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    });
  }

  ngOnInit() {
    const user = this.auth.user;
    if (user) {
      this.currentUserId = user.id;
      this.paymentForm.patchValue({
        name: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || ''
      });
    }
    this.auth.currentUser$.subscribe(u => {
      if (u) {
        this.currentUserId = u.id;
        this.paymentForm.patchValue({
          name: `${u.nombre} ${u.apellido}`.trim(),
          email: u.email || '',
          telefono: u.telefono || '',
          direccion: u.direccion || ''
        });
      }
    });

    this.paymentForm.get('codigoPostal')!.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(cp => {
        if (cp && cp.toString().length === 5) {
          this.cargarProvincia(cp.toString());
        } else {
          this.paymentForm.get('provincia')!.reset();
        }
      });
  }

  ngAfterViewInit() {
    const modalEl = document.getElementById('paymentResultModal')!;
    this.modalInstance = new bootstrap.Modal(modalEl);
  }

  trackByTipoId(index: number, item: CarritoItem): string {
    return `${item.tipo}-${item.id}`;
  }

  pay() {
    if (this.loading || this.paymentForm.invalid || this.total <= 0) return;
    this.loading = true;

    const amountInCents = Math.round(this.total * 100);
    this.http.post<{ clientSecret: string }>(
      'https://backend-d2i9.onrender.com/payments/create-payment-intent',
      { amount: amountInCents, currency: 'eur' }
    ).subscribe({
      next: ({ clientSecret }) => this.confirmPayment(clientSecret),
      error: err => {
        this.loading = false;
        this.openModal('Error inesperado', 'No se pudo solicitar el pago.');
        console.error('Error clientSecret:', err);
      }
    });
  }

  private confirmPayment(clientSecret: string) {
    this.stripeService.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card.element,
        billing_details: {
          name: this.paymentForm.value.name,
          email: this.paymentForm.value.email
        }
      }
    }).subscribe({
      next: result => {
        this.loading = false;
        if (result.error) {
          this.openModal('Error en el pago', result.error.message || '');
          return;
        }
        if (result.paymentIntent?.status === 'succeeded') {
          this.openModal('Pago completado', 'Tu pago se ha realizado con éxito.');

          // Obtenemos el último pedido para asignar número de factura
          this.pedidoService.getUltimoPedido().subscribe({
            next: (lastPedido: any) => {
              // lastPedido.id existe en la respuesta JSON
              const idUltimo = lastPedido.id;
              const nextInvoiceNumber = idUltimo + 1;

              // Construcción de la factura
              const invoice: InvoiceData = {
                number: nextInvoiceNumber.toString(),
                date: new Date().toLocaleDateString('es-ES'),
                customer: {
                  name: this.paymentForm.value.name,
                  email: this.paymentForm.value.email,
                },
                items: this.carritoItems.map(i => ({
                  description: `${i.nombre} #${i.id}`,
                  quantity: i.cantidad,
                  price: i.precio,
                })),
              };

              // Payload para envío de factura
              const invoicePayload = {
                email: this.paymentForm.value.email,
                invoice,
                shipping: {
                  telefono: this.paymentForm.value.telefono,
                  direccion: this.paymentForm.value.direccion,
                  codigoPostal: this.paymentForm.value.codigoPostal,
                  provincia: this.paymentForm.value.provincia,
                },
                total: this.total,
                paymentIntentId: result.paymentIntent.id,
              };

              // Envío de factura
              this.invoiceSvc.sendInvoice(invoicePayload).subscribe({
                next:()=> console.log('Factura enviada con número', nextInvoiceNumber),
                error: e=> console.error('Error enviando factura', e)
              });

              // Creación de pedido en el backend
              const totalCantidad = this.carritoItems.reduce((sum, i) => sum + i.cantidad, 0);
              const nuevoPedido: Pedido = {
                direccion: this.paymentForm.value.direccion,
                telefono: this.paymentForm.value.telefono,
                cantidad: totalCantidad,
                nombre_user: this.paymentForm.value.name,
                userId: this.currentUserId,
                items: this.carritoItems.map(i => ({
                  id: i.id,
                  nombre: i.nombre,
                  precio: i.precio,
                  imagen_url: i.imagen_url,
                  tipo: i.tipo,
                  cantidad: i.cantidad,
                }))
              };
              this.pedidoService.crearPedido(nuevoPedido).subscribe({
                next: resp=> console.log('Pedido registrado:', resp),
                error: err=> console.error('Error creando pedido:', err)
              });

              // Limpieza final
              this.paymentForm.reset();
              this.carritoService.clearCart();
            },
            error: err => {
              console.error('Error al obtener último pedido:', err);
            }
          });
        }
      },
      error: err => {
        this.loading = false;
        this.openModal('Error en el pago', 'Ha ocurrido un error al procesar el pago.');
        console.error('Error confirmando pago:', err);
      }
    });
  }

  private openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalInstance.show();
  }

  private cargarProvincia(codP: string) {
    const cod = parseInt(codP, 10);
    if (codP.length === 5 && cod >= 1000 && cod <= 52999) {
      const key = parseInt(codP.substring(0, 2), 10);
      this.paymentForm.get('provincia')!.setValue(this.provincias[key] || '');
    } else {
      this.paymentForm.get('provincia')!.setValue('Código postal inexistente');
    }
  }
}
