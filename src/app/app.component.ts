import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CarritoComponent } from './carrito/carrito.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule,NavbarComponent,FooterComponent,CarritoComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontkick';

   pathSegments: string[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pathSegments = event.urlAfterRedirects.split('/').filter(segment => segment);
      }
    });
  }

  navigateTo(index: number) {
    const url = '/' + this.pathSegments.slice(0, index + 1).join('/');
    this.router.navigate([url]);
  }
  navigateHome() {
  this.router.navigate(['/']);
}
}
