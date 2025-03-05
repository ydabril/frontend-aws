import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-cognito/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  confirmForm: FormGroup;
  isLoginMode: boolean = true;
  isConfirmMode: boolean = false;
  emailRegistered: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.confirmForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.isLoginMode = segments.some(segment => segment.path === 'login');
    });
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const { email, password } = this.authForm.value;

    try {
      if (this.isLoginMode) {
        await this.authService.login(email, password);
        this.router.navigate(['/home']);
      } else {
        await this.authService.register(email, password);
        this.emailRegistered = email;
        this.isConfirmMode = true;
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Algo salió mal.'}`);
    }
  }

  async onConfirm() {
    if (this.confirmForm.invalid) {
      alert('Ingrese el código de confirmación.');
      return;
    }

    const code = this.confirmForm.value.code;

    try {
      await this.authService.confirmSignUp(this.emailRegistered, code);
      alert('Cuenta confirmada. Ahora puedes iniciar sesión.');
      this.isConfirmMode = false;
      this.isLoginMode = true;
    } catch (error: any) {
      alert(`Error al confirmar: ${error.message || 'Código incorrecto'}`);
    }
  }
}
