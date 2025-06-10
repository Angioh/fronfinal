import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidacionesPropias } from '../../check-out/validaciones-propias';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          ValidacionesPropias.passwordSegura,
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          ValidacionesPropias.esLetra,
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          ValidacionesPropias.esLetra,
        ],
      ],
      role: ['cliente'],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, apellido, email, password, role } = this.registerForm.value;
    console.log('Payload que envío:', {
      nombre,
      apellido,
      email,
      password,
      role,
    });

    this.auth.register(nombre, apellido, email, password, role).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Error al registrar (detalles):', err);
        if (err.error?.message) {
          this.error = `Backend: ${err.error.message}`;
        } else {
          this.error = `Error al registrar (código ${err.status})`;
        }
      },
    });
  }
}
