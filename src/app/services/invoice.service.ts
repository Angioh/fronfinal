// src/app/services/invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}
export interface InvoiceData {
  number: string;
  date: string;
  customer: { name: string; email: string };
  items: InvoiceItem[];
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private url = 'https://backend-d2i9.onrender.com/email/send-invoice';

  constructor(private http: HttpClient) {}

  sendInvoice(payload: any) {
    return this.http.post<{ message: string }>(this.url, payload);
  }
}
