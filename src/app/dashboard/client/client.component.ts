// src/app/client/client.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService, ClienteProfile } from './user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  private userSub!: Subscription;
  private profileSub!: Subscription;
  userId: number = 0;

  // Estado de edición de cada campo
  editableFields: Record<string, boolean> = {
    nombre: false,
    apellido: false,
    direccion: false,
    telefono: false,
    email: false,
    password: false,
    confirmPassword: false,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^[0-9\-\+\s]*$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );

    Object.keys(this.editableFields).forEach((field) => {
      this.profileForm.get(field)?.disable();
    });

    this.userSub = this.authService.currentUser$
      .pipe(
        switchMap((user) => {
          if (!user) {
            return of(null);
          }
          this.userId = user.id;
          return this.userService.getProfile(this.userId);
        })
      )
      .subscribe(
        (profile) => {
          if (profile) {
            this.profileForm.patchValue({
              nombre: profile.nombre,
              apellido: profile.apellido,
              direccion: profile.direccion,
              telefono: profile.telefono,
              email: profile.email,
            });
          }
        },
        (err) => {
          console.error('Error al cargar perfil:', err);
          this.error = 'No se pudo cargar tu perfil';
        }
      );
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
  }

  private passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (pass || confirm) {
      return pass === confirm ? null : { passwordsMismatch: true };
    }
    return null;
  }

  toggleEdit(field: string): void {
    const current = this.editableFields[field];
    this.editableFields[field] = !current;

    const control = this.profileForm.get(field);
    if (control) {
      if (this.editableFields[field]) {
        control.enable();
      } else {
        control.disable();
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.error = 'Por favor corrige los errores en el formulario.';
      return;
    }
    this.error = '';
    this.success = '';
    this.loading = true;

    const formValue = this.profileForm.value;
    const updateData: Partial<ClienteProfile> & { password?: string } = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      direccion: formValue.direccion,
      telefono: formValue.telefono,
      email: formValue.email,
    };
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    this.profileSub = this.userService
      .updateProfile(this.userId, updateData)
      .pipe(
        catchError((err) => {
          console.error('Error al actualizar perfil:', err);
          this.error = 'Ocurrió un error al actualizar tu perfil.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((updated) => {
        this.loading = false;
        if (updated) {
          this.success = 'Perfil actualizado correctamente.';
          this.authService.updateCurrentUser(updated);

          Object.keys(this.editableFields).forEach((field) => {
            this.profileForm.get(field)?.disable();
            this.editableFields[field] = false;
          });
        }
      });
  }
}
