import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
})
export class RegisterComponent {
  registerForm;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Definimos todos los controles exactamente
    this.registerForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nombre:   ['', Validators.required],
      apellido: ['', Validators.required],
      role:     ['cliente']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, apellido, email, password, role } = this.registerForm.value;
      console.log('Payload que envío:', { nombre, apellido, email, password, role });
      this.auth.register(nombre!, apellido!, email!, password!, role!).subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => {
          console.error('Error al registrar (detalles):', err);
          if (err.error && err.error.message) {
            this.error = `Backend: ${err.error.message}`;
          } else {
            this.error = `Error al registrar (código ${err.status})`;
          }
        }
      });
    }
  }
}
