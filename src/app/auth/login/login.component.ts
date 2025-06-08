import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
})
export class LoginComponent {
  loginForm;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        const role = this.auth.role;
        const target = role === 'admin'
          ? ['/administrador/dashboard']
          : ['/cliente/dashboard'];
        // Primero navegamos, y cuando haya terminado, recargamos la página:
        this.router.navigate(target).then(() => {
          // Recarga completa como si pulsaras F5
          window.location.reload();
        });
      },
      error: err => this.error = 'Credenciales incorrectas'
    });
  }
}
}
