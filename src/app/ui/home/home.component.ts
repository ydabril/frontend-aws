import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth-cognito/auth.service";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    userEmail: string | null = null;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  async ngOnInit() {
    try {
      const attributes = await this.authService.getUserAttributes();

      this.userEmail = attributes?.email ?? 'Usuario';
    } catch (error) {
      console.error('Error obteniendo usuario', error);
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error cerrando sesión', error);
      alert('Hubo un problema cerrando sesión.');
    }
  }
}