import { Component } from '@angular/core';
import { InvoiceService, InvoiceData } from '../services/invoice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  imports: [FormsModule, CommonModule],
})
export class InvoiceComponent {
  email = '';
  invoice: InvoiceData = {
    number: '',
    date: '',
    customer: { name: '', email: '' },
    items: [],
  };

  constructor(private invoiceSvc: InvoiceService) {}

onSend() {
  const payload = {
    email: this.email,
    invoice: this.invoice
  };

  this.invoiceSvc.sendInvoice(payload)
    .subscribe({
      next: () => alert('Correo enviado con factura'),
      error: err => alert('Error: ' + err.message),
    });
}
}
