import { AuthGuard } from './auth/auth.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ClientComponent } from './dashboard/client/client.component';
import { EjesComponent } from './productos/ejes/ejes.component';
import { RuedasComponent } from './productos/ruedas/ruedas.component';
import { RodamientosComponent } from './productos/rodamientos/rodamientos.component';
import { TablasComponent } from './productos/tablas/tablas.component';
import { TornillosComponent } from './productos/tornillos/tornillos.component';
import { LijasComponent } from './productos/lijas/lijas.component';
import { HomeComponent } from './home/home.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { AdminGuard } from './auth/admin.guard';
import { RodaProductComponent } from './productos/rodamientos/roda-product/roda-product.component';
import { LijaProductComponent } from './productos/lijas/lija-product/lija-product.component';
import { RuedaProductComponent } from './productos/ruedas/rueda-product/rueda-product.component';
import { TorniProductComponent } from './productos/tornillos/torni-product/torni-product.component';
import { EjeProductComponent } from './productos/ejes/eje-product/eje-product.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderAdminComponent } from './dashboard/admin/order-admin/order-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ejes', component: EjesComponent },
  { path: 'ruedas', component: RuedasComponent },
  { path: 'rodamientos', component: RodamientosComponent },
  { path: 'tablas', component: TablasComponent },
  { path: 'tornillos', component: TornillosComponent },
  { path: 'lijas', component: LijasComponent },
  {path:'',component: HomeComponent},
  {path: 'carrito', component: CarritoComponent},
  {path: 'dashboard', component: ClientComponent},
  { path: 'tablas/:id', component: ProductoComponent },
  { path: 'rodamientos/:id', component: RodaProductComponent },
  { path: 'lijas/:id', component: LijaProductComponent },
  { path: 'ruedas/:id', component: RuedaProductComponent },
  { path: 'tornillos/:id', component: TorniProductComponent },
  { path: 'ejes/:id', component: EjeProductComponent },
  {
    path: 'cliente/dashboard',
    component: ClientComponent,
    canActivate: [AuthGuard] // Solo usuarios autenticados
  },{
    path: 'cliente/mis-pedidos',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard] // Solo usuarios autenticados
  },
  
  {
    path: 'administrador/dashboard',
    component: AdminComponent,
    canActivate: [AdminGuard] 
  },
   {
    path: 'administrador/dashboard/ordenes',
    component: OrderAdminComponent,
    canActivate: [AdminGuard] 
  },
  { path: 'checkout', component: CheckOutComponent },

  { path: '**', redirectTo: '' }                    // <-- Ruta comodín para no encontrados
];
